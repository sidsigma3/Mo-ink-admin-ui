import React from 'react'
import { MdAdd } from "react-icons/md";
import "./AddBtn.css"

const AddBtn = ({text,clickFunction}) => {
  return (
    <>
    <button  onClick={clickFunction} className='btn btn-primary add-btn lg-add-btn d-flex align-items-center gap-1'>
        <span>{text}</span><MdAdd size={18}/>
    </button>

    <button className='btn btn-primary add-btn sm-add-btn'>
       <MdAdd size={18}/>
    </button>
    </>
  )
}

export default AddBtn