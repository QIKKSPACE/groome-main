"use client";

import React, { useEffect, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";

interface DeliveryFormData {
  riderName: string;
  pincode: string;
  city: string;
  state: string;
  fullAddress: string;
  dlNumber?: string;
  dlImage?: File | null;
}

export default function DeliveryForm() {
  const [form, setForm] = useState<DeliveryFormData>({
    riderName: "",
    pincode: "",
    city: "",
    state: "",
    fullAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState("");
  const [isZipValid, setIsZipValid] = useState(false);
  const { showToast } = useToast();
const { login, redirectPath, setRedirectPath, error: authError } = useAuth();
  
  useEffect(() => {
    setRedirectPath(null);
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ ZIP Code Lookup
  const handleZipLookup = async (zip: string) => {
    if (zip.length !== 6) return;

    setZipLoading(true);
    setZipError("");
    setIsZipValid(false);

    try {
      const res = await fetch(`https://thegroome.com/backend/superadmin/zip-lookup?zip=${zip}`, {
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          city: data.city,
          state: data.state,
        }));
        setIsZipValid(true);
      } else {
        setZipError(data.error || "Invalid PIN code — please fill details manually.");
        setIsZipValid(false);
        setForm((prev) => ({ ...prev, city: "", state: "" }));
      }
    } catch (err) {
      setZipError("Unable to fetch location. Please fill city and state manually.");
      setIsZipValid(false);
    } finally {
      setZipLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("rider_name", form.riderName);
      formData.append("address", form.fullAddress);
      formData.append("zip_code", form.pincode);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("dl_number", form.dlNumber || "");
      if (form.dlImage) formData.append("dl_image", form.dlImage);

      const res = await apiClient.post("/verification/delivery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("🚴 Rider registered successfully!", "success");
      console.log("✅ Response:", res.data);
    } catch (err: any) {
      console.error("❌ Error submitting form:", err);
      showToast(`${err?.response?.data?.message || "Something went wrong."}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg mb-20 md:mb-0">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">🚴 Register Delivery Rider</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rider Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Rider Name</label>
          <input
            type="text"
            name="riderName"
            value={form.riderName}
            onChange={handleChange}
            required
            placeholder="Enter rider's full name"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PIN Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">PIN Code</label>
          <div className="relative">
            <input
              type="text"
              name="pincode"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value.length === 6) handleZipLookup(e.target.value);
              }}
              disabled={zipLoading}
              required
              placeholder="6-digit PIN code"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {zipLoading && <Loader2 className="absolute right-3 top-3 h-5 w-5 text-blue-500 animate-spin" />}
          </div>
          {zipError && <p className="text-red-500 text-sm mt-1">{zipError}</p>}
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="Enter city"
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isZipValid && "bg-white"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              placeholder="Enter state"
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isZipValid && "bg-white"}`}
            />
          </div>
        </div>

        {/* Full Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Address</label>
          <input
            type="text"
            name="fullAddress"
            value={form.fullAddress}
            onChange={handleChange}
            required
            placeholder="Enter full address"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* DL Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">DL Number</label>
          <input
            type="text"
            name="dlNumber"
            value={form.dlNumber || ""}
            onChange={handleChange}
            placeholder="Enter Driving License Number"
            className="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* DL Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">DL Image</label>
          <div className="relative mt-1 border rounded-lg flex items-center p-2">
            <FileUp className="text-gray-500 w-5 h-5 mr-2" />
            <input type="file" name="dlImage" onChange={handleChange} className="text-sm" />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
