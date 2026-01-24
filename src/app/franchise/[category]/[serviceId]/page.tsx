"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowLeft, MapPin, Clock, Phone, Mail, Calendar, Check, Users, Shield, Award } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { getServiceById, generateBookingSlots, getCategoryById } from "@/lib/services";
import { BookingSlot } from "@/lib/services";

const ServiceDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<{name: string, price: number}[]>([]);

  const categoryId = params.category as string;
  const serviceId = parseInt(params.serviceId as string);
  
  const service = getServiceById(serviceId);
  const category = getCategoryById(categoryId);
  const bookingSlots = generateBookingSlots(serviceId);

  // Service types based on category with pricing
  const getServiceTypes = (categoryId: string) => {
    switch (categoryId) {
      case "female-salons":
        return [
          { name: "Hair Cut & Styling", price: 299 },
          { name: "Hair Color & Highlights", price: 899 },
          { name: "Facial Treatment", price: 599 },
          { name: "Makeup & Bridal", price: 1299 },
          { name: "Spa & Wellness", price: 799 },
          { name: "Manicure & Pedicure", price: 399 },
          { name: "Eyebrow & Eyelash", price: 199 },
          { name: "Skin Treatment", price: 699 }
        ];
      case "male-salons":
        return [
          { name: "Hair Cut & Styling", price: 199 },
          { name: "Beard Grooming", price: 149 },
          { name: "Hair Color", price: 499 },
          { name: "Face Massage", price: 299 },
          { name: "Hair Wash & Treatment", price: 249 },
          { name: "Eyebrow Shaping", price: 99 },
          { name: "Hair Spa", price: 399 }
        ];
      case "paint":
        return [
          { name: "Interior Painting", price: 1299 },
          { name: "Exterior Painting", price: 1599 },
          { name: "Wall Texture", price: 899 },
          { name: "Waterproofing", price: 1999 },
          { name: "Color Consultation", price: 199 },
          { name: "Wall Repair", price: 599 },
          { name: "Primer Application", price: 399 },
          { name: "Touch-up Work", price: 299 }
        ];
      case "other-services":
        return [
          { name: "AC Repair & Service", price: 599 },
          { name: "Plumbing Repair", price: 399 },
          { name: "Electrical Work", price: 499 },
          { name: "Carpentry", price: 699 },
          { name: "Home Cleaning", price: 199 },
          { name: "Appliance Repair", price: 449 },
          { name: "Pest Control", price: 799 },
          { name: "Home Security", price: 1299 }
        ];
      default:
        return [];
    }
  };

  const serviceTypes = getServiceTypes(categoryId);

  const handleServiceTypeToggle = (serviceType: {name: string, price: number}) => {
    setSelectedServiceTypes(prev => 
      prev.some(type => type.name === serviceType.name)
        ? prev.filter(type => type.name !== serviceType.name)
        : [...prev, serviceType]
    );
  };

  const calculateTotalCost = () => {
    return selectedServiceTypes.reduce((total, serviceType) => total + serviceType.price, 0);
  };

  if (!service || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
       
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Group slots by date
  const slotsByDate = bookingSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, BookingSlot[]>);

  const availableDates = Object.keys(slotsByDate).sort();

  const handleSlotSelect = (slot: BookingSlot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="container mx-auto px-4 py-8">

        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2">
            {/* Service Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Service Image */}
                <div className="relative h-64 md:h-80 w-full md:w-80 flex-shrink-0">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>

                {/* Service Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {service.name}
                  </h1>
                  

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2" />
                      <span>{service.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-2" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone size={18} className="mr-2" />
                      <span>{service.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail size={18} className="mr-2" />
                      <span>{service.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.availability === 'Available Today' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {service.availability}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {service.description}
              </p>
              
              {/* Service Type Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Service Types</h3>
                <p className="text-sm text-gray-600 mb-4">Choose one or more services you need:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {serviceTypes.map((serviceType, index) => (
                    <button
                      key={index}
                      onClick={() => handleServiceTypeToggle(serviceType)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        selectedServiceTypes.some(type => type.name === serviceType.name)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium">{serviceType.name}</div>
                        <div className="text-xs mt-1 opacity-80">₹{serviceType.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedServiceTypes.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-blue-800 font-medium">Selected Services:</p>
                      <p className="text-sm text-blue-800 font-bold">Total: ₹{calculateTotalCost()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedServiceTypes.map((type, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {type.name} (₹{type.price})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {service.features && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Service Images */}
            {service.images && service.images.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {service.images.map((image, index) => (
                    <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${service.name} ${index + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600">{service.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Working Hours</h3>
                  <p className="text-gray-600">{service.workingHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h2>
              
              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Select Date</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        selectedDate === date
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Available Times</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {slotsByDate[selectedDate].map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          slot.available
                            ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Form Modal */}
              {showBookingForm && selectedSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                        <p className="text-gray-900">{service.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <p className="text-gray-900">{formatDate(selectedSlot.date)} at {selectedSlot.time}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <p className="text-gray-900">{selectedSlot.price}</p>
                      </div>
                      {selectedServiceTypes.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Selected Services</label>
                          <div className="space-y-2">
                            {selectedServiceTypes.map((type, index) => (
                              <div key={index} className="flex justify-between items-center px-2 py-1 bg-blue-50 rounded">
                                <span className="text-blue-800 text-sm">{type.name}</span>
                                <span className="text-blue-800 text-sm font-medium">₹{type.price}</span>
                              </div>
                            ))}
                            <div className="flex justify-between items-center px-2 py-1 bg-blue-100 rounded font-bold">
                              <span className="text-blue-900">Total Service Cost</span>
                              <span className="text-blue-900">₹{calculateTotalCost()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowBookingForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Handle booking confirmation
                          alert('Booking confirmed! You will receive a confirmation SMS.');
                          setShowBookingForm(false);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Benefits */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield size={16} className="text-green-500" />
                    <span className="text-sm text-gray-600">100% Safe & Hygienic</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award size={16} className="text-blue-500" />
                    <span className="text-sm text-gray-600">Certified Professionals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-purple-500" />
                    <span className="text-sm text-gray-600">Expert Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetailsPage;
