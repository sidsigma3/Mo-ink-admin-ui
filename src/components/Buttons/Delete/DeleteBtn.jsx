import React from 'react'
import "./DeleteBtn.css"

const DeleteBtn = ({clickFunction}) => {
  return (
    <>
    <button className='delete-btn ' onClick={clickFunction}>
        Delete
    </button>
    </>
  )
}

export default DeleteBtn