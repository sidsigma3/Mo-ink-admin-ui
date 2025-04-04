import React from 'react'
import { PiExportBold } from "react-icons/pi";
import "./ExportBtn.css"

const ExportBtn = ({onClick}) => {
  return (
    <>
     <button className='export-btn btn lg-btn bg-warning-subtle text-black' onClick={onClick}>
         <span> Export </span><PiExportBold size={18}/>
    </button>

    <button className='export-btn btn sm-btn bg-warning-subtle text-black'>
    <PiExportBold size={23}/>
    </button>
    </>
  )
}

export default ExportBtn