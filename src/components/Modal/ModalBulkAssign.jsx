import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'
import { AiOutlineSend } from "react-icons/ai";


const ModalBulkAssign = ({show,handleClose}) => {
  return (
   <Modal show={show} onHide={handleClose} centered>
    <ModalHeader closeButton>
        <ModalTitle>Send Invoice</ModalTitle>
    </ModalHeader>
  
    <ModalBody>

        <div className='d-flex gap-2'>
            <div className='d-flex flex-column gap-2 flex-grow-1'>
                <label>From</label>
                <input  className='border-light-subtle p-1 border-1 rounded'></input>
            </div>

            <div className='d-flex flex-column gap-2 flex-grow-1'>
                <label>WhatsApp np.</label>
                <input  className='border-light-subtle p-1 border-1 rounded'></input>
            </div>
        </div>



            <div className='d-flex flex-column gap-2 mt-2'> 
                <label>Mail</label>
                <input  className='border-light-subtle p-1 border-1 rounded'></input>
                <div className='p-4 border rounded dashed d-flex align-items-center justify-content-center' style={{height:'10rem'}}>
                <input type='file'></input>
                </div>
            </div>


            <div className='d-flex flex-column gap-2 mt-2'>
                <label>Custom message (optional)</label>
                <textarea className='border-1 border-light-subtle'></textarea>
            </div>

    </ModalBody>

    <ModalFooter>
        <div>
            <button className='btn btn-primary btn-sm d-flex align-items-center gap-2'>
                Send P.O.
                <span><AiOutlineSend /></span>    
            </button>
             
        </div>
    </ModalFooter>
  
  
   </Modal>
  )
}

export default ModalBulkAssign