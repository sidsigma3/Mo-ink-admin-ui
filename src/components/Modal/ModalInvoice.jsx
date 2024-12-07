import React from 'react'
import { Modal, ModalBody, ModalHeader, ModalTitle ,ModalFooter ,Button } from 'react-bootstrap'
import { AiOutlineSend } from "react-icons/ai";

const ModalInvoice = ({show,handleClose}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
        <ModalHeader closeButton>
            <ModalTitle>Send Invoice</ModalTitle>
        </ModalHeader>
        <ModalBody>

            <div className='d-flex gap-2'>
                <div className='d-flex flex-column gap-1 flex-grow-1'>
                    <label>To</label>
                    <input className='rounded ps-1 py-1 border border-secondary-subtle' style={{fontSize:'0.8rem'}} placeholder='Add Email Id'></input>
                </div>

                <div className='d-flex flex-column gap-1 flex-grow-1'>
                    <label>From</label>
                    <input value={'Mo Ink N Dyes'} className='rounded ps-1 py-1 border border-secondary-subtle' style={{fontSize:'0.8rem'}}></input>
                </div>
            </div>

            <div className='d-flex flex-column gap-1 flex-grow-1 mt-2'>
                    <label>Cc</label>
                    <input className='rounded ps-1 py-1 border border-secondary-subtle' style={{fontSize:'0.8rem'}}></input>
            </div>

            <div className='d-flex flex-column gap-1 flex-grow-1 mt-2'>
                    <label>Subjects</label>
                    <input className='rounded ps-1 py-1 border border-secondary-subtle' style={{fontSize:'0.8rem'}}></input>
            </div>

            <div className='d-flex flex-column gap-1 flex-grow-1 mt-2'>
                    <label>Custom message</label>
                    <input className='rounded ps-1 py-1 border border-secondary-subtle' style={{fontSize:'0.8rem',height:'6rem'}}></input>
            </div>  



        </ModalBody>

        <ModalFooter>
        <Button size='sm' className='d-flex align-items-center gap-2' onClick={handleClose}>
            Send
            <span><AiOutlineSend /></span>
        </Button>
     
        </ModalFooter>
    </Modal>
  )
}

export default ModalInvoice