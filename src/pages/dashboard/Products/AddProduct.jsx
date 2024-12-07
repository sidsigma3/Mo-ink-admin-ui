import React, { useState ,useContext } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import StatusFilter from "../../../components/Filter/DayFilter/StatusFilter/StatusFilter";
import { TextField } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { useNavigate ,useLocation} from "react-router-dom";
import ReactQuill from "react-quill";
import "./AddProduct.css";
import { SketchPicker } from "react-color";
import { IoMdAdd } from "react-icons/io";
import { Button } from "react-bootstrap";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddBtn from "../../../components/Buttons/Add/AddBtn";
import { ProductContext } from './../../../components/Context/ProductContext';
import DeleteBtn from "../../../components/Buttons/Delete/DeleteBtn";


const AddProduct = () => {

  const { state } = useLocation();
  const { products ,addProduct } = useContext(ProductContext);  
  const navigate = useNavigate();
  const product = state?.index !== undefined ? products[state.index] : null;
  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [status, setStatus] = useState(product?.status || "Active"); 

  

 

  const [formData, setFormData] = useState({
    productName: product?.productName || '',
    description: product?.description || '',
    pricePerKg: product?.pricePerKg || '',
    compareAtPrice: product?.compareAtPrice || '',
    costPerItem: product?.costPerItem || '',
    profit: product?.profit || '',
    margin: product?.margin || '',
    size: product?.size || '',
    stock: product?.stock || '',
    colorVariants: product?.colorVariants || [],
    status: product?.status || 'Active',
    media: product?.media || null,
  });

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMediaChange = (e) => {
    setFormData({ ...formData, media: e.target.files[0] });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  
  const handleSubmit = (e) => {
  e.preventDefault();

  const newProducts = sizeColorMap.map(({ size, colors }) => {
    const totalAvailable = calculateTotalAvailable(colors);
    const averagePrice = calculateAveragePrice(colors);

    return {
      ...formData,
      productId: `PRD${Date.now()}-${size}`, 
      size, // Add the size
      colorVariants: colors.map((color) => color.hex.trim()), 
      stock: totalAvailable, 
      price: averagePrice, 
      status,
      sizeColorMap,
      variants,
    };
  });

  if (state?.index !== undefined) {
   
    const updatedProducts = products.map((product) => {
      if (product.productName === formData.productName) {
      
        return {
          ...product,
          ...formData, 
          allVariants: newProducts, 
          sizeColorMap,
          variants, 
        };
      }
      return product; 
    });

  } else {
    
    newProducts.forEach((product) => addProduct(product));
  }

  navigate('/products');
};

 

  const [sizes, setSizes] = useState([{ value: "" }]); 
  const [colors, setColors] = useState([{ color: "white" }]); 
  const [sizeColorMap, setSizeColorMap] = useState(product?.sizeColorMap || []);

  console.log(sizeColorMap)

  const generateSizeColorMap = () => {
    const sizes = variants.find(v => v.name.toLowerCase() === "size")?.values || [];
    const colors = variants.find(v => v.name.toLowerCase() === "color")?.values || [];
  
    const map = sizes.map(size => {
      return {
        size: size.value,
        colors: colors.map(color => ({
          name: color.color,
          hex: color.hex
        }))
      };
    });
  
    setSizeColorMap(map);
  };
  


  const handleSizeChange = (index, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index].value = value;
    setSizes(updatedSizes);
  };


  const addSizeField = () => {
    setSizes([...sizes, { value: "" }]);
  };


  const removeSizeField = (index) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
  };

  
  const handleColorChange = (index, color) => {
    const updatedColors = [...colors];
    updatedColors[index].color = color.hex;
    setColors(updatedColors);
  };


  const addColorField = () => {
    setColors([...colors, { color: "white" }]);
  };


  const removeColorField = (sizeIndex, colorIndex) => {
    const updatedMap = [...sizeColorMap];
    updatedMap[sizeIndex].colors = updatedMap[sizeIndex].colors.filter(
      (_, index) => index !== colorIndex
    );
    setSizeColorMap(updatedMap);
  };



  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const [showColorPicker, setShowColorPicker] = useState({});

  const toggleColorPicker = (index) => {
    setShowColorPicker((prevState) => ({
      ...prevState,
      [index]: !prevState[index], 
    }));
  };

  const addColorToList = () => {};

  const [variants, setVariants] = useState(product?.variants || []);
  const [expandedVariant, setExpandedVariant] = useState(null);

  const addVariant = () => {
    setVariants([
      ...variants,
      { name: "", values: [{ value: "", color: "", hex: "" }] },
    ]);
    setExpandedVariant(variants.length); // Automatically expand the new variant
  };

  const handleVariantNameChange = (index, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index].name = value;
    setVariants(updatedVariants);
  };

  const handleVariantValueChange = (variantIndex, valueIndex, key, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].values[valueIndex][key] = value;
    setVariants(updatedVariants);
  };

  const handleVariantValueChangeTable = (sizeIndex, colorIndex, key, value) => {
    setSizeColorMap((prev) => {
      const updatedMap = [...prev];
      // Ensure `colors` exists and `colorIndex` is valid
      if (updatedMap[sizeIndex]?.colors[colorIndex]) {
        updatedMap[sizeIndex].colors[colorIndex][key] = value;
      }
      return updatedMap;
    });
  };


