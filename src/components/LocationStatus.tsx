"use client";

import React, { useEffect, useState } from "react";
import { MapPin, PackageCheck } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import AskLocation from "./AskLocation";

type ModalState = "hidden" | "gps" | "pincode";

interface PincodeResponse {
  success?: boolean;
  pincode?: string;
  city?: string;
  state?: string;
  message?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.thegroome.com";
const LOCATION_API = `${API_BASE}/superadmin/pincode`;

const LocationRequest: React.FC = () => {
  const { location, updateLocation } = useLocation();

  const [modalState, setModalState] = useState<ModalState>("hidden");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Check if coordinates exist (0 is valid for lat/lng)
  const locationMissing = location?.lat == null || location?.lng == null;

  useEffect(() => {
    if (!locationMissing) {
      setModalState("hidden");
      return;
    }

    if (!dismissed) {
      setModalState("gps");
    } else {
      setModalState("hidden");
    }
  }, [locationMissing, dismissed]);

  const getAddressFromCoordinates = async (
    lat: number,
    lng: number
  ): Promise<PincodeResponse> => {
    const url = `${LOCATION_API}?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;

    const response = await fetch(url);
    const data: PincodeResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to get location details.");
    }

    return data;
  };

  const handleGPSRequest = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Please enter your pincode.");
      setModalState("pincode");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Fetch pincode, city, and state from reverse geocoding endpoint
          const locationData = await getAddressFromCoordinates(lat, lng);

          updateLocation({
            lat,
            lng,
            pincode: locationData.pincode || "",
            city: locationData?.address.city || "",
            state: locationData?.address.state || "",
            type: "gps",
          });

          setModalState("hidden");
          setDismissed(false);
        } catch (apiError) {
          console.error("Failed to fetch location metadata:", apiError);

          // Fallback: Store raw coordinates even if reverse-geocoding failed
          updateLocation({
            lat,
            lng,
            pincode: "",
            city: "",
            state: "",
            type: "gps",
          });

          setModalState("hidden");
          setDismissed(false);
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);

        switch (geoError.code) {
          case 1:
            setError("Location permission was denied. Please enter your pincode.");
            break;
          case 2:
            setError("Your location could not be determined. Please enter your pincode.");
            break;
          case 3:
            setError("Location request timed out. Please enter your pincode.");
            break;
          default:
            setError("Unable to retrieve your location. Please enter your pincode.");
            break;
        }

        setModalState("pincode");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <>
      {/* Main empty/location state message */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-gray-50">
        <div className="bg-white shadow-lg rounded-3xl p-8 flex flex-col items-center max-w-md w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
          {locationMissing ? (
            <MapPin className="text-blue-500 w-14 h-14 mb-4 animate-bounce" />
          ) : (
            <PackageCheck className="text-emerald-500 w-14 h-14 mb-4 animate-pulse" />
          )}

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
            {locationMissing ? "Location Required" : "No Products or Vendors Found Near You"}
          </h2>

          <p className="text-gray-500 text-sm md:text-base mb-6">
            {locationMissing
              ? "Enable your location or enter your pincode to see services near you."
              : "We'll notify you when services are available in your area. Please check back later."}
          </p>

          {locationMissing && (
            <button
              type="button"
              onClick={() => setModalState("pincode")}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all duration-200"
            >
              Enter Pincode
            </button>
          )}
        </div>
      </div>

      {/* GPS Location Prompt Modal */}
      {modalState === "gps" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full text-center animate-in fade-in zoom-in-95 duration-200">
            <MapPin className="text-blue-500 w-14 h-14 mb-4 mx-auto animate-bounce" />

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Enable Location or Enter Pincode
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              We use your location to show nearby services and available vendors.
            </p>

            <button
              type="button"
              onClick={handleGPSRequest}
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-md w-full transition-all duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : "active:scale-98"
              }`}
            >
              {loading ? "Getting Location..." : "Enable Location"}
            </button>

            <button
              type="button"
              onClick={() => setModalState("pincode")}
              disabled={loading}
              className="mt-3 text-gray-600 hover:text-slate-900 underline text-sm transition disabled:opacity-50"
            >
              Enter Pincode Manually
            </button>

            <button
              type="button"
              onClick={() => {
                setDismissed(true);
                setModalState("hidden");
              }}
              disabled={loading}
              className="block mx-auto mt-3 text-gray-400 hover:text-gray-600 text-xs underline disabled:opacity-50 transition"
            >
              Maybe later
            </button>

            {error && <p className="mt-4 text-xs font-medium text-rose-600">{error}</p>}
          </div>
        </div>
      )}

      {/* Manual Pincode Input Modal */}
      {modalState === "pincode" && (
        <AskLocation
          onClose={() => {
            setModalState("hidden");
            setError(null);
            setDismissed(true);
          }}
        />
      )}
    </>
  );
};

export default LocationRequest;