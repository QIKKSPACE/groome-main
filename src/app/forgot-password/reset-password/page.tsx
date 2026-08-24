"use client";

import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const firebaseToken = searchParams.get("token");
  const phone = searchParams.get("phone");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Both password fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!firebaseToken) {
      setError("Invalid request. No token found.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://api.thegroome.com/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseToken,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(data.message || "Password reset successfully!");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow">

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600 mb-6">
          Create a new password for your account
        </p>

        <div className="space-y-4">
          <div>
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-10 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center text-red-600 text-sm mt-3">
            <AlertCircle size={16} className="mr-1" /> {error}
          </div>
        )}

        {success && (
          <div className="flex items-center text-green-600 text-sm mt-3">
            ✅ {success}
          </div>
        )}

        <Button
          onClick={handleResetPassword}
          className="w-full h-12 mt-6 rounded-xl"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}
