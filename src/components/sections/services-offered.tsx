"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useServices, Service } from "@/contexts/ServicesContext";

const ServicesOffered: React.FC = () => {
  const { services, loading, error, refresh } = useServices();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin h-12 w-12 border-t-4 border-blue-600 rounded-full mb-4"></div>
        <p className="text-gray-500 text-lg">Loading services...</p>
      </div>
    );
  }

  if (error || !services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <p className="text-red-600 text-lg font-semibold mb-4">
          {error || "No services available."}
        </p>
        <button
          onClick={refresh}
          className="px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service: Service) => {
          // Safe first image URL
          const firstImage =
            service.images?.[0]?.image_url
              ? `https://thegroome.com/backend${service.images[0].image_url}`
              : "/placeholder.png";

          const shopLogo =
            service.vendor?.profileUrl || "/groome-logo.png";

          return (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              {/* Service Image */}
              <div className="relative h-64 w-full">
                <Image
                  src={firstImage}
                  alt={service.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Vendor Info */}
              <div className="flex items-center p-4 gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={shopLogo}
                    alt={service.vendor.business_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-gray-800 font-semibold text-lg">
                    {service.vendor.business_name}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {service.vendor.city || service.vendor.map_address}
                  </p>
                </div>
              </div>

              {/* Price and Book */}
              <div className="p-4 mt-auto flex items-center justify-between flex-wrap gap-4">
                <span className="text-blue-600 font-bold text-lg md:text-xl">
                  ₹{Number(service.price)-(Number(service.discount_price)*Number(Number(service.price)))/100}
                  {service.discount_price && (
                    <span className="line-through text-gray-400 ml-2 text-base md:text-lg">
                      ₹{service.price}
                    </span>
                  )}
                </span>
                <Link href={`/services/${service.id}`}>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesOffered;
