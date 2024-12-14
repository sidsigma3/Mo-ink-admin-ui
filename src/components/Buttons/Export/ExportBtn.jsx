import React from 'react'
import { PiExportBold } from "react-icons/pi";
import "./ExportBtn.css"

const ExportBtn = () => {
  return (
    <>
     <button className='export-btn btn lg-btn'>
         <span> Export </span><PiExportBold size={18}/>
    </button>

    <button className='export-btn btn sm-btn'>
    <PiExportBold size={23}/>
    </button>
    </>
  )
}

export default ExportBtn