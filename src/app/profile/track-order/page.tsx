"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  User
} from "lucide-react";

interface OrderDetails {
  id: string;
  serviceName: string;
  serviceProvider: string;
  status: string;
  estimatedTime: string;
  address: string;
  phone: string;
  date: string;
  time: string;
  totalCost: number;
  progress: {
    step: string;
    completed: boolean;
    time: string;
  }[];
}

const TrackOrderPage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  // Mock order data
  const mockOrders = [
    {
      id: "ORD-2024-001",
      serviceName: "Hair Cut & Styling",
      serviceProvider: "Sunrise Spa And Salon",
      status: "In Progress",
      estimatedTime: "2 hours",
      address: "123 Main Street, Delhi NCR",
      phone: "+91 98765 43210",
      date: "2024-01-15",
      time: "10:00 AM",
      totalCost: 299,
      progress: [
        { step: "Order Confirmed", completed: true, time: "09:30 AM" },
        { step: "Service Provider Assigned", completed: true, time: "09:45 AM" },
        { step: "Service Provider En Route", completed: true, time: "10:15 AM" },
        { step: "Service In Progress", completed: true, time: "10:30 AM" },
        { step: "Service Completed", completed: false, time: "12:00 PM" }
      ]
    },
    {
      id: "ORD-2024-002", 
      serviceName: "AC Repair & Service",
      serviceProvider: "CoolAir Services",
      status: "Scheduled",
      estimatedTime: "3 hours",
      address: "456 Park Avenue, Mumbai",
      phone: "+91 98765 43211",
      date: "2024-01-16",
      time: "2:00 PM",
      totalCost: 599,
      progress: [
        { step: "Order Confirmed", completed: true, time: "01:30 PM" },
        { step: "Service Provider Assigned", completed: true, time: "01:45 PM" },
        { step: "Service Provider En Route", completed: false, time: "2:00 PM" },
        { step: "Service In Progress", completed: false, time: "2:30 PM" },
        { step: "Service Completed", completed: false, time: "5:00 PM" }
      ]
    }
  ];

  const handleTrackOrder = () => {
    if (trackingId.trim()) {
      const order = mockOrders.find(o => o.id.toLowerCase().includes(trackingId.toLowerCase()));
      setOrderDetails(order || null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600 bg-green-100";
      case "In Progress": return "text-blue-600 bg-blue-100";
      case "Scheduled": return "text-yellow-600 bg-yellow-100";
      case "Cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
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
          <p className="text-sm md:text-base text-gray-600">Enter your order ID to track the status of your service</p>
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

        {/* Order Details */}
        {orderDetails && (
          <div className="space-y-4 md:space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-lg">Order Details</span>
                  <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(orderDetails.status)} self-start sm:self-auto`}>
                    {orderDetails.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start space-x-3">
                      <Package className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base break-words">{orderDetails.serviceName}</p>
                        <p className="text-xs md:text-sm text-gray-600">Service</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base break-words">{orderDetails.serviceProvider}</p>
                        <p className="text-xs md:text-sm text-gray-600">Service Provider</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base">{orderDetails.date} at {orderDetails.time}</p>
                        <p className="text-xs md:text-sm text-gray-600">Scheduled Time</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base break-words">{orderDetails.address}</p>
                        <p className="text-xs md:text-sm text-gray-600">Service Address</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base">{orderDetails.phone}</p>
                        <p className="text-xs md:text-sm text-gray-600">Contact Number</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base">{orderDetails.estimatedTime}</p>
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
                  {orderDetails.progress.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 md:space-x-4">
                      <div className="flex-shrink-0 mt-0.5">
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm md:text-base ${step.completed ? 'text-gray-900' : 'text-gray-500'} break-words`}>
                          {step.step}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Service Provider */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">Contact your service provider directly</p>
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <Button variant="outline" className="flex items-center justify-center space-x-2 text-sm md:text-base">
                      <Phone className="w-4 h-4" />
                      <span>Call Provider</span>
                    </Button>
                    <Button className="flex items-center justify-center space-x-2 text-sm md:text-base">
                      <Truck className="w-4 h-4" />
                      <span>Get Support</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Order Found */}
        {trackingId && !orderDetails && (
          <Card>
            <CardContent className="p-6 md:p-8 text-center">
              <Truck className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                We couldn't find an order with ID "{trackingId}". Please check your order ID and try again.
              </p>
              <Button variant="outline" onClick={() => setTrackingId("")} className="text-sm md:text-base">
                Try Another Order ID
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        <Card className="mt-6 md:mt-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {mockOrders.map((order) => (
                <div 
                  key={order.id}
                  className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setTrackingId(order.id);
                    setOrderDetails(order);
                  }}
                >
                  <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm md:text-base break-words">{order.serviceName}</p>
                      <p className="text-xs md:text-sm text-gray-600 break-words">{order.serviceProvider}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} block`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">{order.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrderPage;
