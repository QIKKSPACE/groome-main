// contexts/ServicesContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// Type for a single service image
interface ServiceImage {
  id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

// Type for a single service
export interface Service {
  id: string;
  vendor_id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: string;
  discount_price: string;
  duration_minutes: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  images: ServiceImage[];
}

// Context type
interface ServicesContextType {
  services: Service[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// Create context
const ServicesContext = createContext<ServicesContextType>({
  services: [],
  loading: false,
  error: null,
  refresh: () => {},
});

// Provider
export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("https://thegroome.com/backend/users/allService");
      setServices(res.data);
    } catch (err: any) {
      console.error("Error fetching services:", err);
      setError(err.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServicesContext.Provider value={{ services, loading, error, refresh: fetchServices }}>
      {children}
    </ServicesContext.Provider>
  );
};

// Hook to use services context
export const useServices = () => useContext(ServicesContext);
