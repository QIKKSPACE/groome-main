"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BundledProductItem {
  id: string;
  name: string;
  image: string;
  price: number;
  selling_price?: number;
  quantity: number;
}

export interface CartItem {
  id: number | string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  inStock: boolean;
  isPackage?: boolean;
  packageId?: string;
  packageType?: string;
  vendorName?: string;
  bundledItems?: BundledProductItem[];
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: (Omit<CartItem, 'quantity'> & { quantity?: number }) | CartItem) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: (Omit<CartItem, 'quantity'> & { quantity?: number }) | CartItem) => {
    const qtyToAdd = (item as any).quantity && (item as any).quantity > 0 ? (item as any).quantity : 1;
    setItems(prevItems => {
      const existingItem = prevItems.find(cartItem => String(cartItem.id) === String(item.id));
      if (existingItem) {
        return prevItems.map(cartItem =>
          String(cartItem.id) === String(item.id)
            ? { ...cartItem, quantity: cartItem.quantity + qtyToAdd }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: qtyToAdd }];
      }
    });
  };

  const removeFromCart = (id: number | string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
