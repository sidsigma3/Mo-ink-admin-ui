import React ,{useState} from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useSpinnerDyers } from '../Context/SpinnersAndDyersContext';



const ModalAssign = ({show,handleClose}) => {

    const {data,updateData} = useSpinnerDyers ()


    const [alignment, setAlignment] = useState('Spinners')

    const handleChange = (event, newAlignment) => {
      setAlignment(newAlignment);
    };



  return (
    <Modal show={show} onHide={handleClose} centered>
        <ModalHeader closeButton>
            <ModalTitle>Assign Order</ModalTitle>
        </ModalHeader>

        <ModalBody>

                <div className='d-flex justify-content-center'>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    >
                    <ToggleButton value="Spinners">Spinners</ToggleButton>
                    <ToggleButton value="Dyers">Dyers</ToggleButton>
                
                 </ToggleButtonGroup>
                </div>



                <div className='row gap-2 mt-2 m-0'>
                    {data.map((customer,index)=>(
                        <div className='col-5 bg-body-secondary p-2 rounded flex-grow-1 border border-secondary-subtle'>
                            <div className='d-flex justify-content-between '>
                              <h4 className='fs-6'>{customer.name}</h4>
                              <input type='checkbox'></input>
                            </div>

                            <div className='d-flex justify-content-between'>
                            <h5>{customer.phone}</h5>
                            <p className='px-1' style={{border:'1px solid #6EE7B7',backgroundColor:'#D1FAE5',color:'#065F46',borderRadius:'0.3rem',fontSize:'0.8rem'}}>{customer.assignOrders} Orders</p>
                            </div>
                            <p className='m-0'>{customer.location}</p>
                            <p className='text-body-tertiary'>Last Order On {customer.lastOrder}</p>
                        </div>
                    ))}

                </div>




        </ModalBody>
    
        <ModalFooter>
        <Button size='sm' onClick={handleClose}>
            Assign
        </Button>

     
        </ModalFooter>
    
    </Modal>


  )
}

export default ModalAssign