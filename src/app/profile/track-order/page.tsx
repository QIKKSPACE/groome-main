"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Circle,
  Phone,
  Calendar,
  Package,
  User,
  ShoppingBag,
  Wrench,
  RefreshCw
} from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { ProductOrders } from "@/components/ProductOrders";
import { ServiceBooking, BookingItem } from "@/components/ServiceBooking";

const TrackOrderPage = () => {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");
  const [orderDetails, setOrderDetails] = useState<BookingItem | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "services">("services");
  
  // API fetched services & loading state
  const [servicesBookings, setServicesBookings] = useState<BookingItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Fetch bookings for services tab
  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingServices(true);
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
        setServicesBookings(list);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchBookings();
  }, []);

  const handleTrackOrder = () => {
    if (trackingId.trim()) {
      const order = servicesBookings.find((o) =>
        o.id.toLowerCase().includes(trackingId.trim().toLowerCase())
      );
      setOrderDetails(order || null);
    }
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "confirmed":
      case "completed":
        return "text-green-600 bg-green-100";
      case "in progress":
      case "in_progress":
        return "text-blue-600 bg-blue-100";
      case "scheduled":
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
      case "canceled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleReschedule = (bookingOrId: BookingItem | string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const booking = typeof bookingOrId === "string"
      ? servicesBookings.find((b) => b.id === bookingOrId)
      : bookingOrId;

    if (!booking) return;

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
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/profile"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 md:mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Back to Profile</span>
        </Link>

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-sm md:text-base text-gray-600">Enter your order ID to track the status of your service or product</p>
        </div>

        {/* Track Order Input */}
        <Card className="mb-6 md:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Track Order</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Enter Order ID (e.g., ORD-2024-001)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1 px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              />
              <Button 
                onClick={handleTrackOrder}
                className="px-4 py-2.5 md:px-6 md:py-3 text-sm md:text-base whitespace-nowrap"
              >
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Details View (If searched) */}
        {orderDetails && (
          <div className="space-y-4 md:space-y-6 mb-8">
            {/* Order Summary */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-lg">Order Details</span>
                  <div className="flex items-center space-x-3">
                    {Boolean(orderDetails.can_reschedule || orderDetails.canReschedule) && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => handleReschedule(orderDetails, e)}
                        className="text-xs md:text-sm flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reschedule Booking</span>
                      </Button>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(orderDetails.status)} capitalize`}>
                      {orderDetails.status}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start space-x-3">
                      <Package className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base break-words">
                          {orderDetails.services?.map((s) => s.name).join(", ") || orderDetails.serviceName || "Service"}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          Services ({orderDetails.services?.length || 1})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base break-words">
                          {orderDetails.employee_slot
                            ? `Slot #${orderDetails.employee_slot}`
                            : (orderDetails.serviceProvider || "Assigned Specialist")}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">Provider / Slot</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base">
                          {orderDetails.slot_date
                            ? new Date(orderDetails.slot_date).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : orderDetails.date || "N/A"}
                          {orderDetails.start_ts
                            ? ` at ${new Date(orderDetails.start_ts).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}`
                            : orderDetails.time ? ` at ${orderDetails.time}` : ""}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">Scheduled Time</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base break-words">
                          {orderDetails.address || "Salon / Provider Location"}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">Service Location</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base">
                          {orderDetails.phone || "Available in booking confirmation"}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">Contact Number</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base">
                          {orderDetails.estimatedTime || "Standard appointment duration"}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">Estimated Duration</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {(orderDetails.progress || [
                    { step: "Booking Placed", completed: true, time: "Confirmed" },
                    {
                      step: "Specialist Assigned",
                      completed: true,
                      time: orderDetails.employee_slot
                        ? `Slot ${orderDetails.employee_slot}`
                        : "Assigned",
                    },
                    {
                      step: "Service in Progress",
                      completed:
                        orderDetails.status?.toLowerCase() === "in_progress" ||
                        orderDetails.status?.toLowerCase() === "completed",
                      time:
                        orderDetails.status?.toLowerCase() === "in_progress"
                          ? "Ongoing"
                          : "Pending",
                    },
                    {
                      step: "Completed",
                      completed: orderDetails.status?.toLowerCase() === "completed",
                      time:
                        orderDetails.status?.toLowerCase() === "completed"
                          ? "Done"
                          : "Pending",
                    },
                  ]).map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 md:space-x-4">
                      <div className="flex-shrink-0 mt-0.5">
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm md:text-base ${
                            step.completed ? "text-gray-900" : "text-gray-500"
                          } break-words`}
                        >
                          {step.step}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Order Found State */}
        {trackingId && !orderDetails && (
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8 text-center">
              <Truck className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                We couldn&apos;t find an order with ID &quot;{trackingId}&quot;. Please check your order ID and try again.
              </p>
              <Button variant="outline" onClick={() => setTrackingId("")} className="text-sm md:text-base">
                Try Another Order ID
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs Component for Products and Services */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("services")}
                className={`flex items-center space-x-2 py-3 px-4 font-medium text-sm md:text-base border-b-2 transition-colors ${
                  activeTab === "services"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Services</span>
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center space-x-2 py-3 px-4 font-medium text-sm md:text-base border-b-2 transition-colors ${
                  activeTab === "products"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Products</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Services Tab Content */}
            {activeTab === "services" && (
              <ServiceBooking
                bookings={servicesBookings}
                loading={loadingServices}
                onSelectBooking={(order) => {
                  setTrackingId(order.id);
                  setOrderDetails(order);
                }}
                onReschedule={(id, booking) => handleReschedule(booking || id)}
              />
            )}

            {/* Products Tab Content */}
            {activeTab === "products" && (
              <ProductOrders />
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrderPage;