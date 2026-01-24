// put this in a top-level file, e.g., _app.tsx or a top-level layout

import { useEffect } from "react";

export const useCaptureReferral = () => {
  useEffect(() => {
    if (typeof window === "undefined") return; // only run in browser

    // Do nothing if referral_id is already stored
    if (localStorage.getItem("referral_id")) return;

    // Get referral_id (or referral_code) from URL query
    const params = new URLSearchParams(window.location.search);
    const referralId = params.get("referral_code") || params.get("referral_id");

    if (referralId) {
      localStorage.setItem("referral_id", referralId);
      console.log("Captured referral ID:", referralId);
    }
  }, []);
};
