import React, { useState, useRef, useEffect } from 'react';
import "./StatusFilter.css";
import { MdKeyboardArrowDown } from "react-icons/md";

const StatusFilter = ({ status, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(status || 'Active');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (newStatus) => {
    setSelectedStatus(newStatus);
    onStatusChange && onStatusChange(newStatus);
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
    <div className="status-filter-dropdown w-100 position-relative" ref={dropdownRef}>
      <button
        className="status-toggle btn border-1 bg-white d-flex align-items-center justify-content-between w-100"
        onClick={() => setOpen(!open)}
      >
        <span>{selectedStatus}</span>
        <MdKeyboardArrowDown size={20} />
      </button>

      {open && (
        <div className="status-dropdown-menu position-absolute mt-1 w-100 bg-white border rounded shadow-sm">
          {["Active", "Inactive", "All"].map((statusOption) => (
            <div
              key={statusOption}
              className="dropdown-item-custom px-2 py-1"
              onClick={() => handleSelect(statusOption)}
            >
              {statusOption}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default StatusFilter;
