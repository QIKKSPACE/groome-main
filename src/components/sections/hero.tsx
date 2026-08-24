"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { WebflowContext } from "@/contexts/WebflowContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id?: string | number;
  position: string;
  image_url: string;
  title?: string;
  link_url?: string | null;
}

const Hero = () => {
  const router = useRouter();
  const { data } = useContext(WebflowContext);

  // Filter banners by position === 'service'
  const serviceBanners: Banner[] =
    data?.banners?.filter((banner: Banner) => banner.position === "service") || [];

  // Fallback in case no banners found
  const mobileSliderImages =
    serviceBanners.length > 0
      ? serviceBanners.map((banner: Banner) => ({
          src: `https://api.thegroome.com${banner.image_url}`,
          alt: banner.title || "Banner",
          link_url: banner.link_url,
        }))
      : [];

  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide functionality (pauses when hovering controls)
  useEffect(() => {
    if (mobileSliderImages.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentMobileSlide(
        (prev) => (prev + 1) % mobileSliderImages.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [mobileSliderImages.length, isHovered]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mobileSliderImages.length <= 1) return;
    setCurrentMobileSlide((prev) => (prev + 1) % mobileSliderImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mobileSliderImages.length <= 1) return;
    setCurrentMobileSlide(
      (prev) => (prev - 1 + mobileSliderImages.length) % mobileSliderImages.length
    );
  };

  const handleBannerClick = (linkUrl?: string | null) => {
    if (!linkUrl) return;

    const domain = "https://thegroome.com";

    if (linkUrl.startsWith(domain)) {
      // Internal route: extract pathname
      const internalPath = linkUrl.replace(domain, "") || "/";
      router.push(internalPath);
    } else {
      // External link: open in a new tab
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Services from API
  const services =
    data?.services?.map((service: any) => ({
      name: service.name,
      category: service.slug || service.name.toLowerCase().replace(/\s+/g, "-"),
      icon: service.image_url
        ? `https://api.thegroome.com${service.image_url}`
        : "/assets/icons/default-icon.jpeg",
    })) || [];

  return (
    <section className="relative min-h-[400px] md:min-h-[500px] bg-white overflow-hidden">
      {/* 📱 Mobile Slider Viewport Container */}
      {mobileSliderImages.length > 0 && (
        <div
          className="md:hidden w-full px-4 py-4 relative group/mobile"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm bg-slate-50">
            {mobileSliderImages.map((image, index) => {
              const hasLink = Boolean(image.link_url);

              return (
                <div
                  key={index}
                  onClick={() => handleBannerClick(image.link_url)}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                    index === currentMobileSlide ? "opacity-100 z-10" : "opacity-0 z-0",
                    hasLink && "cursor-pointer"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="100vw"
                    unoptimized
                  />
                </div>
              );
            })}

            {/* Mobile Nav Overlays */}
            {mobileSliderImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm text-white p-1.5 rounded-full hover:bg-black/50 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm text-white p-1.5 rounded-full hover:bg-black/50 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight size={18} strokeWidth={2} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🧭 Desktop Slider Canvas Grid System */}
      {mobileSliderImages.length > 0 && (
        <div
          className="hidden md:block absolute top-0 right-5 z-0 w-3/5 h-full px-44 py-32 mr-4 group/desktop"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-x-44 inset-y-32 bg-gradient-to-l from-slate-50 to-slate-100/50 rounded-2xl -z-10"></div>

          <div className="relative w-full h-full overflow-hidden rounded-xl">
            {mobileSliderImages.map((image, index) => {
              const hasLink = Boolean(image.link_url);

              return (
                <div
                  key={index}
                  onClick={() => handleBannerClick(image.link_url)}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                    index === currentMobileSlide ? "opacity-100 z-10" : "opacity-0 z-0",
                    hasLink && "cursor-pointer"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain"
                    priority={index === 0}
                    quality={95}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    unoptimized
                  />
                </div>
              );
            })}

            {/* Desktop Modernized Luxury Controls */}
            {mobileSliderImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover/desktop:opacity-100 translate-x-2 group-hover/desktop:translate-x-0"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover/desktop:opacity-100 -translate-x-2 group-hover/desktop:translate-x-0"
                  aria-label="Next slide"
                >
                  <ChevronRight size={22} strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🛍️ Left Content Workspace Grid Layout */}
      <div className="relative z-10 container mx-auto px-4 md:px-10 py-4 md:py-20">
        <div className="max-w-2xl">
          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-950 mb-5 md:mb-8 leading-tight tracking-tight">
            Home services at your
            <br />
            doorstep
          </h1>

          {/* Services Matrix Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-4 md:p-6 w-full max-w-xl">
            <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4 md:mb-5 tracking-wide">
              What are you looking for?
            </h3>

            {/* Premium Linked Grid Elements */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-5">
              {services.map((service: any, index: number) => (
                <Link
                  key={index}
                  href={`/allservices/${service.category}`}
                  className="group flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl p-3 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-12 h-12 md:w-16 md:h-16 overflow-hidden rounded-full shadow-sm group-hover:shadow-md transition-all duration-300 bg-white">
                    <Image
                      src={service.icon}
                      alt={service.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h4 className="mt-2.5 text-xs font-medium text-slate-800 leading-tight line-clamp-2 group-hover:text-black transition-colors">
                    {service.name}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;