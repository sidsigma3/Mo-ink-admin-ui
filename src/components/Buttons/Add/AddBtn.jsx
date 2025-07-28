import React from 'react'
import { MdAdd } from "react-icons/md";
import "./AddBtn.css"

const AddBtn = ({text, clickFunction}) => {
  return (
    <>
    <button onClick={clickFunction} className='btn add-btn lg-add-btn d-flex fw-medium align-items-center gap-1'>
        <span style={{ textDecoration: 'none' }}>{text}</span>
        <MdAdd size={18} />
    </button>

    <button onClick={clickFunction} className='btn add-btn sm-add-btn'>
       <MdAdd size={23}/>
    </button>
    </>
  )
}

export default AddBtn