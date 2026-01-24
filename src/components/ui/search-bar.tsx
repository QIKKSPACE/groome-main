"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  z-index: 20;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 18px 60px 18px 60px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  color: #333;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &::placeholder {
    color: #666;
  }

  &:focus {
    background-color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 16px 50px 16px 50px;
    font-size: 14px;
    border-radius: 6px;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;

  @media (max-width: 768px) {
    left: 18px;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #666;
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    right: 18px;
  }
`;

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleFocus = () => {
    router.push("/search"); // 👈 navigates to search screen
  };

  return (
    <SearchContainer>
      <SearchIcon>
        <Search size={20} />
      </SearchIcon>

      {/* Input acts like a trigger */}
      <SearchInput
        type="text"
        placeholder="Search for Shops, Products & Services"
        onFocus={handleFocus}
        readOnly // 👈 prevents typing on the home screen
      />

      {searchQuery && (
        <ClearButton type="button" onClick={() => setSearchQuery("")}>
          <X size={18} />
        </ClearButton>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
