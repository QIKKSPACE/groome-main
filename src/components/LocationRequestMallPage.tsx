"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Navigation,
  ShoppingCart,
  Store,
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/toast";
import { useMalls } from "@/contexts/MallContext";
import { NearbyMall, MallProduct } from "@/types/mall";
import AskLocation from "./AskLocation";

const API_BASE = "https://api.thegroome.com";

const formatImageUrl = (url?: string): string => {
  if (!url) return "/navlogo.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const clean = url.startsWith("/") ? url : `/${url}`;
  return `${API_BASE}${clean}`;
};

const LocationRequestMallPage: React.FC = () => {
  const { location, updateLocation } = useLocation();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const {
    malls,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    fetchMalls,
  } = useMalls();

  const locationMissing = !location?.lat || !location?.lng;

  // Local UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // GPS Request Handler
  const handleGPSRequest = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser. Please enter your pincode instead."
      );
      return;
    }

    setGpsLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `${API_BASE}/superadmin/pincode?lat=${encodeURIComponent(
              lat
            )}&lng=${encodeURIComponent(lng)}`
          );
          const data = await res.json();

          updateLocation({
            lat,
            lng,
            pincode: data?.pincode || "",
            city: data?.address?.city || data?.city || "",
            state: data?.address?.state || data?.state || "",
            type: "gps",
          });
        } catch {
          // Fallback: save coordinates even if reverse geocoding fails
          updateLocation({
            lat,
            lng,
            pincode: "",
            city: "",
            state: "",
            type: "gps",
          });
        } finally {
          setGpsLoading(false);
        }
      },
      (geoError) => {
        setGpsLoading(false);
        switch (geoError.code) {
          case 1:
            setLocationError(
              "Location permission denied. Please allow location access or enter your pincode."
            );
            break;
          case 2:
            setLocationError(
              "Your location could not be determined. Please enter your pincode."
            );
            break;
          case 3:
            setLocationError(
              "Location request timed out. Please enter your pincode."
            );
            break;
          default:
            setLocationError(
              "Unable to retrieve your location. Please enter your pincode."
            );
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  // Filtered malls based on search query (by mall name or product name/desc)
  const filteredMalls = useMemo(() => {
    if (!searchQuery.trim()) return malls;
    const q = searchQuery.toLowerCase().trim();

    return malls.filter((mall) => {
      const matchName = mall.business_name?.toLowerCase().includes(q);
      const matchProducts = mall.products?.some(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
      return matchName || matchProducts;
    });
  }, [malls, searchQuery]);

  // Handle add product to cart
  const handleAddToCart = (
    product: MallProduct,
    mallName: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const price = Number(product.selling_price || product.price || 0);
    const originalPrice =
      product.selling_price && product.price > product.selling_price
        ? Number(product.price)
        : undefined;

    addToCart({
      id: product.id,
      name: product.name,
      image: formatImageUrl(product.image),
      price,
      originalPrice,
      inStock:
        (product.stock_quantity ?? 1) > 0 && product.status !== "inactive",
      vendorName: mallName,
    });

    showToast(`${product.name} added to cart!`, "success");
  };

  // -------------------------------------------------------------
  // 1. IF LOCATION NOT ENABLED: LUXURY "NEED LOCATION ACCESS"
  // -------------------------------------------------------------
  if (locationMissing) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16 bg-gradient-to-b from-stone-50/60 to-white">
          <div className="relative bg-white/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-3xl p-8 sm:p-12 flex flex-col items-center max-w-lg w-full border border-stone-200/80 animate-in fade-in zoom-in-95 duration-300">
            {/* Ambient decorative aura */}
            <div className="absolute -top-10 -z-10 w-44 h-44 bg-amber-400/10 rounded-full blur-3xl" />

            {/* Icon */}
            <div className="w-20 h-20 bg-stone-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-stone-900/10">
              <MapPin className="w-10 h-10 animate-bounce text-amber-400" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600 mb-2">
              Concierge Access
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-3">
              Need Location Access to Fetch Malls
            </h2>

            <p className="text-stone-500 text-sm sm:text-base mb-8 max-w-md leading-relaxed font-normal">
              Please enable your location or provide your pincode to reveal
              the exclusive digital malls and verified boutiques available in
              your area.
            </p>

            <div className="flex flex-col w-full gap-3.5">
              <button
                type="button"
                onClick={handleGPSRequest}
                disabled={gpsLoading}
                className={`flex items-center justify-center gap-2.5 bg-gradient-to-r from-stone-900 via-neutral-900 to-black hover:from-neutral-800 hover:to-neutral-900 active:scale-[0.99] text-white font-medium text-sm sm:text-base px-6 py-4 rounded-2xl shadow-md transition-all duration-200 ${
                  gpsLoading
                    ? "opacity-75 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-lg"
                }`}
              >
                {gpsLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5 text-amber-400" />
                    <span>Enable Location</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                disabled={gpsLoading}
                className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200/80 active:scale-[0.99] text-stone-800 font-medium text-sm sm:text-base px-6 py-3.5 rounded-2xl border border-stone-200/60 transition-all duration-200"
              >
                <MapPin className="w-4 h-4 text-stone-500" />
                <span>Enter Pincode Manually</span>
              </button>
            </div>

            {locationError && (
              <div className="mt-5 p-3.5 bg-rose-50/80 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5 text-left w-full">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{locationError}</span>
              </div>
            )}
          </div>
        </div>

        {modalOpen && (
          <AskLocation
            onClose={() => {
              setModalOpen(false);
            }}
          />
        )}
      </>
    );
  }

  // -------------------------------------------------------------
  // 2. IF LOCATION ENABLED: PREMIUM NEARBY MALLS COLLECTION
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Luxury Controls & Search Toolbar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-200/70 p-4 sm:p-5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Current Location Pill */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <MapPin size={18} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                Shopping Near
              </div>
              <div className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <span>
                  {location.city ||
                    location.pincode ||
                    "Current Location"}
                  {location.pincode && location.city
                    ? ` (${location.pincode})`
                    : ""}
                </span>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="text-xs text-amber-600 hover:text-amber-700 underline font-semibold ml-1 cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search malls or products..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Refresh Action */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => fetchMalls({ isRefresh: true })}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 active:scale-95 transition"
            >
              <Loader2
                size={14}
                className={`text-stone-500 ${loading ? "animate-spin" : "hidden"}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && malls.length === 0 && (
        <div className="space-y-8">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-200/80 p-6 sm:p-8 animate-pulse"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-stone-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-stone-200 rounded-md w-1/4" />
                  <div className="h-4 bg-stone-100 rounded-md w-1/6" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((p) => (
                  <div key={p} className="h-56 bg-stone-100 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && malls.length === 0 && (
        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center my-8 max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-900 mb-1">
            Unable to Load Digital Malls
          </h3>
          <p className="text-sm text-stone-500 mb-5">{error}</p>
          <button
            type="button"
            onClick={() => fetchMalls({ force: true })}
            className="bg-stone-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMalls.length === 0 && (
        <div className="bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-stone-200/80 p-12 text-center my-8 max-w-md mx-auto">
          <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-10 h-10 text-stone-400" />
          </div>

          <h3 className="text-xl font-bold text-stone-900 mb-2">
            No Digital Malls Found
          </h3>

          <p className="text-stone-500 text-sm mb-6 leading-relaxed">
            {searchQuery
              ? `No malls or products match "${searchQuery}".`
              : "We couldn't find any digital malls in this area yet."}
          </p>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-stone-900 hover:bg-black text-white text-sm font-semibold px-6 py-3 rounded-2xl transition shadow-sm"
          >
            Change Location / Pincode
          </button>
        </div>
      )}

      {/* Malls List */}
      {!loading && filteredMalls.length > 0 && (
        <div className="space-y-10">
          {filteredMalls.map((mall) => {
            const hasProducts = mall.products && mall.products.length > 0;

            return (
              <div
                key={mall.id}
                className="bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-stone-200/80 overflow-hidden transition-all duration-300"
              >
                {/* Premium Mall Info Header (No location, No directions, No distance) */}
                <div className="p-6 sm:p-7 bg-gradient-to-r from-stone-50/70 via-white to-stone-50/40 border-b border-stone-100">
                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Mall Logo / Profile Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border border-stone-200/90 shadow-sm shrink-0 flex items-center justify-center">
                      <img
                        src={formatImageUrl(mall.profile_image)}
                        alt={mall.business_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/navlogo.png";
                        }}
                      />
                    </div>

                    {/* Mall Title & Verified Badge */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                          {mall.business_name}
                        </h3>

                        {mall.verified && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-stone-900 text-stone-100 shadow-sm">
                            <Sparkles size={11} className="text-amber-400" />
                            Verified Mall
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-stone-400 font-medium tracking-wide uppercase">
                          Digital Storefront
                        </span>
                        {hasProducts && (
                          <>
                            <span className="text-stone-300">•</span>
                            <span className="text-xs text-stone-600 font-medium">
                              {mall.products?.length} {mall.products?.length === 1 ? "Product" : "Products"} available
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="p-6 sm:p-8 bg-white">
                  {!hasProducts ? (
                    <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400 text-sm">
                      <ShoppingBag size={28} className="mx-auto mb-2 text-stone-300" />
                      No products currently listed in this mall.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {mall.products?.map((product) => {
                        const sellingPrice = Number(
                          product.selling_price || product.price || 0
                        );
                        const originalPrice = Number(product.price || 0);
                        const hasDiscount =
                          product.selling_price != null &&
                          originalPrice > sellingPrice;
                        const discountPct = hasDiscount
                          ? Math.round(
                              ((originalPrice - sellingPrice) / originalPrice) *
                                100
                            )
                          : 0;

                        const isOutOfStock =
                          (product.stock_quantity ?? 1) <= 0 ||
                          product.status === "inactive";

                        return (
                          <div
                            key={product.id}
                            className="group bg-white rounded-2xl border border-stone-200/90 hover:border-stone-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                          >
                            <Link
                              href={`/product/${product.id}`}
                              className="block p-3.5"
                            >
                              {/* Product Image */}
                              <div className="relative w-full aspect-square bg-stone-50 rounded-xl overflow-hidden mb-3">
                                <img
                                  src={formatImageUrl(product.image)}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/navlogo.png";
                                  }}
                                />

                                {hasDiscount && (
                                  <span className="absolute top-2 right-2 bg-stone-900/90 backdrop-blur-md text-stone-100 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                                    {discountPct}% OFF
                                  </span>
                                )}

                                {isOutOfStock ? (
                                  <span className="absolute bottom-2 left-2 bg-stone-900/90 text-rose-400 text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded shadow">
                                    Out of Stock
                                  </span>
                                ) : product.stock_quantity != null &&
                                  product.stock_quantity <= 5 ? (
                                  <span className="absolute bottom-2 left-2 bg-amber-500/95 text-white text-[9px] font-semibold px-2 py-0.5 rounded shadow">
                                    Only {product.stock_quantity} left
                                  </span>
                                ) : null}
                              </div>

                              {/* Title & Description */}
                              <h5 className="font-bold text-stone-900 text-sm line-clamp-1 group-hover:text-stone-600 transition-colors">
                                {product.name}
                              </h5>

                              {product.description && (
                                <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                                  {product.description}
                                </p>
                              )}

                              {/* Price */}
                              <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-base font-extrabold text-stone-900">
                                  ₹{sellingPrice.toLocaleString("en-IN")}
                                </span>
                                {hasDiscount && (
                                  <span className="text-xs text-stone-400 line-through">
                                    ₹{originalPrice.toLocaleString("en-IN")}
                                  </span>
                                )}
                              </div>
                            </Link>

                            {/* Add to Cart button */}
                            <div className="p-3.5 pt-0">
                              <button
                                type="button"
                                disabled={isOutOfStock}
                                onClick={(e) =>
                                  handleAddToCart(
                                    product,
                                    mall.business_name,
                                    e
                                  )
                                }
                                className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                                  isOutOfStock
                                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                    : "bg-stone-900 hover:bg-black text-white active:scale-95 shadow-sm"
                                }`}
                              >
                                <ShoppingCart size={13} />
                                <span>
                                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                                </span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination: Load More */}
          {hasMore && (
            <div className="flex justify-center pt-4 pb-8">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide bg-stone-900 hover:bg-black text-white active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-amber-400" />
                    <span>Loading more malls...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Malls</span>
                    <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMore && malls.length > 0 && (
            <div className="text-center py-8">
              <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
                — End of Available Malls —
              </span>
            </div>
          )}
        </div>
      )}

      {/* Pincode Modal */}
      {modalOpen && (
        <AskLocation
          onClose={() => {
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default LocationRequestMallPage;
