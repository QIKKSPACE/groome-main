"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Clock, 
  MapPin, 
  Smartphone,
  CheckCircle,
  FileText,
  Search,
  Navigation,
  CreditCard,
  Bike,
  Car,
  Truck,
  Plus,
  Calendar,
  Award,
  User,
  Shield,
  Phone,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const DeliveryPartnerPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    professionalType: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Delivery Partner Application:', formData);
    alert('Application submitted successfully! We will contact you soon.');
    setIsPopupOpen(false);
    setFormData({ email: '', mobile: '', professionalType: '' });
  };
  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: "Flexible Earnings",
      description: "Earn money on your own schedule with competitive rates"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Choose Your Hours",
      description: "Work when you want with complete schedule flexibility"
    },
    {  
      icon: <MapPin className="w-8 h-8 text-purple-600" />,
      title: "Local Deliveries",
      description: "Deliver in your neighborhood and familiar areas"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-orange-600" />,
      title: "Easy App",
      description: "User-friendly driver app with navigation and tracking"
    }
  ];

  const vehicleEarnings = [
    {
      icon: <Bike className="w-8 h-8 text-blue-600" />,
      vehicle: "Bike/Scooter",
      rate: "$3-5 per delivery",
      description: "Small packages, documents"
    },
    {
      icon: <Car className="w-8 h-8 text-green-600" />,
      vehicle: "Car",
      rate: "$5-8 per delivery",
      description: "Medium packages, groceries"
    },
    {
      icon: <Truck className="w-8 h-8 text-purple-600" />,
      vehicle: "Van/Truck",
      rate: "$10-15 per delivery",
      description: "Large items, furniture"
    }
  ];

  const additionalEarnings = [
    {
      icon: <Plus className="w-6 h-6 text-green-600" />,
      amount: "+$2",
      type: "Peak hour bonus"
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      amount: "+$5",
      type: "Weekend bonus"
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      amount: "+$50",
      type: "Monthly completion bonus"
    }
  ];

  const steps = [
    {
      number: "1",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Sign Up",
      description: "Complete registration and verification"
    },
    {
      number: "2", 
      icon: <Search className="w-8 h-8 text-green-600" />,
      title: "Get Approved",
      description: "Background check and document verification"
    },
    {
      number: "3",
      icon: <Navigation className="w-8 h-8 text-purple-600" />,
      title: "Start Delivering",
      description: "Accept orders and start earning"
    },
    {
      number: "4",
      icon: <CreditCard className="w-8 h-8 text-orange-600" />,
      title: "Get Paid",
      description: "Weekly automatic payments"
    }
  ];

  const personalRequirements = [
    "18+ years old",
    "Valid driver's license",
    "Clean background check",
    "Smartphone with GPS"
  ];

  const vehicleRequirements = [
    "Valid vehicle registration",
    "Vehicle insurance",
    "Good vehicle condition",
    "Delivery bag/equipment"
  ];
  const { user, setRedirectPath } = useAuth();
    const router = useRouter();
  
     const handleApplyClick = () => {
      if (user) {
        router.push("/deliveryform");
      } else {
        setRedirectPath("/deliveryform");
        router.push("/auth");
      }
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20 md:pb-0">
      
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-5">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Become a Delivery Partner
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl mx-auto">
            Join our delivery network and start earning on your schedule. 
            Flexible work, competitive pay, and the freedom to be your own boss.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                  onClick={() =>{handleApplyClick()}}

          >
            Start Delivering Today
          </Button>
        </div>
      </section>

      {/* Why Deliver With Us Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Why Deliver With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earning Potential Section */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Earning Potential
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicleEarnings.map((earning, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {earning.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    {earning.vehicle}
                  </CardTitle>
                  <div className="text-2xl font-bold text-green-600">
                    {earning.rate}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {earning.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Earnings Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Additional Earnings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalEarnings.map((earning, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {earning.icon}
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {earning.amount}
                  </div>
                  <p className="text-gray-700 font-medium">
                    {earning.type}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center bg-white p-8 rounded-xl shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full mb-6">
                  {step.number}
                </div>
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Requirements */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-6 h-6 text-blue-600 mr-3" />
                  Personal Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {personalRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Requirements */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Car className="w-6 h-6 text-purple-600 mr-3" />
                  Vehicle Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vehicleRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Separator line */}
      <div className="border-t border-gray-300"></div>

      {/* Start Delivering Today Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Popup Content */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Start Delivering Today
              </h3>
              <p className="text-gray-600 mb-6">
                Join our delivery network and start earning on your schedule. 
                Flexible work, competitive pay, and the freedom to be your own boss. Fill out the form below to get started!
              </p>
              
              {/* Application Form */}
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                {/* Email Field */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Mobile Field */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="Enter your mobile number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Professional Type Field */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Type *
                  </label>
                  <select
                    required
                    value={formData.professionalType}
                    onChange={(e) => handleInputChange('professionalType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select professional type</option>
                    <option value="become-an-affiliate">Become an Affiliate</option>
                    <option value="become-a-vendor">Become a Vendor</option>
                    <option value="become-a-manufacturer">Become a Manufacturer</option>
                    <option value="own-a-digital-mall">Own a Digital Mall</option>
                    <option value="become-a-delivery-partner">Become a Delivery Partner</option>
                    <option value="apply-for-franchise">Apply for Franchise</option>
                  </select>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  Submit Application
                </Button>
              </form>

              {/* Benefits List */}
              <div className="text-left mb-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Earn money on your own schedule with competitive rates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Work when you want with complete schedule flexibility</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Deliver in your neighborhood and familiar areas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">User-friendly driver app with navigation and tracking</span>
                </div>
              </div>

              {/* Close Button */}
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                onClick={() => setIsPopupOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DeliveryPartnerPage;
