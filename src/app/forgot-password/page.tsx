"use client";

import React, { useState } from "react";
import { Phone, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // make sure recaptchaVerifier is initialized
import { signInWithPhoneNumber } from "firebase/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setError("");
    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Check if user exists
      const res = await fetch("https://thegroome.com/backend/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.exists) {
        setError(data.message || "User does not exist");
        setLoading(false);
        return;
      }

      // 2️⃣ Send OTP via Firebase
      if (!window.recaptchaVerifier) {
        throw new Error("reCAPTCHA not initialized");
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        window.recaptchaVerifier
      );
(window as any).confirmationResults = window.confirmationResults || {};
window.confirmationResults[phone] = confirmation;
      // 3️⃣ Navigate to verify OTP page with verificationId
      router.push(
        `/forgot-password/verify-otp?vid=${confirmation.verificationId}&phone=${phone}`
      );

    } catch (err: any) {
      console.error("Send OTP error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow">

        <Link href="/auth" className="flex items-center text-sm text-gray-600 mb-4">
          <ArrowLeft size={18} className="mr-1" /> Back to Login
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600 mb-6">
          Enter your registered mobile number
        </p>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center text-red-600 text-sm mt-3">
            <AlertCircle size={16} className="mr-1" /> {error}
          </div>
        )}

        <Button
          onClick={handleSendOtp}
          className="w-full h-12 mt-6 rounded-xl"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </div>
    </div>
  );
}
