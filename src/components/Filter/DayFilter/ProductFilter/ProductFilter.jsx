import React ,{useState} from 'react'
import "./ProductFilter.css"
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';



const ProductFilter = ({ filterOptions, onFilterChange }) => {
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]); // Default to first option
    const [searchTerm, setSearchTerm] = useState("");
  
    const handleSelect = (filter) => {
      setSelectedFilter(filter);
      onFilterChange(filter, searchTerm);
    };
  
    const handleSearch = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      onFilterChange(selectedFilter, value);
    };
  
    return (
      <div className="d-flex bg-white p-2 gap-3 border order-id w-100 ps-0">
        {/* Dropdown Selection */}
        <div className="d-flex align-items-center justify-content-between border border-right" style={{ width: "39%" }}>
          <Dropdown onSelect={handleSelect} size="sm" className="d-flex align-items-center w-100">
            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2 w-100 border border-0">
              <p className="m-0 d-flex align-items-center gap-2">{selectedFilter}</p>
            </Dropdown.Toggle>
  
            <Dropdown.Menu className="w-100">
              {filterOptions.map((option, index) => (
                <Dropdown.Item key={index} eventKey={option}>
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
  
        {/* Search Input */}
        <div className="d-flex align-items-center justify-content-between w-100" style={{ width: "61%" }}>
          <input type="text" placeholder={`Search by ${selectedFilter}`} value={searchTerm} onChange={handleSearch} />
          <span>
            <IoSearchOutline />
          </span>
        </div>
      </div>
    );
  };
  
  export default ProductFilter;