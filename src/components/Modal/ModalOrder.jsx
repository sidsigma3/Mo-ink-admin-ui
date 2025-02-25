import React, { useEffect, useState } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { SketchPicker } from "react-color";
import { IoIosArrowDown } from "react-icons/io";
import Collapse from "react-bootstrap/Collapse";
import { IoMdAdd } from "react-icons/io";
import "./ModalOrder.css"
import CataloguePage from "./CatalougePage";

const ModalOrder = ({ show, handleClose, products, addToCart , onOrderCreate}) => {
 
  const [openProductId, setOpenProductId] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [showCatalogue, setShowCatalogue] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});

  // Handles size selection for a product
  const sizeSelectHandler = (productId, size) => {
    setSelectedSize((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [size]: !prev[productId]?.[size],
      },
    }));
  };

  // Toggles visibility of a product's variant list
  const toggleCollapse = (productId) => {
    setOpenProductId(openProductId === productId ? null : productId);
  };

  // Opens the Catalogue Page inside the modal
  const openCatalogue = (variant) => {
    setCurrentVariant(variant);
    setShowCatalogue(true);
  };

  // Handles selection of color from Catalogue Page
  const handleColorSelection = (colorHex, colorName) => {
    if (!currentVariant) return;

    setSelectedColors((prev) => ({
      ...prev,
      [currentVariant.id]: {
        ...prev[currentVariant.id],
        [currentVariant.size]: { colorHex, colorName },
      },
    }));

    setShowCatalogue(false); // Close catalogue after selection
  };

  // Creates the final order
  const handleOrderCreation = () => {
    const order = Object.keys(selectedSize) // Iterate over variantIds
      .flatMap((variantId) =>
        Object.keys(selectedSize[variantId]) // Iterate over sizes for this variant
          .filter((size) => selectedSize[variantId][size]) // Check if size is selected (true)
          .map((size) => {
            // Find the correct product using variantId
            const product = products.find((p) =>
              p.groupedVariants?.some((v) => v.variants.some((variant) => variant.id === Number(variantId)))
            );
  
            // Ensure we found a product
            if (!product) return null;
  
            // Find the variant group by size
            const variant = product.groupedVariants?.find((v) => v.size === size);
  
            // Find the selected variant by variantId
            const selectedVariant = variant?.variants?.find((v) => v.id === Number(variantId));
  
            return {
              productId: product.productId, // Retrieve productId correctly
              productName:product.productName,
              size,
              colors: selectedColors[variantId]?.[size]?.colorHex || [], // Ensure it's an array
              variant,
              product
            };
          })
      ) 
      .filter((item) => item !== null && item.colors.length > 0); // Remove null items and only keep valid selections
  
    onOrderCreate(order);
    handleClose();
  };
  


  return (
    <Modal className="modal" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>All Products</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showCatalogue ? (
          products.map((product) => (
            <div key={product.productId}>
              <div
                className="mb-4 d-flex justify-content-between align-items-center"
                onClick={() => toggleCollapse(product.productId)}
                aria-controls={`collapse-${product.productId}`}
                aria-expanded={openProductId === product.productId}
              >
                <h5>{product.productName}</h5>
                <span>
                  <IoIosArrowDown />
                </span>
              </div>

              <Collapse in={openProductId === product.productId}>
                <div id={`collapse-${product.productId}`}>
                  {product.groupedVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className="size-section mb-3 d-flex justify-content-between"
                    >
                      <div className="d-flex align-items-center gap-5">
                        <button
                          key={variant.id}
                          onClick={() => sizeSelectHandler(variant.id, variant.size)}
                          className={selectedSize[variant.id]?.[variant.size] ? 'selected' : 'not-selected'}
                        >
                          Size: {variant.size}
                        </button>
                      </div>

                  
                      {selectedColors[variant.id]?.[variant.size] && (
                        <div className="selected-color-box d-flex gap-3">
                          {selectedColors[variant.id][variant.size].colorHex.map((color, index) => (
                            <div key={index} className="d-flex flex-column gap-2">
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: color.hexCode.trim(), // Ensure no extra spaces
                                  border: "1px solid #ccc",
                                }}
                              ></div>
                              <span>{color.colorName}</span>
                            </div>
                          ))}
                        </div>
                      )}


                        <span onClick={() => openCatalogue(variant)} className="d-flex align-items-center">
                        <img src="./color-wheel.png" alt="Color Selector" />
                      </span>

                    </div>
                  ))}
                </div>
              </Collapse>
            </div>
          ))
        ) : (
          // Show Catalogue Page inside the modal
          <CataloguePage onColorSelect={handleColorSelection} onClose={() => setShowCatalogue(false)} variant={currentVariant} />
        )}
      </Modal.Body>
      <Modal.Footer className="flex justify-content-between">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleOrderCreation}>
          Add to Cart
        </Button>

        
      </Modal.Footer>
    </Modal>
  );
};

export default ModalOrder;
