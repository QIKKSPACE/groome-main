"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WebflowContext } from "@/contexts/WebflowContext"; // make sure this import path is correct

const Hero = () => {
  const { data } = useContext(WebflowContext);

  // Filter banners by position === 'service'
  const serviceBanners =
    data?.banners?.filter((banner: any) => banner.position === "service") || [];

  // Fallback in case no banners found
  const mobileSliderImages =
    serviceBanners.length > 0
      ? serviceBanners.map((banner: any) => ({
          src: `https://thegroome.com/backend${banner.image_url}`,
          alt: banner.title || "Banner",
        }))
      : [
         
        ];
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);

  // Auto-slide functionality for both mobile and desktop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMobileSlide(
        (prev) => (prev + 1) % mobileSliderImages.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [mobileSliderImages.length]);

  // Services from API
  const services =
    data?.services?.map((service: any) => ({
      name: service.name,
      category: service.slug || service.name.toLowerCase().replace(/\s+/g, "-"),
      icon: service.image_url
        ? `https://thegroome.com/backend${service.image_url}`
        : "/assest/icons/default-icon.jpeg", // fallback if icon missing
    })) || [];
 console.log(services)

  return (
    <section className="relative min-h-[400px] md:min-h-[500px] bg-white">
      {/* Mobile Slider */}
      <div className="md:hidden w-full px-4 py-4">
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          {mobileSliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentMobileSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                quality={90}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Slider */}
      <div className="hidden md:block absolute top-0 right-5 z-0 w-3/5 h-full px-44 py-32 mr-4">
        <div className="absolute inset-x-44 inset-y-32 bg-gradient-to-l from-gray-100 to-gray-200"></div>

        <div className="relative w-full h-full overflow-hidden">
          {mobileSliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentMobileSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                priority={index === 0}
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-10 py-4 md:py-20">
        <div className="max-w-2xl">
          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6 leading-tight">
            Home services at your
            <br />
            doorstep
          </h1>

          {/* Services Card */}
          <div className="bg-white rounded-lg shadow-lg p-3 md:p-6 w-full max-w-fit">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
              What are you looking for?
            </h3>

            {/* Services Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {services.map((service: any, index: number) => (
                <Link
                  key={index}
                  href={`/services/${service.category}`}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md group flex flex-col items-center justify-center text-center"
                  style={{
                    width: "110px",
                    height: "100px",
                    padding: "6px",
                  }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-2 relative overflow-hidden rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <Image
                      src={service.icon}
                      alt={service.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>

                  <div className="relative">
                    <h4 className="text-xs sm:text-xs font-medium text-gray-800 leading-tight text-center">
                      {service.name}
                    </h4>
                  </div>
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
