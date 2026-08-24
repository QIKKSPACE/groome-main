"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Phone, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UnprotectedRoute from "@/components/unprotectedRoute";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import RecaptchaProvider from "@/components/RecaptchaProvider";

const SignupPage = () => {
  const router = useRouter();

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    accountType: "customer",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignupInputChange = (field: string, value: string) => {
    setSignupData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateSignupForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!signupData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!signupData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!signupData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupData.email))
      newErrors.email = "Email is invalid";

    if (!signupData.phone.trim()) newErrors.phone = "Phone number is required";

    if (!signupData.password.trim()) newErrors.password = "Password is required";
    else if (signupData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!signupData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password";
    else if (signupData.password !== signupData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSignupSubmit = async (e: React.FormEvent) => {
  if(isLoading) return; // Prevent multiple submissions
  e.preventDefault();
  if (!validateSignupForm()) return;

  setIsLoading(true);
  setErrors({});

  try {
    // STEP 1 → Backend pre-check
    const res = await fetch("https://api.thegroome.com/auth/pre-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signupData.email,
        phone: signupData.phone,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ general: data.message || "Signup failed" });
      return;
    }

    // STEP 2 → Ensure Recaptcha exists
    if (!window.recaptchaVerifier) {
      throw new Error("reCAPTCHA not initialized");
    }
console.log("Sending OTP to:", `+91${signupData.phone}`);
console.log("Recaptcha verifier:", window.recaptchaVerifier);
    // STEP 3 → Firebase OTP

   // await window.recaptchaVerifier.render();
    const confirmation = await signInWithPhoneNumber(
      auth,
      `+91${signupData.phone}`,
      window.recaptchaVerifier
    );

    // STEP 4 → Redirect to OTP screen
    router.push(
      `/verifyotp?vid=${confirmation.verificationId}` +
      `&phone=${signupData.phone}` +
      `&email=${signupData.email}` +
      `&firstName=${signupData.firstName}` +
      `&lastName=${signupData.lastName}` +
      `&password=${signupData.password}`
    );

  } catch (error: any) {
    console.error("Signup error:", error);

    setErrors({
      general: error.message || "Something went wrong",
    });
  } finally {
    setIsLoading(false);
  }
};



  return (
    <UnprotectedRoute>
  <RecaptchaProvider />
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-start p-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Main */}
      <div className="relative z-10 flex items-start md:items-center justify-center px-6 py-2 md:py-8 min-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="w-full max-w-md mb-20 md:mb-0">
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600 mb-4">Join Groome</p>
            <Link href="/" className="inline-block">
              <Image
                src="/navlogo.png"
                alt="Groome Logo"
                width={120}
                height={28}
                priority
                className="mx-auto"
              />
            </Link>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-3 md:space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              {["firstName", "lastName"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>
                    {field === "firstName" ? "First Name" : "Last Name"}
                  </Label>
                  <Input
                    id={field}
                    type="text"
                    placeholder={field === "firstName" ? "First Name" : "Last Name"}
                    value={(signupData as any)[field]}
                    onChange={(e) => handleSignupInputChange(field, e.target.value)}
                    className={`h-12 bg-gray-50 border-gray-200 rounded-xl ${
                      errors[field]
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email Address"
                  value={signupData.email}
                  onChange={(e) => handleSignupInputChange("email", e.target.value)}
                  className={`pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl ${
                    errors.email ? "border-red-300 focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter Phone Number"
                  value={signupData.phone}
                  onChange={(e) => handleSignupInputChange("phone", e.target.value)}
                  className={`pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl ${
                    errors.phone ? "border-red-300 focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={signupData.password}
                  onChange={(e) => handleSignupInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 h-12 bg-gray-50 border-gray-200 rounded-xl ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={signupData.confirmPassword}
                  onChange={(e) => handleSignupInputChange("confirmPassword", e.target.value)}
                  className={`pl-10 pr-10 h-12 bg-gray-50 border-gray-200 rounded-xl ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Global Error */}
            {errors.general && (
              <div className="flex items-center text-red-600 text-sm space-x-1 justify-center">
                <AlertCircle size={16} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Continue to Verify OTP"}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/auth" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
    </UnprotectedRoute>

  );
};

export default SignupPage;
