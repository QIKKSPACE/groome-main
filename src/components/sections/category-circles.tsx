"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WebflowContext } from "@/contexts/WebflowContext";

const CategoryCircles = () => {
  const { data } = useContext(WebflowContext);
  const router = useRouter();

  const categories =
    data?.categories?.filter(
      (cat: any) => cat.is_active && cat.parent_id === null
    ) || [];

  return (
    <section className="bg-white py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="mb-8 md:mb-12 text-center text-2xl md:text-3xl font-bold text-gray-800">
          Categories
        </h2>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-8">
          {categories.map((category: any) => (
            <button
              key={category.id}
              onClick={() => router.push(`/product-category/${category.id}`)}
              className="w-[72px] md:w-[96px] flex flex-col items-center group"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-full shadow-md transition-transform duration-200 group-hover:scale-105">
                <Image
                  src={`https://api.thegroome.com${category.image_url}`}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>

              <span className="mt-2 text-center text-[11px] md:text-sm font-medium text-gray-700 leading-tight line-clamp-2">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;