import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/toast";
import BottomNavigation from "@/components/sections/bottom-navigation";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { WebflowProvider } from "@/contexts/WebflowContext";
import Header from "@/components/sections/header";
import { LocationProvider } from "@/contexts/LocationContext";
import { ServicesProvider } from "@/contexts/ServicesContext";
import { ServiceCartProvider } from "@/contexts/ServiceCartContext";

import ServiceCartDrawer from "@/components/ServiceCartDrawer";

export const metadata: Metadata = {
  title: "The Groome",
  description: "Your all in one App For local shopping.",
};
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase";
import RecaptchaProvider from "@/components/RecaptchaProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <ServiceCartProvider>
            <ToastProvider>
              <ErrorReporter />
              <AuthProvider>
                      
              <WebflowProvider>
                <ServicesProvider>
                  <RecaptchaProvider />
                  <Header />
                  <LocationProvider>
                    <Script
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
                      strategy="afterInteractive"
                      data-target-origin="*"
                      data-message-type="ROUTE_CHANGE"
                      data-include-search-params="true"
                      data-only-in-iframe="true"
                      data-debug="true"
                      data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
                    />
                    {children}
                  </LocationProvider>
                  <ServiceCartDrawer />
                </ServicesProvider>

              </WebflowProvider>

              </AuthProvider>

              <BottomNavigation />
              <VisualEditsMessenger />
            </ToastProvider>
          </ServiceCartProvider>
        </CartProvider>
      </body>
    </html>
  );
}
