import React, { useState, useEffect } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

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

  useEffect(() => {
    setSelectedStatuses(status); // Sync external status change
  }, [status]);

  const handleToggle = (status) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(updated);
    if (onStatusChange) onStatusChange(updated);
  };

  return (
    <Dropdown className='order-filter'>
  <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center  border justify-content-between gap-2 w-100">
    <p className="m-0">
      {selectedStatuses.length === 0
        ? "All"
        : selectedStatuses.length === 1
        ? selectedStatuses[0]
        : "Multiple"}
    </p>
  </Dropdown.Toggle>

  <Dropdown.Menu className="px-2 ">
    {statusOptions.map((status) => (
      <Form.Check
        key={status}
        type="checkbox"
        id={`status-${status}`}
        label={<span style={{ fontSize: '0.8rem' }}>{status}</span>}
        checked={selectedStatuses.includes(status)}
        onChange={() => handleToggle(status)}
      />
    ))}
  </Dropdown.Menu>
</Dropdown>

  );
};

export default OrderFilter;
