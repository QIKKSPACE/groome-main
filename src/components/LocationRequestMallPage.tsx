"use client";

import React, { useState } from "react";
import { MapPin, PackageCheck } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import AskLocation from "./AskLocation";

const LocationRequestMallPage: React.FC = () => {
  const { location } = useLocation();
  const locationMissing = !location?.lat || !location?.lng;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 bg-gray-50">
        <div className="bg-white shadow-lg rounded-3xl p-8 flex flex-col items-center max-w-md w-full animate-fadeIn">
          {/* Icon */}
          {locationMissing ? (
            <MapPin className="text-blue-500 w-14 h-14 mb-4 animate-bounce" />
          ) : (
            <PackageCheck className="text-green-500 w-14 h-14 mb-4 animate-pulse" />
          )}

          {/* Heading */}
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
            {locationMissing
              ? "Location Required"
              : "No Nearby Digital Mall Found"}
          </h2>

          {/* Subtext */}
          <p className="text-gray-500 text-sm md:text-base mb-6">
            {locationMissing
              ? "To show nearby digital malls, enter your pincode."
              : "We will notify you when a Digital Mall is available near you. Please check back later."}
          </p>

          {/* Button to open pincode modal */}
          {locationMissing && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all duration-300"
            >
              Enter Pincode
            </button>
          )}
        </div>
      </div>

      {/* Pincode Modal */}
      {modalOpen && (
        <AskLocation
          onClose={() => {
            setModalOpen(false);
          }}
        />
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
    </>
  );
};

export default LocationRequestMallPage;
