"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Layout,
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2,
  Tag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  Megaphone,
} from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const API_BASE = "https://api.thegroome.com";

export default function AdBookingPage() {
  // Config Data
  const [pricingConfig, setPricingConfig] = useState({
    positionRates: { top: 0, middle: 0, bottom: 0, service: 0 },
    discounts: [],
  });
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setRedirectPath } = useAuth();
  const router = useRouter();

  // User Selections
  const [selectedPosition, setSelectedPosition] = useState("top");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetLink, setTargetLink] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Multi-Level Multi-Select Cascading Location State
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedTehsils, setSelectedTehsils] = useState([]);
  const [selectedPincodes, setSelectedPincodes] = useState([]);

  // All Pincodes Checkbox State
  const [selectAllPincodes, setSelectAllPincodes] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setRedirectPath("/advertisment");
      router.push("/auth");
    }
  }, [user, setRedirectPath, router]);

  // Fetch Location and Pricing Config on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [locRes, priceRes] = await Promise.all([
          fetch(`${API_BASE}/location/all`),
          fetch(`${API_BASE}/adv-pricing/pricing-config`),
        ]);

        const locData = await locRes.json();
        const priceData = await priceRes.json();

        setLocations(Array.isArray(locData) ? locData : []);
        if (priceData.success) {
          setPricingConfig(priceData.data);
        }
      } catch (err) {
        console.error("Failed to load setup data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Multi-Select Cascading Location Options
  const countryOptions = locations;

  const stateOptions = useMemo(() => {
    return locations
      .filter((c) => selectedCountries.includes(String(c.id)))
      .flatMap((c) => c.states || []);
  }, [locations, selectedCountries]);

  const cityOptions = useMemo(() => {
    return stateOptions
      .filter((s) => selectedStates.includes(String(s.id)))
      .flatMap((s) => s.cities || []);
  }, [stateOptions, selectedStates]);

  const tehsilOptions = useMemo(() => {
    return cityOptions
      .filter((c) => selectedCities.includes(String(c.id)))
      .flatMap((c) => c.tehsils || []);
  }, [cityOptions, selectedCities]);

  const pincodeOptions = useMemo(() => {
    return tehsilOptions
      .filter((t) => selectedTehsils.includes(String(t.id)))
      .flatMap((t) => t.pincodes || []);
  }, [tehsilOptions, selectedTehsils]);

  // Selected Names / Codes Derived from Selected IDs
  const selectedCountryNames = useMemo(() => {
    return countryOptions
      .filter((c) => selectedCountries.includes(String(c.id)))
      .map((c) => c.name);
  }, [countryOptions, selectedCountries]);

  const selectedStateNames = useMemo(() => {
    return stateOptions
      .filter((s) => selectedStates.includes(String(s.id)))
      .map((s) => s.name);
  }, [stateOptions, selectedStates]);

  const selectedCityNames = useMemo(() => {
    return cityOptions
      .filter((c) => selectedCities.includes(String(c.id)))
      .map((c) => c.name);
  }, [cityOptions, selectedCities]);

  const selectedTehsilNames = useMemo(() => {
    return tehsilOptions
      .filter((t) => selectedTehsils.includes(String(t.id)))
      .map((t) => t.name);
  }, [tehsilOptions, selectedTehsils]);

  const selectedPincodeCodes = useMemo(() => {
    return pincodeOptions
      .filter((p) => selectedPincodes.includes(String(p.id)))
      .map((p) => p.code || p.name || p.id);
  }, [pincodeOptions, selectedPincodes]);

  // Handle Select All Pincodes Toggle
  const handleToggleSelectAllPincodes = (e) => {
    const checked = e.target.checked;
    setSelectAllPincodes(checked);
    if (checked) {
      const allIds = pincodeOptions.map((p) => String(p.id));
      setSelectedPincodes(allIds);
    } else {
      setSelectedPincodes([]);
    }
  };

  // Helper Multi-Select Toggle Function
  const toggleSelection = (id, currentList, setList, resetChildrenFn) => {
    const strId = String(id);
    let updatedList;
    if (currentList.includes(strId)) {
      updatedList = currentList.filter((item) => item !== strId);
    } else {
      updatedList = [...currentList, strId];
    }
    setList(updatedList);

    if (resetChildrenFn) {
      resetChildrenFn();
    }
  };

  // Duration & Pricing Calculation Logic
  const daysCount = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  }, [startDate, endDate]);

  const activeDiscountPct = useMemo(() => {
    if (daysCount <= 0 || !pricingConfig.discounts.length) return 0;
    const applicableTier = pricingConfig.discounts.find((d) => {
      const minPass = daysCount >= d.minDays;
      const maxPass = !d.maxDays || daysCount <= d.maxDays;
      return minPass && maxPass;
    });
    return applicableTier ? Number(applicableTier.discount) : 0;
  }, [daysCount, pricingConfig.discounts]);

  const priceCalculation = useMemo(() => {
    const dailyRate = Number(pricingConfig.positionRates[selectedPosition]) || 0;
    const rawTotal = dailyRate * daysCount;
    const discountAmount = (rawTotal * activeDiscountPct) / 100;
    const finalTotal = rawTotal - discountAmount;

    return { dailyRate, rawTotal, discountAmount, finalTotal };
  }, [selectedPosition, daysCount, activeDiscountPct, pricingConfig.positionRates]);

  // Image Upload Handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!daysCount) return alert("Please select a valid date range.");
    if (selectedCountries.length === 0) return alert("Please select at least one Country.");

    // Validation: If Tehsil is selected, at least one pincode must be selected
    if (selectedTehsils.length > 0 && selectedPincodes.length === 0) {
      return alert("Select pincode inside tehsil or mark all pincode inside tehsil.");
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("position", selectedPosition);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("targetLink", targetLink);

      // Sending Names and Codes instead of IDs
      formData.append("countries", JSON.stringify(selectedCountryNames));
      if (selectedStateNames.length) formData.append("states", JSON.stringify(selectedStateNames));
      if (selectedCityNames.length) formData.append("cities", JSON.stringify(selectedCityNames));
      if (selectedTehsilNames.length) formData.append("tehsils", JSON.stringify(selectedTehsilNames));
      if (selectedPincodeCodes.length) formData.append("pincodes", JSON.stringify(selectedPincodeCodes));
      
      formData.append("allPincodesSelected", selectAllPincodes);

      if (bannerFile) formData.append("banner", bannerFile);
      const res = await apiClient.post("/campaigns/create-campaign", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
     

     if (res.data?.success) {
  setSubmitSuccess(true);
} else {
  alert(res.data?.error || "Failed to submit campaign. Please check inputs.");
}
    } catch (err) {
      console.error(err);
      alert("Error submitting advertisement request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-medium text-lg animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
          Loading Ad Portal Configuration...
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-xl border border-slate-100 dark:border-slate-700">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Campaign Submitted!</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Your advertisement request has been received. Our admin team will review and approve your banner shortly.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-black rounded-xl font-medium transition"
          >
            Create Another Campaign
          </button>
        </div>
      </div>
    );
  }

  const isPincodeMissingForTehsil = selectedTehsils.length > 0 && selectedPincodes.length === 0;
  const isSubmitDisabled = submitting || daysCount <= 0 || selectedCountries.length === 0 || isPincodeMissingForTehsil;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
       <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-center sm:text-left">
  <div>
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
      <Sparkles className="w-3.5 h-3.5" /> Ad Manager Portal
    </div>
    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
      Launch Your Campaign
    </h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
      Target hyper-local audiences across multiple countries, states, cities, and pincodes.
    </p>
  </div>

  {/* View All Campaigns Button */}
  <button
    onClick={()=>router.push('/advertisment/dashboard')}
    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition-all shadow-sm shrink-0"
  >
    <Megaphone className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
    View All Campaigns
  </button>
</div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Inputs (Left Column) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Target Locations (Multi-Select Cascading) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Select Target Zone(s)</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Select multiple regions at any level for your ad campaign.</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* 1. Country Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Countries * ({selectedCountries.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    {countryOptions.map((c) => {
                      const isSelected = selectedCountries.includes(String(c.id));
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() =>
                            toggleSelection(c.id, selectedCountries, setSelectedCountries, () => {
                              setSelectedStates([]);
                              setSelectedCities([]);
                              setSelectedTehsils([]);
                              setSelectedPincodes([]);
                              setSelectAllPincodes(false);
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-indigo-600 text-black shadow-sm"
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                          <span className={isSelected ? "text-black" : "text-slate-800 dark:text-slate-200"}>
                            {c.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. State Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    States ({selectedStates.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    {stateOptions.length === 0 ? (
                      <span className="text-xs text-slate-400">Select a country first</span>
                    ) : (
                      stateOptions.map((s) => {
                        const isSelected = selectedStates.includes(String(s.id));
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() =>
                              toggleSelection(s.id, selectedStates, setSelectedStates, () => {
                                setSelectedCities([]);
                                setSelectedTehsils([]);
                                setSelectedPincodes([]);
                                setSelectAllPincodes(false);
                              })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-indigo-600 text-black shadow-sm"
                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                            <span className={isSelected ? "text-black" : "text-slate-800 dark:text-slate-200"}>
                              {s.name}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 3. City Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Cities ({selectedCities.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    {cityOptions.length === 0 ? (
                      <span className="text-xs text-slate-400">Select state(s) first</span>
                    ) : (
                      cityOptions.map((c) => {
                        const isSelected = selectedCities.includes(String(c.id));
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() =>
                              toggleSelection(c.id, selectedCities, setSelectedCities, () => {
                                setSelectedTehsils([]);
                                setSelectedPincodes([]);
                                setSelectAllPincodes(false);
                              })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-indigo-600 text-black shadow-sm"
                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                            <span className={isSelected ? "text-black" : "text-slate-800 dark:text-slate-200"}>
                              {c.name}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 4. Tehsil Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Tehsils ({selectedTehsils.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    {tehsilOptions.length === 0 ? (
                      <span className="text-xs text-slate-400">Select city/cities first</span>
                    ) : (
                      tehsilOptions.map((t) => {
                        const isSelected = selectedTehsils.includes(String(t.id));
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() =>
                              toggleSelection(t.id, selectedTehsils, setSelectedTehsils, () => {
                                setSelectedPincodes([]);
                                setSelectAllPincodes(false);
                              })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-indigo-600 text-black shadow-sm"
                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                            <span className={isSelected ? "text-black" : "text-slate-800 dark:text-slate-200"}>
                              {t.name}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 5. Pincode Selection & "Select All" Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                      Pincodes ({selectedPincodes.length} selected)
                    </label>

                    {tehsilOptions.length > 0 && pincodeOptions.length > 0 && (
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        <input
                          type="checkbox"
                          checked={selectAllPincodes}
                          onChange={handleToggleSelectAllPincodes}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                        />
                        Select All Pincodes in selected Tehsil(s)
                      </label>
                    )}
                  </div>

                  <div className={`flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border ${
                    isPincodeMissingForTehsil
                      ? "border-amber-500 dark:border-amber-500"
                      : "border-slate-200 dark:border-slate-700"
                  }`}>
                    {pincodeOptions.length === 0 ? (
                      <span className="text-xs text-slate-400">Select tehsil(s) first</span>
                    ) : (
                      pincodeOptions.map((p) => {
                        const isSelected = selectedPincodes.includes(String(p.id));
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectAllPincodes(false);
                              toggleSelection(p.id, selectedPincodes, setSelectedPincodes);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-indigo-600 text-black shadow-sm"
                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                            <span className={isSelected ? "text-black" : "text-slate-800 dark:text-slate-200"}>
                              {p.code}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Tehsil without Pincode Validation Error Display */}
                  {isPincodeMissingForTehsil && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Select pincode inside tehsil or mark all pincode inside tehsil</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Choose Position */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Select Banner Placement</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Choose where your ad appears on the website.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "top", name: "Top Header Banner", desc: "Maximum visibility above fold" },
                  { key: "middle", name: "Middle Content Banner", desc: "High engagement within articles" },
                  { key: "bottom", name: "Bottom Footer Banner", desc: "Cost-effective baseline reach" },
                  { key: "service", name: "Service Section Banner", desc: "Targeted service conversion zone" },
                ].map((pos) => {
                  const rate = pricingConfig.positionRates[pos.key] || 0;
                  const isSelected = selectedPosition === pos.key;
                  return (
                    <div
                      key={pos.key}
                      onClick={() => setSelectedPosition(pos.key)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">{pos.name}</span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">₹{rate}/day</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pos.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Date Range Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Campaign Duration</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pick your flight dates.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">End Date *</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Creative & Target Link */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Upload Banner & Link</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Attach creative media and click-through URL.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Target Link (URL) *</label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="url"
                      placeholder="https://yourwebsite.com/landing-page"
                      value={targetLink}
                      onChange={(e) => setTargetLink(e.target.value)}
                      required
                      className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Banner Image *</label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/40 transition">
                    {bannerPreview ? (
                      <div className="relative group max-w-md mx-auto">
                        <img src={bannerPreview} alt="Banner Preview" className="max-h-40 rounded-lg mx-auto shadow-sm" />
                        <button
                          type="button"
                          onClick={() => {
                            setBannerFile(null);
                            setBannerPreview(null);
                          }}
                          className="mt-3 text-xs text-red-500 hover:underline font-medium"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Click to upload banner</span>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP (Max 5MB)</p>
                        <input type="file" accept="image/*" onChange={handleImageChange} required className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout & Pricing Summary (Right Sticky Column) */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 sticky top-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Summary & Pricing</h3>

              <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Placement</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{selectedPosition} Banner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Target Zones</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedCountries.length} Country/Countries</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Daily Rate</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">₹{priceCalculation.dailyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Duration</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{daysCount} Days</span>
                </div>
              </div>

              {/* Discounts */}
              {activeDiscountPct > 0 && (
                <div className="my-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5" /> Bulk Discount ({activeDiscountPct}%)
                  </span>
                  <span className="font-bold">-₹{priceCalculation.discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Total Calculation */}
              <div className="pt-2 pb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Total Cost</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      ₹{priceCalculation.finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full py-8 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition ${
                  isSubmitDisabled
                    ? "bg-slate-400 dark:bg-slate-700 text-slate-200 cursor-not-allowed opacity-80"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 active:scale-[0.98]"
                }`}
              >
                {submitting ? (
                  <span className="text-black font-semibold">Submitting...</span>
                ) : (
                  <>
                    <span className="text-black font-bold">Submit Campaign</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Reviewed by Admin before activation
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}