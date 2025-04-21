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
    <Modal className="modal modal-customer-list" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>All Customers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
       <ul className="list-unstyled m-0">
        {customers?.map((customer) => (
          <li key={customer.customerId}>
            <input
              type="checkbox"     
              onChange={() => handleCheckboxChange(customer)}
              checked={selectedCustomers.some((c) => c.customerId === customer.customerId)}
            />
            <h5>{customer.customerName}</h5>
            <span>
              <h4>.</h4>
            </span>
            <h6>{customer.email}</h6>
          </li>
        ))}
        </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCustomerAdd}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCustomerList