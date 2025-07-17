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
import { addProduct , deleteProduct, updateProduct , uploadProductImage } from "../../../services/ProductService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Button } from "react-bootstrap";
import ImportBtn from "../../../components/Buttons/Import/ImportBtn";
import ExportBtn from "../../../components/Buttons/Export/ExportBtn";
import StatusInput from "../../../components/StatusInput/StatusInput";
import ModalDelete from "../../../components/Modal/ModalDelete";
import Toast from "../../../components/Toast/Toast";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const backendUrl = process.env.REACT_APP_IMAGE_URL

const AddProduct = () => {

  const { state } = useLocation();
  const { index, ix, finalData } = state || {}; // Provide a default empty object
  const [errors, setErrors] = useState({});
  const [sizeColorError, setSizeColorError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [uploadedMedia, setUploadedMedia] = useState([]);
 
  const isViewMode = !!state

  const product = (typeof index === 'number' && finalData) ? finalData[index] : null;

  console.log(product)
 
 const transformProductData = (product) => {
  if (!product || !product.groupedVariants) return { variants: [], sizeColorMap: [] };

  const groupedVariants = product.groupedVariants;

  const sizes = groupedVariants.map((group) => ({ value: group.size }));

  const colorHexMap = new Map();
  groupedVariants.forEach((group) => {
    group.variants.forEach((colorGroup) => {
      const hexKey = colorGroup.hexCode?.toLowerCase();
      if (hexKey && !colorHexMap.has(hexKey)) {
        colorHexMap.set(hexKey, {
          value: colorGroup.colorName,
          color: colorGroup.colorName,
          hex: colorGroup.hexCode,
          id: colorGroup.variants[0]?.id,
        });
      }
    });
  });

  const sizeColorMap = groupedVariants.map((group) => {
    const coneVariant = group.variants
      .flatMap((colorGroup) => colorGroup.variants)
      .find((v) => v.variantType === "cone");

    const hankVariant = group.variants
      .flatMap((colorGroup) => colorGroup.variants)
      .find((v) => v.variantType === "hank");

    const coneDescription = coneVariant?.variantDescription || "";
    const hankDescription = hankVariant?.variantDescription || "";

    const colors = group.variants.map((colorGroup) => ({
      color: colorGroup.colorName,
      hex: colorGroup.hexCode,
      variants: colorGroup.variants.map((variant) => ({
      variantType: variant.variantType,
      available: variant.available,
      price: variant.price,
      markupPricePerKg: variant.markupPricePerKg,
      id: variant.id,
      availableStatus: variant.availableStatus,
      variantDescription: variant.variantDescription || "",
      })),
    }));

    return {
      size: group.size,
      coneDescription,
      hankDescription,
      colors,
    };
  });

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

  const showToast = (message, type = "error") => {
    setToasts([{ message, type }]);
    setTimeout(() => setToasts([]), 3000);
      };
 
 

const coneImage = product?.productImage?.find(img => img.includes('/cone/')) || null;
const hankImage = product?.productImage?.find(img => img.includes('/hank/')) || null;

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
  media: product?.productImage?.[0] || null,
  mediaHank: hankImage,
  mediaCone: coneImage,
});

console.log(product);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


 const handleDescriptionChange = (sizeIndex, variantType, value) => {
  const newData = [...sizeColorMap];
  if (variantType === "CONE") {
    newData[sizeIndex].coneDescription = value;
  } else if (variantType === "HANK") {
    newData[sizeIndex].hankDescription = value;
  }
  setSizeColorMap(newData);
};



const handleMediaChange = async (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const res = await uploadProductImage(file, `product-${type}`); // type: hank or cone
    const uploadedUrl = res.data;

    setFormData(prev => ({
      ...prev,
      [`media${type.charAt(0).toUpperCase() + type.slice(1)}`]: uploadedUrl, // mediaHank or mediaCone
    }));
  } catch (error) {
    showToast('Image upload failed due to image file size.', 'error');
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({}); // Reset errors before validation

    // Validation checks
    let validationErrors = {};

    if (!formData.productName.trim()) validationErrors.productName = "Product name is required.";
    // if (!formData.description.trim()) validationErrors.description = "Description is required.";
    // if (!formData.pricePerKg || formData.pricePerKg <= 0) validationErrors.pricePerKg = "Valid price per Kg is required.";
    // if (!formData.costPerItem || formData.costPerItem <= 0) validationErrors.costPerItem = "Valid cost per item is required.";
    // if (!formData.compareAtPrice || formData.compareAtPrice <= 0) validationErrors.compareAtPrice = "Valid Compare at price is required.";
    // if (!formData.media) validationErrors.media = "Please upload a product image or media.";
    if (!formData.gst || formData.gst < 0) validationErrors.gst = "Valid GST value is required.";
    if (variants.length < 2) validationErrors.variants = "At least (Size & Color) variant is required.";
    if (sizeColorMap.length < 2) validationErrors.sizeColorMap = "Size and color combination is required.";

    let hasInvalidPricing = false;
      sizeColorMap.forEach(({ size, colors }) => {
        colors.forEach(color => {
          (color.variants || []).forEach(variant => {
            const price = Number(variant.price);
            const markup = Number(variant.markupPricePerKg);
            if (!price || price <= 0 || !markup || markup <= 0) {
              hasInvalidPricing = true;
            }
          });
        });
      });

      if (hasInvalidPricing) {
        validationErrors.sizeColorMap = "Each size-color variant must have a valid Price and Markup Price.";
      }

    // Stop submission if there are errors
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

  
    
    const plainTextDescription = formData.description.replace(/<\/?[^>]+(>|$)/g, "");

    // Create variants with calculated prices and availability
    const newVariants = sizeColorMap.flatMap(({ size, colors, coneDescription, hankDescription }) =>
      colors.flatMap((color) =>
        (color.variants || []).map((variant) => ({
          size,
          color: {
            colorName: color.color,
            colorCode: color.hex,
            status: "ACTIVE",
          },
          variantType: variant.variantType.toUpperCase(),
          availableWeight: Number(variant.available),
          pricePerKg: Number(variant.price),
          markupPricePerKg: Number(variant.markupPricePerKg || 0),
          availableStatus: variant.availableStatus || "ACTIVE",
          variantDescription:
            variant.variantType.toUpperCase() === "CONE"
              ? coneDescription || ""
              : hankDescription || "",
        }))
      )
    );


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
        media: [formData.mediaCone,formData.mediaHank],
        availableStatus: status.toUpperCase(),
        gstOnProduct: Number(formData.gst),
        variants: newVariants, // All variants are sent
        deletedVariantIds: [], // No deleted variants are tracked now
    };

    console.log(formattedData)

    try {
        if (state?.index !== undefined) {
            const productId = product.productId;
            const originalGrouped = product.groupedVariants || [];

            const changedVariants = [];

            // Loop through newVariants and check for changes
            newVariants.forEach((newVar) => {
                const matchSizeGroup = originalGrouped.find(g => g.size === newVar.size);
                const matchColor = matchSizeGroup?.variants.find(
                    old =>
                        old.colorName === newVar.color.colorName &&
                        old.hexCode.toLowerCase() === newVar.color.colorCode.toLowerCase() &&
                        old.variantType === newVar.variantType
                );

                if (!matchColor ||
                    matchColor.available !== newVar.availableWeight ||
                    matchColor.pricePerKg !== newVar.pricePerKg ||
                    matchColor.markupPricePerKg !== newVar.markupPricePerKg ||
                    matchColor.hexCode !== newVar.color.hexCode
                ) {
                    changedVariants.push(newVar); // Track only changed variants
                }
            });

            // Send all variants, but mark only the changed ones in formattedData
            formattedData.variants = newVariants; // All variants, including changed and unchanged

            // Do not track deleted variants
            // formattedData.deletedVariantIds = deletedIds;  // No longer needed

            await updateProduct(productId, formattedData);
        } else {
            // If it's a new product, just add the new variants
            formattedData.variants = newVariants;
            await addProduct(formattedData);
        }

        navigate('/products');
    } catch (error) {
        console.error('Error submitting product:', error);
    }
};


  
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

 

  const addVariantValue = (index) => {
    const updatedVariants = [...variants];
    updatedVariants[index].values.push({ value: "", color: "", hex: "" });
    setVariants(updatedVariants);
  };



  const handleDone = () => {
    setExpandedVariant(null); // Collapse all forms
  };

  const toggleExpand = (index) => {
    setExpandedVariant(expandedVariant === index ? null : index);
  };


  const calculateTotalAvailable = (colors) => {
    return colors.reduce((total, color) => {
      return (
        total +
        color.variants.reduce((vSum, v) => vSum + Number(v.available || 0), 0)
      );
    }, 0);
  };

  const calculateAverageCostPerKg = (colors) => {
    const total = [];
    colors.forEach((color) => {
      color.variants.forEach((v) => total.push(Number(v.costPerKg || 0)));
    });
    return total.length ? (total.reduce((a, b) => a + b, 0) / total.length).toFixed(2) : 0;
  };

  const calculateAveragePrice = (colors) => {
    const total = [];
    colors.forEach((color) => {
      color.variants.forEach((v) => total.push(Number(v.price || 0)));
    });
    return total.length ? (total.reduce((a, b) => a + b, 0) / total.length).toFixed(2) : 0;
  };

  const calculateAverageMarkupPrice = (colors) => {
    const total = [];
    colors.forEach((color) => {
      color.variants.forEach((v) => total.push(Number(v.markupPricePerKg || 0)));
    });
    return total.length ? (total.reduce((a, b) => a + b, 0) / total.length).toFixed(2) : 0;
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
    const newData = [...sizeColorMap];
    newData[sizeIndex].colors.push({
      color: "",
      hex: "",
      variants: [
        {
          variantType: "cone",
          available: 0,
          price: 0,
          markupPricePerKg: 0,
          costPerKg: 0,
        },
      ],
    });
    setSizeColorMap(newData);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [pendingDelete, setPendingDelete] = useState(null);

  const handleDelete = async () => {
  
      try {
        await deleteProduct(product.productId); 
        showToast("Product deleted successfully");
      } catch (error) {
        showToast("Failed to delete product", "error");
      }
    };


//   try {
//     const productId = product.productId;
//     await deleteProduct(productId);
//     navigate('/products'); // Redirect after deletion
//   } catch (error) {
//     console.error("Error Deleting product:", error);
//   }
// };
const [toasts, setToasts] = useState([]);


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
   const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };

  if (!file) return;

  // Validate file type
  if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
          showToast("Invalid file type. Please upload an Excel file", "error");
    // alert("Invalid file type. Please upload an Excel file.");
    return;
  }

  setSelectedFile(file);
};

