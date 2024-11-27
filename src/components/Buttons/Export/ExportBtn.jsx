import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import "./ExportBtn.css"

const ExportBtn = () => {
  return (
    <>
     <button className='export-btn btn'>
         <span> Export </span><MdOutlineFileDownload />
    </button>
    </>
  )
}

export default ExportBtn