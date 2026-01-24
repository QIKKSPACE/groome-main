import { Product } from './types';

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Hair Oil",
    image: "/assest/sliderassest/salon.jpg",
    description: "Natural hair oil with coconut and almond extracts for healthy hair growth and nourishment. This premium blend contains essential vitamins and minerals that strengthen hair follicles and prevent breakage.",
    price: "₹299",
    originalPrice: "₹399",
    rating: 4.8,
    reviews: 120,
    inStock: true,
    category: "Beauty & Personal Care",
    brand: "Orchids Premium",
    specifications: {
      "Volume": "200ml",
      "Type": "Hair Oil",
      "Ingredients": "Coconut Oil, Almond Oil, Vitamin E",
      "Suitable For": "All Hair Types",
      "Packaging": "Glass Bottle"
    },
    features: [
      "100% Natural Ingredients",
      "Promotes Hair Growth",
      "Reduces Hair Fall",
      "Adds Natural Shine",
      "No Harmful Chemicals"
    ],
    images: [
      "/assest/sliderassest/salon.jpg"
    ],
    availability: "In Stock",
    shipping: "Free shipping on orders above ₹499",
    warranty: "30 days money back guarantee"
  },
  {
    id: 2,
    name: "Professional Paint Brush Set",
    image: "/assest/sliderassest/painting.jpg",
    description: "High-quality paint brushes for professional and DIY painting projects. Made with premium synthetic bristles for smooth application and excellent coverage.",
    price: "₹599",
    originalPrice: "₹799",
    rating: 4.9,
    reviews: 95,
    inStock: true,
    category: "Home & Garden",
    brand: "ProTools",
    specifications: {
      "Set Includes": "5 Different Brush Sizes",
      "Bristle Type": "Synthetic",
      "Handle Material": "Wooden",
      "Sizes": "1/2 inch, 1 inch, 2 inch, 3 inch, 4 inch",
      "Packaging": "Carrying Case"
    },
    features: [
      "Professional Grade Quality",
      "Smooth Paint Application",
      "Easy to Clean",
      "Durable Construction",
      "Comfortable Grip"
    ],
    images: [
      "/assest/sliderassest/painting.jpg"
    ],
    availability: "In Stock",
    shipping: "Free shipping on orders above ₹499",
    warranty: "1 year manufacturer warranty"
  },
  {
    id: 3,
    name: "AC Filter Replacement",
    image: "/assest/sliderassest/repairman-doing-air-conditioner-service.jpg",
    description: "High-efficiency AC air filter for better air quality and improved cooling performance. Compatible with most AC brands and models.",
    price: "₹199",
    originalPrice: "₹299",
    rating: 4.7,
    reviews: 150,
    inStock: true,
    category: "Home Appliances",
    brand: "CoolAir",
    specifications: {
      "Filter Type": "HEPA Filter",
      "Dimensions": "12 x 12 x 1 inches",
      "Compatibility": "Most AC Brands",
      "Material": "Synthetic Fiber",
      "Packaging": "Individual Pack"
    },
    features: [
      "High Efficiency Filtration",
      "Easy Installation",
      "Improves Air Quality",
      "Reduces Allergens",
      "Energy Efficient"
    ],
    images: [
      "/assest/sliderassest/repairman-doing-air-conditioner-service.jpg"
    ],
    availability: "In Stock",
    shipping: "Free shipping on orders above ₹299",
    warranty: "6 months manufacturer warranty"
  },
  {
    id: 4,
    name: "Beauty Kit Combo",
    image: "/assest/sliderassest/salon.jpg",
    description: "Complete beauty kit with makeup essentials and professional tools. Perfect for beginners and professionals alike.",
    price: "₹899",
    originalPrice: "₹1299",
    rating: 4.6,
    reviews: 80,
    inStock: false,
    category: "Beauty & Personal Care",
    brand: "Glamour Pro",
    specifications: {
      "Kit Contents": "15 Professional Tools",
      "Case Material": "Premium Leather",
      "Tools Included": "Brushes, Sponges, Tweezers",
      "Makeup Items": "Foundation, Lipstick, Eyeshadow",
      "Packaging": "Gift Box"
    },
    features: [
      "Professional Quality Tools",
      "Complete Makeup Set",
      "Portable Case",
      "Beginner Friendly",
      "Premium Materials"
    ],
    images: [
      "/assest/sliderassest/salon.jpg"
    ],
    availability: "Out of Stock",
    shipping: "Free shipping on orders above ₹499",
    warranty: "30 days money back guarantee"
  },
  {
    id: 5,
    name: "Cleaning Supplies Pack",
    image: "/assest/sliderassest/painting.jpg",
    description: "Professional cleaning supplies for home and office. Includes all essential cleaning products for a spotless environment.",
    price: "₹499",
    originalPrice: "₹699",
    rating: 4.5,
    reviews: 200,
    inStock: true,
    category: "Home & Garden",
    brand: "CleanPro",
    specifications: {
      "Pack Contents": "8 Cleaning Products",
      "Volume": "Various Sizes",
      "Type": "Multi-Surface Cleaners",
      "Packaging": "Eco-Friendly",
      "Shelf Life": "2 Years"
    },
    features: [
      "Multi-Surface Cleaning",
      "Eco-Friendly Formula",
      "Long Lasting",
      "Easy to Use",
      "Professional Grade"
    ],
    images: [
      "/assest/sliderassest/painting.jpg"
    ],
    availability: "In Stock",
    shipping: "Free shipping on orders above ₹399",
    warranty: "30 days money back guarantee"
  },
  {
    id: 6,
    name: "Plumbing Tool Kit",
    image: "/assest/sliderassest/repairman-doing-air-conditioner-service.jpg",
    description: "Essential plumbing tools for home repairs and maintenance. Professional grade tools for DIY enthusiasts and professionals.",
    price: "₹799",
    originalPrice: "₹999",
    rating: 4.8,
    reviews: 75,
    inStock: true,
    category: "Tools & Hardware",
    brand: "FixIt Pro",
    specifications: {
      "Tool Count": "12 Professional Tools",
      "Case Material": "Heavy Duty Plastic",
      "Tools Included": "Wrenches, Pliers, Cutters",
      "Weight": "2.5 kg",
      "Packaging": "Toolbox"
    },
    features: [
      "Professional Grade Tools",
      "Durable Construction",
      "Complete Tool Set",
      "Easy Storage",
      "Long Lasting"
    ],
    images: [
      "/assest/sliderassest/repairman-doing-air-conditioner-service.jpg"
    ],
    availability: "In Stock",
    shipping: "Free shipping on orders above ₹499",
    warranty: "2 years manufacturer warranty"
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
