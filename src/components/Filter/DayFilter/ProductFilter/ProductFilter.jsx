import React, { useState, useRef, useEffect } from 'react';
import "./ProductFilter.css";
import { IoSearchOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";

const ProductFilter = ({ filterOptions, onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleSelect = (filter) => {
    setSelectedFilter(filter);
    setDropdownOpen(false);
    onFilterChange(filter, searchTerm);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange(selectedFilter, value);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="d-flex bg-white gap-3 border order-id w-100 ps-0" style={{ height: '2.3rem' }}>
      
      {/* Custom Dropdown */}
      <div
        className="custom-dropdown w-50"
        ref={dropdownRef}
        
      >
        <button
          className="dropdown-toggle-custom border-0 d-flex align-items-center justify-content-between px-2 w-100"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{selectedFilter}</span>
          <MdKeyboardArrowDown size={20} />
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu-custom position-absolute w-full bg-white border rounded shadow-sm mt-1">
            {filterOptions.map((option, index) => (
              <div
                key={index}
                className="dropdown-item-custom px-2 py-1"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Field */}
      <div className="d-flex align-items-center justify-content-between border px-2 rounded w-100 border-0" style={{ width: "61%" }}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="border-0 w-100"
          style={{ outline: "none" }}
        />
        <IoSearchOutline />
      </div>
    </div>
  );
};

export default ProductFilter;
