"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";

interface ServiceHeaderProps {
  service: {
    name: string;
    description: string;
    duration_minutes: number;
    images: { image_url: string }[];
    vendor: {
      business_name: string;
      address: string;
      city: string;
      state: string;
    };
    settings: {
      open_time: string;
      close_time: string;
    };
  };
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ service }) => {
  const baseURL = "https://api.thegroome.com"; 

  const [index, setIndex] = useState(0);
  const total = service.images?.length || 0;
  const sliderRef = useRef<HTMLDivElement>(null);

  // Next slide
  const next = () => setIndex((prev) => (prev + 1) % total);

  // Prev slide
  const prev = () =>
    setIndex((prev) => (prev - 1 + total) % total);

  // --- TOUCH / SWIPE SUPPORT ---
  let startX = 0;

  const onTouchStart = (e: React.TouchEvent) => {
    startX = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) next(); // swipe left
    if (endX - startX > 50) prev(); // swipe right
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">

        {/* IMAGE / SLIDER */}
        <div className="relative h-64 md:h-80 w-full md:w-80">

          {/* SLIDER WRAPPER */}
          <div
            ref={sliderRef}
            className="relative h-full w-full overflow-hidden rounded-xl"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* IMAGES */}
            <div
              className="flex h-full transition-transform duration-300"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {service.images.map((img, idx) => (
                <div key={idx} className="relative h-64 md:h-80 min-w-full">
                  <img
                    src={baseURL + img.image_url}
                    alt={service.name}
                  
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </div>

            {/* DOTS */}
            {total > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {service.images.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => setIndex(dotIndex)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === dotIndex ? "bg-white" : "bg-white/50"
                    }`}
                  ></button>
                ))}
              </div>
            )}

            {/* ARROWS (Desktop Only) */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {service.name}
          </h1>

          <div className="space-y-3 mb-6">
            {/* Vendor Location */}
            <div className="flex items-center text-gray-600">
              <MapPin size={18} className="mr-2" />
              <span>
                {service.vendor.business_name}, {service.vendor.city}, {service.vendor.state}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center text-gray-600">
              <Clock size={18} className="mr-2" />
              <span>{service.duration_minutes} min</span>
            </div>

            {/* Address */}
            <p className="text-gray-600 text-sm">
              {service.vendor.address}
            </p>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-end">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Open Today ({service.settings.open_time.slice(0, 5)} - {service.settings.close_time.slice(0, 5)})
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-700 leading-relaxed">{service.description}</p>
    </div>
  );
};

export default ServiceHeader;
