"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Import your AuthContext
import UnprotectedRoute from "@/components/unprotectedRoute";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
const OtpVerificationPage = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyOtp, error: authError, loading } = useAuth(); // ✅ from context
const verificationId = searchParams.get("vid");
  const userData = {
    phone: searchParams.get("phone") || "",
    email: searchParams.get("email") || "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    password: searchParams.get("password") || "",
    
  };

  // Prevent back navigation before 30s
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (!canResend) {
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
        alert("Please wait for 30 seconds before going back.");
      }
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [canResend]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    setTimer(30);
    setCanResend(false);
    setLocalError("");
    // Optionally: call resend OTP API later
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLocalError("");

  const otpCode = otp.join("");

  if (!verificationId) {
    setLocalError("OTP session expired. Please resend.");
    return;
  }

  if (otpCode.length !== 6) {
    setLocalError("Enter a valid 6-digit OTP.");
    return;
  }

  try {
    // 1️⃣ Create Firebase credential
    const credential = PhoneAuthProvider.credential(
      verificationId,
      otpCode
    );

    // 2️⃣ Verify OTP with Firebase
    const result = await signInWithCredential(auth, credential);
    const firebaseUser = result.user;

    // 3️⃣ Get Firebase ID token
    const firebaseToken = await firebaseUser.getIdToken();

    // 4️⃣ Call backend signup
    await verifyOtp(userData, firebaseToken);

    // ✅ 5️⃣ Redirect ONLY after success
    //router.push(redirectPath || "/profile");

  } catch (err: any) {
    console.error("OTP / Signup failed:", err);

    // Firebase OTP errors
    if (err?.code === "auth/invalid-verification-code") {
      setLocalError("Invalid OTP");
      return;
    }

    if (err?.code === "auth/code-expired") {
      setLocalError("OTP expired. Please resend.");
      return;
    }

    // Backend errors (thrown from verifyOtp)
    setLocalError(
      err?.response?.data?.message ||
      "Signup failed. Please try again."
    );
  }
};


  const finalError = localError || authError;

  return (
    <UnprotectedRoute>

    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-start p-6">
        <Link
          href="#"
          onClick={(e) => {
            if (!canResend) e.preventDefault();
            else window.history.back();
          }}
          className={`flex items-center space-x-2 text-gray-600 transition-colors ${
            canResend ? "hover:text-gray-800" : "opacity-50 cursor-not-allowed"
          }`}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>

      {/* Main Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-2 md:py-10 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md mb-20 md:mb-0 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
          <p className="text-gray-600 mb-4">
            Enter the 6-digit code sent to <b>{userData.phone}</b>
          </p>
          <Image
            src="/navlogo.png"
            alt="Groome Logo"
            width={120}
            height={28}
            priority
            className="mx-auto mb-6"
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Boxes */}
            <div className="flex justify-center space-x-3 md:space-x-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 md:w-14 md:h-14 text-center text-lg font-semibold bg-gray-50 border-gray-200 rounded-xl focus:ring-blue-500"
                />
              ))}
            </div>

            {/* Timer + Resend */}
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-2">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-blue-600 font-medium hover:text-blue-700 underline"
                >
                  Resend OTP
                </button>
              ) : (
                <>
                  <Clock size={16} className="text-gray-400" />
                  <span>Resend in {timer}s</span>
                </>
              )}
            </div>

            {/* Error */}
            {finalError && <p className="text-red-500 text-sm mt-2">{finalError}</p>}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
    </UnprotectedRoute>

  );
};

export default OtpVerificationPage;
