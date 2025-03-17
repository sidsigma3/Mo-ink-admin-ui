import React from 'react'
import { CgImport } from "react-icons/cg";
import "./ImportBtn.css"

const ImportBtn = ({onClick}) => {
  return (
    <>
     <button className='import-btn btn lg-btn' onClick={onClick}>
         <span> Import </span><CgImport size={19}/>
    </button>


    <button className='import-btn btn sm-btn'>
    <CgImport size={22}/>
    </button>
    </>
  )
}

export default ImportBtn