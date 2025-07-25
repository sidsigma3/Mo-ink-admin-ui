import React, { useState, useEffect, useRef } from "react";
import "./OrderFilter.css"; // Optional: your styling

const statusOptions = [
  "NEW",
  "CONFIRMED",
  "SHIPPED",
  "MANUFACTURING",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const OrderFilter = ({ status = [], onStatusChange }) => {
  const [selectedStatuses, setSelectedStatuses] = useState(status);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    setSelectedStatuses(status);
  }, [status]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleStatus = (status) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(updated);
    if (onStatusChange) onStatusChange(updated);
  };

  const getLabel = () => {
    if (selectedStatuses.length === 0) return "All";
    if (selectedStatuses.length === 1) return selectedStatuses[0];
    return "Multiple";
  };

  return (
    <div className="order-filter position-relative" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-light border d-flex align-items-center justify-content-between w-100"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <span>{getLabel()}</span>
        <span className="ms-auto">&#9662;</span> {/* Down arrow */}
      </button>

      {dropdownOpen && (
        <div
          className="dropdown-menu show p-2 shadow rounded mt-1"
          style={{ position: "absolute", width: "100%", zIndex: 9999, background: "white" }}
        >
          {statusOptions.map((status) => (
            <div key={status} className="form-check mb-1">
              <input
                type="checkbox"
                className="form-check-input"
                id={`status-${status}`}
                checked={selectedStatuses.includes(status)}
                onChange={() => handleToggleStatus(status)}
              />
              <label
                htmlFor={`status-${status}`}
                className="form-check-label"
                style={{ fontSize: "0.9rem" }}
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderFilter;
