import React from 'react';
import Image from 'next/image';

const services = [
  {
    id: 1,
    name: "Women's Salon & Spa",
    icon: "/assest/icons/salonicon.jpeg",
    description: "Beauty and wellness services"
  },
  {
    id: 2,
    name: "Men's Salon & Massage",
    icon: "/assest/icons/spa.jpeg",
    description: "Grooming and relaxation services"
  },
  {
    id: 3,
    name: "AC & Appliance Repair",
    icon: "/assest/icons/acrepair.jpeg",
    description: "Air conditioning and appliance maintenance"
  },
  {
    id: 4,
    name: "Cleaning & Pest Control",
    icon: "/assest/icons/Revamp-Wall-Makeover.jpeg",
    description: "Home cleaning and pest management"
  },
  {
    id: 5,
    name: "Electrician, Plumber & Carpenter",
    icon: "/assest/icons/plumber.jpeg",
    description: "Professional repair services"
  },
  {
    id: 6,
    name: "Native Water Purifier",
    icon: "/assest/icons/Water-Purifier.jpeg",
    description: "Water purification solutions"
  },
  {
    id: 7,
    name: "Painting & Waterproofing",
    icon: "/assest/icons/painting.jpeg",
    description: "Interior and exterior painting"
  },
  {
    id: 8,
    name: "Carpenter",
    icon: "/assest/icons/carpenter.jpeg",
    description: "Carpentry and woodworking services"
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-5 md:px-10">
        {/* Services Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-fit">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            What are you looking for?
          </h3>
          
          {/* Services Grid - 3-3-2 Layout */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md group flex flex-col items-center justify-center text-center ${
                  index >= 6 ? 'col-span-1' : ''
                }`}
                style={{
                  width: '140px',
                  height: '100px',
                  padding: '7px'
                }}
              >
                {/* Service Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 mb-1 relative overflow-hidden rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={service.icon}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Black line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
                
                {/* Service Name */}
                <h4 className="text-xs font-medium text-gray-800 leading-tight text-center">
                  {service.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
