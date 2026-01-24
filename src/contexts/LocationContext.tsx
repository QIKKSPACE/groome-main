"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

export interface UserLocation {
  lat?: number;
  lng?: number;
  pincode?: string;
  city?: string;
  type?: "gps" | "pincode" | "city";
}

interface LocationContextType {
  location: UserLocation | null;
  updateLocation: (data: UserLocation) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse userLocation:", err);
      }
    }
  }, []);

  const updateLocation = (data: UserLocation) => {
    setLocation(data);
    localStorage.setItem("userLocation", JSON.stringify(data));
  };

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
