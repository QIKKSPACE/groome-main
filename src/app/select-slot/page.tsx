"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useServiceCart } from "@/contexts/ServiceCartContext";
import SlotSelection from "@/components/SlotSelection";

interface DisplayService {
  id: string;
  name: string;
  price: number;
  image: string;
  vendor_id: string;
  vendor_name: string;
  vendor_image: string;
}

const formatImageUrl = (url?: string) => {
  if (!url || url === "/placeholder.png") return "/placeholder.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://api.thegroome.com${url.startsWith("/") ? "" : "/"}${url}`;
};

const SelectSlotPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items } = useServiceCart();

  const vendorId = searchParams?.get("vendorId") || "";
  const serviceIdsRaw = searchParams?.get("serviceIds") || "[]";
  const bookingId = searchParams?.get("bookingId") || undefined;

  // Parse selected service IDs
  let parsedIds: string[] = [];
  try {
    const parsed = JSON.parse(serviceIdsRaw);
    parsedIds = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    parsedIds = serviceIdsRaw
      ? serviceIdsRaw.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      : [];
  }

  const [resolvedServices, setResolvedServices] = useState<DisplayService[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);

  useEffect(() => {
    if (!vendorId || parsedIds.length === 0) {
      setLoadingServices(false);
      return;
    }

    const resolvedMap = new Map<string, DisplayService>();

    // 1. Check cart items
    items.forEach((item) => {
      if (parsedIds.includes(item.id)) {
        resolvedMap.set(item.id, {
          id: item.id,
          name: item.name,
          price: item.price,
          image: formatImageUrl(item.image),
          vendor_id: item.vendor_id,
          vendor_name: item.vendor_name,
          vendor_image: formatImageUrl(item.vendor_image),
        });
      }
    });

    // 2. Check sessionStorage for reschedule services
    try {
      const rawSession = sessionStorage.getItem("reschedule_services");
      if (rawSession) {
        const parsedSession: any[] = JSON.parse(rawSession);
        if (Array.isArray(parsedSession)) {
          parsedSession.forEach((s) => {
            if (parsedIds.includes(s.id) && !resolvedMap.has(s.id)) {
              resolvedMap.set(s.id, {
                id: s.id,
                name: s.name,
                price: Number(s.price) || 0,
                image: formatImageUrl(s.image || s.service_images?.[0]?.image_url),
                vendor_id: s.vendor_id || vendorId,
                vendor_name: s.vendor_name || "Vendor",
                vendor_image: formatImageUrl(s.vendor_image),
              });
            }
          });
        }
      }
    } catch (e) {
      console.error("Failed to read reschedule_services from sessionStorage", e);
    }

    // 3. Find missing IDs to fetch from API
    const missingIds = parsedIds.filter((id) => !resolvedMap.has(id));

    if (missingIds.length === 0) {
      setResolvedServices(parsedIds.map((id) => resolvedMap.get(id)!));
      setLoadingServices(false);
      return;
    }

    // 4. Fetch missing service details from the API
    const fetchServices = async () => {
      try {
        const fetched = await Promise.all(
          missingIds.map(async (id) => {
            try {
              const res = await fetch(`https://api.thegroome.com/users/services/${id}`);
              if (!res.ok) return null;
              const data = await res.json();
              const rawImg = data?.images?.[0]?.image_url || data?.service_images?.[0]?.image_url;
              const rawVendorImg = data?.vendor?.profileUrl;
              const price =
                data?.discount_price != null
                  ? Number(data.price) - Number(data.discount_price)
                  : Number(data?.price) || 0;

              return {
                id,
                name: data?.name || "Service",
                price,
                image: formatImageUrl(rawImg),
                vendor_id: vendorId,
                vendor_name: data?.vendor?.name || data?.vendor?.business_name || "Vendor",
                vendor_image: formatImageUrl(rawVendorImg),
              } as DisplayService;
            } catch {
              return null;
            }
          })
        );

        fetched.forEach((s) => {
          if (s) resolvedMap.set(s.id, s);
        });
      } catch (err) {
        console.error("Failed to fetch service details:", err);
      } finally {
        const finalList = parsedIds.map(
          (id) =>
            resolvedMap.get(id) || {
              id,
              name: "Service",
              price: 0,
              image: "/placeholder.png",
              vendor_id: vendorId,
              vendor_name: "Vendor",
              vendor_image: "/placeholder.png",
            }
        );
        setResolvedServices(finalList);
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [vendorId, serviceIdsRaw, items]);

  if (!vendorId || parsedIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Service Not Found</h1>
        <p className="text-gray-500 mb-6">Please select valid services and a vendor to choose a slot.</p>
        <Link href="/services">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
            Go to Services
          </button>
        </Link>
      </div>
    );
  }

  const vendorName = resolvedServices.length > 0 ? resolvedServices[0].vendor_name : "Vendor";
  const vendorImage = resolvedServices.length > 0 ? resolvedServices[0].vendor_image : "/placeholder.png";
  const slotServiceId = parsedIds.join(",");

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto max-w-3xl px-4 h-16 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 mr-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <Image
                src={vendorImage}
                alt={vendorName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                {bookingId ? "Reschedule Appointment" : "Book Appointment"}
              </h1>
              <p className="text-xs text-gray-500 font-medium">{vendorName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mt-6">
        {/* Selected Services Display */}
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Selected Services
          </h2>

          {loadingServices ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center space-x-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium">Loading service details...</span>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 divide-y divide-gray-100">
              {resolvedServices.map((service) => (
                <div key={service.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                      {service.name}
                    </h3>
                    {service.price > 0 && (
                      <p className="text-blue-600 font-bold mt-1 text-sm sm:text-base">
                        ₹{service.price.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Slot Selection Component */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <SlotSelection
            serviceId={slotServiceId}
            vendorId={vendorId}
            duration={60}
            bookingId={bookingId}
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
