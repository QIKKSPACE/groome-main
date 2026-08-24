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

const BannerSlider = () => {
  const router = useRouter();
  const { data } = useContext(WebflowContext);

  // Only top banners
  const banners: Banner[] =
    data?.banners?.filter((b: Banner) => b.position === "top") || [];

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
      // Internal navigation: extract relative path (e.g., "https://thegroome.com/collections/new" -> "/collections/new")
      const internalPath = linkUrl.replace(domain, "") || "/";
      router.push(internalPath);
    } else {
      // External navigation: open in new tab
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (banners.length === 0) return null;

  return (
    <div>
      {/* Custom keyframes and utility classes for the blinking effect */}
      <style>{`
        @keyframes text-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-text-blink {
          animation: text-blink 1.5s ease-in-out infinite;
        }
        .gradient-text-hot {
          background: linear-gradient(90deg, #ec4899 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      <div className="w-full flex flex-col items-center justify-center pt-12 pb-6 border-b border-slate-100">
        <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-[0.3em] uppercase mb-2">
          Exclusive Preview
        </span>
        <h3 className="text-xl md:text-2xl font-light tracking-[0.15em] uppercase font-serif gradient-text-hot animate-text-blink">
          Launching Soon
        </h3>
        <div className="w-8 h-[1px] bg-slate-900 mt-4" />
      </div>

      <section
        className="relative w-full bg-white flex justify-center items-center py-8"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Container with max width */}
        <div className="w-full max-w-6xl relative overflow-hidden px-4">
          {/* Slides */}
          <div className="relative w-full aspect-[16/9] md:aspect-[3/1]">
            {banners.map((banner, index) => {
              const hasLink = Boolean(banner.link_url);

              return (
                <div
                  key={banner.id}
                  onClick={() => handleBannerClick(banner.link_url)}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
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
    </div>
  );
};

export default BannerSlider;