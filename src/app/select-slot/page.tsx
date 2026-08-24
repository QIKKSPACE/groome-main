"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useServiceCart } from "@/contexts/ServiceCartContext";
import SlotSelection from "@/components/SlotSelection";

const SelectSlotPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items } = useServiceCart();

  const vendorId = searchParams.get("vendorId") || "";
  const serviceIdsRaw = searchParams.get("serviceIds") || "[]";
  
  // Parse selected services from context based on URL params
  let parsedIds: string[] = [];
  try { parsedIds = JSON.parse(serviceIdsRaw); } catch { parsedIds = []; }
  
  const selectedServices = items.filter(item => parsedIds.includes(item.id) && item.vendor_id === vendorId);
  const vendorName = selectedServices.length > 0 ? selectedServices[0].vendor_name : "Vendor";
  const vendorImage = selectedServices.length > 0 ? selectedServices[0].vendor_image : "/placeholder.png";

  if (!vendorId || !serviceIdsRaw || selectedServices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cart Not Found</h1>
        <p className="text-gray-500 mb-6">Please select services from the cart first.</p>
        <Link href="/services">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
            Go to Services
          </button>
        </Link>
      </div>
    );
  }

  // Use the first service ID for slot calculation, or join them if the API supports it.
  // We'll pass the JSON string so it books all of them if handled by the existing component.
  // Actually, to ensure it doesn't break calculateSlot, we pass parsedIds.join(',')
  const slotServiceId = parsedIds.join(',');

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto max-w-3xl px-4 h-16 flex items-center">
          <button onClick={() => router.back()} className="p-2 -ml-2 mr-3 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <Image src={vendorImage} alt={vendorName} fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Book Appointment</h1>
              <p className="text-xs text-gray-500 font-medium">{vendorName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mt-6">
        {/* Selected Services Display */}
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Selected Services</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 divide-y divide-gray-100">
            {selectedServices.map(service => (
              <div key={service.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={service.image} alt={service.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{service.name}</h3>
                  <p className="text-blue-600 font-bold mt-1">₹{service.price}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Slot Selection Component */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <SlotSelection 
            serviceId={slotServiceId} 
            vendorId={vendorId} 
            duration={60} 
          />
        </section>
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SelectSlotPage;
