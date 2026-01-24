"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (phone && (window as any).confirmationResults?.[phone]) {
      setConfirmationResult((window as any).confirmationResults[phone]);
    }
  }, [phone]);

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp.trim()) return setError("OTP is required");
    if (!confirmationResult) return setError("OTP session expired. Resend OTP.");

    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();
      router.push(`/forgot-password/reset-password?token=${idToken}&phone=${phone}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
        <p className="text-gray-600 mb-4">Enter the OTP sent to {phone}</p>
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="h-12 mb-3 rounded-xl"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <Button onClick={handleVerifyOtp} className="w-full h-12" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}
