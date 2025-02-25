import React, { useState ,useEffect } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { SketchPicker } from "react-color";
import { IoIosArrowDown } from "react-icons/io";
import Collapse from "react-bootstrap/Collapse";
import { IoMdAdd } from "react-icons/io";
import "./ModalCustomerList.css"
import { getAllCustomer } from "../../services/CustomerService";

const ModalCustomerList = ({ show, handleClose ,customers,onCustomerAdd}) => {

    const [selectedCustomers, setSelectedCustomers] = useState([]);
    // const [customers,setCustomer] = useState([])


    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const data = await getAllCustomer();
    //       setCustomer(data.data)
          
    //     } catch (error) {
    //       console.error('Error fetching Customers:', error);
    //     }
    //   };
    
    //     fetchData(); 
    //   }, []); 
    

    // const customers = [
    //     { id: 1, name: "Cody Fisher", email: "codyfisher@gmail.com" },
    //     { id: 2, name: "Jane Doe", email: "janedoe@gmail.com" },
    //     { id: 3, name: "John Smith", email: "johnsmith@gmail.com" },
    //   ];
    
      const handleCheckboxChange = (customer) => {
        setSelectedCustomers((prev) =>
          prev.some((c) => c.customerId === customer.customerId)
            ? prev.filter((c) => c.customerId !== customer.customerId) // Remove if already selected
            : [...prev, customer] // Add if not selected
        );
      };
    
      const handleCustomerAdd = () => {
        onCustomerAdd(selectedCustomers); // Pass selected customers to the parent
        handleClose()
      };



  return (
    <Modal className="modal modal-customer-list" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>All Customers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
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