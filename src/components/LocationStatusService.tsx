"use client";

import React from "react";
import { MapPin, PackageCheck } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import ServicesOffered from "./sections/services-offered";

const LocationRequestService: React.FC = () => {
  const { location } = useLocation();
  const locationMissing = !location?.lat || !location?.lng;

  return (
    <div className="flex flex-col items-center px-4 bg-gray-50">
      {/* Card for icon and message */}
      <div className="bg-white shadow-lg rounded-3xl p-8 flex flex-col items-center max-w-md w-full mt-12 animate-fadeIn">
        {locationMissing ? (
          <MapPin className="text-blue-500 w-14 h-14 mb-4 animate-bounce" />
        ) :<div/>}

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
          {locationMissing
            ? "Enable Location or Select City"
            : "BOOK SERVICES"}
        </h2>

        {locationMissing && (
          <p className="text-gray-500 text-sm md:text-base mb-6">
            To show services near you, enable location on the home page or select your city manually.
          </p>
        )}
      </div>

      {/* Services Offered (only if location is available) */}
      {!locationMissing && (
        <div className="w-full mt-8">
          <ServicesOffered />
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce { animation: bounce 1s infinite; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse { animation: pulse 1.5s infinite; }
      `}</style>
    </div>
  );
};

export default LocationRequestService;
