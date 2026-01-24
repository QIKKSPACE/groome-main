"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, UserPlus, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const AffiliateTab = () => {
  const { user, acceptAffiliate } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralUsers, setReferralUsers] = useState<{ id: string; name: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "earnings">("users");

  const referralUrl = `https://thegroome.com/signup?referral_code=${user?.affiliate_code}`;

  // Fetch referred users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.affiliate_code) return;
      try {
        const res = await axios.get(
          `https://thegroome.com/backend/users/all-user-under-affiliate/${user.id}`
        );
        setReferralUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch referral users", err);
        setReferralUsers([]);
      }
    };
    fetchUsers();
  }, [user?.affiliate_code]);

  const handleAcceptAffiliate = async () => {
    if (!accepted || !user) return;
    setLoading(true);
    try {
      await acceptAffiliate();
      setAccepted(false);
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // CASE 1: User is not an affiliate yet
  if (!user?.affiliate_code) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-8 rounded-xl shadow-md text-center max-w-md mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-2">Join Our Affiliate Program</h2>
        <p className="mb-6">
          Accept the terms & conditions and start earning with your affiliate code.
        </p>
        <label className="flex items-center justify-center space-x-2 mb-6">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5"
          />
          <span>I accept the terms and conditions</span>
        </label>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3"
          disabled={!accepted || loading}
          onClick={handleAcceptAffiliate}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    );
  }

  // CASE 2: User is an affiliate → show dashboard
  return (
    <div className="space-y-6 max-w-4xl mx-auto px-5 py-8">
      {/* Referral URL */}
      <Card className="border-blue-200 hover:shadow-lg transition-shadow">
        <CardContent className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Referral Link</h3>
            <p className="text-gray-600 break-all">{referralUrl}</p>
          </div>
          <Button
            onClick={handleCopyUrl}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? "Copied!" : "Copy URL"}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "users" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "earnings" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("earnings")}
        >
          Earnings
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "users" && (
        <Card className="border-gray-200 hover:shadow-lg transition-shadow">
          <CardTitle className="text-xl font-bold text-gray-900">Referred Users</CardTitle>
          <CardContent className="space-y-3">
            {referralUsers.length === 0 ? (
              <p className="text-gray-600">No users available for this affiliate.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {referralUsers.map((u) => (
                  <Card key={u.id} className="p-3 border hover:shadow-md transition-shadow rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                        <span>{u.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">ID: {u.id}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "earnings" && (
        <Card className="border-gray-200 hover:shadow-lg transition-shadow">
          <CardTitle className="text-xl font-bold text-gray-900">Earnings</CardTitle>
          <CardContent>
            <p className="text-gray-600">
              Website under development. Earnings will be available soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AffiliateTab;
