"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Slot {
  time: string; // e.g. "10:00"
  employees_used: number;
  available: boolean;
  capacity: number;
}

interface SlotResponse {
  closed: boolean;
  date: string; // e.g. "2025-11-24"
  slots: Slot[];
}

interface Props {
  serviceId: string;
  vendorId: string;
  duration: number; // in minutes
  onSelectSlot?: (slot: Slot & { date: string }) => void;
}

const SlotSelection: React.FC<Props> = ({ serviceId, vendorId, duration, onSelectSlot }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slotData, setSlotData] = useState<SlotResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot & { date: string } | null>(null);

  const { user, setRedirectPath } = useAuth();
  const router = useRouter();

  const today = new Date().toLocaleDateString("en-CA");

  const fetchSlots = async (date: string) => {
    setLoading(true);
    setError("");
    setSlotData(null);
    setSelectedSlot(null);

    try {
      const url = `https://api.thegroome.com/users/calculateSlot/${serviceId}?date=${date}&vendorId=${vendorId}&duration=${duration}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load slots");

      const data: SlotResponse = await res.json();
      setSlotData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const handleBooking = () => {
    if (!user) {
      setRedirectPath(`/services/${serviceId}`);
      router.push("/auth");
      return;
    }

    if (!selectedSlot) return;

    const [hour, minute] = selectedSlot.time.split(":").map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hour, minute, 0, 0);
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

    // Properly format params for query string
    const query = new URLSearchParams();
    query.append("vendorId", vendorId);
    query.append("serviceIds", serviceId); // single serviceId as string, or join for multiple
    query.append("employeeSlot", "1");
    query.append("startTs", startDate.toISOString());
    query.append("endTs", endDate.toISOString());
    query.append("slotDate", selectedDate);
    query.append("metadata", JSON.stringify({}));

    router.push(`/booking?${query.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CalendarDays size={22} /> Select Slot
      </h2>

      {/* Date Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-gray-700">Select Date</label>
        <input
          type="date"
          min={today}
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={30} />
        </div>
      )}

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm mb-4">{error}</div>}

      {!selectedDate && <p className="text-gray-500 text-sm">Please select a date to view available slots.</p>}

      {slotData && slotData.closed && (
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
             <>Vendor is closed on {formatDate(selectedDate)} (Weekly Off)</>
        </div>
      )}

      {/* Slots */}
      {slotData && !slotData.closed && (
        <div>
          <h3 className="font-semibold mb-3 text-gray-900">Available Time Slots</h3>

          {slotData.slots.length === 0 ? (
            <p className="text-gray-500 text-sm">No slots available.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {slotData.slots.map((slot, index) => {
                const slotObj = { ...slot, date: slotData.date };
                const isSelected =
                  selectedSlot?.time === slot.time && selectedSlot.date === slotData.date;

                return (
                <button
  key={index}
  disabled={!slot.available}
  onClick={() => {
    setSelectedSlot(slotObj);
    onSelectSlot?.(slotObj);
  }}
  className={`p-3 rounded-lg text-sm font-semibold border transition-all
    ${
      slot.available
        ? isSelected
          ? "bg-blue-600 text-white border-blue-700"
          : "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
        : "bg-red-100 text-red-700 border-red-300 cursor-not-allowed"
    }`}
>
  {slot.time}
  
</button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedSlot && (
        <div className="mt-6">
          <button
            onClick={handleBooking}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default SlotSelection;
