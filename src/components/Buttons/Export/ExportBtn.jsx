import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import "./ExportBtn.css"

const ExportBtn = () => {
  return (
    <>
     <button className='export-btn btn lg-btn'>
         <span> Export </span><MdOutlineFileDownload size={18}/>
    </button>

    <button className='export-btn btn sm-btn'>
    <MdOutlineFileDownload size={18}/>
    </button>
    </>
  )
}

export default ExportBtn