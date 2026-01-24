"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, MapPin, Clock, Phone, Star, ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

interface ShopDetailCardProps {
  shop: {
    id: number;
    name: string;
    category: string;
    rating: number;
    image: string;
    description: string;
    location: string;
    timings: string;
    phone: string;
    isOpen: boolean;
  };
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export const ShopDetailCard = ({ shop, products, isOpen, onClose }: ShopDetailCardProps) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [isMapsOpen, setIsMapsOpen] = useState(false);

  const openGoogleMaps = () => {
    setIsMapsOpen(true);
  };

  const closeMaps = () => {
    setIsMapsOpen(false);
  };

  const nextProduct = () => {
    setSelectedProductIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setSelectedProductIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (!isOpen) return null;

  const selectedProduct = products[selectedProductIndex];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white">
                <Image
                  src={shop.image}
                  alt={shop.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{shop.name}</h2>
                <p className="text-blue-100 mb-3">{shop.description}</p>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{shop.rating}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm">{shop.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span className="text-sm">{shop.timings}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Phone size={16} />
                    <span className="text-sm">{shop.phone}</span>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    shop.isOpen ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-[500px]">
            {/* Left Side - Products */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedProductIndex === products.indexOf(product)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => setSelectedProductIndex(products.indexOf(product))}
                  >
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.originalPrice && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-md">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                          product.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart size={16} className="inline mr-1" />
                        Add to Cart
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Selected Product Details */}
            <div className="w-1/3 bg-gray-50 p-6 border-l border-gray-200">
              <h3 className="text-xl font-bold mb-4">Product Details</h3>
              
              {selectedProduct && (
                <div className="space-y-6">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{selectedProduct.name}</h4>
                    <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Price:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-600">₹{selectedProduct.price}</span>
                          {selectedProduct.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₹{selectedProduct.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span>{selectedProduct.rating}</span>
                          <span className="text-gray-500">({selectedProduct.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Category:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {selectedProduct.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          selectedProduct.inStock 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={openGoogleMaps}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin size={20} />
                        Visit Shop Location
                      </button>
                      
                      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <Phone size={20} />
                        Contact Store
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {products.length > 1 && (
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={prevProduct}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedProductIndex + 1} / {products.length}
                  </span>
                  <button
                    onClick={nextProduct}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Modal */}
      {isMapsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-green-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">📍 {shop.name} Location</h3>
              <button
                onClick={closeMaps}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center text-gray-600">
                  <MapPin size={48} className="mx-auto mb-2" />
                  <p className="font-medium">Google Maps Integration</p>
                  <p className="text-sm">{shop.location}</p>
                  <iframe
                    src={`https://www.google.com/maps/embed?1&q=${encodeURIComponent(shop.location)}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  <span><strong>Address:</strong> {shop.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-green-600" />
                  <span><strong>Hours:</strong> {shop.timings}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-green-600" />
                  <span><strong>Phone:</strong> {shop.phone}</span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  Open in Google Maps
                </a>
                <button
                  onClick={closeMaps}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Sample products data for each shop
export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 8999,
    originalPrice: 12999,
    image: "/assest/icons/salonicon.jpeg",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    category: "Electronics",
    rating: 4.8,
    reviews: 1247,
    inStock: true
  },
  {
    id: 2,
    name: "Designer T-Shirt Collection",
    price: 1299,
    originalPrice: 1999,
    image: "/assest/icons/makeup.jpeg",
    description: "Comfortable cotton t-shirts with modern designs and perfect fit.",
    category: "Fashion",
    rating: 4.6,
    reviews: 892,
    inStock: true
  },
  {
    id: 3,
    name: "Beauty Essentials Kit",
    price: 2499,
    image: "/assest/icons/spa.jpeg",
    description: "Complete beauty kit with skincare products and cosmetic items.",
    category: "Beauty",
    rating: 4.9,
    reviews: 567,
    inStock: false
  },
  {
    id: 4,
    name: "Home Decor Vase",
    price: 799,
    originalPrice: 1199,
    image: "/assest/icons/homemakeover.jpeg",
    description: "Elegant ceramic vase perfect for home decoration and flower arrangements.",
    category: "Home",
    rating: 4.7,
    reviews: 234,
    inStock: true
  },
  {
    id: 5,
    name: "Sports Training Shoes",
    price: 3999,
    originalPrice: 5999,
    image: "/assest/icons/men-massage.jpeg",
    description: "Professional sports shoes with advanced cushioning and support technology.",
    category: "Sports",
    rating: 4.5,
    reviews: 445,
    inStock: true
  },
  {
    id: 6,
    name: "Best Seller Book Set",
    price: 599,
    originalPrice: 899,
    image: "/assest/icons/plumber.jpeg",
    description: "Collection of bestselling books from various genres and authors.",
    category: "Books",
    rating: 4.8,
    reviews: 324,
    inStock: true
  }
];
