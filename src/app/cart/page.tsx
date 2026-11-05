"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, User, Phone, MapPin, Mail } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useServiceCart } from "@/contexts/ServiceCartContext";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { 
    items: serviceItems, 
    removeService, 
    clearVendorServices, 
    getGroupedByVendor 
  } = useServiceCart();
  const router = useRouter();

  const [activeCartTab, setActiveCartTab] = useState<'product' | 'service'>('product');

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    mobile: '',
    email: '',
    address: ''
  });
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = items.reduce((total, item) => total + ((item.originalPrice || item.price) - item.price) * item.quantity, 0);
  const total = getTotalPrice();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.mobile || !customerInfo.email || !customerInfo.address) {
      alert('Please fill in all required fields');
      return;
    }
    // Here you would typically send the order to your backend
    alert('Order placed successfully!');
  };

  const groupedServiceItems = getGroupedByVendor();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
    
      {/* Cart Title */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft size={18} className="mr-1" />
              Continue Shopping
            </Link>

            {/* Cart Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveCartTab('product')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeCartTab === 'product'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Product Cart ({items.length})
              </button>
              <button
                onClick={() => setActiveCartTab('service')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeCartTab === 'service'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Service Cart ({serviceItems.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeCartTab === 'product' ? (
          items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your product cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <Link 
                href="/mall"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Shop Products
              </Link>
            </div>
          ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        {item.isPackage && (
                          <div className="mb-1.5 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                            <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Combo Package
                            </span>
                            {item.vendorName && (
                              <span className="text-xs text-gray-500 font-light">
                                by {item.vendorName.trim()}
                              </span>
                            )}
                          </div>
                        )}
                        <h3 className="text-base md:text-lg font-medium text-gray-900">{item.name}</h3>
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <div className="flex items-center justify-center sm:justify-start space-x-2">
                            <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                            {item.originalPrice && <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>}
                          </div>
                          <span className="text-sm text-green-600 font-medium">
                            {item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0}% OFF
                          </span>
                        </div>

                        {item.isPackage && item.bundledItems && item.bundledItems.length > 0 && (
                          <div className="mt-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-left">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                              Package Includes:
                            </p>
                            <div className="space-y-1">
                              {item.bundledItems.map((child, cIdx) => (
                                <div key={cIdx} className="text-xs text-gray-600 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block flex-shrink-0" />
                                  <span>{child.quantity * item.quantity}x {child.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls and Total */}
                      <div className="flex items-center justify-between sm:justify-end space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 rounded-l-md"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-2 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 rounded-r-md"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Checkout Form */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowCheckoutForm(!showCheckoutForm)}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  {showCheckoutForm ? 'Hide Checkout Form' : 'Proceed to Checkout'}
                </button>
              </div>

              {/* Checkout Form */}
              {showCheckoutForm && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                  
                  <form className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <User size={16} className="inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone size={16} className="inline mr-2" />
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={customerInfo.mobile}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your mobile number"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Mail size={16} className="inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <MapPin size={16} className="inline mr-2" />
                        Delivery Address *
                      </label>
                      <textarea
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your complete delivery address"
                        required
                      />
                    </div>

                    {/* Place Order Button */}
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
                    >
                      Place Order - ₹{total}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )) : (
          /* Service Cart Tab Content */
          serviceItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your service cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any services to book yet.</p>
              <Link 
                href="/services"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-6 lg:max-w-4xl lg:mx-auto">
              {groupedServiceItems.map((group) => (
                <div key={group.vendor_id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Vendor Header */}
                  <div className="bg-gray-50 flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border bg-white">
                        <Image 
                          src={group.vendor_image} 
                          alt={group.vendor_name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{group.vendor_name}</h3>
                    </div>
                    <button 
                      onClick={() => clearVendorServices(group.vendor_id)}
                      className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Clear Vendor</span>
                    </button>
                  </div>

                  {/* Services List */}
                  <div className="p-4 space-y-4">
                    {group.services.map((service) => (
                      <div key={service.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm relative space-y-3">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative w-full sm:w-24 h-40 sm:h-24 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                            <Image src={service.image} alt={service.name} fill className="object-cover" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            {service.isPackage && (
                              <div className="mb-1">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  Service Combo Package
                                </span>
                              </div>
                            )}
                            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1">{service.name}</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold text-blue-600">₹{service.price}</p>
                              {service.originalPrice && service.originalPrice > service.price && (
                                <p className="text-sm text-gray-400 line-through">₹{service.originalPrice}</p>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => removeService(service.id)}
                            className="absolute sm:relative top-2 right-2 sm:top-auto sm:right-auto text-gray-400 hover:text-red-500 p-2 sm:self-center bg-white/80 rounded-full"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {service.isPackage && service.bundledServices && service.bundledServices.length > 0 && (
                          <div className="pt-2 border-t border-gray-100 bg-gray-50/70 p-2.5 rounded-lg text-xs">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                              Package Services Included:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {service.bundledServices.map((child, cIdx) => (
                                <div key={cIdx} className="flex items-center justify-between text-gray-700 bg-white p-2 rounded border border-gray-100">
                                  <span className="font-medium">• {child.name}</span>
                                  {child.duration_minutes && (
                                    <span className="text-gray-400 text-[11px]">{child.duration_minutes} mins</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Vendor Footer (Booking) */}
                  <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total for this vendor</p>
                      <p className="text-2xl font-bold text-gray-900">₹{group.totalPrice}</p>
                    </div>
                    <button
                      onClick={() => {
                        const serviceIds = JSON.stringify(
                          group.services.flatMap(s => (s.isPackage && s.serviceIds ? s.serviceIds : [s.id]))
                        );
                        router.push(`/select-slot?vendorId=${group.vendor_id}&serviceIds=${serviceIds}`);
                      }}
                      className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
