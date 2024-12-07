import { Input  } from '@mui/material';
import React ,{useState} from 'react'
import { Modal, Button, Dropdown, ModalHeader, ModalTitle, ModalBody, ModalFooter  } from "react-bootstrap";
import "./ModalCustomer.css"

const ModalCustomer = ({ show, handleClose,onSubmit}) => {
        const [formData, setFormData] = useState({
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          apartment: '',
          city: '',
          state: '',
          country: '',
          pinCode: ''
        });
      
        // Handle input changes
        const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({
            ...prev,
            [name]: value
          }));
        };
      
        // Handle form submission
        const handleSubmit = () => {
          // Format the data you want to send (name, contact, and address only)
          const customerData = {
            name: `${formData.firstName} ${formData.lastName}`,
            contact: formData.phone,
            address: `${formData.address}, ${formData.apartment}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pinCode}`
          };
      
          onSubmit(customerData); // Pass the data to the parent component
          handleClose()
        };



  return (
   <Modal className='modal-customer' show={show} onHide={handleClose} centered>
    <ModalHeader closeButton>
        <ModalTitle>Add New Customer</ModalTitle>
    </ModalHeader>

    <ModalBody>
      <div className='d-flex gap-2'>
        <div>
          <label>First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div>
          <label>Last Name</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
      </div>

      
        <div>
          <label>Phone No.</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </div>
      

      <div>
        <label>Address</label>
        <input name="address" value={formData.address} onChange={handleChange} />
      </div>

      <div>
        <label>Apartment, suite, etc.</label>
        <input name="apartment" value={formData.apartment} onChange={handleChange} />
      </div>

      <div className='d-flex gap-2'>
        <div>
          <label>Country</label>
          <input name="country" value={formData.country} onChange={handleChange} />
        </div>
        <div>
          <label>State</label>
          <input name="state" value={formData.state} onChange={handleChange} />
        </div>
      </div>

      <div className='d-flex gap-2'>
        <div>
          <label>City</label>
          <input name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div>
          <label>PIN code</label>
          <input name="pinCode" value={formData.pinCode} onChange={handleChange} />
        </div>
      </div>

      {/* <button onClick={handleSubmit}>Add to Cart</button> */}
    </ModalBody>

    <ModalFooter>
        <Button onClick={handleClose}>
            Close
        </Button>

        <Button onClick={handleSubmit}>add</Button>
    </ModalFooter>

   </Modal>
  )
}

export default ModalCustomer