import React from 'react'
import "./DashboardBox.css"
import { BsThreeDots } from "react-icons/bs";

const DashboardBox = (props) => {
  return (
    <div className='dashboardBox'>
        <div className='title d-flex justify-content-between'>
            <h4>{props.heading}</h4>
            <span><BsThreeDots size={20}/></span>
        </div>

        <div>
            <h3>{props.number}</h3>
        </div>
    </div>
  )
}

export default DashboardBox