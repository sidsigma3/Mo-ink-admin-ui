import React, { useState, useEffect } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import "./OrderFilter.css";

const statusOptions = [
  "NEW",
  "CONFIRMED",
  "SHIPPED",
  "MANUFACTURING",
  "DELIVERED",
  "CANCELLED",
  "RETURNED"
];

const OrderFilter = ({ status = [], onStatusChange }) => {
  const [selectedStatuses, setSelectedStatuses] = useState(status);

  const handleToggle = (status) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(updated);
    if (onStatusChange) onStatusChange(updated);
  };

  const isChecked = (status) => selectedStatuses.includes(status);

  return (
    <Dropdown className='order-filter'>
      <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2">
        <p className="m-0">
          {selectedStatuses.length === 0 ? "All" : selectedStatuses.join(", ")}
        </p>
      </Dropdown.Toggle>

      <Dropdown.Menu className="px-2" style={{ minWidth: "200px" }}>
        {statusOptions.map((status) => (
          <Form.Check
            key={status}
            type="checkbox"
            id={`status-${status}`}
            label={status}
            checked={isChecked(status)}
            onChange={() => handleToggle(status)}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default OrderFilter;
