"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, UserPlus, Wallet, CheckCircle2, XCircle, Percent, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/api/apiClient";
import { useRouter } from "next/navigation";

interface ReferralUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  affiliate_code: string;
  city: string | null;
  state: string | null;
  created_at: string;
  sub_affiliates_count: number;
}

interface CommissionSettings {
  is_repurchase_commission_allowed: boolean;
  repurchase_commission_pct: number | null;
  is_override_commission_allowed: boolean;
  override_commission_pct: number | null;
  is_advertisment_commission_allowed: boolean;
  advertisment_commission_pct: number | null;
  is_mall_commission_allowed: boolean;
  mall_commission_pct: number | null;
  is_franchise_commission_allowed: boolean;
  franchise_commission_pct: number | null;
}

const AffiliateTab = () => {
  const { user, acceptAffiliate } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralUsers, setReferralUsers] = useState<ReferralUser[]>([]);
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "earnings">("users");
     const router = useRouter();
   
  const referralUrl = `https://thegroome.com/signup?cr_code=${user?.affiliate_code}`;

  // Fetch referred users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.id) return;
      try {
        const res = await apiClient.get(`/users/all-user-under-affiliate/${user.id}`);
        setReferralUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch referral users", err);
        setReferralUsers([]);
      }
    };
    fetchUsers();
  }, [user?.id]);

  // Fetch user commission settings
  useEffect(() => {
    const fetchCommissionSettings = async () => {
      try {
        const res = await apiClient.get("/users/commision-settings");
        if (res.data?.success) {
          setCommissionSettings(res.data.settings);
        }
      } catch (err) {
        console.error("Failed to fetch commission settings", err);
      }
    };
    fetchCommissionSettings();
  }, []);

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
  if (!user?.is_affiliate) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-8 rounded-xl shadow-md text-center max-w-md mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-2">Join Our Affiliate Program</h2>
        <p className="mb-6">
          Accept the terms & conditions and start earning with your affiliate code.
        </p>
        <label className="flex items-center justify-center space-x-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5 accent-blue-600 rounded"
          />
          <span className="text-sm font-medium">I accept the terms and conditions</span>
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
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Referral URL Card */}
      <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50/50 to-white">
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Referral Link</h3>
            <p className="text-gray-600 text-sm break-all font-mono bg-white px-3 py-1.5 rounded border border-blue-100">{referralUrl}</p>
          </div>
          <Button
            onClick={handleCopyUrl}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? "Copied!" : "Copy URL"}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 -mb-px ${
            activeTab === "users" 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Referred Users ({referralUsers.length})
        </button>
        <button
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 -mb-px ${
            activeTab === "earnings" 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("earnings")}
        >
          Earnings & Wallet
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "users" && (
        <Card className="border-gray-200 shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Network Directory
            </CardTitle>
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
              {referralUsers.length} Total Direct Referrals
            </span>
          </div>
          
          <CardContent className="p-0">
            {referralUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No users available for this affiliate.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100/80 text-gray-700 font-semibold border-b border-gray-200 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">User Name</th>
                      <th className="py-3 px-4">Affiliate Code</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4 text-center">Sub-Affiliates</th>
                      <th className="py-3 px-4">Joined On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {referralUsers.map((u, index) => (
                      <tr 
                        key={u.id} 
                        className={`hover:bg-blue-50/40 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">
                          <div>{u.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded border border-gray-200">
                            {u.affiliate_code || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {u.city || u.state ? `${u.city || ""}${u.city && u.state ? ", " : ""}${u.state || ""}` : <span className="text-gray-400 italic">Not specified</span>}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-200">
                            {u.sub_affiliates_count}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(u.created_at).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "earnings" && (
        <div className="space-y-6">
          {/* Wallet Header Card */}
          <Card className="border-emerald-100 shadow-sm bg-gradient-to-r from-emerald-50/60 to-white">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
                  <Wallet className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Available Wallet Balance</p>
                  <h2 className="text-3xl font-extrabold text-gray-900 mt-0.5">₹0.00</h2>
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2" onClick={()=>{
                                       router.push(`/wallet`);
              }}>
                <span>Withdraw Funds</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Commission Rates Breakdown Card */}
          <Card className="border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Percent className="w-5 h-5 text-blue-600" />
                Your Commission Structure
              </CardTitle>
              <span className="text-xs text-gray-500">Configured by Admin</span>
            </div>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100/80 text-gray-700 font-semibold border-b border-gray-200 text-xs uppercase tracking-wider">
                      <th className="py-3 px-6">Commission Type</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-right">Commission Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {[
                      {
                        title: "Repurchase Commission",
                        allowed: commissionSettings?.is_repurchase_commission_allowed,
                        pct: commissionSettings?.repurchase_commission_pct,
                      },
                      {
                        title: "Override Commission",
                        allowed: commissionSettings?.is_override_commission_allowed,
                        pct: commissionSettings?.override_commission_pct,
                      },
                      {
                        title: "Advertisement Commission",
                        allowed: commissionSettings?.is_advertisment_commission_allowed,
                        pct: commissionSettings?.advertisment_commission_pct,
                      },
                      {
                        title: "Mall Commission",
                        allowed: commissionSettings?.is_mall_commission_allowed,
                        pct: commissionSettings?.mall_commission_pct,
                      },
                      {
                        title: "Franchise Commission",
                        allowed: commissionSettings?.is_franchise_commission_allowed,
                        pct: commissionSettings?.franchise_commission_pct,
                      },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">{item.title}</td>
                        <td className="py-4 px-6 text-center">
                          {item.allowed ? (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Allowed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200">
                              <XCircle className="w-3.5 h-3.5" /> Disabled
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-semibold text-gray-800">
                          {item.allowed && item.pct !== null && item.pct !== undefined ? (
                            <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                              {item.pct}%
                            </span>
                          ) : (
                            <span className="text-gray-400 font-normal">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AffiliateTab;