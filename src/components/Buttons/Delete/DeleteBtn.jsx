import React from 'react'
import "./DeleteBtn.css"

const DeleteBtn = ({clickFunction}) => {
  return (
    <>
    <button className='delete-btn btn btn btn-outline-danger' onClick={clickFunction}>
        Delete
    </button>
    </>
  )
}

export default DeleteBtn