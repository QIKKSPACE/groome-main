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
  TrendingUp, 
  Gift, 
  Share2,
  UserPlus,
  Code,
  Star,
  Quote,
  X
} from "lucide-react";
import AffiliatePopup from "@/components/AffiliateModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const AffiliatePage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    professionalType: ''
  });
  const { user } = useAuth();
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Affiliate Application:', formData);
    alert('Application submitted successfully! We will contact you soon.');
    setIsPopupOpen(false);
    setFormData({ email: '', mobile: '', professionalType: '' });
  };

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: "Earn Up to 15%",
      description: "Commission on every successful referral"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Growing Income",
      description: "Build a sustainable passive income stream"
    },
    {
      icon: <Gift className="w-8 h-8 text-purple-600" />,
      title: "Bonus Rewards",
      description: "Extra bonuses for top performers"
    },
    {
      icon: <Share2 className="w-8 h-8 text-orange-600" />,
      title: "Easy Sharing",
      description: "Simple tools to share and track referrals"
    }
  ];

  const steps = [
    {
      number: "1",
      icon: <UserPlus className="w-8 h-8 text-blue-600" />,
      title: "Sign Up",
      description: "Create your affiliate account in minutes"
    },
    {
      number: "2", 
      icon: <Code className="w-8 h-8 text-green-600" />,
      title: "Get Your Code",
      description: "Receive your unique affiliate code"
    },
    {
      number: "3",
      icon: <DollarSign className="w-8 h-8 text-purple-600" />,
      title: "Share & Earn",
      description: "Share with friends and start earning"
    }
  ];

  const earningRates = [
    {
      percentage: "5-8%",
      category: "Service Bookings",
      description: "Home cleaning, plumbing, repairs"
    },
    {
      percentage: "10-12%",
      category: "Product Sales", 
      description: "Electronics, home goods, accessories"
    },
    {
      percentage: "15%",
      category: "Premium Memberships",
      description: "Subscription plans and VIP services"
    }
  ];

  const testimonials = [
    {
      quote: "I've earned over $2,000 in my first 6 months just by sharing with friends. The platform makes it so easy to track everything!",
      name: "Nikhil Jha",
      title: "Top Affiliate",
      avatar: "/assest/icons/salon-prime.jpeg"
    },
    {
      quote: "Started as a side hustle, now it's my main income source. The support team is amazing and payouts are always on time.",
      name: "Manvi Arora", 
      title: "Super Affiliate",
      avatar: "/assest/icons/plumber.jpeg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20 md:pb-0">
   
      
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-5">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Become an Affiliate Partner
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl mx-auto">
            Join our affiliate program and earn money by referring friends to our services. 
            Start your journey to financial freedom today!
          </p>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            onClick={()=>{
            if(user.affiliate_code)
            {
                  router.push("/profile");
                  return;


            }
            setIsPopupOpen(true)

          }}
          >
            Join Now - It's Free!
          </Button>
        </div>
      </section>

      {/* Why Choose Our Affiliate Program Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Why Choose Our Affiliate Program?
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

      {/* How It Works Section */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Earnings Potential Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Earnings Potential
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {earningRates.map((rate, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {rate.percentage}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {rate.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {rate.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <p className="text-lg text-gray-700 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-blue-600 text-sm">
                      {testimonial.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-5 bg-black text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Start Earning?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white max-w-2xl mx-auto">
            Join thousands of successful affiliates who are already earning with us. 
            It's free to join and you can start earning immediately!
          </p>
          <Button 
          onClick={()=>{
            if(user.affiliate_code)
            {
                  router.push("/profile");
                  return;

            }
            setIsPopupOpen(true)

          }}
          size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            Start Your Affiliate Journey
          </Button>
        </div>
      </section>

      {/* Separator line */}
      <div className="border-t border-gray-300"></div>

      {/* Join Now Popup Modal */}
    {isPopupOpen && <AffiliatePopup onClose={() => setIsPopupOpen(false)} />}
      <Footer />
    </div>
  );
};

export default AffiliatePage;
