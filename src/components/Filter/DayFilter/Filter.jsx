import React ,{useState} from 'react'
import { LuCalendarSearch } from "react-icons/lu";
import { Dropdown } from 'react-bootstrap';
import "./Filter.css"


const Filter = () => {

  const [selectedStatus, setSelectedStatus] = useState('Prev Day'); // Default status selection

  const handleSelect = (status) => {
    setSelectedStatus(status);
    // if (onStatusChange) onStatusChange(status); // Pass selected status to parent
  };


  return (
    <div className="filter d-flex">
    {/* <button>
        <span>
        <LuCalendarSearch size={20} />
        </span>
        <span className='text'>Last 12 Months</span>
        
    </button> */}

    <Dropdown onSelect={handleSelect}  size="sm" className='d-flex align-items-center w-100'>
      <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2 w-100 border border-0 ">
        <p className="m-0 d-flex align-items-center gap-2"><div><LuCalendarSearch size={20} /></div>{selectedStatus}</p>
      </Dropdown.Toggle>

      <Dropdown.Menu className='w-100'>
        <Dropdown.Item eventKey="Prev Day">Prev Day </Dropdown.Item>
        <Dropdown.Item eventKey="Prev Week">Prev Week</Dropdown.Item>
        <Dropdown.Item eventKey="Prev Month">Prev Month</Dropdown.Item>
        <Dropdown.Item eventKey="Prev Quarter">Prev Quarter</Dropdown.Item>
        <Dropdown.Item eventKey="Prev Year">Prev Year</Dropdown.Item>
        <Dropdown.Item eventKey="Custom Date">Custom Date</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </div>
  )
}

export default Filter