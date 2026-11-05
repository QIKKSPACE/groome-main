export interface MallProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  selling_price?: number;
  stock_quantity?: number;
  status?: string;
  listed_at?: string;
  image?: string;
}

export interface NearbyMall {
  id: string;
  business_name: string;
  profile_image?: string;
  address?: string;
  map_address?: string;
  pincode?: string;
  city?: string;
  state?: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  verified?: boolean;
  distance_km?: number;
  products?: MallProduct[];
}

export interface NearbyMallsResponse {
  success: boolean;
  count: number;
  radius_km: number;
  page: number;
  limit: number;
  malls: NearbyMall[];
}
