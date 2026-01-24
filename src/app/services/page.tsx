import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import ServicesOffered from "@/components/sections/services-offered";
import MobileAppSection from "@/components/sections/mobile-app";
import Footer from "@/components/sections/footer";
import LocationRequestService from "@/components/LocationStatusService";

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
    
      <main>
        <Hero />
       <LocationRequestService />
        <MobileAppSection />
      </main>
      <Footer />
    </div>
  );
}
