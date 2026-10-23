"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  RefreshCw, 
  Wrench, 
  Scissors, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/api/apiClient";

export interface ServiceImage {
  id: string;
  image_url: string;
}

export interface BookingService {
  id: string;
  name: string;
  description?: string;
  price?: number;
  service_images?: ServiceImage[];
}

export interface BookingItem {
  id: string;
  vendor_id?: string;
  user_id?: string;
  can_reschedule?: boolean;
  canReschedule?: boolean;
  employee_slot?: number;
  start_ts?: string;
  end_ts?: string;
  slot_date?: string;
  status: string;
  metadata?: Record<string, any>;
  services: BookingService[];
  // Fallbacks for compatibility
  serviceName?: string;
  serviceProvider?: string;
  totalCost?: number;
  date?: string;
  time?: string;
  address?: string;
  phone?: string;
  estimatedTime?: string;
  progress?: {
    step: string;
    completed: boolean;
    time: string;
  }[];
}

interface ServiceBookingProps {
  bookings?: BookingItem[];
  loading?: boolean;
  onSelectBooking?: (booking: BookingItem) => void;
  onReschedule?: (bookingId: string, booking: BookingItem) => void;
}

export const ServiceBooking: React.FC<ServiceBookingProps> = ({
  bookings: propBookings,
  loading: propLoading,
  onSelectBooking,
  onReschedule,
}) => {
  const [internalBookings, setInternalBookings] = useState<BookingItem[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);

  // If bookings prop is not passed, fetch independently
  useEffect(() => {
    if (propBookings === undefined && propLoading === undefined) {
      const fetchBookings = async () => {
        setInternalLoading(true);
        try {
          const response = await apiClient.get("users/all-bookings");
          const data = response.data;
          const list: BookingItem[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.bookings)
            ? data.bookings
            : Array.isArray(data?.data?.bookings)
            ? data.data.bookings
            : Array.isArray(data?.data)
            ? data.data
            : [];
          setInternalBookings(list);
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        } finally {
          setInternalLoading(false);
        }
      };

      fetchBookings();
    }
  }, [propBookings, propLoading]);

  const router = useRouter();
  const bookings = propBookings !== undefined ? propBookings : internalBookings;
  const loading = propLoading !== undefined ? propLoading : internalLoading;

  const handleRescheduleClick = (booking: BookingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReschedule) {
      onReschedule(booking.id, booking);
    } else {
      const vendorId = booking.vendor_id || "";
      const serviceIds = (booking.services || []).map((s) => s.id);
      const serviceIdsParam = JSON.stringify(serviceIds);

      // Populate service cart in localStorage for seamless select-slot loading
      try {
        const cartItemsToPersist = (booking.services || []).map((s) => ({
          id: s.id,
          name: s.name,
          price: Number(s.price) || 0,
          image:
            (s.service_images?.[0]?.image_url?.startsWith("http")
              ? s.service_images[0].image_url
              : `https://api.thegroome.com${s.service_images?.[0]?.image_url || ""}`) ||
            "/placeholder.png",
          vendor_id: booking.vendor_id || "",
          vendor_name: booking.serviceProvider || "Vendor",
          vendor_image: "/placeholder.png",
        }));

        const existingCartRaw = localStorage.getItem("service_cart");
        let existingCart: any[] = [];
        try {
          existingCart = existingCartRaw ? JSON.parse(existingCartRaw) : [];
          if (!Array.isArray(existingCart)) existingCart = [];
        } catch {
          existingCart = [];
        }

        const mergedCart = [...existingCart];
        cartItemsToPersist.forEach((newItem) => {
          const idx = mergedCart.findIndex((i) => i.id === newItem.id);
          if (idx >= 0) {
            mergedCart[idx] = newItem;
          } else {
            mergedCart.push(newItem);
          }
        });
        localStorage.setItem("service_cart", JSON.stringify(mergedCart));
        sessionStorage.setItem("reschedule_services", JSON.stringify(cartItemsToPersist));
      } catch (err) {
        console.error("Failed to update cart for reschedule:", err);
      }

      router.push(
        `/select-slot?vendorId=${vendorId}&serviceIds=${serviceIdsParam}${
          booking.id ? `&bookingId=${booking.id}` : ""
        }`
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "confirmed":
        return {
          label: "Confirmed",
          badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dotClass: "bg-emerald-500",
        };
      case "completed":
        return {
          label: "Completed",
          badgeClass: "bg-green-50 text-green-700 border-green-200",
          dotClass: "bg-green-500",
        };
      case "in progress":
      case "in_progress":
        return {
          label: "In Progress",
          badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
          dotClass: "bg-blue-500",
        };
      case "scheduled":
        return {
          label: "Scheduled",
          badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
          dotClass: "bg-amber-500",
        };
      case "pending":
        return {
          label: "Pending",
          badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
          dotClass: "bg-yellow-500",
        };
      case "cancelled":
      case "canceled":
        return {
          label: "Cancelled",
          badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
          dotClass: "bg-rose-500",
        };
      default:
        return {
          label: status || "Unknown",
          badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
          dotClass: "bg-gray-400",
        };
    }
  };

  const formatDate = (slotDate?: string, startTs?: string) => {
    const dateStr = slotDate || startTs;
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (startTs?: string, endTs?: string) => {
    if (!startTs) return "N/A";
    try {
      const s = new Date(startTs);
      const startFormatted = isNaN(s.getTime())
        ? startTs
        : s.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

      if (endTs) {
        const e = new Date(endTs);
        const endFormatted = isNaN(e.getTime())
          ? endTs
          : e.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
        return `${startFormatted} - ${endFormatted}`;
      }
      return startFormatted;
    } catch {
      return startTs;
    }
  };

  const getImageUrl = (image_url?: string) => {
    if (!image_url) return null;
    if (image_url.startsWith("http://") || image_url.startsWith("https://")) {
      return image_url;
    }
    return `https://api.thegroome.com${image_url.startsWith("/") ? "" : "/"}${image_url}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
        <p className="text-sm">Loading your service bookings...</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
          No service bookings found
        </h3>
        <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto mb-6">
          You haven&apos;t booked any services yet. Explore our top salons and grooming specialists to schedule an appointment.
        </p>
        <Link href="/">
          <Button className="px-6 py-2.5 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Explore Services
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const statusInfo = getStatusBadge(booking.status);
        const canReschedule = Boolean(booking.can_reschedule ?? booking.canReschedule);
        const servicesList = Array.isArray(booking.services) ? booking.services : [];
        const totalAmount = servicesList.reduce(
          (sum, s) => sum + (Number(s.price) || 0),
          0
        ) || booking.totalCost || 0;

        return (
          <div
            key={booking.id}
            onClick={() => onSelectBooking?.(booking)}
            className="group bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer relative"
          >
            {/* Header: ID, Status Badge, Reschedule Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Booking ID:
                </span>
                <span className="text-xs font-mono font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                  {booking.id}
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                {/* Reschedule Booking Button if canReschedule is true */}
                {canReschedule && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleRescheduleClick(booking, e)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm font-medium h-8 px-3 flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reschedule Booking</span>
                  </Button>
                )}

                {/* Status Badge */}
                <div
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                  <span>{statusInfo.label}</span>
                </div>
              </div>
            </div>

            {/* Services Listing */}
            <div className="py-3 divide-y divide-gray-100">
              {servicesList.length > 0 ? (
                servicesList.map((service, sIdx) => {
                  const firstImg = service.service_images?.[0]?.image_url;
                  const imageUrl = getImageUrl(firstImg);

                  return (
                    <div
                      key={service.id || sIdx}
                      className="py-2.5 first:pt-1 last:pb-1 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative border border-gray-200 flex items-center justify-center">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={service.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Scissors className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {service.name}
                          </h4>
                          {service.description && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {service.price !== undefined && service.price !== null && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900">
                            ₹{Number(service.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-2 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {booking.serviceName || "Grooming Service"}
                    </h4>
                    {booking.serviceProvider && (
                      <p className="text-xs text-gray-500">{booking.serviceProvider}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Details: Date, Time, Slot, Total */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-600 gap-2">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center space-x-1.5 text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>{formatDate(booking.slot_date, booking.start_ts)}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-gray-700">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>{formatTime(booking.start_ts, booking.end_ts)}</span>
                </div>
                {booking.employee_slot !== undefined && booking.employee_slot !== null && (
                  <div className="flex items-center space-x-1.5 text-gray-500">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Slot {booking.employee_slot}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                <span className="text-xs text-gray-500">Total:</span>
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  ₹{Number(totalAmount).toLocaleString("en-IN")}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const service_booking = ServiceBooking;
export default ServiceBooking;
