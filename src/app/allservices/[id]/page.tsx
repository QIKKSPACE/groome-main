"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useServiceCart } from "@/contexts/ServiceCartContext";
import { useAuth } from "@/contexts/AuthContext"; // Integrated Auth Context
import { Check, Plus, AlertCircle, ShoppingBag, MapPin, RefreshCw, Share2 } from "lucide-react";

interface ServiceImage {
  id: number;
  image_url: string;
}

interface Vendor {
  id: number;
  business_name: string;
  profile_image: string | null;
  city?: string;
  map_address?: string;
}

interface Service {
  id: string;
  name: string;
  price: string | number;
  discount_price?: string | number;
  images: ServiceImage[];
  vendor_id: string;
  vendor: Vendor;
}

export default function AllServicesPage() {
  const params = useParams();
  const category = params?.id as string;

  const { items, addService, removeService } = useServiceCart();
  const { user } = useAuth(); // Extracted user context
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchServices = async () => {
    if (!category) return;
    
    setLoading(true);
    setError(null);
    try {
      const decodedCategory = decodeURIComponent(category);
      const response = await fetch(`https://api.thegroome.com/users/services/category/${decodedCategory}`);
      
      if (!response.ok) {
        throw new Error("We encountered an issue pulling up the available slots. Please try again.");
      }
      
      const data = await response.json();
      setServices(Array.isArray(data) ? data : data.services || []);
    } catch (err: any) {
      setError(err.message || "A network error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category]);

  const handleShare = async (e: React.MouseEvent, serviceId: string | number, serviceName: string) => {
    e.preventDefault(); // Prevents layout link triggers
    
    const referralCode = user?.affiliate_code ? `?cr_code=${user.affiliate_code}` : "";
    const shareUrl = `https://thegroome.com/services/${serviceId}${referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: serviceName,
          text: `Check out this service: ${serviceName}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback desktop handler
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const decodedTitle = decodeURIComponent(category || "").replace(/-/g, " ");

  // --- STATE 1: PREMIUM SKELETON LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12 animate-pulse space-y-3">
            <div className="h-10 w-64 rounded-xl bg-slate-200" />
            <div className="h-5 w-96 rounded-lg bg-slate-200" />
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="overflow-hidden rounded-3xl bg-white p-4 shadow-sm border border-slate-100/80 space-y-5">
                <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-slate-200" />
                <div className="space-y-3 px-2">
                  <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-200" />
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 2: PREMIUM ERROR STATE ---
  if (error) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-slate-50/30 px-4">
        <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl shadow-rose-900/[0.02]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Unable to load experiences</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{error}</p>
          <button
            onClick={() => startTransition(() => { fetchServices(); })}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]"
          >
            <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // --- STATE 3: PREMIUM EMPTY STATE (NO PRODUCTS FOUND) ---
  if (!services?.length) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-slate-50/30 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-900/[0.02]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No options available yet</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            We couldn&apos;t find any premium treatments in <span className="font-semibold text-slate-800 capitalize">“{decodedTitle}”</span> right now.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-blue-600/10 active:scale-[0.98]"
          >
            Explore Other Categories
          </Link>
        </div>
      </div>
    );
  }

  // --- MAIN APP CONTENT OVERVIEW ---
  return (
    <section className="min-h-screen bg-slate-50/50 py-16 antialiased">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Header Section */}
        <div className="relative mb-14 border-b border-slate-200/60 pb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 capitalize md:text-5xl lg:text-5xl">
            {decodedTitle}
          </h1>
          <p className="mt-3 text-base text-slate-500 md:text-lg">
            Discover and book handpicked premier treatments, curated near you.
          </p>
        </div>

        {/* Services Display Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => {
            const firstImage = service.images?.[0]?.image_url
              ? `https://api.thegroome.com${service.images[0].image_url}`
              : "/placeholder.png";

            const shopLogo = service.vendor?.profile_image
              ? `https://api.thegroome.com${service.vendor.profile_image}`
              : "/groome-logo.png";

            const baselinePrice = Number(service.price);
            const absoluteDiscount = Number(service.discount_price) || 0;
            const finalPrice = baselinePrice - absoluteDiscount;

            const isAdded = items.some((item) => item.id === service.id);

            return (
              <div
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white 
                shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50 mb-20"
              >
                {/* Image Wrap & Savings Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={firstImage}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Share Button Overlay */}
                  <button
                    onClick={(e) => handleShare(e, service.id, service.name)}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-700 backdrop-blur-sm transition hover:bg-white hover:text-blue-600 shadow-sm"
                    title="Share service"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>

                  {absoluteDiscount > 0 && (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-600 shadow-sm">
                      Save ₹{absoluteDiscount}
                    </span>
                  )}
                </div>

                {/* Main Descriptive Card Body */}
                <div className="flex flex-1 flex-col p-6">
                  
                  {/* Service Title Link */}
                  <Link href={`/services/${service.id}`} className="group/title block mb-4">
                    <h3 className="line-clamp-2 text-lg font-bold text-slate-800 transition-colors group-hover/title:text-blue-600 tracking-tight leading-snug">
                      {service.name}
                    </h3>
                  </Link>

                  {/* Curated Vendor Profiles */}
                  <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-50 bg-slate-50/40 p-2.5">
                    <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200/40 bg-white">
                      <Image
                        src={shopLogo}
                        alt={service.vendor?.business_name || "Merchant"}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold text-slate-800">
                        {service.vendor?.business_name || "Selected Partner"}
                      </h4>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                        <MapPin className="h-3 w-3 flex-shrink-0 text-slate-400" />
                        <span className="truncate">
                          {service.vendor?.city || service.vendor?.map_address || "Location Verified"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Core Checkout Metrics */}
                  <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        ₹{finalPrice}
                      </span>
                      {absoluteDiscount > 0 && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                          ₹{baselinePrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (isAdded) {
                          removeService(service.id);
                        } else {
                          addService({
                            id: service.id,
                            name: service.name,
                            price: finalPrice,
                            image: firstImage,
                            vendor_id: service.vendor_id,
                            vendor_name: service.vendor?.business_name || "Partner",
                            vendor_image: shopLogo,
                          });
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide transition-all active:scale-[0.97] ${
                        isAdded
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/15"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4 stroke-[3]" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 stroke-[3]" /> Add
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}