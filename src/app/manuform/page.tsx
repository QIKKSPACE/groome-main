"use client";

import React, { useEffect, useState, useContext } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { WebflowContext } from "@/contexts/WebflowContext";
import { apiClient } from "@/api/apiClient";
import { useToast } from "@/components/ui/toast";

interface FormData {
  firmName: string;
  pincode: string;
  city: string;
  state: string;
  fullAddress: string;
  manufacturerNumber?: string;
  documentImage?: File | null;
  selectedProducts: string[];
}

export default function ManufacturerForm() {
  const [form, setForm] = useState<FormData>({
    firmName: "",
    pincode: "",
    city: "",
    state: "",
    fullAddress: "",
    selectedProducts: [],
  });

  const [loading, setLoading] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState("");
  const [isZipValid, setIsZipValid] = useState(false);
const { login, redirectPath, setRedirectPath, error: authError } = useAuth();
  
  useEffect(() => {
    setRedirectPath(null);
  }, []);
  const { showToast } = useToast();

  const { data, loading: categoriesLoading, error: categoriesError } = useContext(WebflowContext);
  const categories = data?.categories?.filter((c: any) => !c.parent_id) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ ZIP code lookup
  const handleZipLookup = async (zip: string) => {
    if (zip.length !== 6) return;

    setZipLoading(true);
    setZipError("");
    setIsZipValid(false);

    try {
      const res = await fetch(`https://api.thegroome.com/superadmin/zip-lookup?zip=${zip}`, {
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
        setZipError("");
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

  const handleProductSelect = (productId: string) => {
    setForm((prev) => {
      const alreadySelected = prev.selectedProducts.includes(productId);
      return {
        ...prev,
        selectedProducts: alreadySelected
          ? prev.selectedProducts.filter((p) => p !== productId)
          : [...prev.selectedProducts, productId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("firm_name", form.firmName);
      formData.append("address", form.fullAddress);
      formData.append("zip_code", form.pincode);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("manufacturer_number", form.manufacturerNumber || "");
      if (form.documentImage) formData.append("company_doc", form.documentImage);
      formData.append("product_ids", JSON.stringify(form.selectedProducts));

      const res = await apiClient.post("/verification/manufacturers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("🎉 Manufacturer registered successfully!", "success");
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">🏭 Register Your Manufacturer Firm</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Firm Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Firm Name</label>
          <input
            type="text"
            name="firmName"
            value={form.firmName}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your firm name"
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
                if (e.target.value.length === 6) handleZipLookup(e.target.value);
              }}
              disabled={zipLoading}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="6-digit PIN code"
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
            placeholder="Enter full firm address"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Manufacturer Number & Document */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Manufacturer Number</label>
          <input
            type="text"
            name="manufacturerNumber"
            value={form.manufacturerNumber || ""}
            onChange={handleChange}
            placeholder="Enter Manufacturer Number"
            className="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Document Image</label>
          <div className="relative mt-1 border rounded-lg flex items-center p-2">
            <FileUp className="text-gray-500 w-5 h-5 mr-2" />
            <input
              type="file"
              name="documentImage"
              onChange={handleChange}
              className="text-sm"
            />
          </div>
        </div>

        {/* Product Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Products
          </label>
          {categoriesLoading ? (
            <p className="text-gray-500 text-sm">Loading products...</p>
          ) : categoriesError ? (
            <p className="text-red-500 text-sm">Failed to load products.</p>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 border p-3 rounded-lg max-h-40 overflow-y-auto">
              {categories.map((cat: any) => (
                <label key={cat.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.selectedProducts.includes(cat.id)}
                    onChange={() => handleProductSelect(cat.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No products available.</p>
          )}
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
