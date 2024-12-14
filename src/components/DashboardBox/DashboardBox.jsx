import React from 'react'
import "./DashboardBox.css"
import { BsThreeDots } from "react-icons/bs";

const DashboardBox = (props) => {
  return (
    <div className='dashboardBox shadow-sm'>
        <div className='title d-flex justify-content-between'>
            <h4>{props.heading}</h4>
            {/* <span><BsThreeDots size={20}/></span> */}
        </div>

        <div className='mt-2'>
            <h3>{props.number}</h3>
        </div>
    </div>
  )
}

export default DashboardBox