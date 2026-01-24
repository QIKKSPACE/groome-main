"use client";

import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { apiClient } from "@/api/apiClient";

interface InfluencerFormData {
  name: string;
  instagramProfile: string;
  state: string;
  contentType: string;
  languages: string[];
  profilePicture?: File | null;
  consent: boolean;
  aboutYou: string; // ✅ Added About You
}

const indianLanguages = [
  "Hindi",
  "English",
  "Bhojpuri",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Odia",
  "Bengali",
  "Assamese",
];

const contentTypes = [
  "Lifestyle",
  "Tech",
  "Food",
  "Travel",
  "Fitness",
  "Fashion",
  "Education",
  "Entertainment",
  "Parenting",
];

export default function InfluencerForm() {
  const [form, setForm] = useState<InfluencerFormData>({
    name: "",
    instagramProfile: "",
    state: "",
    contentType: "",
    languages: [],
    profilePicture: null,
    consent: false,
    aboutYou: "", // ✅ initialize
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files, type, checked } = e.target as any;
    if (type === "checkbox" && name === "consent") {
      setForm((prev) => ({ ...prev, consent: checked }));
    } else if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLanguageSelect = (language: string) => {
    setForm((prev) => {
      const alreadySelected = prev.languages.includes(language);
      return {
        ...prev,
        languages: alreadySelected
          ? prev.languages.filter((l) => l !== language)
          : [...prev.languages, language],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.consent) {
      showToast("⚠️ You must give consent to proceed.", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("instagram_profile", form.instagramProfile);
      formData.append("state", form.state);
      formData.append("content_type", form.contentType);
      formData.append("languages", JSON.stringify(form.languages));
      formData.append("about_you", form.aboutYou); // ✅ append aboutYou
       formData.append("consent", form.consent); // ✅ append aboutYou
      if (form.profilePicture) formData.append("profile_picture", form.profilePicture);

      // TODO: Replace with your API call
    const res = await apiClient.post("/verification/influencer/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
      showToast("🎉 Influencer registered successfully!", "success");
    }catch (err: any) {
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    "Something went wrong";

  showToast(`❌ ${message}`, "error");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg mb-20 md:mb-0">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">📸 Register as an Influencer</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Instagram Profile */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Instagram Profile Link</label>
          <input
            type="url"
            name="instagramProfile"
            value={form.instagramProfile}
            onChange={handleChange}
            required
            placeholder="https://www.instagram.com/yourprofile"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            placeholder="Enter your state"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Main Content Type</label>
          <select
            name="contentType"
            value={form.contentType}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select content type</option>
            {contentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Languages Known</label>
          <div className="grid grid-cols-2 gap-2 border p-3 rounded-lg max-h-40 overflow-y-auto">
            {indianLanguages.map((lang) => (
              <label key={lang} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.languages.includes(lang)}
                  onChange={() => handleLanguageSelect(lang)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                {lang}
              </label>
            ))}
          </div>
        </div>

        {/* About You */}
        <div>
          <label className="block text-sm font-medium text-gray-700">About You (max 1000 chars)</label>
          <textarea
            name="aboutYou"
            value={form.aboutYou}
            onChange={handleChange}
            maxLength={1000}
            rows={6}
            placeholder="Tell us a bit about yourself"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{form.aboutYou.length}/1000</p>
        </div>

        {/* Profile Picture */}
       

        {/* Consent Checkbox */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={handleChange}
            required
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700">
            I confirm to join <strong>Gromme</strong> as an influencer and consent to allow Gromme to use my video for promotional purposes wherever required.
          </label>
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
