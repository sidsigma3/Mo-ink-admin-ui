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
        <Dropdown.Item eventKey="NEW">New Order</Dropdown.Item>
        <Dropdown.Item eventKey="CONFIRMED">Confirm</Dropdown.Item>
        <Dropdown.Item eventKey="SHIPPED">Shipped</Dropdown.Item>
        <Dropdown.Item eventKey="MANUFACTURING">Manufactured</Dropdown.Item>
        <Dropdown.Item eventKey="DELIVERED">Delivered</Dropdown.Item>
        <Dropdown.Item eventKey="CANCELLED">Cancelled</Dropdown.Item>
        <Dropdown.Item eventKey="RETURNED">Returned</Dropdown.Item>
      

      </Dropdown.Menu>
    </Dropdown>
  );
};

export default OrderFilter;
