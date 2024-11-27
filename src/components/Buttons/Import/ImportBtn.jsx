import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import "./ImportBtn.css"

const ImportBtn = () => {
  return (
    <>
     <button className='import-btn btn'>
         <span> Import </span><MdOutlineFileDownload />
    </button>
    </>
  )
}

export default ImportBtn