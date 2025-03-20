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
  const [currentId,setCurrentId] = useState('')

  const sizeSelectHandler = (productId, size) => {
    setSelectedSize((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [size]: !prev[productId]?.[size],
      },
    }));
  };


  const toggleCollapse = (productId) => {
    setOpenProductId(openProductId === productId ? null : productId);
  };

 
  const openCatalogue = (variant,id) => {
    setCurrentId(id)
    setCurrentVariant(variant);
    setShowCatalogue(true);
  };

 
  const handleColorSelection = (colorHex, colorName) => {
    if (!currentVariant) return;

    setSelectedColors((prev) => ({
      ...prev,
      [currentVariant.id]: {
        ...prev[currentVariant.id],
        [currentVariant.size]: { colorHex, colorName },
      },
    }));

    setShowCatalogue(false); 
  };

  
  const handleOrderCreation = () => {
    const order = Object.keys(selectedSize) 
      .flatMap((variantId) =>
        Object.keys(selectedSize[variantId]) 
          .filter((size) => selectedSize[variantId][size]) 
          .map((size) => {
           
            const product = products.find((p) =>
              p.groupedVariants?.some((v) => v.variants.some((variant) => variant.id === Number(variantId)))
            );
  
         
            if (!product) return null;
  
          
            const variant = product.groupedVariants?.find((v) => v.size === size);
  
      
            const selectedVariant = variant?.variants?.find((v) => v.id === Number(variantId));
  
            return {
              productId: product.productId, 
              productName:product.productName,
              size,
              colors: selectedColors[variantId]?.[size]?.colorHex || [], 
              variant,
              product
            };
          })
      ) 
      .filter((item) => item !== null && item.colors.length > 0); 
  
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
                        <div className="selected-color-box d-flex gap-3 overflow-auto" style={{width:'70%'}}>
                          {selectedColors[variant.id][variant.size].colorHex.map((color, index) => (
                            <div key={index} className="d-flex flex-column gap-2">
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: color.hexCode.trim(), 
                                  border: "1px solid #ccc",
                                }}
                              ></div>
                              <span style={{width:'2.5rem'}}>{color.colorName}</span>
                            </div>
                          ))}
                        </div>
                      )}


                        <span onClick={() => openCatalogue(variant,product.productId)} className="d-flex align-items-center">
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
          <CataloguePage onColorSelect={handleColorSelection} onClose={() => setShowCatalogue(false)} variant={currentVariant} id={currentId}/>
        )}
      </Modal.Body>
      <Modal.Footer className="flex justify-content-between" style={{ display: showCatalogue === true ? 'none' : 'flex'}}>
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
