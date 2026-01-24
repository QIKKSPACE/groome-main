"use client";

import React from "react";
import SearchBar from "@/components/ui/search-bar";

const SearchSection = () => {
  return (
    <section className="bg-white pt-2 pb-2 md:py-4 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchBar />
      </div>
    </section>
  );
};

export default SearchSection;

