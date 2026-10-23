"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ServiceHeader from "@/components/ServiceHeader";
import { useServiceCart } from "@/contexts/ServiceCartContext";
import { Shield, Sparkles, ChevronLeft, ChevronRight, Check, Plus, ShoppingBag, Radio, Ban } from "lucide-react";

const ServiceDetailsPage = () => {
  const params = useParams();
  const { id } = params;

  const { items, addService, removeService } = useServiceCart();

  const [loading, setLoading] = useState(true);
  const [serviceData, setServiceData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.thegroome.com/users/services/${id}`);
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
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin h-16 w-16 border-4 border-amber-500 border-t-transparent rounded-full"></div>
          <Sparkles className="absolute text-amber-500 animate-pulse" size={20} />
        </div>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="flex items-center justify-center h-screen text-rose-600 font-medium bg-slate-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-rose-100">
          <p className="text-lg">Failed to load service experience.</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Parse accurate image URLs matching API architecture
  const rawImages = serviceData?.images || serviceData?.service_images || [];
  const images = rawImages.length > 0 
    ? rawImages.map((imgObj: any) => `https://api.thegroome.com${imgObj.image_url}`)
    : ["/placeholder.png"];

  const whyChooseUs = serviceData?.vendor?.why_choose_us || [];
  const shopLogo = serviceData?.vendor?.profileUrl || "/groome-logo.png";
  const isDelayActive = serviceData?.vendor?.is_delay_active;

  // Financial Computations
  const finalPrice = Number(serviceData?.price) - (Number(serviceData?.discount_price) || 0);
  const isAdded = items.some((item) => item.id === serviceData?.id);

  const handleCartToggle = () => {
    if (isAdded) {
      removeService(serviceData.id);
    } else {
      addService({
        id: serviceData.id,
        name: serviceData.name,
        price: finalPrice,
        image: images[0],
        vendor_id: serviceData.vendor_id,
        vendor_name: serviceData.vendor?.business_name || "Premium Vendor",
        vendor_image: shopLogo,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 selection:bg-amber-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* PREMIUM E-COMMERCE TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE: Media Gallery & Core Details */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            {/* PREMIUM IMAGE GALLERY */}
            <div className="space-y-4">
              {/* Main Display Image */}
              <div className="relative aspect-[4/3] md:aspect-[16/10] w-full bg-slate-100 rounded-3xl overflow-hidden shadow-sm group">
                <img
                  src={images[activeImageIndex]}
                  alt={`${serviceData?.name || "Service"} View`}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-lg transition-all text-slate-800 z-10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-lg transition-all text-slate-800 z-10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Grid Strip */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-24 aspect-square rounded-xl overflow-hidden bg-slate-100 snap-start transition-all duration-200 ${
                        activeImageIndex === idx 
                          ? "ring-2 ring-amber-500 ring-offset-2 scale-95" 
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="Thumbnail view" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SERVICE DESCRIPTION & VENDOR INFRASTRUCTURE */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <ServiceHeader service={serviceData} />
            </div>

          </div>

          {/* RIGHT SIDE: Luxury Sticky Checkout Box */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.02]">
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 tracking-wide uppercase">
                  <Sparkles size={12} /> Curated Experience
                </span>

                {/* DYNAMIC VENDOR DELAY ACTIVE STATUS BADGE */}
              {isDelayActive ? (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 tracking-wide uppercase">
    <Radio size={12} className="animate-pulse text-emerald-500" />  Delay System Active: Active
  </span>
) : (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100 tracking-wide uppercase">
    <Ban size={12} className="text-rose-400" />  Delay System Active: Inactive
  </span>
)}
{/* DYNAMIC HOME VISIT STATUS BADGE */}
      {serviceData?.home_visit_available ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 tracking-wide uppercase">
          <Check size={12} className="text-emerald-500" /> Home Visit Available
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100 tracking-wide uppercase">
          <Ban size={12} className="text-rose-400" /> Home Visit Not Available
        </span>
      )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                {serviceData?.name}
              </h1>

              {/* Dynamic Price Display */}
              <div className="flex items-baseline gap-3 my-6">
                <span className="text-4xl font-extrabold text-slate-900">
                  ₹{finalPrice}
                </span>
                {serviceData?.discount_price && (
                  <span className="text-lg text-slate-400 line-through font-medium">
                    ₹{serviceData.price}
                  </span>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleCartToggle}
                className={`w-full flex items-center justify-center gap-3 rounded-2xl py-4 px-6 font-semibold text-white shadow-md transition-all duration-300 transform active:scale-[0.98] ${
                  isAdded
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="h-5 w-5 stroke-[2.5]" />
                    <span>Remove From Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-slate-400 mt-4">
                Tax and tailored accommodations calculated at checkout.
              </p>
            </div>
          </div>

        </div>

        {/* WHY CHOOSE US ASSURANCE BLOCK */}
        {whyChooseUs.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative max-w-3xl">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-2">
                The Premium Standard
              </h3>
              <p className="text-slate-400 text-sm md:text-base mb-8">
                Every reservation promises meticulous execution, handpicked professional talent, and pristine quality control.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {whyChooseUs.map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start space-x-3.5 p-4 bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/[0.06] transition-all hover:bg-white/[0.07]"
                >
                  <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
                    <Shield size={18} />
                  </div>
                  <span className="text-sm text-slate-200 leading-relaxed font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <div className="h-16" />
    </div>
  );
};

export default ServiceDetailsPage;