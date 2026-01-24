export interface Service {
  id: number;
  name: string;
  image: string;
  description?: string;
  price?: string;
  rating?: number;
  reviews?: number;
  category: string;
  location?: string;
  availability?: string;
  duration?: string;
  features?: string[];
  images?: string[];
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
}

export interface BookingSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  price?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  services: Service[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "female-salons",
    title: "Book Appointment For Female Saloons",
    services: [
      { 
        id: 1, 
        name: "Sunrise Spa And Salon", 
        image: "/assest/icons/salonicon.jpeg",
        description: "Premium beauty services for women with state-of-the-art facilities and experienced professionals. We offer a wide range of treatments including facials, hair styling, makeup, and spa services.",
        category: "female-salons",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "60-90 minutes",
        features: [
          "Professional Hair Styling",
          "Facial Treatments",
          "Makeup Services",
          "Spa & Wellness",
          "Bridal Packages",
          "Skin Care Consultation"
        ],
        images: [
          "/assest/icons/salonicon.jpeg",
          "/assest/icons/makeup.jpeg",
          "/assest/icons/spa.jpeg"
        ],
        address: "123 Connaught Place, New Delhi, 110001",
        phone: "+91 98765 43210",
        email: "info@sunrisesalon.com",
        workingHours: "9:00 AM - 9:00 PM (Mon-Sun)"
      },
      { 
        id: 2, 
        name: "Equinox Beauty Parlor", 
        image: "/assest/icons/salon-prime.jpeg",
        description: "Complete beauty solutions and spa treatments with modern equipment and skilled professionals.",
        category: "female-salons",
        location: "Mumbai",
        availability: "Available Today",
        duration: "45-75 minutes"
      },
      { 
        id: 3, 
        name: "Sri Manisha", 
        image: "/assest/icons/hair-studio.jpeg",
        description: "Traditional and modern beauty services combining age-old techniques with contemporary methods.",
        category: "female-salons",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "60-90 minutes"
      },
      { 
        id: 4, 
        name: "Hilite Salon And Spa", 
        image: "/assest/icons/spa.jpeg",
        description: "Luxury spa and salon services for the ultimate relaxation and beauty experience.",
        category: "female-salons",
        location: "Pune",
        availability: "Available Today",
        duration: "90-120 minutes"
      },
      { 
        id: 5, 
        name: "V2 Ladies Salon", 
        image: "/assest/icons/salonicon.jpeg",
        description: "Modern beauty treatments and styling with the latest trends and techniques.",
        category: "female-salons",
        location: "Chennai",
        availability: "Available Today",
        duration: "45-90 minutes"
      },
      { 
        id: 6, 
        name: "Glamour Studio", 
        image: "/assest/icons/makeup.jpeg",
        description: "Professional makeup and beauty services for special occasions and daily grooming.",
        category: "female-salons",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "60-120 minutes"
      },
      { 
        id: 7, 
        name: "Beauty Haven", 
        image: "/assest/icons/salon-prime.jpeg",
        description: "Complete beauty and wellness center offering comprehensive beauty solutions.",
        category: "female-salons",
        location: "Kolkata",
        availability: "Available Today",
        duration: "75-105 minutes"
      },
      { 
        id: 8, 
        name: "Elite Beauty Lounge", 
        image: "/assest/icons/spa.jpeg",
        description: "Premium beauty treatments and spa services in a luxurious environment.",
        category: "female-salons",
        location: "Ahmedabad",
        availability: "Available Today",
        duration: "90-150 minutes"
      }
    ]
  },
  {
    id: "male-salons",
    title: "Book Appointment For Male Saloons",
    services: [
      { 
        id: 9, 
        name: "The Jawed Habib", 
        image: "/assest/icons/men-massage.jpeg",
        description: "Professional grooming services for men with expert stylists and modern techniques.",
        category: "male-salons",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "30-60 minutes"
      },
      { 
        id: 10, 
        name: "Rossano Ferretti", 
        image: "/assest/icons/men-massage.jpeg",
        description: "Luxury men's grooming and styling with international standards and premium products.",
        category: "male-salons",
        location: "Mumbai",
        availability: "Available Today",
        duration: "45-90 minutes"
      },
      { 
        id: 11, 
        name: "Naturals Salons", 
        image: "/assest/icons/men-massage.jpeg",
        description: "Natural grooming solutions for men using organic and chemical-free products.",
        category: "male-salons",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "30-75 minutes"
      },
      { 
        id: 12, 
        name: "Men's Grooming Studio", 
        image: "/assest/icons/men-massage.jpeg",
        description: "Complete men's grooming services with personalized attention and care.",
        category: "male-salons",
        location: "Pune",
        availability: "Available Today",
        duration: "45-90 minutes"
      },
      { 
        id: 13, 
        name: "Gentleman's Barber Shop", 
        image: "/assest/icons/men-massage.jpeg",
        description: "Classic barber services and styling with traditional techniques and modern tools.",
        category: "male-salons",
        location: "Chennai",
        availability: "Available Today",
        duration: "30-60 minutes"
      },
      { 
        id: 14, 
        name: "Urban Grooming", 
        image: "/assest/icons/men-massage.jpeg",
        description: "Modern men's grooming and wellness with contemporary styling and treatments.",
        category: "male-salons",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "45-75 minutes"
      },
      { 
        id: 15, 
        name: "The Grooming Co", 
        image: "/assest/icons/men-massage.jpeg",
        description: "Professional men's grooming services with attention to detail and quality.",
        category: "male-salons",
        location: "Kolkata",
        availability: "Available Today",
        duration: "30-90 minutes"
      },
      { 
        id: 16, 
        name: "Elite Men's Salon", 
        image: "/assest/icons/men-massage.jpeg",
        description: "Premium grooming and styling for men with luxury amenities and expert services.",
        category: "male-salons",
        location: "Ahmedabad",
        availability: "Available Today",
        duration: "60-120 minutes"
      }
    ]
  },
  {
    id: "paint",
    title: "Book Appointment For Paint",
    services: [
      { 
        id: 17, 
        name: "Interior Painting", 
        image: "/assest/icons/painting.jpeg",
        description: "Professional interior wall painting services with premium quality paints and expert application.",
        category: "paint",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "2-4 days"
      },
      { 
        id: 18, 
        name: "Exterior Painting", 
        image: "/assest/icons/painting.jpeg",
        description: "Exterior wall painting and weatherproofing with durable and weather-resistant paints.",
        category: "paint",
        location: "Mumbai",
        availability: "Available Today",
        duration: "3-5 days"
      },
      { 
        id: 19, 
        name: "Wall Makeover", 
        image: "/assest/icons/Revamp-Wall-Makeover.jpeg",
        description: "Complete wall transformation and design with creative solutions and modern techniques.",
        category: "paint",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "4-7 days"
      },
      { 
        id: 20, 
        name: "Waterproofing", 
        image: "/assest/icons/painting.jpeg",
        description: "Wall waterproofing and leak repair with advanced waterproofing solutions.",
        category: "paint",
        location: "Pune",
        availability: "Available Today",
        duration: "2-3 days"
      },
      { 
        id: 21, 
        name: "Color Consultation", 
        image: "/assest/icons/painting.jpeg",
        description: "Professional color selection and design advice for your home or office space.",
        category: "paint",
        location: "Chennai",
        availability: "Available Today",
        duration: "1-2 hours"
      },
      { 
        id: 22, 
        name: "Textured Painting", 
        image: "/assest/icons/painting.jpeg",
        description: "Special textured wall finishes and effects for unique and artistic wall designs.",
        category: "paint",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "3-6 days"
      },
      { 
        id: 23, 
        name: "Decorative Painting", 
        image: "/assest/icons/painting.jpeg",
        description: "Artistic and decorative wall painting with custom designs and patterns.",
        category: "paint",
        location: "Kolkata",
        availability: "Available Today",
        duration: "5-10 days"
      },
      { 
        id: 24, 
        name: "Commercial Painting", 
        image: "/assest/icons/painting.jpeg",
        description: "Office and commercial space painting with professional-grade materials and techniques.",
        category: "paint",
        location: "Ahmedabad",
        availability: "Available Today",
        duration: "7-14 days"
      }
    ]
  },
  {
    id: "ac-repair",
    title: "AC Repair & Service",
    services: [
      { 
        id: 25, 
        name: "AC Repair & Service", 
        image: "/assest/icons/acrepair.jpeg",
        description: "Professional AC repair and maintenance services with certified technicians and genuine parts.",
        category: "ac-repair",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "1-3 hours"
      },
      { 
        id: 26, 
        name: "AC Installation", 
        image: "/assest/icons/acrepair.jpeg",
        description: "Complete AC installation services with proper setup and testing for optimal performance.",
        category: "ac-repair",
        location: "Mumbai",
        availability: "Available Today",
        duration: "2-4 hours"
      },
      { 
        id: 27, 
        name: "AC Gas Filling", 
        image: "/assest/icons/acrepair.jpeg",
        description: "AC gas filling and leak detection services with high-quality refrigerant and proper testing.",
        category: "ac-repair",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "1-2 hours"
      },
      { 
        id: 28, 
        name: "AC Deep Cleaning", 
        image: "/assest/icons/acrepair.jpeg",
        description: "Comprehensive AC deep cleaning and sanitization for better air quality and efficiency.",
        category: "ac-repair",
        location: "Pune",
        availability: "Available Today",
        duration: "2-3 hours"
      },
      { 
        id: 29, 
        name: "AC Preventive Maintenance", 
        image: "/assest/icons/acrepair.jpeg",
        description: "Regular AC maintenance and servicing to prevent breakdowns and ensure optimal performance.",
        category: "ac-repair",
        location: "Chennai",
        availability: "Available Today",
        duration: "1-2 hours"
      },
      { 
        id: 30, 
        name: "AC Uninstallation", 
        image: "/assest/icons/acrepair.jpeg",
        description: "Safe AC uninstallation and removal services with proper disposal and cleanup.",
        category: "ac-repair",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "1-2 hours"
      }
    ]
  },
  {
    id: "plumbing",
    title: "Plumbing Services",
    services: [
      { 
        id: 31, 
        name: "Plumbing Repair", 
        image: "/assest/icons/plumber.jpeg",
        description: "Complete plumbing solutions and repairs with experienced plumbers and quality materials.",
        category: "plumbing",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "1-4 hours"
      },
      { 
        id: 32, 
        name: "Pipe Installation", 
        image: "/assest/icons/plumber.jpeg",
        description: "New pipe installation and replacement services with modern plumbing solutions.",
        category: "plumbing",
        location: "Mumbai",
        availability: "Available Today",
        duration: "2-6 hours"
      },
      { 
        id: 33, 
        name: "Bathroom Renovation", 
        image: "/assest/icons/bathroom.jpeg",
        description: "Complete bathroom renovation and plumbing services with modern fixtures and fittings.",
        category: "plumbing",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "3-7 days"
      },
      { 
        id: 34, 
        name: "Water Tank Cleaning", 
        image: "/assest/icons/plumber.jpeg",
        description: "Professional water tank cleaning and sanitization for clean and safe water supply.",
        category: "plumbing",
        location: "Pune",
        availability: "Available Today",
        duration: "2-4 hours"
      },
      { 
        id: 35, 
        name: "Leak Detection", 
        image: "/assest/icons/plumber.jpeg",
        description: "Advanced leak detection and repair services using modern equipment and techniques.",
        category: "plumbing",
        location: "Chennai",
        availability: "Available Today",
        duration: "1-3 hours"
      },
      { 
        id: 36, 
        name: "Drain Cleaning", 
        image: "/assest/icons/plumber.jpeg",
        description: "Professional drain cleaning and unclogging services for smooth water flow.",
        category: "plumbing",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "1-2 hours"
      }
    ]
  },
  {
    id: "electrical",
    title: "Electrical Services",
    services: [
      { 
        id: 37, 
        name: "Electrical Repair", 
        image: "/assest/icons/electric.jpeg",
        description: "Electrical repairs and installations with certified electricians and safety standards.",
        category: "electrical",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "1-3 hours"
      },
      { 
        id: 38, 
        name: "Wiring Installation", 
        image: "/assest/icons/electric.jpeg",
        description: "Complete electrical wiring installation and replacement with quality materials.",
        category: "electrical",
        location: "Mumbai",
        availability: "Available Today",
        duration: "4-8 hours"
      },
      { 
        id: 39, 
        name: "Switch & Socket Installation", 
        image: "/assest/icons/electric.jpeg",
        description: "Switch and socket installation services with modern electrical fittings.",
        category: "electrical",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "1-2 hours"
      },
      { 
        id: 40, 
        name: "Fan Installation", 
        image: "/assest/icons/electric.jpeg",
        description: "Ceiling fan installation and repair services with proper mounting and wiring.",
        category: "electrical",
        location: "Pune",
        availability: "Available Today",
        duration: "1-2 hours"
      },
      { 
        id: 41, 
        name: "Light Fixture Installation", 
        image: "/assest/icons/electric.jpeg",
        description: "Light fixture installation and repair services for modern and traditional lighting.",
        category: "electrical",
        location: "Chennai",
        availability: "Available Today",
        duration: "1-3 hours"
      },
      { 
        id: 42, 
        name: "Electrical Safety Check", 
        image: "/assest/icons/electric.jpeg",
        description: "Comprehensive electrical safety inspection and maintenance for your home or office.",
        category: "electrical",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "2-4 hours"
      }
    ]
  },
  {
    id: "carpentry",
    title: "Carpentry Services",
    services: [
      { 
        id: 43, 
        name: "Custom Furniture", 
        image: "/assest/icons/carpenter.jpeg",
        description: "Custom furniture and woodwork services with skilled carpenters and quality materials.",
        category: "carpentry",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "3-10 days"
      },
      { 
        id: 44, 
        name: "Furniture Repair", 
        image: "/assest/icons/carpenter.jpeg",
        description: "Professional furniture repair and restoration services for all types of wooden furniture.",
        category: "carpentry",
        location: "Mumbai",
        availability: "Available Today",
        duration: "1-3 days"
      },
      { 
        id: 45, 
        name: "Sofa Repair", 
        image: "/assest/icons/Sofa.jpeg",
        description: "Sofa repair and reupholstering services with modern fabrics and quality workmanship.",
        category: "carpentry",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "2-5 days"
      },
      { 
        id: 46, 
        name: "Door & Window Installation", 
        image: "/assest/icons/carpenter.jpeg",
        description: "Door and window installation services with proper fitting and finishing.",
        category: "carpentry",
        location: "Pune",
        availability: "Available Today",
        duration: "1-2 days"
      },
      { 
        id: 47, 
        name: "Kitchen Cabinet", 
        image: "/assest/icons/carpenter.jpeg",
        description: "Custom kitchen cabinet design and installation with modern storage solutions.",
        category: "carpentry",
        location: "Chennai",
        availability: "Available Today",
        duration: "5-15 days"
      },
      { 
        id: 48, 
        name: "Wardrobe Installation", 
        image: "/assest/icons/carpenter.jpeg",
        description: "Custom wardrobe design and installation with efficient storage and modern aesthetics.",
        category: "carpentry",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "3-7 days"
      }
    ]
  },
  {
    id: "cleaning",
    title: "Cleaning Services",
    services: [
      { 
        id: 49, 
        name: "Home Cleaning", 
        image: "/assest/icons/khichan-cleaning.jpeg",
        description: "Professional home and office cleaning services with eco-friendly products and trained staff.",
        category: "cleaning",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "2-6 hours"
      },
      { 
        id: 50, 
        name: "Deep Cleaning", 
        image: "/assest/icons/khichan-cleaning.jpeg",
        description: "Comprehensive deep cleaning services for thorough sanitization and hygiene.",
        category: "cleaning",
        location: "Mumbai",
        availability: "Available Today",
        duration: "4-8 hours"
      },
      { 
        id: 51, 
        name: "Office Cleaning", 
        image: "/assest/icons/khichan-cleaning.jpeg",
        description: "Professional office cleaning and maintenance services for a clean work environment.",
        category: "cleaning",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "2-4 hours"
      },
      { 
        id: 52, 
        name: "Post Construction Cleaning", 
        image: "/assest/icons/khichan-cleaning.jpeg",
        description: "Post-construction cleaning services for new homes and renovated spaces.",
        category: "cleaning",
        location: "Pune",
        availability: "Available Today",
        duration: "6-12 hours"
      },
      { 
        id: 53, 
        name: "Carpet Cleaning", 
        image: "/assest/icons/khichan-cleaning.jpeg",
        description: "Professional carpet cleaning and stain removal services with advanced equipment.",
        category: "cleaning",
        location: "Chennai",
        availability: "Available Today",
        duration: "2-4 hours"
      },
      { 
        id: 54, 
        name: "Window Cleaning", 
        image: "/assest/icons/khichan-cleaning.jpeg",
        description: "Window cleaning services for crystal clear views and sparkling clean windows.",
        category: "cleaning",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "1-3 hours"
      }
    ]
  },
  {
    id: "appliance-repair",
    title: "Appliance Repair",
    services: [
      { 
        id: 55, 
        name: "Washing Machine Repair", 
        image: "/assest/icons/washing-machine.jpeg",
        description: "Home appliance repair and maintenance services for washing machines with genuine parts.",
        category: "appliance-repair",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "1-3 hours"
      },
      { 
        id: 56, 
        name: "Refrigerator Repair", 
        image: "/assest/icons/frige.jpeg",
        description: "Refrigerator repair and maintenance services with expert technicians and quality service.",
        category: "appliance-repair",
        location: "Mumbai",
        availability: "Available Today",
        duration: "1-2 hours"
      },
      { 
        id: 57, 
        name: "Microwave Repair", 
        image: "/assest/icons/microwave.jpeg",
        description: "Microwave repair and maintenance services with proper diagnosis and quality repairs.",
        category: "appliance-repair",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "1-2 hours"
      },
      { 
        id: 58, 
        name: "Water Purifier Service", 
        image: "/assest/icons/Water-Purifier.jpeg",
        description: "Water purifier service and maintenance with filter replacement and sanitization.",
        category: "appliance-repair",
        location: "Pune",
        availability: "Available Today",
        duration: "1-2 hours"
      },
      { 
        id: 59, 
        name: "Geyser Repair", 
        image: "/assest/icons/electric.jpeg",
        description: "Geyser repair and maintenance services with safety checks and quality repairs.",
        category: "appliance-repair",
        location: "Chennai",
        availability: "Available Today",
        duration: "1-2 hours"
      },
      { 
        id: 60, 
        name: "RO Service", 
        image: "/assest/icons/Water-Purifier.jpeg",
        description: "RO water purifier service and maintenance with filter replacement and cleaning.",
        category: "appliance-repair",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "1-2 hours"
      }
    ]
  },
  {
    id: "home-makeover",
    title: "Home Makeover",
    services: [
      { 
        id: 61, 
        name: "Home Makeover", 
        image: "/assest/icons/homemakeover.jpeg",
        description: "Complete home makeover and renovation services with modern design and quality workmanship.",
        category: "home-makeover",
        location: "Delhi NCR",
        availability: "Available Today",
        duration: "15-30 days"
      },
      { 
        id: 62, 
        name: "Interior Design", 
        image: "/assest/icons/homemakeover.jpeg",
        description: "Professional interior design services with creative solutions and modern aesthetics.",
        category: "home-makeover",
        location: "Mumbai",
        availability: "Available Today",
        duration: "7-15 days"
      },
      { 
        id: 63, 
        name: "Space Planning", 
        image: "/assest/icons/homemakeover.jpeg",
        description: "Efficient space planning and optimization services for better utilization and aesthetics.",
        category: "home-makeover",
        location: "Bangalore",
        availability: "Available Tomorrow",
        duration: "3-7 days"
      },
      { 
        id: 64, 
        name: "Color Consultation", 
        image: "/assest/icons/homemakeover.jpeg",
        description: "Professional color consultation and design advice for your home transformation.",
        category: "home-makeover",
        location: "Pune",
        availability: "Available Today",
        duration: "1-2 days"
      },
      { 
        id: 65, 
        name: "Furniture Arrangement", 
        image: "/assest/icons/homemakeover.jpeg",
        description: "Furniture arrangement and space optimization services for better functionality and aesthetics.",
        category: "home-makeover",
        location: "Chennai",
        availability: "Available Today",
        duration: "1-2 days"
      },
      { 
        id: 66, 
        name: "Lighting Design", 
        image: "/assest/icons/homemakeover.jpeg",
        description: "Professional lighting design and installation services for ambient and functional lighting.",
        category: "home-makeover",
        location: "Hyderabad",
        availability: "Available Tomorrow",
        duration: "2-5 days"
      }
    ]
  }
];

