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
  Camera,
  DollarSign,
  Megaphone,
  Heart,
  Zap,
} from "lucide-react";
import Footer from "@/components/sections/footer";
import { useAuth } from "@/contexts/AuthContext";

const InfluencerPage = () => {
  const router = useRouter();
  const { user, setRedirectPath } = useAuth();

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: "Earn Money",
      description: "Monetize your social media by promoting businesses you love",
    },
    {
      icon: <Megaphone className="w-8 h-8 text-blue-600" />,
      title: "Grow Your Influence",
      description: "Reach new audiences and increase your online presence",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Trusted Platform",
      description: "Get paid safely through verified partnerships",
    },
    {
      icon: <Headphones className="w-8 h-8 text-orange-600" />,
      title: "24/7 Support",
      description: "Our team is here to assist you whenever needed",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Sign Up & Verify",
      description: "Create your influencer profile and verify your social accounts",
    },
    {
      number: "2",
      title: "Choose Campaigns",
      description: "Browse businesses and select campaigns you want to promote",
    },
    {
      number: "3",
      title: "Promote & Earn",
      description: "Share content on your social media and get paid for engagement",
    },
  ];

  const requirements = [
    {
      title: "Active Social Profile",
      description: "Have at least 1,000 followers on a major platform",
    },
    {
      title: "High-Quality Content",
      description: "Create engaging posts and stories for your audience",
    },
    {
      title: "Authenticity",
      description: "Promote businesses that align with your personal brand",
    },
    {
      title: "Commitment",
      description: "Deliver campaigns on time to earn rewards",
    },
  ];

  const handleJoinClick = () => {
    if (user) {
      router.push("/influencerform");
    } else {
      setRedirectPath("/influencerform");
      router.push("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-5">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Become an Influencer
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl mx-auto">
            Promote businesses on your social media and get rewarded for your influence. 
            Join our network and start earning today!
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            onClick={handleJoinClick}
          >
            Join as an Influencer
          </Button>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Why Join Our Influencer Network?
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

      {/* How It Works Section */}
      <section className="py-20 px-5 bg-gray-50">
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
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Requirements
          </h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Monetize Your Influence?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white max-w-2xl mx-auto">
            Join our network of influencers and start earning by promoting brands you love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              onClick={handleJoinClick}
            >
              Join Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold"
              onClick={() => router.push("/influencerform")}
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

export default InfluencerPage;
