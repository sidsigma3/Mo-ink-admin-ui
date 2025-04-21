import React, { useState ,useContext , useEffect } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import StatusFilter from "../../../components/Filter/DayFilter/StatusFilter/StatusFilter";
import { TextField } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { useNavigate ,useLocation} from "react-router-dom";
import ReactQuill from "react-quill";
import "./AddProduct.css";
import { SketchPicker } from "react-color";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddBtn from "../../../components/Buttons/Add/AddBtn";
import { ProductContext } from './../../../components/Context/ProductContext';
import DeleteBtn from "../../../components/Buttons/Delete/DeleteBtn";
import SubmitBtn from "../../../components/Buttons/Submit/SubmitBtn";
import { addProduct , deleteProduct, updateProduct } from "../../../services/ProductService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Button } from "react-bootstrap";
import ImportBtn from "../../../components/Buttons/Import/ImportBtn";
import ExportBtn from "../../../components/Buttons/Export/ExportBtn";
import StatusInput from "../../../components/StatusInput/StatusInput";

const AddProduct = () => {

  const { state } = useLocation();
  const { index, ix, finalData } = state || {}; // Provide a default empty object
  const [errors, setErrors] = useState({});
  const [sizeColorError, setSizeColorError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const product = (typeof index === 'number' && finalData) ? finalData[index] : null;

  
  
 
  const transformProductData = (product) => {
    if (!product || !product.groupedVariants) return { variants: [], sizeColorMap: [] };
  
    const groupedVariants = product.groupedVariants;
  
    // Extract unique sizes
    const sizes = groupedVariants.map((group) => ({
      value: group.size,
    }));
  
    // Extract unique colors
    const uniqueColors = [];
    const colorHexMap = new Map(); // To avoid duplicates
    groupedVariants.forEach((group) => {
      group.variants.forEach((variant) => {
        const hexKey = variant.hexCode?.toLowerCase();
        if (hexKey && !colorHexMap.has(hexKey)) {
          colorHexMap.set(hexKey, {
            value: variant.colorName,
            color: variant.colorName,
            hex: variant.hexCode,
            id: variant.id, // Include ID if available
          });
        }
      });
    });
  
    console.log(groupedVariants)

    // Build sizeColorMap
    const sizeColorMap = groupedVariants.map((group) => ({
      size: group.size,
      colors: group.variants.map((variant) => ({
        color: variant.colorName,
        hex: variant.hexCode,
        available: variant.available,
        price: variant.pricePerKg,
        id: variant.id,
        costPerKg: variant.costPerKg,
        markupPricePerKg: variant.markupPricePerKg,
      })),
    }));
  
    const variants = [
      { name: "size", values: sizes },
      { name: "color", values: [...colorHexMap.values()] },
    ];
  
    return { variants, sizeColorMap };
  };
  




  // const product =
  //   state?.index !== undefined
  //     ? finalData[index].groupedVariants[ix]
  //     : null;

  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [status, setStatus] = useState(product?.availableStatus || "Active"); 

  
 
 

  const [formData, setFormData] = useState({
    productName: product?.productName || '',
    description: product?.productDescription || '',
    pricePerKg: product?.pricePerKg || '',
    compareAtPrice: product?.compareAtPrice || '',
    costPerItem: product?.costPerItemPerKg || '',
    profit: product?.profit || '',
    gst: product?.gstOnProduct || '',
    size: product?.size || '',
    stock: product?.stock || '',
    colorVariants: product?.groupedVariants || [],
    status: product?.availableStatus || 'Active',
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

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({}); // Reset errors before validation

    // Validation checks
    let validationErrors = {};

    if (!formData.productName.trim()) validationErrors.productName = "Product name is required.";
    if (!formData.description.trim()) validationErrors.description = "Description is required.";
    // if (!formData.pricePerKg || formData.pricePerKg <= 0) validationErrors.pricePerKg = "Valid price per Kg is required.";
    // if (!formData.costPerItem || formData.costPerItem <= 0) validationErrors.costPerItem = "Valid cost per item is required.";
    // if (!formData.compareAtPrice || formData.compareAtPrice <= 0) validationErrors.compareAtPrice = "Valid Compare at price is required.";
    // if (!formData.media) validationErrors.media = "Please upload a product image or media.";
    if (!formData.gst || formData.gst < 0) validationErrors.gst = "Valid GST value is required.";
    if (variants.length<2) validationErrors.variants = "At (Size & Color) variant is required.";
    if (sizeColorMap.length<2) validationErrors.sizeColorMap = "Size and color combination is required.";

    // Stop submission if there are errors
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    console.log(product)

    const plainTextDescription = formData.description.replace(/<\/?[^>]+(>|$)/g, "");
    // Create variants with calculated prices and availability

    const newVariants = sizeColorMap.flatMap(({ size, colors }) => {
      return colors.map((color) => ({
        size,
        color: {
          colorName: color.color,
          hexCode: color.hex,
        },
        availableWeight: Number(color.available),
        pricePerKg: Number(color.price),
        costPerKg: Number(color.costPerKg || 0),
        markupPricePerKg: Number(color.markupPricePerKg || 0),
      }));
    });
    
    const averagePrice = sizeColorMap.reduce(
      (acc, { colors }) => {
        const total = colors.reduce((sum, color) => sum + Number(color.price), 0);
        return acc + total;
      },
      0
    ) / sizeColorMap.reduce((count, { colors }) => count + colors.length, 0);
    
    const formattedData = {
      title: formData.productName,
      description: plainTextDescription,
      media: [formData.media] || ['localhost:8080/api/img'],
      availableStatus: status,
      productType: {
        productName: formData.productName,
        description: formData.description,
      },
      gstOnProduct: Number(formData.gst),
      variants: [],
      deletedVariantIds: [],
    };
    
    try {
      if (state?.index !== undefined) {
        const productId = product.productId;
        const originalGrouped = product.groupedVariants || [];
    
        const changedVariants = [];
        const newVariantIds = new Set();
        const existingVariantIds = new Set();
    
        // Track existing variant IDs from original product
        originalGrouped.forEach(group =>
          group.variants.forEach(variant => existingVariantIds.add(variant.id))
        );
    
        // Detect changed and track new variant IDs
        newVariants.forEach((newVar) => {
          if (newVar.id) newVariantIds.add(newVar.id);
    
          const matchSizeGroup = originalGrouped.find(g => g.size === newVar.size);
          const matchColor = matchSizeGroup?.variants.find(
            old => old.colorName === newVar.color.colorName &&
                   old.hexCode.toLowerCase() === newVar.color.hexCode.toLowerCase()
          );
          
    
          if (!matchColor ||
            matchColor.available !== newVar.availableWeight ||
            matchColor.pricePerKg !== newVar.pricePerKg ||
            matchColor.costPerKg !== newVar.costPerKg ||
            matchColor.markupPricePerKg !== newVar.markupPricePerKg ||
            matchColor.hexCode !== newVar.color.hexCode
          ) {
            changedVariants.push(newVar);
          }
        });
    
        // Determine deleted variant IDs
        const deletedIds = [];

        originalGrouped.forEach(group => {
          group.variants.forEach(variant => {
            const stillExists = newVariants.some(newVar =>
              newVar.size === group.size &&
              newVar.color.hexCode.toLowerCase() === variant.hexCode.toLowerCase()
            );
        
            if (!stillExists) {
              deletedIds.push(variant.id); // only push if it's actually not found
            }
          });
        });
    
        formattedData.variants = changedVariants;
        formattedData.deletedVariantIds = deletedIds;
    
        await updateProduct(productId, formattedData);
      } else {
        formattedData.variants = newVariants;
        await addProduct(formattedData);
      }
    
      navigate('/products');
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  }

  
  const [variants, setVariants] = useState(product?.variants || []);
  const [expandedVariant, setExpandedVariant] = useState(null);

  const [sizes, setSizes] = useState([{ value: "" }]); 
  const [colors, setColors] = useState([{ color: "white" }]); 
  const [sizeColorMap, setSizeColorMap] = useState(product?.sizeColorMap || []);

  useEffect(() => {
    if (product) {
      const { variants: newVariants, sizeColorMap: newSizeColorMap } = transformProductData(product);
      setVariants(newVariants);
      setSizeColorMap(newSizeColorMap);
    }
  }, [product]);

  const generateSizeColorMap = () => {
    setSizeColorError("");

    const sizes = variants.find(v => v.name.toLowerCase() === "size")?.values || [];
    const colors = variants.find(v => v.name.toLowerCase() === "color")?.values || [];

    if (sizes.length === 0 || colors.length === 0) {
      setSizeColorError("Please add both Size and Color variants before generating the map.");
      return;
    }

    // Get the current sizeColorMap state
    setSizeColorMap(prevMap => {
        // Create a map of sizes and their respective colors from the previous state
        const existingMap = prevMap.reduce((acc, item) => {
            acc[item.size] = item.colors;
            return acc;
        }, {});

        // Generate the new map based on current sizes and colors
        const newMap = sizes.map(size => {
            const existingColors = existingMap[size.value] || []; // Get existing colors for the size
            const newColors = colors.map(color => ({
                color: color.color,
                hex: color.hex
            }));

            // Merge existing colors and new colors (prevent duplicates)
            const mergedColors = [
                ...existingColors,
                ...newColors.filter(
                    newColor => !existingColors.some(existingColor => existingColor.hex === newColor.hex)
                )
            ];
            return {
              size: size.value,
              colors: mergedColors
          };
      });

      return newMap;
  });
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

  const calculateAverageCostPerKg = (colors) => {
    const values = colors.map((c) => Number(c.costPerKg) || 0).filter((v) => v > 0);
    return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : "";
  };

  const calculateAverageMarkupPrice = (colors) => {
    const values = colors.map((c) => Number(c.markupPricePerKg) || 0).filter((v) => v > 0);
    return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : "";
  };
  
  
  const updateColorField = (sizeIndex, colorIndex, field, value) => {
    setSizeColorMap((prevMap) => {
      return prevMap.map((sizeItem, sIdx) => {
        if (sIdx !== sizeIndex) return sizeItem; // Keep other sizes unchanged
  
        return {
          ...sizeItem,
          colors: sizeItem.colors.map((colorItem, cIdx) => {
            if (cIdx !== colorIndex) return colorItem; // Keep other colors unchanged
  
            return {
              ...colorItem,
              [field]: value, // Update the specific field (available or price)
            };
          }),
        };
      });
    });
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
    color: "New Color",  // Default name
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

  
  
const handleDelete = async () => {
  const isConfirmed = window.confirm("Are you sure you want to delete this product?");
  if (!isConfirmed) return; // Stop if the user cancels

  try {
    const productId = product.productId;
    await deleteProduct(productId);
    navigate('/products'); // Redirect after deletion
  } catch (error) {
    console.error("Error Deleting product:", error);
  }
};


const [selectedFile, setSelectedFile] = useState(null);
  
// Open modal
const openModal = () => setShowModal(true);

// Close modal
const closeModal = () => {
  setShowModal(false);
  setSelectedFile(null);
};

// Handle file selection
const handleFileChange = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  // Validate file type
  if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
    alert("Invalid file type. Please upload an Excel file.");
    return;
  }

  setSelectedFile(file);
};

// Handle file upload & process Excel data
const handleUpload = () => {
  if (!selectedFile) {
    alert("Please select a file to upload.");
    return;
  }

  const reader = new FileReader();
  reader.readAsBinaryString(selectedFile);

  reader.onload = (e) => {
    try {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet data to JSON
      const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!data.length) {
        alert("The uploaded file is empty.");
        return;
      }

      console.log("Parsed Data:", data);
      parseSizeColorData(data); // Call your processing function

      // Close modal after processing
      closeModal();
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Error processing the file. Please try again.");
    }
  };

  reader.onerror = () => {
    alert("Error reading file. Please try again.");
  };
};

const parseSizeColorData = (data) => {
  const sizeColorMap = new Map();

  data.forEach((row) => {
    const size = row.Size ? String(row.Size).trim() : null;
    const colorName = row.Color ? row.Color.trim() : null;
    const hexCode = row.HexCode ? row.HexCode.trim().toLowerCase() : null;
    const available = row.Availability ? Number(row.Availability) : 0;
    const price = row.PricePerKg ? Number(row.PricePerKg) : 0;
    const costPerKg = row.costPerKg ? Number(row.costPerKg) : 0;
    const markupPricePerKg = row.markupPricePerKg ? Number(row.markupPricePerKg) : 0;

    if (size && colorName && hexCode) {
      if (!sizeColorMap.has(size)) {
        sizeColorMap.set(size, new Map());
      }

      if (!sizeColorMap.get(size).has(hexCode)) {
        sizeColorMap.get(size).set(hexCode, {
          color: colorName,
          hex: hexCode,
          available,
          price,
          costPerKg,
          markupPricePerKg
        });
      }
    }
  });

  const sizeArray = [...sizeColorMap.keys()].map((size) => ({ value: size }));

  const formattedSizeColorMap = [...sizeColorMap.entries()].map(([size, colorMap]) => ({
    size: size,
    colors: [...colorMap.values()],
  }));

  console.log("Extracted Size-Color Map:", formattedSizeColorMap);

  setVariants([
    { name: "size", values: sizeArray },
    {
      name: "color",
      values: Array.from(
        new Map(
          formattedSizeColorMap
            .flatMap((entry) => entry.colors)
            .map((color) => [color.hex, color])
        ).values()
      ),
    },
  ]);

  setTimeout(() => {
    setSizeColorMap(formattedSizeColorMap);
  }, 500);
};

const handleExport = () => {
  if (!sizeColorMap || sizeColorMap.length === 0) {
      alert("No data available to export.");
      return;
  }

  // Convert sizeColorMap to a structured array
  const exportData = [];
  
  sizeColorMap.forEach(({ size, colors }) => {
      colors.forEach(({ color, hex, available, price ,markupPricePerKg ,  costPerKg}) => {
          exportData.push({
              Size: size,
              Color: color,
              HexCode: hex,
              Availability: available,
              PricePerKg: price,
              markupPricePerKg:markupPricePerKg,
              costPerKg:costPerKg,

          });
      });
  });

  // Create a new workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  XLSX.utils.book_append_sheet(wb, ws, "Size-Color Data");

  // Generate and trigger file download
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  
  saveAs(data, "Size_Color_Data.xlsx");
};




console.log(sizeColorMap)

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
            {errors.productName && <p className="text-danger">{errors.productName}</p>}
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
            {errors.description && <p className="text-danger">{errors.description}</p>}

          </div>
         
          <div className="media-input-ctn mt-5 p-2">
            <label>Media</label>
            <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
              <input type="file" onChange={handleMediaChange}></input>
              <h4>Accepts images,videos,or 3D models</h4>
            </div>
            {errors.media && <p className="text-danger">{errors.media}</p>}
          </div>
        </div>

        <div className="pricing-ctn mt-2 p-3 rounded">
          <h3 className="mb-3">GST</h3>
          <div className="row">
            {/* <div className="d-flex flex-column col">
              <label>Price/Kg</label>
              <input 
                 type="number"
                 name="pricePerKg"
                 value={formData.pricePerKg}
                 onChange={handleInputChange}
              ></input>
               {errors.pricePerKg && <p className="text-danger">{errors.pricePerKg}</p>}
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
              {errors.compareAtPrice && <p className="text-danger">{errors.compareAtPrice}</p>}
            </div>
          </div>

          <div className="row mt-3">
            <div className="d-flex flex-column flex-grow-1 col-lg-3 col-sm-12">
              <label>Cost Per item/Kg</label>
              <input
                type="number"
                name="costPerItem"
                value={formData.costPerItem}
                onChange={handleInputChange}             
               >
              </input>
              {errors.costPerItem && <p className="text-danger">{errors.costPerItem}</p>}
            </div> */}

            {/* <div className="d-flex flex-column flex-grow-1 col-lg-3 col-sm-6">
              <label>Margin</label>
              <input 
               type="number"
               name="margin"
               value={formData.margin}
               onChange={handleInputChange}
              ></input>
            </div> */}


            <div className="d-flex flex-column flex-grow-1 col-lg-3 col-sm-6">
             
              <input 
              type="number"
              name="gst"
              value={formData.gst}
              onChange={handleInputChange}
              ></input>
               {errors.gst && <p className="text-danger">{errors.gst}</p>}
            </div>

          </div>
        </div>

        <div className="variant-ctn mt-2 p-3 rounded">
            {errors.variants && <p className="text-danger">{errors.variants}</p>}
            <div className="top d-flex justify-content-between">
                <h4>Variant</h4>


           

            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Upload File</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
            
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpload}>
                  Upload
                </Button>
              </Modal.Footer>
              </Modal>


              <div className="d-flex gap-3">

                {state && 
                    <ExportBtn onClick={handleExport}></ExportBtn>
                
                }

            <ImportBtn onClick={() => setShowModal(true)}></ImportBtn>


            {/* <button 
            style={{display:"flex",gap:"1rem" ,alignItems:"center"}}
            onClick={addVariant}>
            <span><IoMdAddCircleOutline size={20}/></span>
            </button> */}

            </div>
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
            // onClick={() => toggleExpand(variantIndex)}
          >
            <div className="d-flex justify-content-between w-100">
            <h4>
              {variant.name || "New Variant"} 
            </h4>

            {/* <button className="delete-btn p-2" onClick={() => removeVariant(variantIndex)}> <MdDeleteOutline  size={20}/></button> */}
            </div>
            <div>
            {variant.name.toLowerCase() === "size" && (
                      <ul className="d-flex gap-2 flex-wrap">
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
                      <ul className="d-flex gap-2 flex-wrap">
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
            <div className="size-sec mt-2"  
            onClick={() => toggleExpand(variantIndex)} 
            >
                <div>
                <label>Variant Name:</label>
                </div>
                <div className="mt-1">
                <select
                  className="w-100 rounded border border-secondary-subtle p-1"
                  value={variant.name}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleVariantNameChange(variantIndex, e.target.value)}
                >
                  <option value="">Select Variant Type</option>
                  <option value="size">Size</option>
                  <option value="color">Color</option>
                </select>
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
                        placeholder="Counter"
                      />

                      {/* <input
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
                      
                      </input> */}

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
                          placeholder="Name"
                          
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
                          placeholder="Hex Code"
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


                    {/* {variants.length > 0 && (
                      <div>
                          {sizeColorError && <p className="text-danger">{sizeColorError}</p>}
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
                        </div>
                    )} */}
        

                {Object.keys(sizeColorMap).length > 0 && (
                    <div className="variant-table-ctn">
                <table  className="variant-table">
                <thead>
                <tr>
                    <th>Counter</th>
                    <th>Variants</th>
                    <th>Available (Kg)</th>
                    <th>Cost/Kg</th>
                    <th>Price/Kg</th>
                    <th>Markup Price/Kg</th>
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
                        value={calculateAverageCostPerKg(entry.colors)}
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
                        <input
                        type="text"
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Price/Kg"
                        value={calculateAverageMarkupPrice(entry.colors)}
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

                                {color.color}
                            </div>
                            
                         
                            
                            <input
                                className="w-50"
                                type="text"
                                value={color.hex || ""}
                                onChange={(e) =>
                                handleVariantValueChangeTable(sizeIndex, colorIndex, "hex", e.target.value)
                                }
                                placeholder="Hex Code"
                            />
                            
                            </td>

                            <td >
                            <div>
                              <input 
                               className="w-75"
                               type="text"
                               value={color.color }
                               onChange={(e) =>
                               handleVariantValueChangeTable(sizeIndex, colorIndex, "color", e.target.value)
                               }
                               placeholder="name"
                              ></input>
                            </div>
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
                            value={color.costPerKg || ""}
                            onChange={(e) =>
                              updateColorField(sizeIndex, colorIndex, "costPerKg", e.target.value)
                            }
                            placeholder="Cost/Kg"
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
                          <input
                            type="number"
                            value={color.markupPricePerKg || ""}
                            onChange={(e) =>
                              updateColorField(sizeIndex, colorIndex, "markupPricePerKg", e.target.value)
                            }
                            placeholder="Markup/Kg"
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

    <div className="w-100 d-flex justify-content-between my-4">
      {state?.index!== undefined && (
          <DeleteBtn clickFunction={handleDelete}></DeleteBtn>
      )}
        
        <SubmitBtn text={'Save'} clickFunction={handleSubmit}></SubmitBtn>
    </div>

      </div>

      <div className="right w-25 flex-grow-1">
        <div className="status-ctn p-3 gap-3 rounded">
          <h3 className="mb-2">Status</h3>
          <StatusInput status={status} onStatusChange={handleStatusChange}></StatusInput>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddProduct;
