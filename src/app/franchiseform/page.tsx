"use client";

import React, { useEffect, useState, useContext } from "react";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { useToast } from "@/components/ui/toast";
import { WebflowContext } from "@/contexts/WebflowContext"; // ✅ import context
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  name: string;
  pincode: string;
  city: string;
  state: string;
  address: string;
  franchiseTypeId: string;
}

export default function FranchiseForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    pincode: "",
    city: "",
    state: "",
    address: "",
    franchiseTypeId: "",
  });

  const [loading, setLoading] = useState(false);
  const [zipError, setZipError] = useState("");
  const [isZipValid, setIsZipValid] = useState(false);
    const { login, redirectPath, setRedirectPath, error: authError } = useAuth();
  
  useEffect(() => {
    setRedirectPath(null);
  }, []);
  const { showToast } = useToast();

  // ✅ Get franchise types directly from context
  const { data, loading: webflowLoading, error: webflowError } = useContext(WebflowContext);
  const franchiseTypes = data?.franchise_types || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Fetch city/state from ZIP
  const handleZipLookup = async (zip: string) => {
    if (zip.length !== 6) return;
    setLoading(true);
    setZipError("");
    try {
      const res = await fetch(`https://thegroome.com/backend/superadmin/zip-lookup?zip=${zip}`, {
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          city: data.city,
          state: data.state,
        }));
        setIsZipValid(true);
        setZipError("");
      } else {
        setZipError(data.error || "Invalid PIN code — please fill details manually.");
        setIsZipValid(false);
        setForm((prev) => ({ ...prev, city: "", state: "" }));
      }
    } catch (err) {
      setZipError("Unable to fetch location. Please fill city and state manually.");
      setIsZipValid(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("address", form.address);
      formData.append("zip_code", form.pincode);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("franchise_type_id", form.franchiseTypeId);
      formData.append("userId", "YOUR_USER_ID_HERE");

      const res = await apiClient.post("/verification/franchises/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("🎉 Franchise registered successfully!", "success");
      console.log("✅ Response:", res.data);

      setForm({
        name: "",
        pincode: "",
        city: "",
        state: "",
        address: "",
        franchiseTypeId: "",
      });
    } catch (err: any) {
      console.error("❌ Error submitting form:", err);
      showToast(`${err?.response?.data?.message || "Something went wrong."}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg mb-20 md:mb-0">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🏢 Register Your Franchise
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Franchise Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Franchise Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter franchise name"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700">PIN Code</label>
          <div className="relative">
            <input
              type="text"
              name="pincode"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value.length === 6) handleZipLookup(e.target.value);
              }}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="6-digit PIN code"
            />
            {loading && <Loader2 className="absolute right-3 top-3 h-5 w-5 text-blue-500 animate-spin" />}
          </div>
          {zipError && <p className="text-red-500 text-sm mt-1">{zipError}</p>}
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="Enter city"
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                !isZipValid && "bg-white"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              placeholder="Enter state"
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                !isZipValid && "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Enter full address"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Franchise Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Franchise Type</label>
          <select
            name="franchiseTypeId"
            value={form.franchiseTypeId}
            onChange={handleChange}
            required
            disabled={webflowLoading || !franchiseTypes.length}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Franchise Type</option>
            {franchiseTypes.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.franchise_type}
              </option>
            ))}
          </select>
          {webflowError && <p className="text-red-500 text-sm mt-1">Failed to load franchise types.</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading || webflowLoading}
        >
          {loading ? <Loader2 className="inline w-5 h-5 animate-spin" /> : "Submit"}
        </button>
      </form>
    </div>
  );
}
