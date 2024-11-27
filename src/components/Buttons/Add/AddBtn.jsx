import React from 'react'
import { MdAdd } from "react-icons/md";
import "./AddBtn.css"

const AddBtn = ({text,clickFunction}) => {
  return (
    <>
    <button  onClick={clickFunction} className='btn btn-primary add-btn'>
        <span>{text}</span><MdAdd />
    </button>
    </>
  )
}

export default AddBtn