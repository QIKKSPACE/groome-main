"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: string | null;
}

interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
}

interface Product {
  id: string;
  name: string;
  price: string;
  selling_price: string;
  description: string;
  images: ProductImage[];
  stock_quantity: number;
}

export default function ProductCategoryPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loadingSubs, setLoadingSubs] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const BACKEND_URL = "https://api.thegroome.com";

  // Handle Share functionality
  const handleShare = async (productId: string) => {
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

  // 1️⃣ Fetch subcategories
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        setLoadingSubs(true);
        const res = await fetch(`${BACKEND_URL}/categories/${id}/subcategories`);
        const data = await res.json();
        setSubcategories(data || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoadingSubs(false);
      }
    };

    if (id) fetchSubs();
  }, [id]);

  // 2️⃣ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const url = new URL(`${BACKEND_URL}/products`);

        url.searchParams.append("categoryId", String(id));
        if (selectedSub) url.searchParams.append("subcategoryId", selectedSub);
        url.searchParams.append("page", String(page));

        const res = await fetch(url.toString());
        const data = await res.json();

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (id) fetchProducts();
  }, [id, selectedSub, page]);

  const hasSubcategories = subcategories.length > 0;

  // 🔄 Recursive Tree Renderer for N-Level Categories Filter UI
  const renderSubcategoryTree = (parentId: string | null = null, depth = 0): React.ReactNode[] => {
    const children = subcategories.filter(sub => {
      if (parentId === null) {
        // Top-level children under the root category: parent_id matches page `id` or is null/empty
        return !sub.parent_id || sub.parent_id === String(id);
      }
      return sub.parent_id === parentId;
    });

    let items: React.ReactNode[] = [];

    children.forEach((sub) => {
      const isSelected = selectedSub === sub.id;

      items.push(
        <button
          key={sub.id}
          onClick={() => {
            setSelectedSub(sub.id);
            setPage(1);
            setMobileOpen(false);
          }}
          style={{ paddingLeft: `${1 + depth * 1}rem` }}
          className={`w-full text-left py-2.5 pr-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-1.5 ${
            isSelected
              ? "bg-slate-950 text-white shadow-md shadow-slate-950/10"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          {depth > 0 && (
            <span className={isSelected ? "text-slate-400 font-mono text-xs" : "text-slate-300 font-mono text-xs"}>
              └─
            </span>
          )}
          <span className="truncate">{sub.name}</span>
        </button>
      );

      // Recursively append children nodes at depth + 1
      items = items.concat(renderSubcategoryTree(sub.id, depth + 1));
    });

    return items;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
      
      {/* 📱 Mobile Top Header & Filter Button */}
      {hasSubcategories && (
        <div className="md:hidden flex items-center justify-between bg-white px-5 py-4 border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <span className="font-semibold text-slate-900 tracking-wide">Explore</span>
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-sm font-medium hover:bg-slate-900 transition-all duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            Filters
          </button>
        </div>
      )}

      {/* 🧭 Sidebar (Desktop Layout) */}
      <aside className="hidden md:block w-72 bg-white border-r border-slate-200 p-6 space-y-6 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-5">Categories</h2>
          
          {loadingSubs ? (
            <div className="space-y-2 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-11 bg-slate-100 rounded-xl w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => { setSelectedSub(null); setPage(1); }}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  !selectedSub 
                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/10" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                All Products
              </button>

              {/* N-Level Tree Rendering */}
              {renderSubcategoryTree(null, 0)}
            </div>
          )}
        </div>
      </aside>

      {/* 📱 Mobile Slide-over Drawer */}
      {mobileOpen && hasSubcategories && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="w-80 bg-white h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 tracking-wide">Sub Categories</h2>
                  <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => { setSelectedSub(null); setMobileOpen(false); setPage(1); }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                      !selectedSub ? "bg-slate-950 text-white" : "text-slate-600 bg-slate-50"
                    }`}
                  >
                    All Products
                  </button>

                  {/* N-Level Tree Rendering for Mobile */}
                  {renderSubcategoryTree(null, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📦 Products View Grid Layout */}
      <main className="flex-1 p-5 md:p-10 flex flex-col justify-between max-w-7xl mx-auto w-full mb-30">
        <div>
          {loadingProducts ? (
            /* 🌀 Premium Tall Skeleton Loader Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4 animate-pulse">
                  <div className="bg-slate-100 rounded-xl aspect-[2/3] w-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-5 bg-slate-100 rounded w-2/3" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* 📭 Empty State View */
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-5 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No products found</h3>
              <p className="text-sm text-slate-500">We couldn't find any products in this specific filter selection.</p>
            </div>
          ) : (
            /* 🛍️ Dynamic High-End Product Cards Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => {
                const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
                const imageSrc = primaryImage?.image_url 
                  ? `${BACKEND_URL}${primaryImage.image_url}` 
                  : "/placeholder.png";

                const originalPrice = parseFloat(product.price);
                const salesPrice = parseFloat(product.selling_price);
                const discount = originalPrice > salesPrice 
                  ? Math.round(((originalPrice - salesPrice) / originalPrice) * 100) 
                  : 0;

                return (
                  <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer block"
                  >
                    {/* TALL EDITORIAL IMAGE WRAPPER (Aspect 2/3) */}
                    <div className="relative aspect-[2/3] w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* 🔗 Premium Dynamic Share/Referral Button overlay */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleShare(product.id);
                        }}
                        className="absolute top-4 right-4 z-10 flex items-center justify-center p-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-black hover:bg-white shadow-md transition-all duration-200"
                        title="Share Referral Link"
                      >
                        {copiedId === product.id ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-emerald-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Premium Metadata & Content Section */}
                    <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest truncate">
                            {product.description || "Apparel"}
                          </p>
                          {user?.affiliate_code && (
                            <span className="text-[9px] font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded">
                              Earn Option Active
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-medium text-slate-800 line-clamp-2 leading-snug group-hover:text-black transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      {/* Unified Pricing Block with Sophisticated Tagging */}
                      <div className="flex items-center flex-wrap gap-2.5 mt-4 pt-3 border-t border-slate-50">
                        <span className="text-lg font-bold text-slate-950">
                          ₹{salesPrice.toLocaleString("en-IN")}
                        </span>
                        {discount > 0 && (
                          <>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{originalPrice.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md tracking-wide">
                              ({discount}% OFF)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 📄 Balanced Responsive Pagination Control Wrapper */}
        {totalPages > 1 && !loadingProducts && (
          <div className="flex items-center justify-between border-t border-slate-200 mt-16 pt-6">
            <button
              disabled={page === 1}
              onClick={() => { setPage(p => Math.max(p - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white shadow-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Previous
            </button>

            <span className="text-sm font-medium text-slate-500">
              Page <span className="text-slate-900 font-semibold">{page}</span> of <span className="text-slate-900 font-semibold">{totalPages}</span>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => { setPage(p => Math.min(p + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white shadow-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}