"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WebflowContext } from "@/contexts/WebflowContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string | number;
  position: string;
  image_url: string;
  title: string;
  link_url?: string | null;
}

const BannerSlider3 = () => {
  const router = useRouter();
  const { data } = useContext(WebflowContext);

  // Only bottom banners
  const banners: Banner[] =
    data?.banners?.filter((b: Banner) => b.position === "bottom") || [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide every 10 seconds
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners]);

  const nextSlide = () => {
    if (banners.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (banners.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = (linkUrl?: string | null) => {
    if (!linkUrl) return;

    const domain = "https://thegroome.com";

    if (linkUrl.startsWith(domain)) {
      // Extract pathname (e.g. "https://thegroome.com/products/item" -> "/products/item")
      const internalPath = linkUrl.replace(domain, "") || "/";
      router.push(internalPath);
    } else {
      // External link - open in a new tab
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (banners.length === 0) return null;

  return (
    <section
      className="relative w-full bg-white flex justify-center items-center py-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Container with max width */}
      <div className="w-full max-w-6xl relative overflow-hidden px-4">
        <div className="mb-6 flex flex-col items-start relative pl-1">
          <span className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-1">
            New Arrivals
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            New Arrivals
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
          </h2>
          <div className="mt-2 h-1 w-12 bg-gradient-to-r from-primary-500 to-transparent rounded-full" />
        </div>

        {/* Slides */}
        <div className="relative w-full aspect-[16/9] md:aspect-[3/1]">
          {banners.map((banner, index) => {
            const hasLink = Boolean(banner.link_url);

            return (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner.link_url)}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                } ${hasLink ? "cursor-pointer" : ""}`}
              >
                <Image
                  src={`https://api.thegroome.com${banner.image_url}`}
                  alt={banner.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="100vw"
                  priority={index === 0}
                  quality={90}
                  unoptimized
                />
              </div>
            );
          })}

          {/* Left Arrow */}
          {banners.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right Arrow */}
          {banners.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full z-20"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Slide Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? "bg-white" : "bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BannerSlider3;