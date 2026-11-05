"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Share2,
  ShoppingBag,
  Loader2,
  Trash2,
  Plus,
  Minus,
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Store,
  Award
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/toast";
import Footer from "@/components/sections/footer";
import ProductPackagesWidget from "@/components/ProductPackagesWidget";
import { useAuth } from "@/contexts/AuthContext";

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  created_at: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  selling_price: string;
  stock_quantity: number;
  status: string;
  category_name?: string;
  sub_category_name?: string;
  mall_name?: string;
  quality_tier?: string;
  images: ProductImage[];
}

const BACKEND_URL = "https://api.thegroome.com";

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { items: cartItems, addToCart, removeFromCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const productId = params.id as string;
  const cartItem = cartItems?.find((item) => String(item.id) === String(productId));
  const isItemInCart = !!cartItem;

  useEffect(() => {
    if (isItemInCart && cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [isItemInCart, cartItem]);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/users/products/${productId}`);
        const data = await response.json();

        if (isMounted) {
          if (data.success && data.product) {
            setProduct(data.product);
          } else {
            setProduct(null);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (isMounted) showToast("Failed to load product details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [productId, showToast]);

  const getFullImageUrl = (urlPath: string | undefined) => {
    if (!urlPath) return "/placeholder.jpg";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) return urlPath;
    return `${BACKEND_URL}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  const originalPrice = product ? parseFloat(product.price) : 0;
  const currentPrice = product?.selling_price ? parseFloat(product.selling_price) : originalPrice;
  const inStock = !!product && product.stock_quantity > 0 && product.status === "active";

  const discountPercentage =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const mainImage =
    product?.images && product.images.length > 0
      ? getFullImageUrl(product.images[selectedImage]?.image_url)
      : "/placeholder.jpg";

  const handleAddToCart = () => {
    if (!product || !inStock) return;

    setIsAdding(true);
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        image: mainImage,
        price: currentPrice,
        originalPrice: originalPrice > currentPrice ? originalPrice : undefined,
        inStock: inStock,
        quantity: quantity,
      });

      showToast(`${product.name} added to your bag.`);
      setIsAdding(false);
    }, 350);
  };

  const handleRemoveFromCart = () => {
    if (!product) return;
    removeFromCart(product.id);
    setQuantity(1);
    showToast(`${product.name} removed from your bag.`);
  };

  const handleShare = async () => {
    const referralCode = (user as any)?.affiliate_code
      ? `?cr_code=${(user as any).affiliate_code}`
      : "";
    const shareUrl = `https://thegroome.com/product/${productId}${referralCode}`;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: product?.name || "The Groome Product",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        showToast("Product link copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing link:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex flex-col justify-between">
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            <p className="text-sm font-medium text-gray-500">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex flex-col justify-between">
        <div className="container mx-auto px-6 py-32 text-center max-w-lg">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            The item you are looking for is currently unavailable or has been archived from our catalogue.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 text-sm font-semibold rounded-xl hover:bg-black transition-all"
          >
            Explore Other Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-gray-900 font-sans antialiased pb-20 lg:pb-12">
      {/* Top Breadcrumbs */}
      <div className="border-b border-gray-200/70 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3.5 max-w-7xl flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs font-medium text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            {product.mall_name && (
              <>
                <span className="hover:text-gray-900 transition-colors">{product.mall_name}</span>
                <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
              </>
            )}
            {product.category_name && (
              <>
                <span className="text-gray-600">{product.category_name.trim()}</span>
                <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
              </>
            )}
            <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          <button
            onClick={handleShare}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={13} />
            <span>{isCopied ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 max-w-7xl">
        {/* Main Product Showcase: 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Showcase & Thumbnails */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Showcase Card */}
            <div className="relative aspect-square w-full bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden group flex items-center justify-center p-6">
              <div className="relative w-full h-full max-w-[450px] max-h-[450px]">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  priority
                  unoptimized
                />
              </div>

              {/* Discount Ribbon 
               {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-sm">
                  {discountPercentage}% OFF
                </div>
              )}

         
              {product.quality_tier && (
                <div className="absolute top-4 right-4 z-10 bg-gray-900/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{product.quality_tier}</span>
                </div>
              )}*/}
             
            </div>

            {/* Thumbnail Navigation Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((img, index) => (
                  <button
                    key={img.id || index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 transition-all p-1.5 border-2 ${
                      selectedImage === index
                        ? "border-gray-900 ring-2 ring-gray-900/10 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getFullImageUrl(img.image_url)}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Buy Box & Overview */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Category / Mall Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                {product.category_name ? (
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                    {product.category_name.trim()}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Official Product
                  </span>
                )}

                {/* Stock Status Badge */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    inStock
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      inStock ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  <span>
                    {inStock
                      ? product.stock_quantity <= 5
                        ? `Only ${product.stock_quantity} left!`
                        : "In Stock"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {product.mall_name && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                  <Store className="w-3.5 h-3.5 text-gray-400" />
                  Available at <span className="font-semibold text-gray-700">{product.mall_name}</span>
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-baseline justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-base text-gray-400 line-through font-medium">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {discountPercentage > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                  Save ₹{(originalPrice - currentPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Quantity Stepper & Add to Bag Actions */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!inStock || quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={!inStock || quantity >= product.stock_quantity}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || isAdding}
                  className="flex-1 h-12 px-5 bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer whitespace-nowrap"
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={16} className="animate-spin flex-shrink-0" />
                      <span>Adding...</span>
                    </>
                  ) : isItemInCart ? (
                    <>
                      <Check size={16} className="text-emerald-400 flex-shrink-0" />
                      <span>Update Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} className="flex-shrink-0" />
                      <span>{inStock ? "Add to Bag" : "Out of Stock"}</span>
                    </>
                  )}
                </button>

                {isItemInCart && (
                  <button
                    onClick={handleRemoveFromCart}
                    className="w-12 h-12 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-200 rounded-xl inline-flex items-center justify-center transition-all flex-shrink-0"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="w-12 h-12 sm:hidden bg-white border border-gray-200 text-gray-600 hover:text-black rounded-xl inline-flex items-center justify-center transition-all flex-shrink-0"
                  title="Share product"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {isItemInCart && (
                <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-800">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check size={14} className="text-emerald-600" /> This product is in your cart
                  </span>
                  <Link
                    href="/cart"
                    className="font-bold underline text-emerald-900 hover:text-emerald-950 flex items-center gap-0.5"
                  >
                    View Bag <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>

            {/* Trust Badges Card */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">100% Genuine Guarantee</h4>
                  <p className="text-gray-500 text-[11px]">Directly sourced from certified vendors</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Fast Local Delivery</h4>
                  <p className="text-gray-500 text-[11px]">Secure packaging and live order tracking</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <RotateCcw size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Easy Replacement</h4>
                  <p className="text-gray-500 text-[11px]">Hassle-free support on defective items</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dedicated Full-Width Bundle & Save Section */}
        <ProductPackagesWidget productId={productId} backendUrl={BACKEND_URL} />

        {/* Product Details & Specifications */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            About This Item
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || "No additional description provided for this product."}
              </p>
            </div>

            <div className="md:col-span-5 bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Specifications
              </h3>
              
              <div className="flex justify-between py-1.5 border-b border-gray-200/60 text-xs">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-gray-900">{product.category_name || "General"}</span>
              </div>

              {product.sub_category_name && (
                <div className="flex justify-between py-1.5 border-b border-gray-200/60 text-xs">
                  <span className="text-gray-500">Sub-Category</span>
                  <span className="font-medium text-gray-900">{product.sub_category_name}</span>
                </div>
              )}

              <div className="flex justify-between py-1.5 border-b border-gray-200/60 text-xs">
                <span className="text-gray-500">Quality Tier</span>
                <span className="font-medium text-gray-900">{product.quality_tier || "Standard"}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-200/60 text-xs">
                <span className="text-gray-500">Stock Availability</span>
                <span className="font-medium text-gray-900">{product.stock_quantity} units available</span>
              </div>

              {product.mall_name && (
                <div className="flex justify-between py-1.5 text-xs">
                  <span className="text-gray-500">Mall Location</span>
                  <span className="font-medium text-gray-900">{product.mall_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Sticky Mobile Buy Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 p-3.5 z-40 flex items-center justify-between gap-4 shadow-lg">
        <div className="min-w-0">
          <p className="text-[11px] text-gray-500 truncate max-w-[150px]">{product.name}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          className="flex-1 max-w-[180px] h-10 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all disabled:opacity-40"
        >
          {isAdding ? (
            <Loader2 size={14} className="animate-spin" />
          ) : isItemInCart ? (
            "Update Bag"
          ) : (
            <>
              <ShoppingBag size={14} />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;