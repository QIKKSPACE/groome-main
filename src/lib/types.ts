export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category?: string;
  brand?: string;
  specifications?: {
    [key: string]: string;
  };
  features?: string[];
  images?: string[];
  availability?: string;
  shipping?: string;
  warranty?: string;
}

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  inStock: boolean;
}
