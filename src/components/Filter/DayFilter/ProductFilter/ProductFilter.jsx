import React ,{useState} from 'react'
import "./ProductFilter.css"
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';



const ProductFilter = () => {

    const [selectedStatus, setSelectedStatus] = useState('Order Id'); // Default status selection

    const handleSelect = (status) => {
      setSelectedStatus(status);
      // if (onStatusChange) onStatusChange(status); // Pass selected status to parent
    };

  return (
   
        <div className='d-flex bg-white  p-2 gap-3 border order-id w-100'>
                <div className='d-flex align-items-center justify-content-between ps-1' style={{width:'39%' }}>
                    {/* <h5>Order ID</h5>
                    <span><MdKeyboardArrowDown size={18}/></span> */}

                    <Dropdown onSelect={handleSelect}  size="sm" className='d-flex align-items-center w-100'>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2 w-100 border border-0 ">
                        <p className="m-0 d-flex align-items-center gap-2">{selectedStatus}</p>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='w-100'>
                        <Dropdown.Item eventKey="Order Id">Order Id</Dropdown.Item>
                        <Dropdown.Item eventKey="Date">Date</Dropdown.Item>
                        <Dropdown.Item eventKey="Customer">Customer</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </div>
            
            
                <div className='d-flex align-items-center justify-content-between' style={{width:'61%'}}>
                    <input type='text' placeholder='Search'></input>
                    <span>  <IoSearchOutline /></span>
                    
                </div>
            </div>

   
  )
}

export default ProductFilter