"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ServiceCartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  vendor_id: string;
  vendor_name: string;
  vendor_image: string;
}

export interface VendorGroup {
  vendor_id: string;
  vendor_name: string;
  vendor_image: string;
  services: ServiceCartItem[];
  totalPrice: number;
}

interface ServiceCartContextType {
  items: ServiceCartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addService: (item: ServiceCartItem) => void;
  removeService: (id: string) => void;
  clearVendorServices: (vendor_id: string) => void;
  clearCart: () => void;
  getGroupedByVendor: () => VendorGroup[];
}

const ServiceCartContext = createContext<ServiceCartContextType | undefined>(undefined);

export const useServiceCart = () => {
  const context = useContext(ServiceCartContext);
  if (!context) {
    throw new Error("useServiceCart must be used within a ServiceCartProvider");
  }
  return context;
};

export const ServiceCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ServiceCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("service_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse service cart", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("service_cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addService = (item: ServiceCartItem) => {
    setItems((prev) => {
      // Prevent duplicates
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
    setIsCartOpen(true); // Auto-open cart when adding an item
  };

  const removeService = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearVendorServices = (vendor_id: string) => {
    setItems((prev) => prev.filter((item) => item.vendor_id !== vendor_id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getGroupedByVendor = (): VendorGroup[] => {
    const groups: Record<string, VendorGroup> = {};

    items.forEach((item) => {
      if (!groups[item.vendor_id]) {
        groups[item.vendor_id] = {
          vendor_id: item.vendor_id,
          vendor_name: item.vendor_name,
          vendor_image: item.vendor_image,
          services: [],
          totalPrice: 0,
        };
      }
      groups[item.vendor_id].services.push(item);
      groups[item.vendor_id].totalPrice += item.price;
    });

    return Object.values(groups);
  };

  const value: ServiceCartContextType = {
    items,
    isCartOpen,
    setIsCartOpen,
    addService,
    removeService,
    clearVendorServices,
    clearCart,
    getGroupedByVendor,
  };

  return (
    <ServiceCartContext.Provider value={value}>
      {children}
    </ServiceCartContext.Provider>
  );
};
