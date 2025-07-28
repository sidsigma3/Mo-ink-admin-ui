import React from 'react'
import { PiExportBold } from "react-icons/pi";
import "./ExportBtn.css"

const ExportBtn = ({onClick}) => {
  return (
    <>
     <button className='export-btn btn lg-btn fw-medium' onClick={onClick}>
         <span> Export </span><PiExportBold size={18}/>
    </button>

    <button className='export-btn btn sm-bttn' onClick={onClick}>
        <PiExportBold size={20}/>
    </button>
    </>
  )
}

export default ExportBtn