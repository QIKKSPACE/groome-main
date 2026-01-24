"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Shield,
  Headphones,
  CheckCircle,
  Home,
  Wrench,
  Zap,
  Wind,
  Sparkles,
  Heart,
  GraduationCap,
  Dumbbell,
  Camera,
  Calendar,
} from "lucide-react";
import Footer from "@/components/sections/footer";
import { useAuth } from "@/contexts/AuthContext";

const VendorPage = () => {
  const router = useRouter();
  const { user, setRedirectPath } = useAuth();

  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Access to Customers",
      description: "Reach thousands of potential customers in your area",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Grow Your Business",
      description: "Expand your service offerings and increase revenue",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Trusted Platform",
      description: "Build trust with verified reviews and secure payments",
    },
    {
      icon: <Headphones className="w-8 h-8 text-orange-600" />,
      title: "24/7 Support",
      description: "Get help whenever you need it from our support team",
    },
  ];

  const services = [
    { icon: <Home className="w-6 h-6" />, name: "Home Cleaning" },
    { icon: <Wrench className="w-6 h-6" />, name: "Plumbing" },
    { icon: <Zap className="w-6 h-6" />, name: "Electrical Work" },
    { icon: <Wind className="w-6 h-6" />, name: "AC Repair" },
    { icon: <Sparkles className="w-6 h-6" />, name: "Beauty Services" },
    { icon: <Heart className="w-6 h-6" />, name: "Pet Care" },
    { icon: <GraduationCap className="w-6 h-6" />, name: "Tutoring" },
    { icon: <Dumbbell className="w-6 h-6" />, name: "Fitness Training" },
    { icon: <Camera className="w-6 h-6" />, name: "Photography" },
    { icon: <Calendar className="w-6 h-6" />, name: "Event Planning" },
  ];

  const steps = [
    {
      number: "1",
      title: "Apply & Get Verified",
      description: "Submit your application and get verified by our team",
    },
    {
      number: "2",
      title: "Set Up Your Profile",
      description: "Create your service profile and set your rates",
    },
    {
      number: "3",
      title: "Start Getting Bookings",
      description: "Receive bookings and grow your customer base",
    },
  ];

  const requirements = [
    {
      title: "Professional Experience",
      description: "Minimum 2 years of experience in your field",
    },
    {
      title: "Valid Documentation",
      description: "Business license and insurance certificates",
    },
    {
      title: "Background Check",
      description: "Clear background verification for customer safety",
    },
    {
      title: "Quality Commitment",
      description: "Commitment to maintaining high service quality",
    },
  ];

  const handleApplyClick = () => {
    if (user) {
      router.push("/vendorform");
    } else {
      setRedirectPath("/vendorform");
      router.push("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-5">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Become a Service Vendor
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl mx-auto">
            Join our platform and connect with customers who need your services. 
            Grow your business with our trusted marketplace.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            onClick={handleApplyClick}
          >
            Apply to Become a Vendor
          </Button>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Why Partner With Us?
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
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Services We're Looking For
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl text-center hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="flex justify-center mb-3 text-blue-600">{service.icon}</div>
                <h3 className="font-medium text-gray-900 text-sm">{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-4 bg-white p-6 rounded-xl border border-gray-100">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{req.title}</h3>
                  <p className="text-gray-600 text-sm">{req.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-5 bg-black text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Grow Your Business?</h2>
          <p className="text-lg md:text-xl mb-8 text-white max-w-2xl mx-auto">
            Join our network of professional service providers and start reaching more customers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              onClick={handleApplyClick}
            >
              Apply Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-black bg-white hover:bg-gray-100 hover:text-black px-8 py-3 text-lg font-semibold"
              onClick={() => router.push("/vendorform")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VendorPage;
