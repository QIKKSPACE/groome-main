"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProductOrdersProps {
  orders?: any[];
  loading?: boolean;
}

export const ProductOrders: React.FC<ProductOrdersProps> = ({ orders = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
        <p className="text-sm">Loading your orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
          No Orders yet
        </h3>
        <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto mb-6">
          You haven&apos;t placed any product orders yet. Browse our store to discover grooming products tailored for you.
        </p>
        <Link href="/shop">
          <Button className="px-6 py-2.5 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, idx) => (
        <div
          key={order?.id || idx}
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between"
        >
          <div>
            <p className="font-medium text-gray-900">{order?.name || `Order #${order?.id}`}</p>
            <p className="text-xs text-gray-500">{order?.date || "Recent Order"}</p>
          </div>
          <span className="text-sm font-semibold text-gray-700">₹{order?.total || 0}</span>
        </div>
      ))}
    </div>
  );
};

export const productorders = ProductOrders;
export default ProductOrders;
