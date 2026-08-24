// 📁 apiClient.ts
import axios from "axios";
import { getTokens, storeAccessToken, clearTokens } from "./authService";

export const apiClient = axios.create({
  baseURL: "https://api.thegroome.com/",
});

// ✅ Attach token only if explicitly allowed
apiClient.interceptors.request.use(
  (config) => {
    // 🔹 Custom flag you’ll set when calling: apiClient.post(url, data, { useAuth: true })
    const useAuth = (config as any).useAuth ?? true;

    if (useAuth) {
      const { accessToken } = getTokens();
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token refresh
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message?.toLowerCase?.() || "";

    const isExpired = status === 401 && message.includes("expired");

    if (isExpired && !original._retry) {
      original._retry = true;

      try {
        const { refreshToken } = getTokens();
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post("https://api.thegroome.com/auth/refresh", {
          refreshToken,
        });

        const { accessToken } = res.data;
        if (accessToken) {
          storeAccessToken(accessToken);
          original.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(original);
        }
      } catch (err) {
        clearTokens();
        window.dispatchEvent(new Event("auth:logout"));
      }
    }

    return Promise.reject(error);
  }
);
