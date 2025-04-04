import { Input  } from '@mui/material';
import React ,{useState} from 'react'
import { Modal, Button, Dropdown, ModalHeader, ModalTitle, ModalBody, ModalFooter  } from "react-bootstrap";
import "./ModalCustomer.css"

const ModalCustomer = ({ show, handleClose,onSubmit}) => {
     
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        language: "",
        phone: "",
        email: "",
        company: "",
        gstin: "",
        chequePhoto: null,
        address: "",
        apartment: "",
        country: "",
        state: "",
        city: "",
        pinCode: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle file upload separately
    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            chequePhoto: e.target.files[0],
        }));
    };

    // Handle form submission
    const handleSubmit = () => {
        const customerData = {
            name: `${formData.firstName} ${formData.lastName}`,
            contact: formData.phone,
            address: `${formData.address}, ${formData.apartment}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pinCode}`,
        };

        onSubmit(customerData); // Send to parent component
        handleClose(); // Close modal
    };

  return (
   <Modal className='modal-customer' show={show} onHide={handleClose} centered>
    <ModalHeader closeButton>
        <ModalTitle>Add New Customer</ModalTitle>
    </ModalHeader>

    <Modal.Body>
                <div className="row bg-white p-3 g-2 rounded">
                    <div className="col-md-6">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label>Language</label>
                        <input type="text" name="language" value={formData.language} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label>Phone No.</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-12">
                        <label>Email</label>
                        <input type="text" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label>Company</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label>GSTIN No.</label>
                        <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} className="form-control" />
                    </div>

                    {/* File Upload */}
                    <div className="col-md-12 border rounded p-3 mt-3">
                        <label>Upload Cancelled Cheque</label>
                        <input type="file" name="chequePhoto" onChange={handleFileChange} className="form-control mt-2" />
                    </div>

                    <div className="col-md-12">
                        <label>Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-12">
                        <label>Apartment, Suite, etc.</label>
                        <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label>Country/Region</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label>State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label>City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label>PIN Code</label>
                        <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="form-control" />
                    </div>
                </div>
            </Modal.Body>

    <ModalFooter>

        <Button size='sm' onClick={handleSubmit}>Submit</Button>
    </ModalFooter>

   </Modal>
  )
}

export default ModalCustomer