export const getServicesByCategory = (categoryId: string): Service[] => {
  const category = serviceCategories.find(cat => cat.id === categoryId);
  return category ? category.services : [];
};

export const getCategoryById = (categoryId: string): ServiceCategory | undefined => {
  return serviceCategories.find(cat => cat.id === categoryId);
};

// Generate booking slots for the next 7 days
export const generateBookingSlots = (serviceId: number): BookingSlot[] => {
  const slots: BookingSlot[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const timeSlots = [
      { time: "09:00", available: Math.random() > 0.3 },
      { time: "10:00", available: Math.random() > 0.2 },
      { time: "11:00", available: Math.random() > 0.4 },
      { time: "12:00", available: Math.random() > 0.3 },
      { time: "14:00", available: Math.random() > 0.2 },
      { time: "15:00", available: Math.random() > 0.3 },
      { time: "16:00", available: Math.random() > 0.4 },
      { time: "17:00", available: Math.random() > 0.2 },
      { time: "18:00", available: Math.random() > 0.3 },
    ];
    
    timeSlots.forEach((slot, index) => {
      slots.push({
        id: `${serviceId}-${dateStr}-${slot.time}`,
        date: dateStr,
        time: slot.time,
        available: slot.available,
        price: "₹299"
      });
    });
  }
  
  return slots;
};

export const getServiceById = (serviceId: number): Service | undefined => {
  for (const category of serviceCategories) {
    const service = category.services.find(s => s.id === serviceId);
    if (service) return service;
  }
  return undefined;
};
