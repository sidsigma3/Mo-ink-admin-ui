import React, { useState ,useEffect } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { SketchPicker } from "react-color";
import { IoIosArrowDown } from "react-icons/io";
import Collapse from "react-bootstrap/Collapse";
import { IoMdAdd } from "react-icons/io";
import "./ModalCustomerList.css"
import { getAllCustomer } from "../../services/CustomerService";

const ModalCustomerList = ({ show, handleClose ,customers,onCustomerAdd, preSelectedCustomers = []}) => {

    const [selectedCustomers, setSelectedCustomers] = useState([]);

    useEffect(() => {
      if (show) {
        setSelectedCustomers(preSelectedCustomers);
      }
    }, [show, preSelectedCustomers]);
  
    const handleCheckboxChange = (customer) => {
      setSelectedCustomers((prev) =>
        prev.some((c) => c.customerId === customer.customerId)
          ? prev.filter((c) => c.customerId !== customer.customerId) // Remove
          : [...prev, customer] // Add
      );
    };
  
    const handleCustomerAdd = () => {
      onCustomerAdd(selectedCustomers); // Send to parent
      handleClose();
    };


  return (
<Modal 
  className="modal no-padding-modal modal-customer-list" 
  show={show} 
  onHide={handleClose} 
  centered
  size="md"
  backdrop="static"
>
  <Modal.Header closeButton className="border-bottom">
    <Modal.Title className="">
      All Customers
    </Modal.Title>
  </Modal.Header>
  
  <Modal.Body className="p-0">
    <div 
      className="customer-list-container"
      style={{ 
        maxHeight: "60vh", 
        minHeight: "200px",
        overflowY: "auto",
        overflowX: "hidden"
      }}
    >
      {customers?.length > 0 ? (
        <ul className="list-unstyled m-0">
          {customers.map((customer) => (
            <li 
              key={customer.customerId}
              className="customer-item border-bottom px-3 py-2 hover-highlight"
              style={{ 
                cursor: "pointer",
                transition: "background-color 0.2s ease"
              }}
              onClick={() => handleCheckboxChange(customer)}
            >
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-3 flex-shrink-0"
                  onChange={() => handleCheckboxChange(customer)}
                  checked={selectedCustomers.some((c) => c.customerId === customer.customerId)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ transform: "scale(1.1)" }}
                />
                
                <div className="customer-info flex-grow-1 min-width-0">
                  <div className="d-flex flex-row flex-sm-row align-items-start align-items-sm-center justify-content-between">
                    <div className="customer-details flex-grow-1 min-width-0">
                      <h6 className="mb-1 text-truncate fw-semibold text-dark">
                        {customer.customerName}
                      </h6>
                      <p className="mb-0 text-muted small text-truncate">
                        {customer.email}
                      </p>
                    </div>
                    
                    <div className="customer-actions mt-1 mt-sm-0 ms-sm-2 flex-shrink-0">
                      <span className="badge bg-light text-dark small">
                        ID: {customer.customerId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="fas fa-users fa-3x text-muted"></i>
          </div>
          <h5 className="text-muted">No customers found</h5>
          <p className="text-muted mb-0">There are no customers to display.</p>
        </div>
      )}
    </div>
  </Modal.Body>
  
  <Modal.Footer className="border-top bg-light">
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center w-100 gap-3">
      <small className="text-muted ">
        {selectedCustomers.length} of {customers?.length || 0} selected
      </small>
      
      <div className="d-flex gap-2">
        {/* <Button 
          variant="outline-secondary" 
          onClick={handleClose}
          className="px-4"
        >
          Cancel
        </Button> */}
        <Button 
          variant="primary" 
          onClick={handleCustomerAdd}
          disabled={selectedCustomers.length === 0}
          className="px-4"
        >
          Add Selected
        </Button>
      </div>
    </div>
  </Modal.Footer>
</Modal>
  )
}

export default ModalCustomerList