import React from 'react'
import { MdAdd } from "react-icons/md";
import "./../Add/AddBtn.css"

const SubmitBtn = ({text,clickFunction}) => {
  return (
    <>
    <button  onClick={clickFunction} className='btn btn-primary add-btn d-flex align-items-center gap-1'>
        <span>{text}</span>
        {/* <MdAdd size={18}/> */}
    </button>
    </>
  )
}

export default SubmitBtn