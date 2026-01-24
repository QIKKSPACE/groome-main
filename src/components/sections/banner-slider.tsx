"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { WebflowContext } from "@/contexts/WebflowContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BannerSlider = () => {
  const { data } = useContext(WebflowContext);

  // Only top banners
  const banners = data?.banners?.filter((b: any) => b.position === "top") || [];

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

  if (banners.length === 0) return null;

  return (
    <section
      className="relative w-full bg-white flex justify-center items-center py-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Container with max width */}
      <div className="w-full max-w-6xl relative overflow-hidden px-4">
        {/* Slides */}
        <div className="relative w-full aspect-[16/9] md:aspect-[3/1]">
          {banners.map((banner: any, index: number) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={`https://thegroome.com/backend${banner.image_url}`}
                alt={banner.title}
                fill
                className="object-cover rounded-lg"
                sizes="100vw"
                priority={index === 0}
                quality={90}
                unoptimized
              />
            </div>
          ))}

          {/* Left Arrow */}
          {banners.length > 1 && (
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full z-20"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right Arrow */}
          {banners.length > 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full z-20"
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
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;
