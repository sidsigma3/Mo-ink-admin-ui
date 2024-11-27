import React from 'react'
import "./ProductFilter.css"
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

const ProductFilter = () => {
  return (
   
        <div className='d-flex bg-white  p-1 gap-3 border order-id w-100'>
                <div className='d-flex gap-4 align-items-center w-50'>
                    <h5>Order ID</h5>
                    <span><MdKeyboardArrowDown size={18}/></span>
                </div>
            
            
                <div className='d-flex gap-5 align-items-center justify-content-between w-50' >
                    <input type='text' placeholder='Search'></input>
                    <span>  <IoSearchOutline /></span>
                    
                </div>
            </div>

   
  )
}

export default ProductFilter