"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Share2, ShoppingBag, Loader2, Trash2, Plus, Minus, Check, 
  ChevronRight, ShieldCheck, Truck, ArrowRight
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/toast";
import Footer from "@/components/sections/footer";
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
    const { user } = useAuth(); // Extracted user context
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const productId = params.id as string; 
  const cartItem = cartItems?.find((item) => String(item.id) === String(productId));
  const isItemInCart = !!cartItem;
  useEffect(() => {
    if (isItemInCart && cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [isItemInCart, cartItem]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/users/products/${productId}`);
        const data = await response.json();

        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        showToast("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
   
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-neutral-900 grid place-items-center" strokeWidth={1} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">

        <div className="container mx-auto px-6 py-44 text-center max-w-xl">
          <h1 className="text-xl font-light text-neutral-900 mb-4 tracking-[0.2em] uppercase">Edition Unavailable</h1>
          <p className="text-neutral-500 mb-10 text-xs font-light tracking-wide leading-relaxed">
            The piece you are looking for is currently unavailable or has been archived from our permanent collection.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center border border-neutral-900 text-neutral-900 px-8 py-3.5 text-[10px] tracking-[0.25em] uppercase hover:bg-neutral-900 hover:text-white transition-all duration-500"
          >
            Return to Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const originalPrice = parseFloat(product.price);
  const currentPrice = product.selling_price ? parseFloat(product.selling_price) : originalPrice;
  const inStock = product.stock_quantity > 0 && product.status === 'active';
  
  const discountPercentage = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const getFullImageUrl = (urlPath: string | undefined) => {
    if (!urlPath) return "/placeholder.jpg";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) return urlPath;
    return `${BACKEND_URL}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  const mainImage = product.images && product.images.length > 0 
    ? getFullImageUrl(product.images[selectedImage]?.image_url)
    : "/placeholder.jpg"; 

  const handleAddToCart = () => {
    if (!inStock) return;

    setIsAdding(true);
    setTimeout(() => {
      const itemToSubmit = {
        id: product.id,
        name: product.name,
        image: mainImage,
        price: currentPrice,
        originalPrice: originalPrice > currentPrice ? originalPrice : undefined,
        inStock: inStock
      };

      addToCart({ ...itemToSubmit, quantity });
      showToast(`${product.name} updated in your bag.`);
      setIsAdding(false);
    }, 400);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
    setQuantity(1);
    showToast(`${product.name} removed from your bag.`);
  };

  const handleShare = async () => {
    const referralCode = user?.affiliate_code ? `?cr_code=${user.affiliate_code}` : "";
    const shareUrl = `https://thegroome.com/product/${productId}${referralCode}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this product!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedId(productId);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (error) {
      console.error("Error sharing link:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-200/60 font-sans antialiased">
    
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-16 max-w-7xl">
        
        {/* Minimalist Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[9px] uppercase tracking-[0.25em] text-neutral-400 mb-12 border-b border-neutral-100 pb-4">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={8} className="opacity-40" />
          {product.mall_name && (
            <>
              <span className="opacity-80">{product.mall_name}</span>
              <ChevronRight size={8} className="opacity-40" />
            </>
          )}
          <span className="text-neutral-900 font-medium truncate max-w-[180px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Visual Presentation */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            
            {/* Thumbnail Navigation */}
            {product.images && product.images.length > 1 && (
              <div className="md:col-span-2 order-2 md:order-1 flex md:flex-col gap-3 overflow-auto scrollbar-none">
                {product.images.map((img, index) => (
                  <button
                    key={img.id || index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square w-20 md:w-full flex-shrink-0 bg-white transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border border-black shadow-sm' 
                        : 'border border-transparent hover:border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getFullImageUrl(img.image_url)}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      
                      className="object-cover p-2"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Showcase Image */}
            <div className={`order-1 md:order-2 ${product.images && product.images.length > 1 ? 'md:col-span-10' : 'md:col-span-12'}`}>
              <div className="relative aspect-[4/5] md:aspect-square w-full min-h-[400px] bg-white group overflow-hidden border border-neutral-100/50 shadow-sm rounded-xl">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase z-10">
                    {discountPercentage}% Off
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Purchasing Matrix */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full py-1">
            <div>
              {product.mall_name && (
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-400 mb-2">
                  {product.mall_name}
                </p>
              )}
              <h1 className="text-xl sm:text-2xl font-light tracking-[0.05em] text-neutral-900 uppercase mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-3 my-6">
                <span className="text-lg font-light tracking-wide text-neutral-950">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-xs text-neutral-400 line-through font-light">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              
              <div className="inline-flex items-center gap-2 border border-neutral-200/60 px-3 py-1 rounded-full mb-8">
                <span className={`h-1 w-1 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                <span className="text-[8px] font-medium text-neutral-500 uppercase tracking-[0.2em]">
                  {inStock ? 'Available Edition' : 'Archive / Out of Stock'}
                </span>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="border-t border-b border-neutral-200/60 py-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Quantity</span>
                <div className="flex items-center border border-neutral-200 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-black transition-colors disabled:opacity-20"
                    disabled={!inStock || quantity <= 1}
                  >
                    <Minus size={10} />
                  </button>
                  <span className="w-10 text-center text-xs font-light tracking-wide">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-black transition-colors disabled:opacity-20"
                    disabled={!inStock || quantity >= product.stock_quantity}
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || isAdding}
                  className="flex-1 h-12 relative bg-neutral-950 text-white text-[10px] font-medium tracking-[0.25em] uppercase hover:bg-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-400 transition-all duration-300"
                >
                  {isAdding ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={12} className="animate-spin" /> Processing
                    </span>
                  ) : (
                    <span>{isItemInCart ? 'Update Quantity' : inStock ? 'Add to Bag' : 'Sold Out'}</span>
                  )}
                </button>
                
                {isItemInCart && (
                  <button
                    onClick={handleRemoveFromCart}
                    className="w-12 h-12 bg-white border border-neutral-200 text-neutral-400 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition-all"
                    title="Remove item"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                )}
                
                <button 
                  onClick={handleShare}
                  className="w-12 h-12 flex items-center justify-center border border-neutral-200 bg-white text-neutral-400 hover:text-black transition-colors"
                >
                  <Share2 size={14} strokeWidth={1.5} />
                </button>
              </div>
              
              {isItemInCart && (
                <p className="text-[9px] text-emerald-600 font-medium uppercase tracking-[0.2em] flex items-center gap-1.5 justify-center pt-2">
                  <Check size={10} strokeWidth={3} /> Curated inside your bag
                </p>
              )}
            </div>

            {/* Editorial Brand Details */}
            <div className="pt-8 space-y-6">
              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-900">The Details</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light tracking-wide">
                    {product.description}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={14} className="text-neutral-800 mt-0.5" strokeWidth={1} />
                  <div>
                    <h4 className="text-[9px] font-medium text-neutral-900 uppercase tracking-wider mb-0.5">Authenticity Guaranteed</h4>
                    <p className="text-[9px] text-neutral-400 font-light">{product.quality_tier || 'Premium'} Tier Specifications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck size={14} className="text-neutral-800 mt-0.5" strokeWidth={1} />
                  <div>
                    <h4 className="text-[9px] font-medium text-neutral-900 uppercase tracking-wider mb-0.5">Premium Transit</h4>
                    <p className="text-[9px] text-neutral-400 font-light">Insured Climate-Safe Delivery</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating Sticky Mobile Console */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-neutral-100 p-4 z-50 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="text-[8px] font-medium text-neutral-400 uppercase tracking-wider">Estimated Value</span>
          <span className="text-sm font-light text-neutral-950">₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          className="w-40 h-10 bg-neutral-950 text-white text-[9px] font-medium uppercase tracking-[0.25em] flex items-center justify-center disabled:opacity-40"
        >
          {isAdding ? <Loader2 size={12} className="animate-spin" /> : isItemInCart ? 'Update Bag' : 'Add to Bag'}
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;