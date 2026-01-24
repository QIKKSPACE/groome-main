"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [vendorId, setVendorId] = useState<string>("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [employeeSlot, setEmployeeSlot] = useState<number>(1);
  const [startTs, setStartTs] = useState<string>("");
  const [endTs, setEndTs] = useState<string>("");
  const [slotDate, setSlotDate] = useState<string>("");
  const [metadata, setMetadata] = useState<object>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Parse query parameters on mount
  useEffect(() => {
    if (!searchParams) return;

    try {
      const vId = searchParams.get("vendorId") || "";
      const sIdsRaw = searchParams.get("serviceIds") || "[]";
      const eSlot = Number(searchParams.get("employeeSlot") || 1);
      const sTs = searchParams.get("startTs") || "";
      const eTs = searchParams.get("endTs") || "";
      const sDate = searchParams.get("slotDate") || "";
      const metaRaw = searchParams.get("metadata") || "{}";

      if (!vId || !sIdsRaw || !sTs || !eTs || !sDate) {
        throw new Error("Missing booking parameters");
      }

      let parsedServiceIds: string[] = [];
      try {
        parsedServiceIds = JSON.parse(sIdsRaw);
        if (!Array.isArray(parsedServiceIds)) throw new Error();
      } catch {
        parsedServiceIds = [sIdsRaw]; // fallback for single ID
      }

      let parsedMetadata: object = {};
      try {
        parsedMetadata = JSON.parse(metaRaw);
      } catch {
        parsedMetadata = {};
      }

      setVendorId(vId);
      setServiceIds(parsedServiceIds);
      setEmployeeSlot(eSlot);
      setStartTs(sTs);
      setEndTs(eTs);
      setSlotDate(sDate);
      setMetadata(parsedMetadata);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid booking parameters");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleConfirmBooking = async () => {
    if (!user) {
      alert("Please login to book!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("https://thegroome.com/backend/users/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          service_id: serviceIds,
          employee_slot: employeeSlot,
          start_ts: startTs,
          end_ts: endTs,
          slot_date: slotDate,
          metadata,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while booking");
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER STATES =====
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Image
          src="/groome-logo.png"
          alt="Booking in progress"
          width={160}
          height={160}
          className="mb-6 animate-pulse drop-shadow-lg"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Confirming your booking ✨
        </h1>
        <p className="text-gray-500 text-sm text-center px-4">
          Please wait while we confirm your booking...
        </p>
        <div className="mt-8 animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <Image
          src="/groome-logo.png"
          alt="Booking failed"
          width={120}
          height={120}
          className="mb-6 opacity-80"
        />
        <h1 className="text-xl font-semibold text-gray-800 mb-3">
          Booking failed 😢
        </h1>
        <p className="text-gray-500 mb-6 text-center px-4">{error}</p>
        <button
          onClick={handleConfirmBooking}
          className="px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <Image
          src="/groome-logo.png"
          alt="Booking confirmed"
          width={160}
          height={160}
          className="mb-6"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Booking Confirmed 🎉
        </h1>
        <p className="text-gray-500 text-center px-4">
          Your booking has been successfully confirmed!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <button
        onClick={handleConfirmBooking}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingPage;
