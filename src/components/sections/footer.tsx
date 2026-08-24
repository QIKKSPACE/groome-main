"use client";

import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import { WebflowContext } from "@/contexts/WebflowContext";

const Footer = () => {
  const { data } = useContext(WebflowContext);

  const socialLinks = [
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      url: "https://twitter.com/orchids",
    },
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      url: "https://facebook.com/orchids",
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      url: "https://instagram.com/orchids",
    },
    {
      name: "YouTube",
      icon: <Youtube size={20} />,
      url: "https://youtube.com/orchids",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      url: "https://linkedin.com/company/orchids",
    },
  ];

  const footerLinks = {
    about: [
      "About Us",
      "Terms & Conditions",
      "Privacy Policy",
      "Services",
    ],
    forPartners: [
      "Register as a professional",
      "Contact Us",
      "My Account",
    ],
  };

  const sortedCities =
    data?.city_list
      ?.map((c: any) => c.city_name)
      ?.sort((a: string, b: string) => a.localeCompare(b)) || [];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 md:px-10 py-12 md:py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Company */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4">
              Company
            </h4>

            <ul className="space-y-2">
              {footerLinks.about.map((link, index) => {
                let href = "#";

                if (link === "About Us") href = "/about-us";
                if (link === "Services") href = "/services";
                if (link === "Terms & Conditions")
                  href = "/terms-condition";
                if (link === "Privacy Policy")
                  href = "/privacy-policy";

                return (
                  <li key={index}>
                    <Link
                      href={href}
                      className="text-gray-300 hover:text-white text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4">
              For Partners
            </h4>

            <ul className="space-y-2">
              {footerLinks.forPartners.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4">
              India
            </h4>

            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
              {sortedCities.length > 0 ? (
                sortedCities.map((city) => (
                  <span
                    key={city}
                    className="text-sm text-gray-300"
                  >
                    {city}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No cities available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/1757279455442-abff6i79x37.png"
                alt="Orchids"
                width={120}
                height={28}
              />

              <span className="text-gray-400 text-sm text-center">
                © {new Date().getFullYear()} Overtime Strategies Pvt. Ltd.
              </span>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Made with ❤️ by{" "}
            <span className="font-semibold text-gray-400">
              Skytrek Technologies
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;