// Handle file upload & process Excel data
const handleUpload = () => {
   const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };

  console.log('hello')

  if (!selectedFile) {
    showToast("Please select a file to upload.", "error");
    // alert("Please select a file to upload.");
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
        showToast("The uploaded file is empty", "error");
      // alert("The uploaded file is empty.");
        return;
      }
      console.log("Parsed Data:", data);
    
      console.log(data)
      parseSizeColorData(data); // Call your processing function

      // Close modal after processing
      closeModal();
    } catch (error) {
      console.error("Error reading file:", error);
      showToast("Error processing the file. Please try again.", "error");

      // alert("Error processing the file. Please try again.");
    }
  };

  reader.onerror = () => {
    showToast("Error reading file. Please try again", "error");
    // alert("Error reading file. Please try again.");
  };
};

const parseSizeColorData = (data) => {
  const sizeColorMap = new Map();
  const descriptionMap = new Map();

  data.forEach((row) => {
    const size = row.Size?.trim();
    const colorName = row.Color?.trim();
    const hexCode = row.HexCode?.trim().toLowerCase();
    const variantType = row.VariantType?.trim().toLowerCase();
    const available = Number(row.Availability) || 0;
    const price = Number(row.PricePerKg) || 0;
    const markupPricePerKg = Number(row.markupPricePerKg) || 0;
    const coneDesc = row.ConeDescription?.trim();
    const hankDesc = row.HankDescription?.trim();

    if (size && colorName && hexCode && variantType) {
      if (!sizeColorMap.has(size)) {
        sizeColorMap.set(size, new Map());
        descriptionMap.set(size, {
          coneDescription: "",
          hankDescription: ""
        });
      }

      if (coneDesc && variantType === "cone") {
        descriptionMap.get(size).coneDescription = coneDesc;
      }

      if (hankDesc && variantType === "hank") {
        descriptionMap.get(size).hankDescription = hankDesc;
      }

      const colorMap = sizeColorMap.get(size);
      if (!colorMap.has(hexCode)) {
        colorMap.set(hexCode, {
          color: colorName,
          hex: hexCode,
          variants: [],
        });
      }

      colorMap.get(hexCode).variants.push({
        variantType,
        available,
        price,
        markupPricePerKg,
        availableStatus: "ACTIVE",
      });
    }
  });

  const formatted = [...sizeColorMap.entries()].map(([size, colorMap]) => ({
    size,
    colors: [...colorMap.values()],
    coneDescription: descriptionMap.get(size)?.coneDescription || "",
    hankDescription: descriptionMap.get(size)?.hankDescription || "",
  }));

  setVariants([
    { name: "size", values: [...sizeColorMap.keys()].map((size) => ({ value: size })) },
    {
      name: "color",
      values: Array.from(
        new Map(
          formatted.flatMap((e) => e.colors).map((color) => [color.hex, color])
        ).values(),
      ),
    },
  ]);

  setTimeout(() => setSizeColorMap(formatted), 500);
};


