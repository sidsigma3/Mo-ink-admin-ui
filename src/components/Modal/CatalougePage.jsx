import { useState , useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { getProductById , updateProduct } from "../../services/ProductService";
import ModalAddColor from "./ModalAddColor";
import Toast from "../Toast/Toast";
import { getUnusedActiveColors } from "../../services/ColorService";


const backendUrl = process.env.REACT_APP_IMAGE_URL

const CataloguePage = ({ onColorSelect, onClose,variant ,id,imageUrl,onProductUpdate}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColor, setNewColor] = useState({ colorName: "", hexCode: "" });
  const [customColors, setCustomColors] = useState([]);
  const [tempCustomColors, setTempCustomColors] = useState([]);
  const [searchColor,setSearchColor] = useState('')
  const [selectedColors, setSelectedColors] = useState([]); 
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [updatedColors,setUpdatedColors] = useState([])

  const handleColorClick = (color) => {
    setSelectedColors((prevColors) => {
      const isAlreadySelected = prevColors.some(
        (c) => c.hexCode === color.hexCode && c.variantType === color.variantType
      );
  
      if (isAlreadySelected) {
        return prevColors.filter(
          (c) => !(c.hexCode === color.hexCode && c.variantType === color.variantType)
        );
      } else {
        return [...prevColors, color];
      }
    });
  };


  console.log(selectedColors)

  useEffect(() => {
  if (id && variant.size) {
    fetchCustomColors();
  }
}, [id, variant.size]);

const fetchCustomColors = async () => {
  try {
    const variantTypes = ['CONE', 'HANK'];

    // Fetch unused colors for each variant type
    const results = await Promise.all(
      variantTypes.map(type => getUnusedActiveColors(id, variant.size, type))
    );

    // Merge and deduplicate based on colorCode + variantType
    const merged = results.flat().reduce((acc, item) => {
      const key = `${item.colorCode}_${item.variantType}`;
      if (!acc.has(key)) acc.set(key, item);
      return acc;
    }, new Map());

    setCustomColors(Array.from(merged.values()));
  } catch (error) {
    console.error("Failed to fetch custom colors:", error);
  }
};


  const handleSaveSelection = () => {
    console.log(selectedColors);
    if (selectedColors.length > 0) {
      onColorSelect(selectedColors); // send color + type
    }
   
    onClose();
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewColor((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSaveColor = () => {
  //   if (newColor.colorName && newColor.hexCode) {
  //     setCustomColors([...customColors, newColor]);
  //     setNewColor({ colorName: "", hexCode: "" });
  //     setIsAddingColor(false);
  //   }
  // };

 const handleCustomColorSelect = (color) => {
  setTempCustomColors((prevColors) => {
    const isAlreadySelected = prevColors.some(
      (c) => c.hexCode === color.hexCode && c.colorName.toLowerCase() === color.colorName.toLowerCase()
    );

    if (isAlreadySelected) {
      return prevColors.filter(
        (c) => !(c.hexCode === color.hexCode && c.colorName.toLowerCase() === color.colorName.toLowerCase())
      );
    } else {
      return [...prevColors, color]; // no need for variantType here
    }
  });
};



  const handleSaveColor = () => {
    const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
    const { colorName, hexCode } = newColor;
  
    if (colorName && hexCode) {
      const colorWithDetails = {
        colorName,
        hexCode,
        price: 150, // fixed value
        available: 100, // fixed value
        costPerKg: 200,
        markupPricePerKg: 200,
      };
  
      setTempCustomColors((prev) => [...prev, colorWithDetails]);
      setNewColor({ colorName: "", hexCode: "" });
    } else {
      showToast("Please enter both color name and hex code", "error");
    }
  };
  


 const handleAddColor = async () => {
  const showToast = (message, type = "error") => {
    setToasts([{ message, type }]);
    setTimeout(() => setToasts([]), 3000);
  };

  if (tempCustomColors.length === 0) {
    showToast("Please select at least one color before adding.", "success");
    return;
  }

  try {
    const response = await getProductById(id);
    const productData = response.data;
    const existingVariants = productData.variants || [];
    const groupedVariants = productData.groupedVariants || [];
    const uniqueSizes = [...new Set(existingVariants.map(v => v.size))];
    const variantTypes = ["cone", "hank"];

    // 🔢 Build average price map
    const averagePriceMap = {};
      variantTypes.forEach((type) => {
      const filtered = existingVariants.filter(
        v => v.size === variant.size && v.variantType === type
      );

      if (filtered.length) {
        const total = filtered.reduce(
          (acc, v) => ({
            pricePerKg: acc.pricePerKg + (v.pricePerKg || 0),
            costPerKg: acc.costPerKg + (v.costPerKg || 0),
            markupPricePerKg: acc.markupPricePerKg + (v.markupPricePerKg || 0),
          }),
          { pricePerKg: 0, costPerKg: 0, markupPricePerKg: 0 }
        );

        averagePriceMap[variant.size][type] = {
          pricePerKg: +(total.pricePerKg / filtered.length).toFixed(2),
          costPerKg: +(total.costPerKg / filtered.length).toFixed(2),
          markupPricePerKg: +(total.markupPricePerKg / filtered.length).toFixed(2),
        };
      }
    });

    // 🧱 Generate new variants
    const newVariants = tempCustomColors.flatMap((color) =>
      variantTypes.map((variantType) => {
        const avg = averagePriceMap[variant.size]?.[variantType] || {
          pricePerKg: 150,
          costPerKg: 200,
          markupPricePerKg: 250,
        };

        return {
          size: variant.size,  // ✅ Only use current size
          variantType:variantType.toUpperCase(),
          color: {
            colorName: color.colorName,
            colorCode: color.hexCode,
            status: "ACTIVE",
          },
          availableWeight: 0,
          pricePerKg: avg.pricePerKg,
          costPerKg: avg.costPerKg,
          markupPricePerKg: avg.markupPricePerKg,
          availableStatus: "ACTIVE",
        };
      })
    );

    // 🔍 Remove existing combinations
    const isNewVariant = (variant) => {
      return !groupedVariants.some(group =>
        group.size === variant.size &&
        group.variants.some(existing =>
          existing.colorName.toLowerCase() === variant.color.colorName.toLowerCase() &&
          existing.hexCode.toLowerCase() === variant.color.colorCode.toLowerCase() &&
          existing.variantType === variant.variantType
        )
      );
    };

    const filteredNewVariants = newVariants.filter(isNewVariant);

    if (filteredNewVariants.length === 0) {
      showToast("All selected variants already exist.", "error");
      return;
    }

    // 📦 Merge old + new variants
    const mergedVariants = [...existingVariants, ...filteredNewVariants];

    const formattedData = {
      title: productData.productName,
      description: productData.productDescription,
      media: productData.productImage || [],
      availableStatus: productData.availableStatus,
      gstOnProduct: Number(productData.gstOnProduct || 0),
      productType: productData.productTypes || {
        productName: productData.productName,
        description: productData.productDescription,
      },
      variants: mergedVariants,
      deletedVariantIds: [],
    };

    console.log(formattedData)
    await updateProduct(id, formattedData);

    const updatedRes = await getProductById(id);
    const updatedVariants = updatedRes.data.variants || [];
    const updatedColorsWithIds = [];

    const seen = new Set();

    updatedVariants.forEach((variant) => {
      const key = `${variant.color.colorName.toLowerCase()}-${variant.color.colorCode.toLowerCase()}-${variant.variantType}`;
      
      if (!seen.has(key)) {
        const match = tempCustomColors.find(
          (temp) =>
            temp.colorName.toLowerCase() === variant.color.colorName.toLowerCase() &&
            temp.hexCode.toLowerCase() === variant.color.colorCode.toLowerCase()
        );

        if (match) {
          updatedColorsWithIds.push({
            colorName: match.colorName,
            hexCode: match.hexCode,
            variantType: variant.variantType.toLowerCase(), // normalize
            colorImage:
              variant.variantType === "CONE"
                ? match.colorImageCone
                : match.colorImageHank,
          });

          seen.add(key);
        }
      }
    });


    await fetchCustomColors();
    onProductUpdate?.();
    setUpdatedColors(updatedColorsWithIds)
    // setCustomColors((prev) => [...prev, ...updatedColorsWithIds]);
    setTempCustomColors([]);
    setIsAddingColor(false);
    showToast("New color variants added successfully!", "success");

  } catch (error) {
    console.error("Error adding color variant:", error);
    showToast("Failed to add color variant. Please try again.", "error");
  }
};

  
 const handleSearchColor = (e) => {
    setSearchColor(e.target.value.toLowerCase());
  };

 

const groupedByColorAndType = variant.variants.reduce((acc, variant) => {
  const baseKey = `${variant.colorName}-${variant.hexCode.toLowerCase()}`;
  
  variant.variants.forEach((innerVariant) => {
    const fullKey = `${baseKey}-${innerVariant.variantType}`;
    
    if (!acc[fullKey]) {
      acc[fullKey] = {
        colorName: variant.colorName,
        hexCode: variant.hexCode,
        variantType: innerVariant.variantType,
        colorImage:innerVariant.colorImage
      };
    }
  });

  return acc;
}, {});


  return (
    <div className="text-center" >
    <div className={`${isModalOpen ? "show" : ""}`}>
      <div className="">
        
      </div>
      <div className="text-start">
      {isAddingColor ? (
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Select Custom Colors</h4>
          {customColors.length === 0 ? (
            <div className="text-gray-500 text-center">No unused custom colors available</div>
          ) : (
            <div className="h-[40rem] overflow-y-auto p-2">
               <div className="d-flex flex-wrap gap-3">
                {customColors.map((item, index) => {
                  const isSelected = tempCustomColors.some(
                    (color) =>
                      color.colorName.toLowerCase() === item.colorName.toLowerCase() &&
                      color.hexCode.toLowerCase() === item.colorCode.toLowerCase()
                  );


                  const imageForCone = item.colorImage?.find((img) =>
                    img.toLowerCase().includes("cone")
                  );
                  const imageForHank = item.colorImage?.find((img) =>
                    img.toLowerCase().includes("hank")
                  );

                  return (
                    <div
                      key={`${index}`}
                      className={`border rounded p-2 ${isSelected ? "border-primary" : ""}`}
                      style={{ cursor: "pointer", width: "calc(25% - 10px)" }}
                      onClick={() => {
                      handleCustomColorSelect({
                        colorName: item.colorName,
                        hexCode: item.colorCode,
                        colorImageCone: imageForCone || "",
                        colorImageHank: imageForHank || "",
                      });

                    }}

                    >
                      <div className="position-relative w-100" style={{ height: '5.5rem' }}>
                        <img
                          src={`${backendUrl}${imageForCone}`} 
                          // src="/wool-item-1.png" 
                          className="img-fluid" alt="Product" 
                        />
                        
                        {/* <div
                          className="position-absolute top-0 start-0 w-100"
                          style={{ height: '5.5rem', backgroundColor: item.colorCode, mixBlendMode: 'multiply', opacity: 0.5 }}
                        ></div> */}
                      </div>
                      <div className="text-center mt-2">
                        <h5 className="fw-bold" style={{ fontSize: '0.8rem' }}>{item.colorName}</h5>
                        <h6 className="text-muted" style={{ fontSize: '0.8rem' }}>{item.colorCode}</h6>
                        <div style={{ fontSize: '0.75rem', color: '#555' }}>Cone & Hank</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            onChange={(e) => setSearchColor(e.target.value.toLowerCase())}
            className="border w-100 rounded-md p-2 mt-2"
            placeholder="Search by name or hexcode"
          />

          <div className="d-flex justify-content-between align-items-center mt-3 mb-3 border-bottom pb-3">
            {customColors.length > 0 && (
              <>
                <h3 className="h6 fw-semibold mb-0">Custom Colors</h3>
                <div
                  className="btn btn-outline-primary d-flex align-items-center gap-2"
                  onClick={() => setIsAddingColor(true)}
                >
                  <FaPlus /> <span>New color</span>
                </div>
              </>
            )}
          </div>

          {/* {customColors.length === 0 && (
            <button className="btn btn-outline-secondary w-100 mt-3" onClick={() => setIsAddingColor(true)}>
              <FaPlus /> Add new color
            </button>
          )} */}

          <h4 className="h6 fw-semibold mt-4">Preset Catalogue</h4>
          <div className="container" style={{ height: "16rem", overflow: "auto" }}>
            <div className="d-flex justify-content-start flex-wrap gap-3">
              {[...updatedColors, ...Object.values(groupedByColorAndType)]
                .filter((colorData, index, self) =>
                  index === self.findIndex(
                    t => t.hexCode === colorData.hexCode && t.variantType === colorData.variantType
                  )
                )
                .filter((colorData) =>
                  colorData.colorName.toLowerCase().includes(searchColor) ||
                  colorData.hexCode.toLowerCase().includes(searchColor)
                )
                .map((colorData, index) => {
                  const isSelected = selectedColors.some(
                    (c) => c.hexCode === colorData.hexCode && c.variantType === colorData.variantType
                  );


                  return (
                    <div
                      key={index}
                      className={`grid-6 col-md-3  border rounded p-2 ${isSelected ? "border-primary" : ""}`}
                      onClick={() => handleColorClick(colorData)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="position-relative w-100 overflow-hidden"
                        style={{ height: "5.5rem", borderRadius: "6px" }}
                      >
                        <img
                          src={`${backendUrl}${colorData.colorImage}`}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                          alt={`${colorData.colorName} - ${colorData.variantType}`}
                        />
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100"
                          style={{ mixBlendMode: "multiply", opacity: 0.5, borderRadius: "6px" }}
                        />
                      </div>
                      <div className="text-center mt-2">
                        <h5 className="fw-bold" style={{ fontSize: "0.8rem" }}>{colorData.colorName}</h5>
                        <h6 className="text-muted" style={{ fontSize: "0.8rem" }}>{colorData.hexCode}</h6>
                        <div style={{ fontSize: "0.8rem", color: "#555" }}>{colorData.variantType}</div>
                      </div>
                    </div>
                  );
                })}

            </div>
          </div>
        </div>
      )}
    </div>

      <div className=" d-flex justify-content-between py-3">

        {isAddingColor ? (
          <div className="d-flex justify-content-between w-100">
           <button className="btn btn-outline-secondary" onClick={() => setIsAddingColor(false)}>VIEW CATALOGUE</button>
           <button
        className="btn btn-outline-primary"
        onClick={() => {
          if (isAddingColor) {
            setShowAddColorModal(true); // Show the modal when adding color
          } else {
            setIsAddingColor(true); // Switch to adding color mode
          }
        }}
      >
        ADD COLOR
      </button>          </div>
          ):(
          <div className="d-flex justify-content-between w-100">
          <button className="btn btn-outline-secondary"
           onClick={()=>{
            setUpdatedColors([])
            onClose()
           }}
           >Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveSelection}>Select color</button>
         </div>
        )
        
      }

      <ModalAddColor
        isOpen={showAddColorModal} // Show modal based on state
        onCancel={() => setShowAddColorModal(false)} // Close the modal when cancelled
        onConfirm={() => {
          handleAddColor(); // Add the color
          setShowAddColorModal(false); // Close the modal after confirming
          setIsAddingColor(false)
        }}
      />
       
      </div>
    </div>

 {/* Toast Notification */}
     <div className="fixed top-4 right-4 z-50 space-y-2">
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


        {/* {filteredVariants.length > 0 ? (
                <ul>
                  {filteredVariants.map((item, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "20px",
                          height: "20px",
                          backgroundColor: item.hexCode,
                          marginRight: "8px",
                          border: "1px solid #ccc",
                        }}
                      ></span>
                      <strong>{item.colorName}</strong> — {item.hexCode}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No matching colors found.</p>
              )} */}

  </div>
  );
};

export default CataloguePage;
