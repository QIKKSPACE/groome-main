"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { WebflowContext } from "@/contexts/WebflowContext";

const CategoryCircles = () => {
  const { data } = useContext(WebflowContext);

  // Only active top-level categories (parent_id === null)
  const categories =
    data?.categories?.filter(
      (cat: any) => cat.is_active && cat.parent_id === null
    ) || [];

  return (
    <section className="pt-6 pb-8 md:py-20 bg-white -mt-2 md:mt-0">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">
          Categories
        </h2>

        {/* Flex for wrapping items */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-16">
          {categories.map((category: any) => (
            <div
              key={category.id}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Circular Category */}
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md group-hover:shadow-lg">
                {category.image_url && (
                  <div className="w-10 h-10 md:w-14 md:h-14 relative">
                    <Image
                      src={`https://thegroome.com/backend${category.image_url}`}
                      alt={category.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Category Name */}
              <h3 className="text-xs md:text-sm font-medium text-gray-800 mt-2 md:mt-4 text-center break-words max-w-[80px] md:max-w-[100px]">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;
