import React, { useState } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { SketchPicker } from "react-color";
import { IoIosArrowDown } from "react-icons/io";
import Collapse from "react-bootstrap/Collapse";
import { IoMdAdd } from "react-icons/io";
import "./ModalOrder.css"

const ModalOrder = ({ show, handleClose, products, addToCart , onOrderCreate}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColors, setSelectedColors] = useState("#000000");
  const [selectedProducts, setSelectedProducts] = useState({});

  const [open, setOpen] = useState(false);

  const [openProductId, setOpenProductId] = useState(null);

  const [showColorPicker, setShowColorPicker] = useState({});

  const [selectedColor, setSelectedColor] = useState("#000000");
  const [colorList, setColorList] = useState({});
  const [selectedSize,setSelectedSize] = useState({})
  

  console.log(selectedSize)
  console.log(colorList)


  const sizeSelectHandler = (productId, size) => {
    setSelectedSize((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}), // Initialize product object if it doesn't exist
        [size]: !prev[productId]?.[size], // Toggle selected state for the specific size
      },
    }));
  };

  
  




  const toggleCollapse = (productId) => {
    setOpenProductId(openProductId === productId ? null : productId); 
  };

  const handleSelectSize = (productId, size) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [size]: {
          colors: prev[productId]?.[size]?.colors || [],
        },
      },
    }));
  };

  const handleSelectColor = (productId, size, color) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [size]: {
          ...prev[productId][size],
          colors: [...new Set([...prev[productId][size].colors, color])], // Unique colors
        },
      },
    }));
  };

  const handleAddToCart = () => {
    const itemsToCart = Object.keys(selectedProducts)
      .map((productId) => {
        const sizes = selectedProducts[productId];
        return Object.keys(sizes).map((size) => ({
          productId,
          size,
          colors: sizes[size].colors,
        }));
      })
      .flat();
    addToCart(itemsToCart);
    handleClose();
  };


  



  const toggleColorPicker = (size) => {
    setShowColorPicker((prevState) => ({
      ...prevState,
      [size]: !prevState[size], // Toggle visibility for the clicked size
    }));
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Update the selected color
  };

  // Add selected color to the product's color list
  const addColorToList = (productId, size) => {
    setColorList((prevState) => {
      const updatedColors = {
        ...prevState,
        [productId]: {
          ...prevState[productId],
          [size]: [
            ...(prevState[productId]?.[size] || []), // Keep existing colors, if any
            selectedColor, // Add the new selected color
          ],
        },
      };
      return updatedColors;
    });
    // Close the color picker after adding the color
    setShowColorPicker((prevState) => ({
      ...prevState,
      [size]: false,
    }));
  };


 
  // Example usage: Logging the order object when a button is clicked
  const handleOrderCreation = () => {
    const order = Object.keys(selectedSize)
      .map((productId) => {
        // Find the product details by productId
        const product = products.find((p) => String(p.id) === String(productId));
        console.log(productId)
        console.log(product.name)
  
        return Object.keys(selectedSize[productId])
          .filter((size) => selectedSize[productId][size])
          .map((size) => ({
            productId,
            productName: product ? product.name : 'Product', 
            size,
            color: colorList[productId]?.[size] || 'default color', 
          }));
      })
      .flat();
  
    // Pass the order details to the parent component
    onOrderCreate(order);
    handleClose()
  };




  return (
    <Modal className="modal" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>All Products</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {products.map((product) => (
          <div key={product.id}>
            <div
              className="mb-4 d-flex justify-content-between align-items-center"
              onClick={() => toggleCollapse(product.id)} // Toggle the specific product's collapse
              aria-controls={`collapse-${product.id}`}
              aria-expanded={openProductId === product.id}
            >
              <h5>{product.name}</h5>
              <span>
                <IoIosArrowDown />
              </span>
            </div>

            <Collapse in={openProductId === product.id}>
              <div id={`collapse-${product.id}`}>
                {product.size.map((size) => (
                  <div
                    key={size}
                    className="size-section mb-3 d-flex justify-content-between"
                  > 

                    <div className="d-flex align-items-center gap-5">

                    <button   key={size} onClick={()=>sizeSelectHandler(product.id,size)} className={selectedSize[product.id]?.[size]? 'selected' : 'not-selected' }>Size: {size}</button>
                  
                     <div className="d-flex gap-2">
                       
                        {(colorList[product.id]?.[size] || [] ).map((color, index) => (
                        <button
                            key={index}
                            style={{
                            backgroundColor: color,
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            padding:"0"
                            }}
                        ></button>
                        ))}
                    </div>
                    </div>

                    <span onClick={() => toggleColorPicker(size)}>
                        <img src="./color-wheel.png"></img>
                    </span>

               
                    {showColorPicker[size] && (
                      <div className="color-picker-ctn">
                        <SketchPicker
                          color={selectedColor}
                          onChange={handleColorChange}
                          className="color-picker"
                        />
                        <Button
                          className="add-color"
                          variant="primary"
                          onClick={() => addColorToList(product.id, size)}
                        >
                          Import <span><IoMdAdd /></span>
                        </Button>
                      </div>
                    )}

                    {/* {product.stock && product.stock[size] ? (
                      <div className="mt-2">
                        <h6>{product.stock[size]} Kgs in Stock</h6>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <h6>Null</h6>
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            </Collapse>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
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
