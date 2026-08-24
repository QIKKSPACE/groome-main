"use client";

import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { apiClient } from "@/api/apiClient";

interface InfluencerFormData {
  name: string;
  instagramProfile: string;
  youtubeChannel: string;
  state: string;
  city: string; // ✅ Added City
  contentTypes: string[];
  languages: string[];
  profilePicture?: File | null;
  consent: boolean;
  aboutYou: string;
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

const availableContentTypes = [
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
    youtubeChannel: "",
    state: "",
    city: "", // ✅ Initialize City
    contentTypes: [],
    languages: [],
    profilePicture: null,
    consent: false,
    aboutYou: "",
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

  const handleContentTypeSelect = (type: string) => {
    setForm((prev) => {
      const alreadySelected = prev.contentTypes.includes(type);
      return {
        ...prev,
        contentTypes: alreadySelected
          ? prev.contentTypes.filter((t) => t !== type)
          : [...prev.contentTypes, type],
      };
    });
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

    if (form.contentTypes.length === 0) {
      showToast("⚠️ Please select at least one content type.", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("instagram_profile", form.instagramProfile);
      formData.append("youtube_channel", form.youtubeChannel);
      formData.append("state", form.state);
      formData.append("city", form.city); // ✅ Append City
      formData.append("content_types", JSON.stringify(form.contentTypes));
      formData.append("languages", JSON.stringify(form.languages));
      formData.append("about_you", form.aboutYou);
      formData.append("consent", String(form.consent));
      
     

      await apiClient.post("/verification/influencer/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      showToast("🎉 Influencer registered successfully!", "success");
    } catch (err: any) {
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

        {/* Social Handles Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Instagram Profile */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram Profile Link</label>
            <input
              type="url"
              name="instagramProfile"
              value={form.instagramProfile}
              onChange={handleChange}
              required
              placeholder="https://instagram.com/..."
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* YouTube Channel Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube Channel Link</label>
            <input
              type="url"
              name="youtubeChannel"
              value={form.youtubeChannel}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Location Group (State & City inline side-by-side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="Enter your city"
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
        </div>

        {/* Content Types (Multiple Selection Grid) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Niches (Select all that apply)</label>
          <div className="grid grid-cols-2 gap-2 border p-3 rounded-lg max-h-40 overflow-y-auto">
            {availableContentTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                <input
                  type="checkbox"
                  checked={form.contentTypes.includes(type)}
                  onChange={() => handleContentTypeSelect(type)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Languages Known</label>
          <div className="grid grid-cols-2 gap-2 border p-3 rounded-lg max-h-40 overflow-y-auto">
            {indianLanguages.map((lang) => (
              <label key={lang} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
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
            rows={4}
            placeholder="Tell us a bit about yourself"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{form.aboutYou.length}/1000</p>
        </div>

       

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
            I confirm to join <strong>Groome</strong> as an influencer and consent to allow Groome to use my Images & Videos for promotional purposes wherever required.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}