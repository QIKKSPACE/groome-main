"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ServiceHeader from "@/components/ServiceHeader";
import { Award, Shield, Users } from "lucide-react";
import SlotSelection from "@/components/SlotSelection";

const ServiceDetailsPage = () => {
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [serviceData, setServiceData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);

        const res = await fetch(`https://thegroome.com/backend/users/services/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

        const data = await res.json();
        setServiceData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-lg">
        Failed to load service. {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 md:px-10 lg:px-16 xl:px-24">

        {/* --------------------------- */}
        {/* TWO COLUMN LAYOUT ON DESKTOP */}
        {/* --------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT SIDE → Service Header */}
          <div className="lg:col-span-2">
            <ServiceHeader service={serviceData} />
          </div>

          {/* RIGHT SIDE → Slot Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <SlotSelection
                serviceId={serviceData?.id??"xyz"}
                vendorId={serviceData?.vendor?.id}
                duration={serviceData?.duration_minutes}
                onSelectSlot={(slot) => console.log("Selected Slot:", slot)}
              />
            </div>
          </div>

        </div>

        {/* Why Choose Us (Full Width Below) */}
        <div className="mt-12 bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h3 className="font-semibold text-lg text-gray-900 mb-6">
            Why Choose Us?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="flex items-center space-x-3">
              <Shield size={22} className="text-green-500" />
              <span className="text-sm text-gray-700">100% Safe & Hygienic</span>
            </div>

            <div className="flex items-center space-x-3">
              <Award size={22} className="text-blue-500" />
              <span className="text-sm text-gray-700">Certified Professionals</span>
            </div>

            <div className="flex items-center space-x-3">
              <Users size={22} className="text-purple-500" />
              <span className="text-sm text-gray-700">Expert Team</span>
            </div>
          </div>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
