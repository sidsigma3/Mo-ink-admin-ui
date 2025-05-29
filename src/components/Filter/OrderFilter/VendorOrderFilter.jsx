import React, { useState, useEffect } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import "./OrderFilter.css";

const vendorStatuses = [
  'PLACED',
  'CONFIRMED',
  'RECEIVED',
  'REPLACED',
  'RETURNED',
  'CANCELLED'
];

const statusDisplayMap = {
  CONFIRMED: 'Confirmed',
  REPLACED: 'Replaced',
  PLACED: 'Placed',
  RECEIVED: 'Received',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled',
};

const VendorOrderFilter = ({ status = [], onStatusChange }) => {
  const [selectedStatuses, setSelectedStatuses] = useState(status);

  useEffect(() => {
    setSelectedStatuses(status); // Sync external status change
  }, [status]);

  const handleToggle = (statusKey) => {
    const updated = selectedStatuses.includes(statusKey)
      ? selectedStatuses.filter((s) => s !== statusKey)
      : [...selectedStatuses, statusKey];

    setSelectedStatuses(updated);
    if (onStatusChange) onStatusChange(updated);
  };

  const displayText = () => {
    if (selectedStatuses.length === 0) return 'All';
    if (selectedStatuses.length === 1) return statusDisplayMap[selectedStatuses[0]] || selectedStatuses[0];
    return 'Multiple';
  };

  return (
    <Dropdown className="order-filter">
      <Dropdown.Toggle
        variant="light"
        id="dropdown-basic"
        className="d-flex align-items-center justify-content-between gap-2"
      >
        <p className="m-0">{displayText()}</p>
      </Dropdown.Toggle>

      <Dropdown.Menu className="px-2" style={{ minWidth: "200px" }}>
        {vendorStatuses.map((statusKey) => (
          <Form.Check
            key={statusKey}
            type="checkbox"
            id={`status-${statusKey}`}
            label={statusDisplayMap[statusKey]}
            checked={selectedStatuses.includes(statusKey)}
            onChange={() => handleToggle(statusKey)}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default VendorOrderFilter;
