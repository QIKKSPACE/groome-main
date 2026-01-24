"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Package, 
  Headphones, 
  Settings,
  MapPin,
  CreditCard,
  Heart,
  Star,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Edit3,
  Calendar,
  Gift,
  Wallet,
  HelpCircle,
  MessageSquare,
  Truck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AffiliateTab from "@/components/AffiliateTab";

const ProfilePage = () => {
  const { user, logout } = useAuth(); // Get user from Auth context
  const [activeTab, setActiveTab] = useState<"profile" | "affiliate">("profile");
  console.log(user)
  useEffect(() => {
    if (!user) {
      window.location.href = "/auth"; // redirect if not logged in
    }
  }, [user]);

  if (!user) return null; // avoid rendering before redirect

  const mainSections = [
    {
      icon: <Truck className="w-6 h-6 text-green-600" />,
      title: "Track Order",
      subtitle: "Track your active orders",
      href: "/profile/track-order"
    },
    {
      icon: <Headphones className="w-6 h-6 text-green-600" />,
      title: "Customer Support",
      subtitle: "Get help with your orders",
      href: "/profile/support"
    },
    {
      icon: <MapPin className="w-6 h-6 text-purple-600" />,
      title: "Saved Addresses",
      subtitle: "Manage delivery locations",
      href: "/profile/addresses"
    }
  ];

  const supportSections = [
    {
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      title: "Chat Support",
      subtitle: "Live chat assistance"
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-green-500" />,
      title: "Help Center",
      subtitle: "FAQs and guides"
    },
    {
      icon: <Calendar className="w-5 h-5 text-purple-500" />,
      title: "Book Service",
      subtitle: "Schedule new service"
    }
  ];

  const handleLogout = () => {
    logout?.(); // call logout from auth context
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20 md:pb-0">
      
      {/* Tabs */}
      <div className="container mx-auto max-w-4xl py-4 flex space-x-4 px-5">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === "profile" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("affiliate")}
          className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === "affiliate" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Affiliate Profile
        </button>
      </div>

      {activeTab === "profile" ? (
        <>
          {/* Profile Header */}
          <section className="bg-black text-white py-12 px-5">
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={user?.avatar || "/assest/icons/salon-prime.jpeg"}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button className="absolute -bottom-1 -right-1 bg-white text-blue-600 rounded-full p-1.5 shadow-lg hover:bg-gray-50">
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-gray-300 mb-2">{user.email}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Sections */}
          <section className="py-6 px-5">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account</h2>
              <div className="space-y-3">
                {mainSections.map((section, index) => (
                  <Link key={index} href={section.href}>
                    <Card className="hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {section.icon}
                          <div>
                            <h3 className="font-semibold text-gray-900">{section.title}</h3>
                            <p className="text-sm text-gray-600">{section.subtitle}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="py-6 px-5">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Support & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {supportSections.map((support, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-3">
                        {support.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{support.title}</h3>
                      <p className="text-sm text-gray-600">{support.subtitle}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Logout Section */}
          <section className="py-6 px-5">
            <div className="container mx-auto max-w-4xl">
              <Card className="border-red-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <LogOut className="w-5 h-5 text-red-500" />
                      <div>
                        <h3 className="font-semibold text-red-600">Sign Out</h3>
                        <p className="text-sm text-gray-600">Log out of your account</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      ) : (
      <AffiliateTab />
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
