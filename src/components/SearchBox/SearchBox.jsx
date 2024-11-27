import React from 'react'
import { IoSearchOutline } from "react-icons/io5";
import "./SearchBox.css"


const SearchBox = () => {
  return (
    <div className='searchBox d-flex align-items-center gap-3 w-100'>
        <IoSearchOutline />
        <input type='text' placeholder='Search'></input>
    </div>
  )
}

export default SearchBox