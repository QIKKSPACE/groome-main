"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Clock, Phone, ShoppingCart, Heart, Share2, ShoppingBag } from 'lucide-react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

// Mock store data - in real app, this would come from API
const storeData = {
  id: 1,
  name: "Fashion Hub",
  category: "Fashion & Clothing",
  rating: 4.8,
  image: "/assest/icons/salonicon.jpeg",
  description: "Latest fashion trends and designer clothing with premium quality materials and modern designs.",
  location: "Ground Floor, Block A",
  email: "fashionhub@email.com",
  timings: "10:00 AM - 10:00 PM",
  phone: "+91 98765 43210",
  foundedYear: "2018",
  followers: "12.5K",
  isOpen: true
};

const products = [
  {
    id: 1,
    name: "Premium Designer T-Shirt",
    price: 1299,
    originalPrice: 1999,
    image: "/assest/icons/salonicon.jpeg",
    description: "100% premium cotton designer t-shirt with modern fit and stylish graphics.",
    category: "T-Shirts",
    rating: 4.8,
    reviews: 247,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Blue", "Green"]
  },
  {
    id: 2,
    name: "Elegant Summer Dress",
    price: 2499,
    originalPrice: 3599,
    image: "/assest/icons/makeup.jpeg",
    description: "Beautiful summer dress with floral pattern, perfect for casual and formal occasions.",
    category: "Dresses",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: ["Pink", "Blue", "Yellow"]
  },
  {
    id: 3,
    name: "Denim Jeans Collection",
    price: 1799,
    originalPrice: 2499,
    image: "/assest/icons/spa.jpeg",
    description: "Classic denim jeans with comfortable fit and durable material.",
    category: "Jeans",
    rating: 4.7,
    reviews: 189,
    inStock: true,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black"]
  },
  {
    id: 4,
    name: "Casual Sneakers",
    price: 3999,
    originalPrice: 5999,
    image: "/assest/icons/homemakeover.jpeg",
    description: "Comfortable sneakers with modern design and excellent grip.",
    category: "Footwear",
    rating: 4.6,
    reviews: 203,
    inStock: false,
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["White", "Black"]
  },
  {
    id: 5,
    name: "Winter Jacket",
    price: 5499,
    originalPrice: 7999,
    image: "/assest/icons/men-massage.jpeg",
    description: "Warm winter jacket with waterproof material and stylish design.",
    category: "Outerwear",
    rating: 4.8,
    reviews: 134,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Black", "Brown"]
  },
  {
    id: 6,
    name: "Hoodie Sweatshirt",
    price: 1999,
    originalPrice: 2999,
    image: "/assest/icons/plumber.jpeg",
    description: "Cozy hoodie sweatshirt perfect for any season with comfortable fit.",
    category: "Sweatshirts",
    rating: 4.5,
    reviews: 178,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Black", "White"]
  }
];

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const addToCart = () => {
    // Add to cart functionality would go here
    if (selectedProduct) {
      alert(`Added ${quantity} x ${selectedProduct.name} to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
     
      
      {/* Store Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/mall"
              className="flex items-center gap-2 hover:text-blue-200 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Mall
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Store Image */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-white shadow-lg">
              <Image
                src={storeData.image}
                alt={storeData.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Store Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{storeData.name}</h1>
                  <p className="text-blue-100 mb-4">{storeData.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{storeData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span className={`${storeData.isOpen ? 'text-green-300' : 'text-red-300'} font-medium`}>
                    {storeData.isOpen ? 'Open Now' : 'Closed'} - {storeData.timings}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Store Details & Map */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Store Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Store Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Founded</label>
                  <p className="text-gray-800">{storeData.foundedYear}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-gray-800">{storeData.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-800">{storeData.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{storeData.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Products */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Products ({products.length})</h2>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-md">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