const handleExport = () => {
  const showToast = (message, type = "error") => {
    setToasts([{ message, type }]);
    setTimeout(() => setToasts([]), 3000);
  };

  if (!sizeColorMap || sizeColorMap.length === 0) {
    showToast("No data available to export.");
    return;
  }

  const exportData = [];

  sizeColorMap.forEach(({ size, colors, coneDescription, hankDescription }) => {
    let coneAdded = false;
    let hankAdded = false;

    colors.forEach(({ color, hex, variants }) => {
      variants?.forEach((variant) => {
        exportData.push({
          Size: size,
          Color: color,
          HexCode: hex,
          VariantType: variant.variantType || "",
          Availability: variant.available ?? "",
          PricePerKg: variant.price ?? "",
          markupPricePerKg: variant.markupPricePerKg ?? "",
          ConeDescription:
            variant.variantType?.toUpperCase() === "CONE" && !coneAdded
              ? coneDescription || ""
              : "",
          HankDescription:
            variant.variantType?.toUpperCase() === "HANK" && !hankAdded
              ? hankDescription || ""
              : "",
        });

        if (variant.variantType?.toUpperCase() === "CONE") coneAdded = true;
        if (variant.variantType?.toUpperCase() === "HANK") hankAdded = true;
      });
    });
  });

  if (exportData.length === 0) {
    showToast("No variant data to export.");
    return;
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.book_append_sheet(wb, ws, "Size-Color Data");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, product.productName + "_data.xlsx");
};



