"use client";

import React, { useState } from "react";
import { Loader2, MapPin, FileUp, Search } from "lucide-react";

interface FormData {
  businessName: string;
  pincode: string;
  city: string;
  state: string;
  gstNumber?: string;
  gstFile?: File | null;
  shopActNumber?: string;
  shopActFile?: File | null;
}

export default function BusinessForm() {
  const [form, setForm] = useState<FormData>({
    businessName: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(false);
  const [zipError, setZipError] = useState("");
  const [isZipValid, setIsZipValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleZipLookup = async (zip: string) => {
    if (zip.length !== 6) return;
    setLoading(true);
    setZipError("");
    try {
      const res = await fetch(`/api/lookupZip?zip=${zip}`);
      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          city: data.city,
          state: data.state,
        }));
        setIsZipValid(true);
      } else {
        setZipError(data.error || "Invalid PIN code");
        setIsZipValid(false);
        setForm((prev) => ({ ...prev, city: "", state: "" }));
      }
    } catch (err) {
      setZipError("Failed to fetch location");
      setIsZipValid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // TODO: send to backend
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🏢 Register Your Business
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your business name"
          />
        </div>

        {/* Pincode */}
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
                if (e.target.value.length === 6) {
                  handleZipLookup(e.target.value);
                }
              }}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="6-digit PIN code"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-3 h-5 w-5 text-blue-500 animate-spin" />
            )}
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
              disabled={!isZipValid}
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              disabled={!isZipValid}
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>
        </div>

        {/* Google Maps Search (to be integrated later) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Location (Google Map)
          </label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="Search your business location..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!isZipValid}
            />
            <button
              type="button"
              disabled={!isZipValid}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-white ${
                isZipValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
              }`}
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>

        {/* GST & Shop Act Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            GST Number (optional)
          </label>
          <input
            type="text"
            name="gstNumber"
            value={form.gstNumber || ""}
            onChange={handleChange}
            placeholder="Enter GST number"
            className="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload GST File (optional)
          </label>
          <div className="relative mt-1 border rounded-lg flex items-center p-2">
            <FileUp className="text-gray-500 w-5 h-5 mr-2" />
            <input type="file" name="gstFile" onChange={handleChange} className="text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shop Act Number (optional)
          </label>
          <input
            type="text"
            name="shopActNumber"
            value={form.shopActNumber || ""}
            onChange={handleChange}
            placeholder="Enter Shop Act number"
            className="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Shop Act File (optional)
          </label>
          <div className="relative mt-1 border rounded-lg flex items-center p-2">
            <FileUp className="text-gray-500 w-5 h-5 mr-2" />
            <input type="file" name="shopActFile" onChange={handleChange} className="text-sm" />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
