import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import "./OrderFilter.css";

const statusDisplayMap = {
  CONFIRMED: 'Confirmed',
  REPLACED: 'Replaced',
  PLACED: 'Placed',
  RECEIVED: 'Received',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled',
  ALL: 'All',
};

const VendorOrderFilter = ({ status = 'ALL', onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(status);

  const handleSelect = (statusKey) => {
    setSelectedStatus(statusKey);
    if (onStatusChange) onStatusChange(statusKey);
  };

  const vendorStatuses = ['ALL', 'PLACED', 'CONFIRMED', 'RECEIVED', 'REPLACED', 'RETURNED', 'CANCELLED'];

  return (
    <Dropdown onSelect={handleSelect} size="sm" className="order-filter">
      <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2">
        <p className="m-0">{statusDisplayMap[selectedStatus]}</p>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {vendorStatuses.map((statusKey) => (
          <Dropdown.Item key={statusKey} eventKey={statusKey}>
            {statusDisplayMap[statusKey]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default VendorOrderFilter;
