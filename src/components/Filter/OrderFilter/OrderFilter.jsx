import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import "./OrderFilter.css"


const OrderFilter = ({ status ,onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(status); // Default status selection

  const handleSelect = (status) => {
    setSelectedStatus(status);
    if (onStatusChange) onStatusChange(status); // Pass selected status to parent
  };
   
  return (
    <Dropdown onSelect={handleSelect}  size="sm" className='order-filter'>
      <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2">
        <p className="m-0">{selectedStatus}</p>
      </Dropdown.Toggle>

      <Dropdown.Menu>
      <Dropdown.Item eventKey="All">All</Dropdown.Item>
        <Dropdown.Item eventKey="New Order">New Order</Dropdown.Item>
        <Dropdown.Item eventKey="Dispatch from Inventory">Dispatch from Inventory</Dropdown.Item>
        <Dropdown.Item eventKey="Send to Vendor">Send to Vendor</Dropdown.Item>
        <Dropdown.Item eventKey="Dispatch from Vendor">Dispatch from Vendor</Dropdown.Item>
        <Dropdown.Item eventKey="Delivered">Delivered</Dropdown.Item>
        <Dropdown.Item eventKey="Order Cancelled">Order Cancelled</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default OrderFilter;
