import React from 'react'
import "./ToggleBtn.css"

const ToggleBtn = ({click,status}) => {
  return (
    <div className='mt-4 text-center toggle-ctn'>
    <input onChange={click} checked={status} type='checkbox' id='toggle' ></input>
    <label className='toggle-btn' for='toggle'></label>
    </div>
  )
}

export default ToggleBtn