const updateVariantField = (sizeIndex, colorIndex, variantIndex, field, value) => {
  const newData = [...sizeColorMap];
  newData[sizeIndex].colors[colorIndex].variants[variantIndex][field] = value;
  setSizeColorMap(newData);
};

const handleVariantValueChangeTable = (sizeIndex, colorIndex, field, value) => {
  const newData = [...sizeColorMap];
  newData[sizeIndex].colors[colorIndex][field] = value;
  setSizeColorMap(newData);
};

const removeVariant = (sizeIndex, colorIndex, variantIndex) => {
  const newData = [...sizeColorMap];
  newData[sizeIndex].colors[colorIndex].variants.splice(variantIndex, 1);
  setSizeColorMap(newData);
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
          <div className="title-ctn d-flex flex-column mb-3 ">
            <label style={{fontSize:'1rem'}}>Title</label>
            <input
              className="ps-1"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
            />
            {errors.productName && <p className="text-danger">{errors.productName}</p>}
          </div>


           {/* <div className="mb-3">
          <div className="desc-input-ctn d-flex flex-column mb-5">
            <label style={{fontSize:'1rem'}}>Description</label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              // onChange={handleDescriptionChange}
              placeholder="Write your description here..."
              style={{ height: 'auto' }}
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
          </div> */}
         
      <div className="">
  <div className=" row g-4">
    {/* Hank Image Upload */}
    <div className="col-md-6">
      <div className="media-upload-card p-4 h-100">
        <label className="upload-label mb-3"  style={{fontSize:'1rem'}}>Hank Image</label>
        <div className="upload-area d-flex flex-column justify-content-center align-items-center p-4">
          <input
            type="file"
            id="hank-upload"
            accept="image/*"
            onChange={(e) => handleMediaChange(e, 'hank')}
            className="d-none"
          />
          <label 
            htmlFor="hank-upload" 
            className="upload-button btn btn-outline-primary rounded-pill px-4 py-2 mb-2"
          >
            <i className="bi bi-cloud-arrow-up me-2"></i>Choose File
          </label>
          <p className="upload-hint text-muted mb-0">JPEG, PNG (Max 2MB)</p>
          
          {formData.mediaHank && (
            <div className="preview-container mt-4 text-center">
              <img 
                src={`${backendUrl}${formData.mediaHank}`} 
                alt="Hank Preview" 
                className="img-thumbnail rounded" 
                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
              />
              {/* <button 
                className="btn btn-sm btn-outline-danger mt-2"
                onClick={() => handleMediaRemove('hank')}
              >
                Remove
              </button> */}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Cone Image Upload */}
    <div className="col-md-6">
      <div className="media-upload-card p-4 h-100">
        <label className="upload-label mb-3"  style={{fontSize:'1rem'}}>Cone Image</label>
        <div className="upload-area d-flex flex-column justify-content-center align-items-center p-4">
          <input
            type="file"
            id="cone-upload"
            accept="image/*"
            onChange={(e) => handleMediaChange(e, 'cone')}
            className="d-none"
          />
          <label 
            htmlFor="cone-upload" 
            className="upload-button btn btn-outline-primary rounded-pill px-4 py-2 mb-2"
          >
            <i className="bi bi-cloud-arrow-up me-2"></i>Choose File
          </label>
          <p className="upload-hint text-muted mb-0">JPEG, PNG (Max 2MB)</p>
          
          {formData.mediaCone && (
            <div className="preview-container mt-4 text-center">
              <img 
                src={`${backendUrl}${formData.mediaCone}`} 
                alt="Cone Preview" 
                className="img-thumbnail rounded" 
                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
              />
              {/* <button 
                className="btn btn-sm btn-outline-danger mt-2"
                onClick={() => handleMediaRemove('cone')}
              >
                Remove
              </button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

        </div>

        <div className="pricing-ctn mt-2 p-3 rounded">
          <h3 className="mb-3"  style={{fontSize:'1rem'}}>GST</h3>
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
                <h4 style={{fontSize:'1rem'}}>Variant</h4>


           

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
     
      {/* {variants.map((variant, variantIndex) => (
        <div className="variant-add" key={variantIndex} style={{ marginBottom: "20px" }}>
        
         
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
                              
                                <h4
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
                                >{value.hex}</h4>
                                 <span>{value.color}</span>
                           </li>
                        ))}
                        </ul>
                 )}
            </div>
          </div>
          )}

        
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
        
      ))} */}


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
        
 {errors.sizeColorMap && <p className="text-danger">{errors.sizeColorMap}</p>}
                 {sizeColorMap.length > 0 && (
         <div className="variant-table-ctn">
         <table className="variant-table">
           <thead>
             <tr>
               <th>Size</th>
               <th>Variants</th>
               <th>Available (Kg)</th>
               {/* <th>Cost/Kg</th> */}
               <th>Price/Kg</th>
               <th>Markup Price/Kg</th>
               <th></th>
               {state?.index !== undefined && (
               <th></th>
               )}
             </tr>
           </thead>
           <tbody>
             {sizeColorMap.map((entry, sizeIndex) => (
               <React.Fragment key={sizeIndex}>
                 <tr
                   onClick={() => toggleRow(sizeIndex)}
                   style={{ cursor: "pointer" }}
                 >
                   <td>
                     <div
                       style={{
                         backgroundColor: "#f0f0f0",
                         borderRadius: "1rem",
                         padding: "0.3rem 1rem",
                         display: "flex",
                         justifyContent: "center",
                       }}
                     >
                       {entry.size}
                     </div>
                   </td>
                   <td>{entry.colors.length} Colors</td>
                   <td>
                     <input
                       type="text"
                       value={calculateTotalAvailable(entry.colors)}
                       readOnly
                       onClick={(e) => e.stopPropagation()}
                     />
                   </td>
                   {/* <td>
                     <input
                       type="text"
                       value={calculateAverageCostPerKg(entry.colors)}
                       readOnly
                       onClick={(e) => e.stopPropagation()}
                     />
                   </td> */}
                   <td>
                     <input
                       type="text"
                       value={calculateAveragePrice(entry.colors)}
                       readOnly
                       onClick={(e) => e.stopPropagation()}
                     />
                   </td>
                   <td>
                     <input
                       type="text"
                       value={calculateAverageMarkupPrice(entry.colors)}
                       readOnly
                       onClick={(e) => e.stopPropagation()}
                     />
                   </td>
                   <td>
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         handleAddColor(sizeIndex);
                       }}
                       style={{ padding: "5px", background: "none", border: "none", color: "#0561FC" }}
                     >
                       <IoMdAddCircleOutline size={20} />
                     </button>
                   </td>
                 </tr>
                  <tr>
                    <td colSpan={7} style={{ borderTop: "none" }}>
                     <div className="d-flex gap-2 mt-2">
                        <textarea
                          className="form-control w-50"
                          rows={6}
                          placeholder="Description for CONE"
                          value={entry.coneDescription || ""}
                          onChange={(e) => handleDescriptionChange(sizeIndex, "CONE", e.target.value)}
                        />
                        <textarea
                          className="form-control w-50"
                          rows={6}
                          placeholder="Description for HANK"
                          value={entry.hankDescription || ""}
                          onChange={(e) => handleDescriptionChange(sizeIndex, "HANK", e.target.value)}
                        />
                      </div>

                    </td>
                  </tr>
   
                 {expandedRow === sizeIndex &&
                   entry.colors.map((color, colorIndex) =>
                     color.variants?.map((variant, variantIndex) => (
                       <React.Fragment key={`${colorIndex}-${variantIndex}`}>
                          <tr className="align-top border-0">
                            <td>
                              {variantIndex === 0 && (
                                <div className="d-flex align-items-center gap-2">
                                  <input
                                    className="w-50 ms-2"
                                    type="text"
                                    value={color.hex || ""}
                                    onChange={(e) =>
                                      handleVariantValueChangeTable(sizeIndex, colorIndex, "hex", e.target.value)
                                    }
                                    placeholder="Hex Code"
                                  />
                                </div>
                              )}
                            </td>
                            <td>
                              {variantIndex === 0 && (
                                <input
                                  className="w-75"
                                  type="text"
                                  value={color.color || ""}
                                  onChange={(e) =>
                                    handleVariantValueChangeTable(sizeIndex, colorIndex, "color", e.target.value)
                                  }
                                  placeholder="Color Name"
                                />
                              )}
                            </td>
                            <td>
                              <input
                                type="number"
                                value={variant.available || ""}
                                onChange={(e) =>
                                  updateVariantField(sizeIndex, colorIndex, variantIndex, "available", e.target.value)
                                }
                                placeholder="Available"
                                disabled={isViewMode}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={variant.price || ""}
                                onChange={(e) =>
                                  updateVariantField(sizeIndex, colorIndex, variantIndex, "price", e.target.value)
                                }
                                placeholder="Price/Kg"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={variant.markupPricePerKg || ""}
                                onChange={(e) =>
                                  updateVariantField(sizeIndex, colorIndex, variantIndex, "markupPricePerKg", e.target.value)
                                }
                                placeholder="Markup/Kg"
                              />
                            </td>
                            <td>
                              <input
                                className="w-50"
                                type="text"
                                value={variant.variantType || ""}
                                onChange={(e) =>
                                  updateVariantField(sizeIndex, colorIndex, variantIndex, "variantType", e.target.value)
                                }
                                placeholder="Type"
                              />
                            </td>
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={variant.availableStatus === "ACTIVE"}
                                  onChange={() => {
                                    const newStatus = variant.availableStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                                    updateVariantField(sizeIndex, colorIndex, variantIndex, "availableStatus", newStatus);
                                  }}
                                />
                                <span className="slider"></span>
                              </label>
                            </td>
                          </tr>

                          
                       

                        </React.Fragment>

                     ))
                   )}

                  
               </React.Fragment>
             ))}
           </tbody>
         </table>
       </div>
      )}
   

       
    </div>

        <div className="w-100 d-flex justify-content-between my-4">
          {state?.index !== undefined && (
            <DeleteBtn clickFunction={() => setShowDeleteModal(true)} />
          )}

          <SubmitBtn text={'Save'} clickFunction={handleSubmit} />

          <ModalDelete
            isOpen={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() => {
              handleDelete();
              setShowDeleteModal(false);
            }}
          />
        </div>


      </div>

      <div className="right w-25 flex-grow-1">
        <div className="status-ctn p-3 gap-3 rounded">
          <h3 className="mb-2">Status</h3>
          <StatusInput status={status} onStatusChange={handleStatusChange}></StatusInput>
        </div>
      </div>
    </div>


 {/* Toast Notification */}
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
          }
        />
      ))}
    </div>

    </div>
  );
};

export default AddProduct;
