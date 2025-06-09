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
  const [productImage,setProductImage] = useState([])
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

 
  const openCatalogue = (variant,id,imageUrl) => {
    setCurrentId(id)
    setCurrentVariant(variant);
    setShowCatalogue(true);
    setProductImage(imageUrl)
  };

 
  const handleColorSelection = (selectedColorArray) => {
    if (!currentVariant) return;
  
    setSelectedColors((prev) => ({
      ...prev,
      [currentId]: {
        ...(prev[currentId] || {}),
        [currentVariant.size]: selectedColorArray, // ✅ storing array of full color+type objects
      },
    }));
  
    setShowCatalogue(false);
  };
  
  


  
  const handleOrderCreation = () => {
    const order = Object.entries(selectedColors).flatMap(([productId, sizes]) =>
      Object.entries(sizes).flatMap(([size, colorArray]) => {
        const product = products.find((p) => p.productId === Number(productId));
        if (!product) return [];
  
        const sizeGroup = product.groupedVariants.find((group) => group.size === size);
        if (!sizeGroup) return [];
  
        return colorArray.flatMap((colorData) => {
          const colorGroup = sizeGroup.variants.find(
            (v) =>
              v.colorName === colorData.colorName &&
              v.hexCode.toLowerCase() === colorData.hexCode.toLowerCase()
          );
          if (!colorGroup) return [];
  
          const matchingVariant = colorGroup.variants.find(
            (variant) => variant.variantType === colorData.variantType
          );
          if (!matchingVariant) return [];
  
          return {
            productId: product.productId,
            productName: product.productName,
            size,
            color: {
              name: colorData.colorName,
              hex: colorData.hexCode,
            },
            variantType: matchingVariant.variantType,
            price: matchingVariant.price,
            markupPricePerKg: matchingVariant.markupPricePerKg,
            available: matchingVariant.available,
            gstOnProduct: product.gstOnProduct,
            productImage: product.productImage,
            variantId: matchingVariant.id,
          };
        });
      })
    );
  
    onOrderCreate(order);
    handleClose();
  };
  


  console.log(products)


  return (
    <Modal className="modal" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>All Products</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showCatalogue ? (
          products
            .filter((product) => product.availableStatus === "ACTIVE")
            .map((product) => (
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
                        <div
                          key={variant.id}
                          style={{fontSize:'0.8rem'}}
                          // onClick={() => sizeSelectHandler(variant.id, variant.size)}
                          className='rounded-pill border bg-secondary-subtle px-3 py-1'
                        >
                          Size: {variant.size}
                        </div>
                      </div>

                  
                      {selectedColors[product.productId]?.[variant.size] && (
                        <div className="selected-color-box d-flex gap-3 overflow-auto" style={{ width: '70%' }}>
                          {Object.values(
                            selectedColors[product.productId][variant.size].reduce((acc, color) => {
                              const key = `${color.colorName}-${color.hexCode}`;
                              if (!acc[key]) {
                                acc[key] = color;
                              }
                              return acc;
                            }, {})
                          ).map((color, index) => (
                            <div key={index} className="d-flex flex-column gap-2 align-items-center">
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: color.hexCode.trim(),
                                  border: "1px solid #ccc",
                                }}
                              />
                              <span style={{ fontSize: '0.7rem', width: '2.5rem', textAlign: 'center' }}>
                                {color.colorName}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}



                        <span onClick={() => openCatalogue(variant,product.productId,product.productImage)} className="d-flex align-items-center">
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
          <CataloguePage onColorSelect={handleColorSelection} onClose={() => setShowCatalogue(false)} variant={currentVariant} id={currentId} imageUrl={productImage}/>
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
