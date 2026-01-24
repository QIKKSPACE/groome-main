"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Home,
  Building2,
  User,
  Briefcase,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { WebflowContext } from "@/contexts/WebflowContext";
import { useCaptureReferral } from "@/hooks/useCaptureReferral";

const Header = () => {
  useCaptureReferral()
  const { getTotalItems } = useCart();
  const { user } = useAuth();
  const { data } = useContext(WebflowContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [screenWidth, setScreenWidth] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const professionalOptions = [
    { title: "Become an Affiliate", href: "/affiliate" },
    { title: "Become a Vendor", href: "/vendor" },
    { title: "Become a Manufacturer", href: "/manufacturer" },
    { title: "Own a Digital Mall", href: "/digital-mall" },
    { title: "Become a Delivery Partner", href: "/delivery-partner" },
    { title: "Apply for Franchise", href: "/franchise" },
      { title: "Join as an Influencer", href: "/influencer" },
  ];

  const sortedCities =
    data?.city_list
      ?.map((c: any) => c.city_name)
      ?.sort((a: string, b: string) => a.localeCompare(b)) || [];

  const filteredCities = sortedCities.filter((city: string) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setHoveredNavItem(null);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
  };

  const dynamicAuthLink = user
    ? { title: "Profile", href: "/profile" }
    : { title: "Login / Sign Up", href: "/auth" };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 bg-black text-white w-full z-50 flex">

        <div className="max-w-[2000px] mx-auto flex items-center h-16 px-4 md:px-8 w-full">
          {/* Left: Hamburger & Logo */}
          <div className="flex items-center space-x-4">
            {screenWidth < 1200 && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-800 rounded-md"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}

            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/navlogo.png"
                alt="Logo"
                width={screenWidth >= 1200 ? 120 : 100}
                height={screenWidth >= 1200 ? 28 : 26}
              />
            </Link>
          </div>

          {/* XL Desktop Nav */}
          {screenWidth >= 1200 && (
            <>
              <nav className="absolute left-1/2 transform -translate-x-1/2">
                <ul className="flex items-center space-x-8">
                  <li>
                    <Link href="/" className="hover:text-gray-300 text-sm">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:text-gray-300 text-sm">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/mall" className="hover:text-gray-300 text-sm">
                      Mall
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Right Section */}
              <div className="flex items-center space-x-4 ml-auto">
                {/* Professional Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredNavItem("Register")}
                  onMouseLeave={() =>
                    setTimeout(() => setHoveredNavItem(null), 200)
                  }
                >
                  <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm">
                    <span>Register as a Professional</span>
                    <ChevronDown
                      size={14}
                      className={`transform transition-transform ${
                        hoveredNavItem === "Register" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {hoveredNavItem === "Register" && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg z-50 min-w-56 overflow-hidden"
                    >
                      {professionalOptions.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="block px-6 py-3 hover:bg-blue-50 text-sm hover:text-blue-600"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* City Selector */}
                <div className="relative" ref={cityDropdownRef}>
                  <button
                    onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors"
                  >
                    <span>{selectedCity || "Select City"}</span>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        isCityDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isCityDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg border border-gray-300 z-50 w-56 max-h-64 overflow-y-auto p-2">
                      <input
                        type="text"
                        placeholder="Search city..."
                        className="w-full mb-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                          >
                            {city}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 px-3 py-2">
                          No cities found
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative p-2 hover:bg-gray-800 rounded-md transition-colors"
                >
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                </Link>

                {/* Auth */}
                <Link
                  href={dynamicAuthLink.href}
                  className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  {dynamicAuthLink.title}
                </Link>
              </div>
            </>
          )}

          {/* City Selector for non-XL (mobile/tablet) */}
          {screenWidth < 1200 && (
            <div className="ml-auto relative" ref={cityDropdownRef}>
              <button
                onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors"
              >
                <span>{selectedCity || "Select City"}</span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    isCityDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isCityDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg border border-gray-300 z-50 w-56 max-h-64 overflow-y-auto p-2">
                  <input
                    type="text"
                    placeholder="Search city..."
                    className="w-full mb-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                      >
                        {city}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 px-3 py-2">
                      No cities found
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menu Drawer for non-XL */}
    {isMenuOpen && screenWidth < 1200 && (
  <div className="absolute top-16 left-0 w-full bg-black text-white shadow-lg z-50">
    <nav className="px-6 py-4 space-y-4">
      {/* Professional Options */}
      {professionalOptions.map((opt) => (
        <Link
          key={opt.title}
          href={opt.href}
          onClick={() => setIsMenuOpen(false)}
          className="block text-sm hover:text-blue-400"
        >
          {opt.title}
        </Link>
      ))}

      <hr className="border-gray-700 my-2" />

      {/* Show below only if screen width > 600 */}
      {screenWidth > 600 && (
        <>
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-sm hover:text-blue-400"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMenuOpen(false)}
            className="block text-sm hover:text-blue-400"
          >
            Services
          </Link>
          <Link
            href="/mall"
            onClick={() => setIsMenuOpen(false)}
            className="block text-sm hover:text-blue-400"
          >
            Mall
          </Link>

          {/* Auth button */}
         <Link
  href={dynamicAuthLink.href}
  onClick={() => setIsMenuOpen(false)}
  className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 
  rounded-lg transition-colors block text-center max-w-[200px] mx-auto"
>
  {dynamicAuthLink.title}
</Link>

        </>
      )}
    </nav>
  </div>
)}

      </header>

      {/* Bottom Tabs for non-XL */}
    
    </>
  );
};

export default Header;
