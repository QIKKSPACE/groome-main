"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

const dummySearchResults: string[] = []; // Replace with your API results

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults(null);

    setTimeout(() => {
      setLoading(false);
      const filtered = dummySearchResults.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : []);
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Find Shops, Products & Services
      </h3>

      {/* Search Bar with Button */}
      <div className="w-full max-w-xl relative flex items-center">
        <input
          type="text"
          placeholder="Search for Products, Services, Malls, Vendors in your area"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-4 pl-12 rounded-xl shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          autoFocus
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex flex-col items-center mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-gray-500 text-lg">Searching for "{query}"...</p>
        </div>
      )}

      {/* Results */}
      {!loading && results && (
        <div className="mt-10 w-full max-w-xl">
          {results.length === 0 ? (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h2 className="text-gray-500 text-xl font-medium">No results found</h2>
              <p className="text-gray-400 mt-2">
                Try searching with a different keyword.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {results.map((item, idx) => (
                <li
                  key={idx}
                  className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
