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

const BannerSlider2 = () => {
  const router = useRouter();
  const { data } = useContext(WebflowContext);

  // Filters for middle banners
  const banners: Banner[] =
    data?.banners?.filter((b: Banner) => b.position === "middle") || [];

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
      // Internal navigation: extract relative path (e.g., "https://thegroome.com/trending" -> "/trending")
      const internalPath = linkUrl.replace(domain, "") || "/";
      router.push(internalPath);
    } else {
      // External navigation: open in a new tab
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (banners.length === 0) return null;

  return (
    <section
      className="w-full bg-white flex flex-col justify-center items-center py-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Container with max width */}
      <div className="w-full max-w-6xl px-4">
        {/* Beautiful Header Section */}
        <div className="mb-6 flex flex-col items-start relative pl-1">
          <span className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-1">
            Handpicked Offers
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Trending
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
          </h2>
          <div className="mt-2 h-1 w-12 bg-gradient-to-r from-primary-500 to-transparent rounded-full" />
        </div>

        {/* Slider Frame */}
        <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-100">
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
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1152px"
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
                className="absolute left-3 md:left-5 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-2 md:p-3 rounded-full z-20 transition-all duration-200"
                aria-label="Previous slide"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Right Arrow */}
            {banners.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-3 md:right-5 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-2 md:p-3 rounded-full z-20 transition-all duration-200"
                aria-label="Next slide"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Slide Indicators */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2.5 z-20 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSlider2;