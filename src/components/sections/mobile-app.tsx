"use client";

import { useState } from "react";
import Image from "next/image";
import { Apple } from "lucide-react";

/**
 * Placeholder component for the phone mockups.
 * The original image assets were not available in the provided data.
 * This component creates a visual placeholder to maintain the layout's integrity,
 * matching the dimensions and positioning shown in the screenshot.
 */
const PhonePlaceholder = ({ className, zIndex }: { className?: string; zIndex?: string }) => (
  <div
    className={`absolute w-[270px] h-[550px] bg-white rounded-[40px] shadow-lg border-8 border-black overflow-hidden ${className}`}
    style={{ zIndex: zIndex }}
  >
    <div className="h-8 bg-black"></div>
    <div className="p-4 space-y-4">
      {/* Logo Section */}
      <div className="flex justify-center items-center py-4">
        <Image
          src="/navlogo.png"
          alt="Orchids Logo"
          width={120}
          height={28}
          className="object-contain"
        />
      </div>
      
      {/* App Content - Realistic Details */}
      <div className="space-y-4">
        {/* Welcome Message */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Welcome to Orchids</h3>
          <p className="text-sm text-gray-600">Home services at your doorstep</p>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Today's Bookings:</span>
            <span className="font-semibold text-blue-600">12</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-600">Available Pros:</span>
            <span className="font-semibold text-green-600">8</span>
          </div>
        </div>
        
        {/* Service Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Popular Services</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                <span className="text-blue-600 text-xs">🔧</span>
              </div>
              <p className="text-xs text-gray-600">Repair</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="w-8 h-8 bg-pink-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                <span className="text-pink-600 text-xs">💄</span>
              </div>
              <p className="text-xs text-gray-600">Beauty</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                <span className="text-green-600 text-xs">🧹</span>
              </div>
              <p className="text-xs text-gray-600">Cleaning</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                <span className="text-purple-600 text-xs">🎨</span>
              </div>
              <p className="text-xs text-gray-600">Painting</p>
            </div>
          </div>
        </div>
        
        {/* Recent Bookings */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Recent Bookings</h4>
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-800">AC Repair</p>
                  <p className="text-xs text-gray-500">Today, 2:00 PM</p>
                </div>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Confirmed</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-800">Salon</p>
                  <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Pending</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-blue-500 text-white text-xs py-2 px-3 rounded-lg font-medium">
              Book Now
            </button>
            <button className="bg-gray-100 text-gray-700 text-xs py-2 px-3 rounded-lg font-medium">
              Track Order
            </button>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-100 rounded-lg p-2">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <span className="text-xs text-blue-600 font-medium">Home</span>
              </div>
              <div className="text-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-1"></div>
                <span className="text-xs text-gray-500">Services</span>
              </div>
              <div className="text-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-1"></div>
                <span className="text-xs text-gray-500">Orders</span>
              </div>
              <div className="text-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-1"></div>
                <span className="text-xs text-gray-500">Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


const MobileAppSection = () => {
    const [phoneNumber, setPhoneNumber] = useState("");

    return (
        <section className="bg-[#f8f9fa] py-20">
            <div className="container">
                <div className="flex flex-wrap items-center -mx-4">
                    <div className="w-full lg:w-5/12 px-4 mb-10 lg:mb-0">
                        <div className="max-w-md lg:mx-auto">
                            <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#212529] mb-2 font-primary leading-tight">
                                Book professionals from your phone
                            </h2>
                            <p className="text-base md:text-lg text-[#6c757d] mb-6 font-primary">
                                Enter your mobile number to get the App download link.
                            </p>
                            
                            {/* Features List */}
                            <div className="mb-8">
                                <h3 className="text-lg md:text-xl font-semibold text-[#212529] mb-4">Why choose our app?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-[#6c757d]">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        <span>Instant booking with real-time availability</span>
                                    </li>
                                    <li className="flex items-center text-[#6c757d]">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        <span>Secure payments & transparent pricing</span>
                                    </li>
                                    <li className="flex items-center text-[#6c757d]">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        <span>Verified professionals with ratings & reviews</span>
                                    </li>
                                    <li className="flex items-center text-[#6c757d]">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        <span>24/7 customer support</span>
                                    </li>
                                    <li className="flex items-center text-[#6c757d]">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        <span>Track your service in real-time</span>
                                    </li>
                                </ul>
                            </div>
                            <form className="mb-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex h-12 md:h-14 border border-[#e5e5e5] rounded-md bg-white shadow-sm overflow-hidden">
                                    <div className="flex items-center px-3 md:px-4 border-r border-[#e5e5e5] shrink-0">
                                        <span className="text-[#212529] font-medium text-sm md:text-base">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="flex-grow px-3 md:px-4 text-[#212529] focus:outline-none focus:ring-0 bg-transparent text-sm md:text-base"
                                        placeholder="Enter mobile number"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#212529] text-white px-6 md:px-10 font-bold hover:bg-opacity-90 transition-colors text-sm md:text-base py-2"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                            
                            {/* Statistics */}
                            <div className="mb-8">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-[#212529]">1K+</div>
                                        <div className="text-sm text-[#6c757d]">Happy Customers</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-[#212529]">50+</div>
                                        <div className="text-sm text-[#6c757d]">Verified Pros</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-[#212529]">4.8★</div>
                                        <div className="text-sm text-[#6c757d]">App Rating</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Download Buttons */}
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <button className="hover:scale-105 transition-transform duration-200">
                                    <Image
                                        src="/google-play.png"
                                        alt="Get it on Google Play"
                                        width={135}
                                        height={40}
                                        className="h-11 w-auto object-contain"
                                        quality={100}
                                        priority
                                    />
                                </button>
                                <button className="hover:scale-105 transition-transform duration-200">
                                    <Image
                                        src="/app-store.png"
                                        alt="Download on the App Store"
                                        width={135}
                                        height={40}
                                        className="h-11 w-auto object-contain"
                                        quality={100}
                                        priority
                                    />
                                </button>
                            </div>
                            
                            {/* Trust Indicators */}
                            <div className="text-center">
                                <p className="text-sm text-[#6c757d] mb-2">Trusted by millions across India</p>
                                <div className="flex justify-center items-center space-x-4 text-xs text-[#6c757d]">
                                    <span>🔒 Secure</span>
                                    <span>⚡ Fast</span>
                                    <span>✅ Reliable</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block w-full lg:w-7/12 px-4">
                        <div className="relative h-[550px] max-w-lg mx-auto">     
                          <PhonePlaceholder className="top-4 right-[120px] transform -rotate-12" zIndex="10" />
                          <PhonePlaceholder className="top-0 right-0 shadow-2xl" zIndex="20" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MobileAppSection;