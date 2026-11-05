"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Check, ShoppingBag, Loader2, Clock, Award, 
  CalendarCheck, Store, ShieldCheck, ArrowRight, Plus
} from "lucide-react";
import { useServiceCart } from "@/contexts/ServiceCartContext";
import { useToast } from "@/components/ui/toast";

export interface PackageServiceItem {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  duration_minutes?: number;
  quality_tier?: string;
  image_url: string;
}

export interface PackageItem {
  item_id: string;
  quantity: number;
  is_target_item: boolean;
  product: any | null;
  service: PackageServiceItem | null;
}

export interface PackagePricing {
  original_total: number;
  final_package_price: number;
  savings: number;
  discount_type: string;
  discount_value: number | string;
}

export interface ServicePackageData {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  package_type: string;
  discount_type: string;
  discount_value: string;
  max_purchases: number | null;
  max_per_customer: number | null;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  vendor_name: string;
  vendor_profile_image: string | null;
  items: PackageItem[];
  pricing: PackagePricing;
  is_bundle_in_stock: boolean;
}

interface ServicePackagesWidgetProps {
  serviceId: string;
  backendUrl?: string;
}

const BACKEND_DEFAULT = "https://api.thegroome.com";

export const ServicePackagesWidget: React.FC<ServicePackagesWidgetProps> = ({
  serviceId,
  backendUrl = BACKEND_DEFAULT,
}) => {
  const router = useRouter();
  const [packages, setPackages] = useState<ServicePackageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { items: cartItems, addService } = useServiceCart();
  const { showToast } = useToast();

  const getFullImageUrl = (urlPath: string | null | undefined) => {
    if (!urlPath) return "/placeholder.png";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) return urlPath;
    return `${backendUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/packages/service/${serviceId}`);
        if (!res.ok) {
          if (isMounted) setPackages([]);
          return;
        }

        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.packages)) {
          setPackages(data.packages);
        }
      } catch (err) {
        console.error("Failed to load service packages:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (serviceId) {
      fetchPackages();
    }

    return () => {
      isMounted = false;
    };
  }, [serviceId, backendUrl]);

  if (loading) {
    return (
      <div className="my-10 bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xs animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-56 bg-gray-200 rounded-md" />
          <div className="h-7 w-28 bg-gray-200 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return null;
  }

  const prepareBundlePayload = (pkg: ServicePackageData) => {
    const firstValidService = pkg.items.find((i) => i.service)?.service;
    const coverImage = getFullImageUrl(
      pkg.image_url || firstValidService?.image_url
    );

    const bundledServices = pkg.items
      .filter((i) => i.service)
      .map((i) => ({
        id: i.service!.id,
        name: i.service!.name,
        image: getFullImageUrl(i.service!.image_url),
        price: i.service!.price,
        discount_price: i.service!.discount_price,
        duration_minutes: i.service!.duration_minutes,
        quality_tier: i.service!.quality_tier,
        quantity: i.quantity,
      }));

    const serviceIds = pkg.items
      .filter((i) => i.service)
      .map((i) => i.service!.id);

    const totalDuration = bundledServices.reduce(
      (sum, s) => sum + (s.duration_minutes || 0),
      0
    );

    return {
      id: `pkg_${pkg.id}`,
      name: pkg.name,
      image: coverImage,
      price: pkg.pricing.final_package_price,
      originalPrice:
        pkg.pricing.original_total > pkg.pricing.final_package_price
          ? pkg.pricing.original_total
          : undefined,
      vendor_id: pkg.vendor_id,
      vendor_name: pkg.vendor_name || "Specialist Vendor",
      vendor_image: getFullImageUrl(pkg.vendor_profile_image),
      isPackage: true,
      packageId: pkg.id,
      packageType: pkg.package_type,
      bundledServices: bundledServices,
      serviceIds: serviceIds,
      duration_minutes: totalDuration,
    };
  };

  const handleAddPackage = (pkg: ServicePackageData) => {
    setAddingId(pkg.id);

    setTimeout(() => {
      const payload = prepareBundlePayload(pkg);
      addService(payload);

      setAddingId(null);
      setAddedId(pkg.id);
      showToast(`${pkg.name} added to your service cart!`);

      setTimeout(() => {
        setAddedId(null);
      }, 3000);
    }, 300);
  };

  const handleDirectBook = (pkg: ServicePackageData) => {
    const serviceIds = pkg.items
      .filter((i) => i.service)
      .map((i) => i.service!.id);

    if (serviceIds.length === 0) return;

    // Add to cart so the cart and context stay in sync
    const payload = prepareBundlePayload(pkg);
    addService(payload);

    // Route directly to select slot with the vendor and service IDs
    const serviceIdsParam = JSON.stringify(serviceIds);
    router.push(`/select-slot?vendorId=${pkg.vendor_id}&serviceIds=${serviceIdsParam}`);
  };

  return (
    <section className="my-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Curated Salon Packages
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Frequently Booked Together
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Bundle complementary salon & grooming treatments into a single appointment.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {packages.map((pkg) => {
          const isBundleInCart = cartItems.some(
            (item) => String(item.id) === `pkg_${pkg.id}`
          );

          const totalDuration = pkg.items.reduce(
            (sum, item) => sum + (item.service?.duration_minutes || 0),
            0
          );

          const hasSavings =
            pkg.pricing.savings > 0 &&
            pkg.pricing.original_total > pkg.pricing.final_package_price;

          const savingsPercent = hasSavings
            ? Math.round(
                (pkg.pricing.savings / pkg.pricing.original_total) * 100
              )
            : 0;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Package Top Banner */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                        <Sparkles className="w-3 h-3" /> Combo Experience
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {pkg.items.length} Treatments Included
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                      {pkg.name}
                    </h3>

                    {pkg.vendor_name && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {pkg.vendor_profile_image ? (
                          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-gray-200">
                            <Image
                              src={getFullImageUrl(pkg.vendor_profile_image)}
                              alt={pkg.vendor_name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <Store className="w-4 h-4 text-gray-400" />
                        )}
                        <span>
                          Curated by <strong className="text-gray-800 font-semibold">{pkg.vendor_name.trim()}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Badges: Duration & Savings */}
                  <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
                    {totalDuration > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs text-xs font-semibold text-gray-700">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>
                          {Math.floor(totalDuration / 60) > 0 ? `${Math.floor(totalDuration / 60)}h ` : ""}
                          {totalDuration % 60 > 0 ? `${totalDuration % 60}m` : ""} Session
                        </span>
                      </div>
                    )}

                    {hasSavings && (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-700 shadow-2xs">
                        Save ₹{pkg.pricing.savings.toLocaleString("en-IN")}
                        {savingsPercent > 0 && ` (${savingsPercent}% OFF)`}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Treatment Cards Grid */}
              <div className="p-5 sm:p-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Included Treatments ({pkg.items.length} Services in 1 Session)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pkg.items.map((item, index) => {
                    const srv = item.service;
                    if (!srv) return null;
                    const itemImg = getFullImageUrl(srv.image_url);

                    return (
                      <div
                        key={item.item_id || index}
                        className="relative bg-gray-50/70 hover:bg-gray-100/70 transition-all duration-300 p-4 rounded-2xl border border-gray-200/60 flex items-center gap-4 group"
                      >
                        {/* Service Thumbnail */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-200 shadow-2xs">
                          <Image
                            src={itemImg}
                            alt={srv.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                          <div className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            #{index + 1}
                          </div>
                        </div>

                        {/* Service Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            {item.is_target_item ? (
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                                Current Service
                              </span>
                            ) : (
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                Combo Partner
                              </span>
                            )}
                            {srv.quality_tier && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200/60">
                                <Award className="w-3 h-3 text-amber-500" />
                                {srv.quality_tier}
                              </span>
                            )}
                          </div>

                          <h4
                            className="text-sm sm:text-base font-bold text-gray-900 truncate"
                            title={srv.name}
                          >
                            {srv.name}
                          </h4>

                          <div className="flex items-center gap-3 mt-1.5 text-xs">
                            <span className="font-extrabold text-gray-900">
                              ₹{(srv.discount_price || srv.price).toLocaleString("en-IN")}
                            </span>
                            {srv.discount_price && srv.price > srv.discount_price && (
                              <span className="line-through text-gray-400 text-[11px]">
                                ₹{srv.price.toLocaleString("en-IN")}
                              </span>
                            )}
                            {srv.duration_minutes && (
                              <span className="flex items-center gap-1 font-medium text-gray-500 ml-auto">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                {srv.duration_minutes} Mins
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Booking & Pricing Bar */}
              <div className="px-5 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    All-Inclusive Package Price
                  </span>
                  <div className="flex items-baseline justify-center sm:justify-start gap-2.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      ₹{pkg.pricing.final_package_price.toLocaleString("en-IN")}
                    </span>
                    {hasSavings && (
                      <span className="text-sm text-gray-400 line-through font-medium">
                        ₹{pkg.pricing.original_total.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Includes all {pkg.items.length} treatments • Dedicated staff & products
                  </p>
                </div>

                {/* Actions: Book Directly + Add to Cart */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => handleDirectBook(pkg)}
                    className="flex-1 sm:flex-none h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                  >
                    <CalendarCheck size={16} />
                    <span>Book Package Now</span>
                  </button>

                  <button
                    onClick={() => handleAddPackage(pkg)}
                    disabled={addingId === pkg.id}
                    className={`h-12 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                      isBundleInCart || addedId === pkg.id
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                    title={isBundleInCart ? "In Service Cart" : "Save to Service Cart"}
                  >
                    {addingId === pkg.id ? (
                      <Loader2 size={16} className="animate-spin text-gray-500" />
                    ) : isBundleInCart || addedId === pkg.id ? (
                      <>
                        <Check size={16} className="text-emerald-600" />
                        <span className="hidden sm:inline">In Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span className="hidden sm:inline">Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicePackagesWidget;
