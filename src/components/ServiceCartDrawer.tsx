"use client";

import React from "react";
import { useServiceCart } from "@/contexts/ServiceCartContext";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ServiceCartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, removeService, clearVendorServices, getGroupedByVendor } = useServiceCart();
  const router = useRouter();

  const groupedItems = getGroupedByVendor();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Service Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {groupedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Your service cart is empty</p>
              <p className="text-sm mt-1">Add some services to book appointments.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedItems.map((group) => (
                <div key={group.vendor_id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
                  {/* Vendor Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-white">
                        <Image 
                          src={group.vendor_image} 
                          alt={group.vendor_name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-800">{group.vendor_name}</h3>
                    </div>
                    <button 
                      onClick={() => clearVendorServices(group.vendor_id)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      title="Clear this vendor's services"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Services List */}
                  <div className="space-y-3">
                    {group.services.map((service) => (
                      <div key={service.id} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image src={service.image} alt={service.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{service.name}</h4>
                          <p className="text-sm font-bold text-blue-600 mt-1">₹{service.price}</p>
                        </div>
                        <button 
                          onClick={() => removeService(service.id)}
                          className="text-gray-400 hover:text-red-500 self-start p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Vendor Footer (Booking) */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total for this vendor</p>
                      <p className="text-lg font-bold text-gray-900">₹{group.totalPrice}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        const serviceIds = JSON.stringify(group.services.map(s => s.id));
                        router.push(`/select-slot?vendorId=${group.vendor_id}&serviceIds=${serviceIds}`);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceCartDrawer;
