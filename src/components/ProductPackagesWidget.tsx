"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Sparkles, Check, ShoppingBag, Loader2, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/toast";

export interface PackageProductItem {
  id: string;
  name: string;
  price: number;
  selling_price: number;
  stock_quantity: number;
  quality_tier?: string;
  in_stock: boolean;
  image_url: string;
}

export interface PackageItem {
  item_id: string;
  quantity: number;
  is_target_item: boolean;
  product: PackageProductItem | null;
  service: any | null;
}

export interface PackagePricing {
  original_total: number;
  final_package_price: number;
  savings: number;
  discount_type: string;
  discount_value: number | string;
}

export interface PackageData {
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

interface ProductPackagesWidgetProps {
  productId: string;
  backendUrl?: string;
}

const BACKEND_DEFAULT = "https://api.thegroome.com";

export const ProductPackagesWidget: React.FC<ProductPackagesWidgetProps> = ({
  productId,
  backendUrl = BACKEND_DEFAULT,
}) => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { items: cartItems, addToCart } = useCart();
  const { showToast } = useToast();

  const getFullImageUrl = (urlPath: string | null | undefined) => {
    if (!urlPath) return "/placeholder.jpg";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) return urlPath;
    return `${backendUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/packages/product/${productId}`);
        if (!res.ok) {
          if (isMounted) setPackages([]);
          return;
        }

        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.packages)) {
          setPackages(data.packages);
        }
      } catch (err) {
        console.error("Failed to load product packages:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (productId) {
      fetchPackages();
    }

    return () => {
      isMounted = false;
    };
  }, [productId, backendUrl]);

  if (loading) {
    return (
      <div className="my-10 bg-white rounded-3xl border border-neutral-200/60 p-6 shadow-2xs animate-pulse space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 w-48 bg-neutral-100 rounded-md" />
          <div className="h-6 w-24 bg-neutral-100 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-neutral-50 rounded-2xl" />
          <div className="h-24 bg-neutral-50 rounded-2xl" />
          <div className="h-24 bg-neutral-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return null;
  }

  const handleAddBundle = (pkg: PackageData) => {
    setAddingId(pkg.id);

    setTimeout(() => {
      const firstValidProduct = pkg.items.find((i) => i.product)?.product;
      const coverImage = getFullImageUrl(
        pkg.image_url || firstValidProduct?.image_url
      );

      const bundledProducts = pkg.items
        .filter((i) => i.product)
        .map((i) => ({
          id: i.product!.id,
          name: i.product!.name,
          image: getFullImageUrl(i.product!.image_url),
          price: i.product!.price,
          selling_price: i.product!.selling_price,
          quantity: i.quantity,
        }));

      addToCart({
        id: `pkg_${pkg.id}`,
        name: pkg.name,
        image: coverImage,
        price: pkg.pricing.final_package_price,
        originalPrice: pkg.pricing.original_total,
        inStock: pkg.is_bundle_in_stock,
        isPackage: true,
        packageId: pkg.id,
        packageType: pkg.package_type,
        vendorName: pkg.vendor_name,
        bundledItems: bundledProducts,
        quantity: 1,
      });

      setAddingId(null);
      setAddedId(pkg.id);
      showToast(`${pkg.name} added to your bag!`);

      setTimeout(() => {
        setAddedId(null);
      }, 3000);
    }, 300);
  };

  return (
    <section className="my-12 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Frequently Bought Together
          </h2>
          <p className="text-xs text-neutral-500">
            Bundle items together from this store for an exclusive package discount.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {packages.map((pkg) => {
          const isBundleInCart = cartItems.some(
            (item) => String(item.id) === `pkg_${pkg.id}`
          );
          const savingsPercent =
            pkg.pricing.original_total > 0
              ? Math.round(
                  (pkg.pricing.savings / pkg.pricing.original_total) * 100
                )
              : 0;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-neutral-200/60 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
            >
              {/* Package Header Banner */}
              <div className="px-6 py-4 bg-neutral-50/60 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 text-white text-[10px] font-bold tracking-wider uppercase">
                    <Package className="w-3 h-3" />
                    Combo Offer
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {pkg.name}
                  </h3>
                  {pkg.vendor_name && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs text-neutral-400 font-medium">
                      • by <span className="text-neutral-700 font-semibold">{pkg.vendor_name.trim()}</span>
                    </span>
                  )}
                </div>

                {pkg.pricing.savings > 0 && (
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <span>Save ₹{pkg.pricing.savings.toLocaleString("en-IN")}</span>
                    {savingsPercent > 0 && (
                      <span className="text-[10px] opacity-80 font-bold">
                        ({savingsPercent}% OFF)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Main Content Layout */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left: Product List */}
                <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                  {pkg.items.map((item, index) => {
                    const prod = item.product;
                    if (!prod) return null;
                    const itemImg = getFullImageUrl(prod.image_url);

                    return (
                      <React.Fragment key={item.item_id || index}>
                        <div className="w-full sm:w-auto flex-1 min-w-[210px] bg-neutral-50/60 hover:bg-neutral-50 transition-colors p-3.5 rounded-2xl border border-neutral-100 flex items-center gap-3.5">
                          {/* Item Thumbnail */}
                          <div className="relative w-16 h-16 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-neutral-200/60 p-1">
                            <Image
                              src={itemImg}
                              alt={prod.name}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                            {item.quantity > 1 && (
                              <span className="absolute bottom-1 right-1 bg-neutral-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                {item.quantity}x
                              </span>
                            )}
                          </div>

                          {/* Item Meta */}
                          <div className="min-w-0 flex-1">
                            {item.is_target_item ? (
                              <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mb-1">
                                Main Item
                              </span>
                            ) : (
                              <span className="inline-block text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                                Add-on
                              </span>
                            )}
                            <h4
                              className="text-xs font-semibold text-neutral-900 truncate"
                              title={prod.name}
                            >
                              {prod.name}
                            </h4>
                            <div className="flex items-baseline gap-1.5 mt-1">
                              <span className="text-xs font-bold text-neutral-900">
                                ₹{(prod.selling_price || prod.price).toLocaleString("en-IN")}
                              </span>
                              {prod.price > prod.selling_price && (
                                <span className="text-[10px] text-neutral-400 line-through">
                                  ₹{prod.price.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Plus Connector Icon */}
                        {index < pkg.items.length - 1 && (
                          <div className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center text-xs font-medium flex-shrink-0">
                            <Plus className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Right: Pricing & CTA */}
                <div className="lg:col-span-4 bg-neutral-50/80 p-5 rounded-2xl border border-neutral-100 flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Bundle Price ({pkg.items.length} items)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                        ₹{pkg.pricing.final_package_price.toLocaleString("en-IN")}
                      </span>
                      {pkg.pricing.original_total > pkg.pricing.final_package_price && (
                        <span className="text-xs text-neutral-400 line-through font-medium">
                          ₹{pkg.pricing.original_total.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    {pkg.pricing.savings > 0 && (
                      <p className="text-[11px] font-medium text-emerald-600 mt-1">
                        Combined discount applied
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddBundle(pkg)}
                    disabled={!pkg.is_bundle_in_stock || addingId === pkg.id}
                    className="w-full h-11 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400 cursor-pointer"
                  >
                    {addingId === pkg.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Adding Bundle...</span>
                      </>
                    ) : addedId === pkg.id || isBundleInCart ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Bundle Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>
                          {pkg.is_bundle_in_stock ? `Add All ${pkg.items.length} to Bag` : "Bundle Out of Stock"}
                        </span>
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

export default ProductPackagesWidget;