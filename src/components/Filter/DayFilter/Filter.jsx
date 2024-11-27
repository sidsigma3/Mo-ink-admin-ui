import React from 'react'
import { LuCalendarSearch } from "react-icons/lu";
import "./Filter.css"


const Filter = () => {
  return (
    <div className="filter d-flex">
    <button>
        <span>
        <LuCalendarSearch size={20} />
        </span>
        Last 12 Months
    </button>
    </div>
  )
}

export default Filter