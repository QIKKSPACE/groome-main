"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useServices, Service } from "@/contexts/ServicesContext";
import { useServiceCart } from "@/contexts/ServiceCartContext";
import { useAuth } from "@/contexts/AuthContext"; // Assuming useAuth is imported from here
import { Check, Plus, Share2 } from "lucide-react";

const ServicesOffered: React.FC = () => {
  const { services, loading, error, refresh } = useServices();
  const { items, addService, removeService } = useServiceCart();
  const { user } = useAuth(); // Extracted user context

  const handleShare = async (e: React.MouseEvent, serviceId: string | number, serviceName: string) => {
    e.preventDefault(); // Prevents underlying links from triggering
    
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
      // Fallback if Web Share API is not supported (e.g., desktop browsers)
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-600" />
        <p className="mt-4 text-lg text-gray-500">Loading services...</p>
      </div>
    );
  }

  if (error || !services?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <p className="mb-4 text-lg font-semibold text-red-600">
          {error || "No services available."}
        </p>

        <button
          onClick={refresh}
          className="rounded-full bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => {
            const firstImage =
              service.images?.[0]?.image_url
                ? `https://api.thegroome.com${service.images[0].image_url}`
                : "/placeholder.png";

            const shopLogo =
              service.vendor?.profile_image 
                ? `https://api.thegroome.com${service.vendor?.profile_image}` 
                : "/groome-logo.png";

            const finalPrice =
              Number(service.price) -
              (Number(service.discount_price) || 0);

            const isAdded = items.some((item) => item.id === service.id);

            return (
              <div
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Service Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={firstImage}
                    alt={service.name}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Share Button Overlay */}
                  <button
                    onClick={(e) => handleShare(e, service.id, service.name)}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-700 backdrop-blur-sm transition hover:bg-white hover:text-blue-600 shadow-sm"
                    title="Share service"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Service Name */}
                  <Link href={`/services/${service.id}`} className="hover:text-blue-600 transition-colors">
                    <h3 className="mb-3 line-clamp-2 text-lg font-bold text-gray-900">
                      {service.name}
                    </h3>
                  </Link>

                  {/* Vendor */}
                  <div className="mb-5 flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border">
                      <img
                        src={shopLogo}
                        alt={service.vendor?.business_name || "Vendor logo"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-medium text-gray-800">
                        {service.vendor?.business_name}
                      </h4>

                      <p className="truncate text-sm text-gray-500">
                        {service.vendor?.city || service.vendor?.map_address}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{finalPrice}
                      </span>

                      {service.discount_price && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          ₹{service.price}
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
                            vendor_name: service.vendor.business_name,
                            vendor_image: shopLogo,
                          });
                        }
                      }}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition ${
                        isAdded
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" /> Add
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
};

export default ServicesOffered;