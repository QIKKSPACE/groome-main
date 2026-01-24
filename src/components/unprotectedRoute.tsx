"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function UnprotectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading,redirectPath} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if(!redirectPath)
      router.push("/profile"); // redirect logged-in users away from login/signup
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return <>{!user ? children : null}</>;
}
