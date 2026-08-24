"use client";

import React, { useContext, useEffect, useState } from "react";
import { Loader2, FileUp, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/api/apiClient";
import { useToast } from "@/components/ui/toast";
import { WebflowContext } from "@/contexts/WebflowContext";

interface FormData {
  shopName: string;
  pincode: string;
  city: string;
  state: string;
  fullAddress: string;
  lat?: number;
  lng?: number;
  shopActNumber?: string;
  shopActFile?: File | null;
  place_id: string;
  categories: string[]; // Assuming categories are identified by numeric IDs
}

interface PlaceSuggestion {
  description: string;
  place_id: string;
}

export default function MallForm() {
  const [form, setForm] = useState<FormData>({
    shopName: "",
    pincode: "",
    city: "",
    state: "",
    fullAddress: "",
    place_id: "",
    categories: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [zipError, setZipError] = useState("");
  const [isZipValid, setIsZipValid] = useState(false);
  const [isListedOnGoogle, setIsListedOnGoogle] = useState(false);

  const [googleSearch, setGoogleSearch] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<PlaceSuggestion[]>([]);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const { login, redirectPath, setRedirectPath, error: authError } = useAuth();
    const { data, loading: servicesLoading, error: servicesError } = useContext(WebflowContext);
  
  const services = data?.services || [];
const categories = data?.categories || [];

const parentCategories = categories.filter(
  (category: any) => category.parent_id === null
);
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

  const handleZipLookup = async (zip: string) => {
    if (zip.length !== 6) return;
    setLoading(true);
    setZipError("");
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
      setLoading(false);
    }
  };

  const fetchAutocomplete = async (query: string) => {
    if (!query || query.length < 2) {
      setAutocompleteResults([]);
      return;
    }
    setGoogleLoading(true);
    setGoogleError("");
    try {
      const res = await fetch(`https://api.thegroome.com/places/autocomplete?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch autocomplete");
      const data = await res.json();
      setAutocompleteResults(data);
    } catch (err) {
      setGoogleError("Failed to fetch suggestions. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const fetchPlaceDetails = async (place: PlaceSuggestion) => {
    setGoogleLoading(true);
    setGoogleError("");
    setAutocompleteResults([]);
    setGoogleSearch(place.description);

    try {
      const res = await fetch(`https://api.thegroome.com/places/details?place_id=${place.place_id}`);
      if (!res.ok) throw new Error("Failed to fetch place details");
      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        fullAddress: data.description || prev.fullAddress,
        city: data.city || prev.city,
        state: data.state || prev.state,
        lat: data.lat,
        lng: data.lng,
        place_id: place.place_id,
      }));
    } catch (err) {
      setGoogleError("Failed to fetch place details. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("shop_name", form.shopName);
    formData.append("address", form.fullAddress); 
    formData.append("zip_code", form.pincode);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("userId", "YOUR_USER_ID_HERE");
      formData.append("category_ids", JSON.stringify(form.categories)); // ✅ include selected category IDs

    if (form.shopActNumber) formData.append("company_id", form.shopActNumber);
    if (form.shopActFile) formData.append("company_doc", form.shopActFile);
    if (form.place_id) formData.append("place_id", form.place_id); // ✅ add this

    const res = await apiClient.post("/verification/malls/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    showToast("🎉 Mall registered successfully!", "success");
    console.log("✅ Response:", res.data);
  } catch (err: any) {
    console.error("❌ Error submitting form:", err);
    showToast(`${err?.response?.data?.message || "Something went wrong."}`, "error");
  } finally {
    setLoading(false);
  }
};
  const handleCategorySelect = (categoryId: number) => {
    setForm((prev) => {
      const alreadySelected = prev.categories.includes(categoryId);
      return {
        ...prev,
        categories: alreadySelected
          ? prev.categories.filter((id) => id !== categoryId)
          : [...prev.categories, categoryId ],
      };
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg mb-20 md:mb-0">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🏬 Register Your Mall Shop
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Shop Name</label>
          <input
            type="text"
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your shop name"
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
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="6-digit PIN code"
            />
            {loading && <Loader2 className="absolute right-3 top-3 h-5 w-5 text-blue-500 animate-spin" />}
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

        {/* Google Maps Search */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="listedOnGoogle"
            checked={isListedOnGoogle}
            onChange={(e) => setIsListedOnGoogle(e.target.checked)}
            disabled={!form.pincode || googleLoading}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="listedOnGoogle" className="text-sm text-gray-700">
            My shop is listed on Google Maps
          </label>
        </div>

        {isListedOnGoogle && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Find Your Shop on Google Maps
            </label>

            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Search your shop..."
                value={googleSearch}
                onChange={(e) => setGoogleSearch(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => fetchAutocomplete(googleSearch)}
                disabled={googleLoading || !googleSearch}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>

            {autocompleteResults.length > 0 && (
              <ul className="mt-2 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {autocompleteResults.map((place) => (
                  <li
                    key={place.place_id}
                    onClick={() => fetchPlaceDetails(place)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {place.description}
                  </li>
                ))}
              </ul>
            )}

            {googleError && <p className="text-red-500 text-sm mt-1">{googleError}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Selecting a result will auto-fill your address and location.
            </p>
          </div>
        )}

        {/* Full Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Address</label>
          <input
            type="text"
            name="fullAddress"
            value={form.fullAddress}
            onChange={handleChange}
            required
            placeholder="Enter full shop address"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
 <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Products Category
          </label>
          {servicesLoading ? (
            <p className="text-gray-500 text-sm">Loading services...</p>
          ) : servicesError ? (
            <p className="text-red-500 text-sm">Failed to load services.</p>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 border p-3 rounded-lg max-h-40 overflow-y-auto">
             {parentCategories.map((category: any) => (
  <label key={category.id} className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={form.categories?.includes(category.id)}
      onChange={() => handleCategorySelect(category.id)}
    />
    {category.name}
  </label>
))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No services available.</p>
          )}
        </div>
        {/* Shop Act */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Shop Act Number (optional)</label>
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
          <label className="block text-sm font-medium text-gray-700">Upload Shop Act File (optional)</label>
          <div className="relative mt-1 border rounded-lg flex items-center p-2">
            <FileUp className="text-gray-500 w-5 h-5 mr-2" />
            <input type="file" name="shopActFile" onChange={handleChange} className="text-sm" />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={googleLoading}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
