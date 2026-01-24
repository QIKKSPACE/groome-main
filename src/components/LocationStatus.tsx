"use client";

import React, { useEffect, useState } from "react";
import { MapPin, PackageCheck } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import AskLocation from "./AskLocation";

type ModalState = "hidden" | "gps" | "pincode";

const LocationRequest: React.FC = () => {
  const { location, updateLocation } = useLocation();
  const [modalState, setModalState] = useState<ModalState>("hidden");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const locationMissing = !location?.lat || !location?.lng;

  useEffect(() => {
    if (location?.lat && location?.lng) {
      setModalState("hidden");
    } else if (!dismissed) {
      setModalState("gps");
    } else {
      setModalState("hidden");
    }
  }, [location, dismissed]);

  const handleGPSRequest = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported. Please enter your pincode.");
      setModalState("pincode");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          type: "gps",
        });
        setLoading(false);
        setModalState("hidden");
        setDismissed(false);
      },
      (err) => {
        setLoading(false);
        setError(
          err.code === 1
            ? "Permission denied. Please enter your pincode."
            : "Unable to get location. Please enter your pincode."
        );
        setModalState("pincode");
      }
    );
  };

  return (
    <>
      {/* --- Always-visible block element --- */}
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
              : "No Products or Vendors Found Near You"}
          </h2>

          {/* Subtext */}
          <p className="text-gray-500 text-sm md:text-base mb-6">
            {locationMissing
              ? "To show services near you, enter your pincode."
              : "We'll notify you when services are available in your area. Please check back later."}
          </p>

          {/* Button to open pincode modal */}
          {locationMissing && (
            <button
              onClick={() => setModalState("pincode")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all duration-300"
            >
              Enter Pincode
            </button>
          )}
        </div>
      </div>

      {/* --- GPS Modal --- */}
      {modalState === "gps" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-[90%] text-center animate-fadeIn relative">
            <MapPin className="text-blue-500 w-14 h-14 mb-4 mx-auto animate-bounce" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Enable Location or Enter Pincode
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              We use your location to show nearby services.
            </p>

            <button
              onClick={handleGPSRequest}
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-xl shadow-md w-full transition-all duration-300 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Fetching..." : "Enable Location"}
            </button>

            <button
              onClick={() => setModalState("pincode")}
              className="mt-3 text-gray-500 underline text-sm"
            >
              Enter Pincode Manually
            </button><br></br>

            <button
              onClick={() => {
                setDismissed(true);
                setModalState("hidden");
              }}
              className="mt-2 text-gray-400 text-xs underline"
            >
              Maybe later
            </button>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        </div>
      )}

      {/* --- Pincode Modal --- */}
      {modalState === "pincode" && (
        <AskLocation
          onClose={() => {
            setModalState("hidden");
            setError(null);
            setDismissed(true);
          }}
        />
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </>
  );
};

export default LocationRequest;
