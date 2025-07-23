import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import "./StatusFilter.css"


const StatusFilter = ({ status ,onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(status); // Default status selection

  const handleSelect = (status) => {
    setSelectedStatus(status);
    if (onStatusChange) onStatusChange(status); // Pass selected status to parent
  };
   
  return (
    <Dropdown onSelect={handleSelect}  size="sm" className='status position-relative z-n1'>
      <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center  border justify-content-between gap-2 w-100">
        <p className="m-0">{selectedStatus}</p>
      </Dropdown.Toggle>

      <Dropdown.Menu className='w-100'>
        <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
        <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>
        <Dropdown.Item eventKey="All">View All</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default StatusFilter;
