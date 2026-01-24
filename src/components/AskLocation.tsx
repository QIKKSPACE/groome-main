"use client";

import React, { useState } from "react";
import { useLocation } from "@/contexts/LocationContext";
import { X } from "lucide-react";

interface AskLocationProps {
  onClose: () => void;
}

const AskLocation: React.FC<AskLocationProps> = ({ onClose }) => {
  const { updateLocation } = useLocation();
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoords = async () => {
    if (pincode.length !== 6) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://thegroome.com/backend/superadmin/longlat?pincode=${pincode}`
      );
      if (!res.ok) throw new Error("Invalid pincode or server error.");

      const data = await res.json();

      if (data.lat && data.lng) {
        updateLocation({
          lat: data.lat,
          lng: data.lng,
          pincode,
          type: "pincode",
        });
        onClose?.(); // safe call
      } else {
        setError("Could not find coordinates for this pincode.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm">
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm animate-fadeIn">
        <button
          onClick={() => onClose?.()}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="font-semibold text-xl text-center mb-4 text-gray-800">
          Enter Your Pincode
        </h2>

        <input
          type="text"
          value={pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 6) setPincode(value);
          }}
          placeholder="e.g. 110001"
          maxLength={6}
          className="border border-gray-300 text-center text-lg tracking-wide p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={fetchCoords}
          disabled={pincode.length !== 6 || loading}
          className={`mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all duration-300 ${
            loading || pincode.length !== 6
              ? "opacity-70 cursor-not-allowed"
              : ""
          }`}
        >
          {loading ? "Fetching..." : "Submit Pincode"}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AskLocation;
