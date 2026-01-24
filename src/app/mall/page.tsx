"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, MapPin, Clock, Phone, ShoppingBag } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LocationRequestMallPage from "@/components/LocationRequestMallPage";

const shops = [
  {
    id: 1,
    name: "Fashion Hub",
    category: "Fashion & Clothing",
    rating: 4.8,
    image: "/assest/icons/salonicon.jpeg",
    description: "Latest fashion trends and designer clothing",
    location: "Ground Floor, Block A",
    timings: "10:00 AM - 10:00 PM",
    phone: "+91 98765 43210",
    isOpen: true
  },
  {
    id: 2,
    name: "Tech Store",
    category: "Electronics",
    rating: 4.6,
    image: "/assest/icons/acrepair.jpeg",
    description: "Latest gadgets and electronic accessories",
    location: "First Floor, Block B",
    timings: "9:00 AM - 9:00 PM",
    phone: "+91 98765 43211",
    isOpen: true
  },
  {
    id: 3,
    name: "Beauty Corner",
    category: "Beauty & Wellness",
    rating: 4.9,
    image: "/assest/icons/makeup.jpeg",
    description: "Premium beauty products and cosmetics",
    location: "Ground Floor, Block C",
    timings: "10:00 AM - 11:00 PM",
    phone: "+91 98765 43212",
    isOpen: false
  },
  {
    id: 4,
    name: "Home Decor",
    category: "Home & Living",
    rating: 4.7,
    image: "/assest/icons/homemakeover.jpeg",
    description: "Beautiful home decoration items",
    location: "Second Floor, Block A",
    timings: "10:00 AM - 8:00 PM",
    phone: "+91 98765 43213",
    isOpen: true
  },
  {
    id: 5,
    name: "Sports Zone",
    category: "Sports & Fitness",
    rating: 4.5,
    image: "/assest/icons/men-massage.jpeg",
    description: "Sports equipment and fitness gear",
    location: "First Floor, Block C",
    timings: "8:00 AM - 10:00 PM",
    phone: "+91 98765 43214",
    isOpen: true
  },
  {
    id: 6,
    name: "Book Paradise",
    category: "Books & Stationery",
    rating: 4.8,
    image: "/assest/icons/plumber.jpeg",
    description: "Wide collection of books and stationery",
    location: "Second Floor, Block B",
    timings: "9:00 AM - 9:00 PM",
    phone: "+91 98765 43215",
    isOpen: true
  }
];

const categories = [
  "All",
  "Fashion & Clothing",
  "Electronics",
  "Beauty & Wellness",
  "Home & Living",
  "Sports & Fitness",
  "Books & Stationery"
];

export default function MallPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
 const { user, setRedirectPath } = useAuth();
  const filteredShops = shops.filter(shop => {
    const matchesCategory = selectedCategory === "All" || shop.category === selectedCategory;
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
   
      {/* Digital Mall Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Digital Mall</h1>
            <p className="text-gray-600 text-sm md:text-lg">Discover amazing shops & exclusive offers</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search shops, products, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

    <LocationRequestMallPage />
      {/* Footer */}
      <Footer />
    </div>
  );
}
