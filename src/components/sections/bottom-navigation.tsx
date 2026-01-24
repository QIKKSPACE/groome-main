"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Home, 
  TestTube, 
  Shield, 
  FileText,
  Wrench,
  Building2,
  User,
  ShoppingCart
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();
  const pathname = usePathname();
  const { getTotalItems } = useCart();

  // Update active tab based on current pathname
  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("home");
    } else if (pathname === "/services") {
      setActiveTab("services");
    } else if (pathname === "/mall") {
      setActiveTab("mall");
    } else if (pathname === "/cart") {
      setActiveTab("cart");
    } else if (pathname === "/auth") {
      setActiveTab("login");
    }
  }, [pathname]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    
    switch (tabId) {
      case "home":
        router.push("/");
        break;
      case "services":
        router.push("/services");
        break;
      case "mall":
        router.push("/mall");
        break;
      case "cart":
        router.push("/cart");
        break;
      case "login":
        router.push("/auth");
        break;
      default:
        break;
    }
  };

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      color: "text-teal-500"
    },
    {
      id: "services",
      label: "Services",
      icon: Wrench,
      color: "text-gray-400"
    },
    {
      id: "mall",
      label: "Mall",
      icon: Building2,
      color: "text-gray-400"
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingCart,
      color: "text-gray-400"
    },
    {
      id: "login",
      label: "Account",
      icon: User,
      color: "text-gray-400"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const cartItemCount = getTotalItems();
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex flex-col items-center py-2 px-1 min-w-0 flex-1 relative"
            >
              <div className="mb-1 relative">
                <Icon 
                  size={24} 
                  className={`${isActive ? 'text-black' : 'text-gray-400'}`}
                />
                {/* Cart Badge */}
                {item.id === "cart" && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </div>
              <span 
                className={`text-xs font-medium ${
                  isActive ? 'text-black' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-6 h-0.5 bg-black mt-1 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
