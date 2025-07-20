import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalProdcutSelect = ({ show, handleClose, products, onOrderCreate }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Handle individual product selection
  const handleProductSelection = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId) // Remove if already selected
        : [...prevSelected, productId] // Add if not selected
    );
  };

  // Handle "Select All" option
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]); // Unselect all if everything is already selected
    } else {
      setSelectedProducts(products.map((product) => product.productId)); // Select all
    }
  };


  const handleConfirmSelection = () => {
    const selectedProductData = products.filter((product) =>
      selectedProducts.includes(product.productId) 
    );
    onOrderCreate(selectedProductData);
    handleClose();
  };
  

  return (
    <Modal className="modal" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Products</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="checkbox"
            label="Select All"
            onChange={handleSelectAll}
            checked={selectedProducts.length === products.length}
          />
          <hr />
          {products.map((product) => (
            <div key={product.productId} className="mb-2 d-flex align-items-center">
              <Form.Check
                type="checkbox"
                onChange={() => handleProductSelection(product.productId)}
                checked={selectedProducts.includes(product.productId)}
              />
              <span className="ms-2">{product.productName}</span>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Close
        </Button> */}
        <button
                    className="btn-secondary-custom" onClick={handleConfirmSelection}>
          Add Selected
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalProdcutSelect;