// const handleVariantValueChange = (variantIndex, valueIndex, key, value) => {
//     setVariants((prevVariants) => {
//       const updatedVariants = [...prevVariants];
  
//       // Check if the variant and value index exist to avoid undefined errors
//       if (
//         updatedVariants[variantIndex] &&
//         updatedVariants[variantIndex].values &&
//         updatedVariants[variantIndex].values[valueIndex]
//       ) {
//         updatedVariants[variantIndex].values[valueIndex][key] = value;
//       }
  
//       return updatedVariants;
//     });
//   };
  
  

  const addVariantValue = (index) => {
    const updatedVariants = [...variants];
    updatedVariants[index].values.push({ value: "", color: "", hex: "" });
    setVariants(updatedVariants);
  };

  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
    setExpandedVariant(null);
  };

  const handleDone = () => {
    setExpandedVariant(null); // Collapse all forms
  };

  const toggleExpand = (index) => {
    setExpandedVariant(expandedVariant === index ? null : index);
  };


  const calculateTotalAvailable = (colors) => {
    return colors.reduce((sum, color) => sum + (Number(color.available) || 0), 0);
  };
  
  const calculateAveragePrice = (colors) => {
    const prices = colors.map((color) => Number(color.price) || 0).filter((price) => price > 0);
    return prices.length > 0 ? (prices.reduce((sum, price) => sum + price, 0) / prices.length).toFixed(2) : "";
  };
  
  
  const updateColorField = (sizeIndex, colorIndex, field, value) => {
    const updatedMap = [...sizeColorMap];
    updatedMap[sizeIndex].colors[colorIndex][field] = value;
    setSizeColorMap(updatedMap);
  };
  

 

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  
  };

  const handleDeleteVariant = (variantIndex, valueIndex,e) => {
    e.stopPropagation();

    // Deep copy the variants state to avoid direct mutation
    const updatedVariants = [...variants];
  
    // Update the specific variant's values by filtering out the value at valueIndex
    updatedVariants[variantIndex].values = updatedVariants[variantIndex].values.filter(
      (_, index) => index !== valueIndex
    );
  
    // Update the state
    setVariants(updatedVariants);
  };
  

  const handleAddColor = (sizeIndex) => {
  const newColor = {
    name: "New Color",  // Default name
    hex: "#FFFFFF",     // Default hex color
    available: "",      // Default availability
    price: "",          // Default price per kg
  };

  setSizeColorMap((prev) => {
    return prev.map((entry, index) => {
      if (index === sizeIndex) {
        return {
          ...entry,
          colors: [...(entry.colors || []), newColor], // Add new color without mutating
        };
      }
      return entry; // Return other entries unchanged
    });
  });
};

  
  
  

  
  return (

    <div className="add-product-ctn">
        <div className='top d-flex gap-3' style={{cursor:"pointer"}}>
            <span onClick={() => navigate('/products')}><IoArrowBackOutline size={25}/></span>
            <h5>Add Products</h5>
        </div>

    <div className="add-product d-flex gap-2">
      <div className="left w-75 flex-grow-1">
        <div className="info-inputs-ctn p-3 rounded">
          <div className="title-ctn d-flex flex-column p-2">
            <label>Titile</label>
            <input
              className="ps-1"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
            />
          </div>

          <div className="desc-input-ctn d-flex flex-column p-2">
            <label>Description</label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Write your description here..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }], 
                  ["bold", "italic", "underline", "strike"], 
                  [{ color: [] }, { background: [] }], 
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"], 
                  ["clean"], 
                  ["undo", "redo"], 
                ],
              }}
            />
          </div>

          <div className="media-input-ctn mt-5 p-2">
            <label>Media</label>
            <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
              <input type="file" onChange={handleMediaChange}></input>
              <h4>Accepts images,videos,or 3D models</h4>
            </div>
          </div>
        </div>

        <div className="pricing-ctn mt-2 p-3 rounded">
          <h3 className="mb-3">Pricing</h3>
          <div className="row">
            <div className="d-flex flex-column col">
              <label>Price/Kg</label>
              <input 
                 type="number"
                 name="pricePerKg"
                 value={formData.pricePerKg}
                 onChange={handleInputChange}
              ></input>
            </div>

            <div className="d-flex flex-column col">
              <label>Compare-at-price</label>
              <input 
               type="number"
               name="compareAtPrice"
               value={formData.compareAtPrice}
               onChange={handleInputChange}
              >
              </input>
            </div>
          </div>

          <div className="row mt-2">
            <div className="d-flex flex-column flex-grow-1 col-lg-3 col-sm-12">
              <label>Cost Per item/Kg</label>
              <input
                type="number"
                name="costPerItem"
                value={formData.costPerItem}
                onChange={handleInputChange}             
               >
              </input>
            </div>

            <div className="d-flex flex-column flex-grow-1 col-lg-3 col-sm-6">
              <label>Profit</label>
              <input 
              type="number"
              name="profit"
              value={formData.profit}
              onChange={handleInputChange}
              ></input>
            </div>

            <div className="d-flex flex-column flex-grow-1 col-lg-3 col-sm-6">
              <label>Margin</label>
              <input 
               type="number"
               name="margin"
               value={formData.margin}
               onChange={handleInputChange}
              ></input>
            </div>
          </div>
        </div>

        <div className="variant-ctn mt-2 p-3 rounded">
            <div className="top d-flex justify-content-between">
                <h4>Variant</h4>
            <button 
            style={{display:"flex",gap:"1rem" ,alignItems:"center"}}
            onClick={addVariant}>
            <span><IoMdAddCircleOutline size={20}/></span>
            </button>
            </div>
     
      {variants.map((variant, variantIndex) => (
        <div className="variant-add" key={variantIndex} style={{ marginBottom: "20px" }}>
          {/* Collapsible Header */}
         
          {expandedVariant != variantIndex && (
          <div
            className="size-sec mt-2"
            style={{
              cursor: "pointer",
              padding: "10px",
              borderRadius: "5px",
            }}
            onClick={() => toggleExpand(variantIndex)}
          >
            <div className="d-flex justify-content-between w-100">
            <h4>
              {variant.name || "New Variant"} 
            </h4>

            <button className="delete-btn p-2" onClick={() => removeVariant(variantIndex)}> <MdDeleteOutline  size={20}/></button>
            </div>
            <div>
            {variant.name.toLowerCase() === "size" && (
                      <ul className="d-flex gap-2">
                        {variant.values.map((value, valueIndex) => (
                            <li
                            style={{
                              marginBottom: "10px",
                              listStyle: "none",
                              padding: "0.3rem 0.8rem",
                              background: "#f0f0f0",
                              borderRadius: "1rem",
                              width:"5rem",
                              display:"flex",
                              justifyContent:"center"
                            }}
                          >
                            {value.value}
                          </li>

                        ))}
                        </ul>
            )}

            {variant.name.toLowerCase() === "color" && (
                      <ul className="d-flex gap-2">
                        {variant.values.map((value, valueIndex) => (
                             <li
                             style={{
                                display:'flex',
                                flexDirection:'column',
                                justifyContent:'center',
                                alignItems:'center',
                               listStyle: "none",
                               padding: "0.3rem 0.8rem",
                            
                              
                               
                             }}
                           >
                                <div
                                  style={{
                                    backgroundColor: value.hex,
                                    width: "25px",
                                    height: "25px",
                                    borderRadius: "50%",
                                    border: "1px solid #ccc",
                                    marginBottom: "5px",
                                  }}
                                ></div>
                                 <span>{value.color}</span>
                           </li>
                        ))}
                        </ul>
                 )}
            </div>
          </div>
          )}

          {/* Collapsible Content */}
          {expandedVariant === variantIndex && (
            <div className="size-sec mt-2"  onClick={() => toggleExpand(variantIndex)} >
                <div>
                <label>Variant Name:</label>
                </div>
                <div className="mt-1">
                <input
                 className="w-100"
                  type="text"
                  value={variant.name}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleVariantNameChange(variantIndex, e.target.value)
                  }
                  placeholder="e.g., Size or Color"
                />
              </div>
              <div>
              <label className="ms-5 mt-2">Variant Values</label>
                 </div> 
           

              
                {variant.values.map((value, valueIndex) => (
                  <div
                    key={valueIndex}
                   
                  >
                    {variant.name.toLowerCase() === "size" && (
                      <div className="variant-value d-flex gap-2">
                      <input
                        className="flex-grow-1"
                        type="text"
                        onClick={(e) => e.stopPropagation()}
                        value={value.value}
                        onChange={(e) =>
                          handleVariantValueChange(
                            variantIndex,
                            valueIndex,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Size (e.g., Large)"
                      />

                      <input
                        className="flex-grow-1"
                         onClick={(e) => e.stopPropagation()}
                         onChange={(e) =>
                        handleVariantValueChange(
                          variantIndex,
                          valueIndex,
                          "hex",
                          e.target.value
                        )
                      }
                      type="text"
                      placeholder="description"
                      >
                      
                      </input>

                        <button

                        onClick={(e) => handleDeleteVariant(variantIndex,valueIndex,e)}
                        style={{
                            border:"none",
                            background:"none",
                            color:"red",
                            marginBottom:"0.3rem"
                        }}
                        > 
                        <MdDeleteOutline  size={20}/></button>
                      
                      </div>
                    )}

                    {variant.name.toLowerCase() === "color" && (
                      <div className="variant-value d-flex justify-content-between align-items-center gap-3">
                        <input
                          className="flex-grow-1"
                          type="text"
                          onClick={(e) => e.stopPropagation()}
                          value={value.color}
                          onChange={(e) =>
                            handleVariantValueChange(
                              variantIndex,
                              valueIndex,
                              "color",
                              e.target.value
                            )
                          }
                          placeholder="Color Name"
                          
                        />
                        <input
                          className="flex-grow-1"
                          type="text"
                          onClick={(e) => e.stopPropagation()}
                          value={value.hex}
                          onChange={(e) =>
                            handleVariantValueChange(
                              variantIndex,
                              valueIndex,
                              "hex",
                              e.target.value
                            )
                          }
                          placeholder="Hex Code (#FFFFFF)"
                          style={{ marginRight: "10px" }}
                        />
                        <div
                          style={{
                            backgroundColor: value.hex,
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            border: "1px solid #ccc",
                          }}
                        ></div>
                        <button

                        onClick={(e) => handleDeleteVariant(variantIndex,valueIndex,e)}
                        style={{
                            border:"none",
                            background:"none",
                            color:"red",
                            marginBottom:"0.3rem"
                        }}
                        > 
                        <MdDeleteOutline  size={20}/>
                        </button>

                     
                      </div>
                    )}
                  </div>
                ))}

                <div className="d-flex btn-ctn gap-2 mt-2 justify-content-center mt-3">
                <button 
                className="add-more p-2" 
                onClick={(e) => {
                    e.stopPropagation();
                    addVariantValue(variantIndex);
                  }}
                >
                  Add Value
                </button>
              
              <button
              className="add-more p-2"
                onClick={handleDone}
              >
                Done
              </button>
              </div>
            </div>
          )}

          
        </div>
        
      ))}


                    {variants.length > 0 && (
                        <div className="d-flex justify-content-end">
                        <button
                            style={{
                                backgroundColor:"#EFEFEF",
                                border:"1px solid #CDCDCD",
                                padding:"0.4rem",
                                borderRadius:"0.3rem",
                                fontSize:"0.8rem"
                            }}
                            onClick={generateSizeColorMap}
                        >
                            Submit
                        </button>
                        </div>
                    )}
        

                {Object.keys(sizeColorMap).length > 0 && (
                    <div className="variant-table-ctn">
                <table  className="variant-table">
                <thead>
                <tr>
                    <th>Counter</th>
                    <th>Variants</th>
                    <th>Available</th>
                    <th>Price/Kg</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {sizeColorMap.map((entry, sizeIndex) => (
                <React.Fragment key={sizeIndex}>
                  
                    <tr onClick={() => toggleRow(sizeIndex)} style={{ cursor: "pointer" }}>
                    <td>
                       <div style={{backgroundColor: "#f0f0f0",borderRadius:"1rem",padding:'0.3rem 1rem',display:"flex",justifyContent:"center"}}>
                       {entry.size}
                       </div>
                    </td> 
                    <td>{entry.colors.length} Variants</td> 
                    <td>
                        <input
                        type="text"
                        placeholder="Available"
                        onClick={(e) => e.stopPropagation()}
                        value={calculateTotalAvailable(entry.colors)}
                        readOnly
                        />
                    </td>
                    <td>
                        <input
                        type="text"
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Price/Kg"
                        value={calculateAveragePrice(entry.colors)}
                        readOnly
                        />
                    </td>
                    <td>
                        <button 
                         onClick={(e) => {
                            e.stopPropagation();
                            handleAddColor(sizeIndex);
                          }}
                        style={{ padding: "5px" , background:"none",border:"none" ,color:"#0561FC"}}
                        ><IoMdAddCircleOutline size={20}/></button>
                    </td>
                    </tr>

                    {/* Expandable Rows */}
                    {expandedRow === sizeIndex &&
                    entry.colors.map((color, colorIndex) => (
                        <tr key={colorIndex}>
                        <td >
                        
                        </td>
                        <td style={{ alignItems: "center" }} className="d-flex justify-content-between">
                            <div >
                            <div
                            style={{
                                backgroundColor: color.hex,
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                border: "1px solid #ccc",
                                marginRight: "10px",
                            }}
                            ></div>

                                {color.name}
                            </div>
                            
                         
                            
                            <input
                                className="w-50"
                                type="text"
                                value={color.hex || ""}
                                onChange={(e) =>
                                handleVariantValueChangeTable(sizeIndex, colorIndex, "hex", e.target.value)
                                }
                                placeholder="Hex Code (#FFFFFF)"
                            />
                            
                            </td>
                        <td>
                            <input
                            type="number"
                            value={color.available || ""}
                            onChange={(e) =>
                                updateColorField(sizeIndex, colorIndex, "available", e.target.value)
                            }
                            placeholder="Available"
                            />
                        </td>
                        <td>
                            <input
                            type="number"
                            value={color.price || ""}
                            onChange={(e) =>
                                updateColorField(sizeIndex, colorIndex, "price", e.target.value)
                            }
                            placeholder="Price/Kg"
                            />
                        </td>
                        <td>
                            <button
                            onClick={() => removeColorField(sizeIndex, colorIndex)}
                            style={{ padding: "5px",background:"none",border:"none",color:"#FF3232" }}
                            >
                            <MdDeleteOutline  size={20}/>
                            </button>
                        </td>
                        </tr>
                    ))
                    
                    }
                </React.Fragment>
                ))}


                            </tbody>
                        </table>
                        </div>
                        
                )}

       
    </div>

    <div className="w-100 d-flex justify-content-between mt-2">
        <DeleteBtn></DeleteBtn>

        <AddBtn clickFunction={handleSubmit} text={'Save'}></AddBtn>
    </div>


      </div>

      <div className="right w-25 flex-grow-1">
        <div className="status-ctn p-3 gap-3 rounded">
          <h3 className="mb-2">Status</h3>
          <StatusFilter status={status} onStatusChange={handleStatusChange}></StatusFilter>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddProduct;
