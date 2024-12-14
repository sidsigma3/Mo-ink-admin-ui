import { Input  } from '@mui/material';
import React ,{useState} from 'react'
import { Modal, Button, Dropdown, ModalHeader, ModalTitle, ModalBody, ModalFooter  } from "react-bootstrap";
import "./ModalCustomer.css"

const ModalCustomer = ({ show, handleClose,onSubmit}) => {
        const [formData, setFormData] = useState({
          firstName:  "",
          lastName:  "",
          language:  "",
          phone:  "",
          email:  "",
          company: "",
          gstin:  "",
          chequePhoto: null,
          address:  "",
          apartment:  "",
          country:"",
          state:  "",
          city: "",
          pinCode:"",
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
    <div className='row bg-white p-3 g-2 rounded '>
                <div className="col-md-6 p-0">
                    <label>First Name</label>
                    <input type="text" name="firstName"  value={formData.firstName} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column p-0">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column p-0">
                    <label>Language</label>
                    <input type="text" name="language" value={formData.language} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column p-0">
                    <label>Phone No.</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="col-md-12 d-flex flex-column p-0">
                    <label>Email</label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column p-0">
                    <label>Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column p-0">
                    <label>GSTIN No.</label>
                    <input
                    className="fs-6 ps-2"
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    placeholder="Add GSTIN No. to authenticate"
                    onChange={handleChange}
                    />
                </div>

                <div className="media-input-ctn mt-3 p-2 col-md-12 col-sm-12 border rounded">
                    <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
                    <input type="file" name="chequePhoto" onChange={handleChange} />
                    <h4 className='fs-6 mt-2'>Add photo of cancelled cheque</h4>
                    </div>
                </div>

                <div className="col-md-12 d-flex flex-column">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>

                <div className="col-md-12 d-flex flex-column">
                    <label>Apartment, Suite, etc.</label>
                    <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
                </div>

                {/* <div className="col-md-6 d-flex flex-column">
                    <label>Country/Region</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <label>PIN code</label>
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} />
                </div> */}



                </div>
    </ModalBody>

    <ModalFooter>

        <Button size='sm' onClick={handleSubmit}>Submit</Button>
    </ModalFooter>

   </Modal>
  )
}

export default ModalCustomer