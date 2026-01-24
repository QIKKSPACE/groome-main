"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  MapPin,
  CheckCircle,
  FileText,
  Search,
  Settings,
  Rocket,
  DollarSign,
  Shield,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const FranchisePage = () => {
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
    console.log('Franchise Application:', formData);
    alert('Application submitted successfully! We will contact you soon.');
    setIsPopupOpen(false);
    setFormData({ email: '', mobile: '', professionalType: '' });
  };

  const benefits = [
    {
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      title: "Proven Business Model",
      description: "Join a successful franchise with established systems and processes"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Growth Opportunities",
      description: "Scale your business with our support and marketing strategies"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Community Support",
      description: "Connect with other franchisees and get ongoing support"
    },
    {
      icon: <MapPin className="w-8 h-8 text-orange-600" />,
      title: "Territory Rights",
      description: "Exclusive rights to operate in your designated territory"
    }
  ];

  const steps = [
    {
      number: "1",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Apply",
      description: "Submit your franchise application"
    },
    {
      number: "2", 
      icon: <Search className="w-8 h-8 text-green-600" />,
      title: "Review",
      description: "We review your application and qualifications"
    },
    {
      number: "3",
      icon: <Settings className="w-8 h-8 text-purple-600" />,
      title: "Setup",
      description: "Training and business setup support"
    },
    {
      number: "4",
      icon: <Rocket className="w-8 h-8 text-orange-600" />,
      title: "Launch",
      description: "Start your franchise business"
    }
  ];
 const { user, setRedirectPath } = useAuth();
    const router = useRouter();
  
     const handleApplyClick = () => {
      if (user) {
        router.push("/franchiseform");
      } else {
        setRedirectPath("/franchiseform");
        router.push("/auth");
      }
    };
  const requirements = [
    "Minimum investment capital",
    "Business experience preferred",
    "Commitment to brand standards",
    "Local market knowledge"
  ];

  const support = [
    "Initial training program",
    "Marketing and advertising support",
    "Ongoing operational guidance",
    "Technology and systems access"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20 md:pb-0">
    
      
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-5">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Apply for Franchise
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl mx-auto">
            Own your business with our proven franchise model. 
            Join our network and build a successful business with our support.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            onClick={() => handleApplyClick()}
          >
            Apply for Franchise
          </Button>
        </div>
      </section>

      {/* Why Franchise With Us Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Why Franchise With Us?
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

      {/* Franchise Process Section */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Franchise Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
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

      {/* Requirements & Support Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Requirements & Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Requirements */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <DollarSign className="w-6 h-6 text-purple-600 mr-3" />
                  Support Provided
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {support.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
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

      {/* Apply for Franchise Popup Modal */}
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
                Apply for Franchise
              </h3>
              <p className="text-gray-600 mb-6">
                Own your business with our proven franchise model. 
                Join our network and build a successful business with our support. Fill out the form below to get started!
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
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Join a successful franchise with established systems</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Scale your business with our support and marketing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Connect with other franchisees and get ongoing support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Exclusive rights to operate in your designated territory</span>
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

export default FranchisePage;
