import React from 'react'
import { MdAdd } from "react-icons/md";
import "./../Add/AddBtn.css"

const SubmitBtn = ({text,clickFunction,disabled}) => {
  return (
    <>
    <button  onClick={clickFunction} className='btn-primary-custom' disabled={disabled}>
        <span>{text}</span>
        {/* <MdAdd size={18}/> */}
    </button>
    </>
  )
}

export default SubmitBtn