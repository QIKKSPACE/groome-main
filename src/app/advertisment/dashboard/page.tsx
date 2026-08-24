"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Megaphone, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Layers,
  RefreshCw
} from "lucide-react";

// Replace with your actual apiClient import
import { apiClient } from "@/api/apiClient";
import { useRouter } from "next/navigation";

const BASE_URL = "https://api.thegroome.com";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router=useRouter();
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      // Calling GET endpoint
      const res = await apiClient.get("/campaigns/campaigns");
      
      if (res.data?.success) {
        setCampaigns(res.data.data || []);
      } else {
        setError(res.data?.error || "Failed to load campaigns.");
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get professional status badge design
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 text-slate-500" /> {status || "Expired"}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 p-6 md:p-8 font-sans antialiased">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8 pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Ad Campaigns
            </h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Manage, track, and optimize your geo-targeted banner advertisements.
          </p>
        </div>

        <button onClick={()=>{router.push('/advertisment')}} 
        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all text-sm">
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[360px] bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-slate-600 text-sm font-medium">Loading your campaigns...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-rose-200 rounded-xl p-8 text-center max-w-md mx-auto my-8 shadow-sm">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Failed to load</h3>
            <p className="text-slate-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchCampaigns}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No campaigns found</h3>
            <p className="text-slate-500 text-sm mb-6">
              You haven&apos;t created any ad campaigns yet. Get started by creating your first banner campaign.
            </p>
            <button
              onClick={() => router.push('/advertisment')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition">
              <Plus className="w-4 h-4" /> Create First Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              // Construct complete image URL
              const imageUrl = campaign.bannerUrl?.startsWith("http")
                ? campaign.bannerUrl
                : `${BASE_URL}${campaign.bannerUrl}`;

              // Parse locations
              const locationList =
                campaign.locations?.pincodes?.length > 0
                  ? { type: "Pincodes", items: campaign.locations.pincodes }
                  : campaign.locations?.cities?.length > 0
                  ? { type: "Cities", items: campaign.locations.cities }
                  : campaign.locations?.states?.length > 0
                  ? { type: "States", items: campaign.locations.states }
                  : { type: "Countries", items: campaign.locations?.countries || [] };

              return (
                <div
                  key={campaign.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
                >
                  {/* Banner Image Container */}
             <div className="relative w-full h-40 bg-slate-100 border-b border-slate-200 overflow-hidden">
   <img
                        src={imageUrl}
                        alt={campaign.title || "Campaign Banner"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/600x300/0f172a/64748b?text=Banner+Unavailable";
                        }}
                      />
  
  {/* Top Overlay Badges */}
  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
    <div className="pointer-events-auto">
      {getStatusBadge(campaign.status)}
    </div>
    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide bg-slate-900/80 text-white backdrop-blur-sm pointer-events-auto">
      {campaign.position || "Top Banner"}
    </span>
  </div>
</div>

                  {/* Content Section */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {campaign.title || `Campaign #${campaign.id}`}
                      </h2>

                      {/* Target Link */}
                      <a
                        href={campaign.targetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 mt-1 line-clamp-1 group/link"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{campaign.targetLink}</span>
                      </a>
                    </div>

                    {/* Dates & Location Badges */}
                    <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      {/* Start and End Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium">
                          {new Date(campaign.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          –{" "}
                          {new Date(campaign.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Locations */}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="font-medium text-slate-700 block mb-1">
                            Targeting ({locationList.type}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {locationList.items.slice(0, 3).map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-700 font-mono"
                              >
                                {item}
                              </span>
                            ))}
                            {locationList.items.length > 3 && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-medium font-mono">
                                +{locationList.items.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}