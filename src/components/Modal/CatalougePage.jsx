import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { getProductById, updateProduct } from "../../services/ProductService";
import ModalAddColor from "./ModalAddColor";
import Toast from "../Toast/Toast";
import { getUnusedActiveColors } from "../../services/ColorService";
import { HiShoppingCart } from "react-icons/hi";

const backendUrl = process.env.REACT_APP_IMAGE_URL

const CataloguePage = ({ 
  onColorSelect, 
  onClose, 
  variant, 
  id, 
  imageUrl, 
  onProductUpdate,
  onAddToCart,        // New prop for direct add to cart
  productName,        // New prop for product name
  gstOnProduct,       // New prop for GST
  selectedProduct,    // New prop for complete product data
  existingCartItems = [] // New prop for existing cart items to check duplicates
}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColor, setNewColor] = useState({ colorName: "", hexCode: "" });
  const [customColors, setCustomColors] = useState([]);
  const [tempCustomColors, setTempCustomColors] = useState([]);
  const [searchColor, setSearchColor] = useState('')
  const [selectedColors, setSelectedColors] = useState([]); 
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [updatedColors, setUpdatedColors] = useState([])

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
    if (id && variant?.size) {
      fetchCustomColors();
    }
  }, [id, variant?.size]);

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

  // Centralized toast function
  const showToast = (message, type = "error") => {
    const newToast = { 
      id: Date.now() + Math.random(), // Ensure unique ID
      message, 
      type 
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  };

  // Enhanced function to create a unique key for cart items
  const createCartItemKey = (item) => {
    return `${item.productId}-${item.size}-${item.color?.name?.toLowerCase()}-${item.color?.hex?.toLowerCase()}-${item.variantType?.toLowerCase()}`;
  };

  // Enhanced function to check if two cart items are exact duplicates
  const areExactDuplicates = (item1, item2) => {
    return (
      item1.productId === item2.productId &&
      item1.size === item2.size &&
      item1.color?.name?.toLowerCase() === item2.color?.name?.toLowerCase() &&
      item1.color?.hex?.toLowerCase() === item2.color?.hex?.toLowerCase() &&
      item1.variantType?.toLowerCase() === item2.variantType?.toLowerCase()
    );
  };

  // Enhanced handleAddToCart with robust duplicate prevention
  const handleAddToCart = () => {
    if (selectedColors.length === 0) {
      showToast("Please select at least one color", "error");
      return;
    }

    console.log("Selected colors to add:", selectedColors);
    console.log("Existing cart items:", existingCartItems);

    // Create cart items from selected colors with enhanced data structure
    const newCartItems = selectedColors.map((colorData) => {
      // Find the matching variant from the variant data
      let matchingVariant = null;
      
      // Search through the variant structure to find the matching variant
      if (variant?.variants) {
        variant.variants.forEach(colorGroup => {
          if (colorGroup.colorName?.toLowerCase() === colorData.colorName?.toLowerCase() &&
              colorGroup.hexCode?.toLowerCase() === colorData.hexCode?.toLowerCase()) {
            
            const foundVariant = colorGroup.variants?.find(v => 
              v.variantType?.toLowerCase() === colorData.variantType?.toLowerCase()
            );
            
            if (foundVariant) {
              matchingVariant = foundVariant;
            }
          }
        });
      }

      // Create comprehensive cart item structure
      return {
        productId: Number(id), // Ensure it's a number
        productName: productName || selectedProduct?.productName || "Unknown Product",
        size: variant?.size || "Unknown Size",
        color: {
          name: colorData.colorName,
          hex: colorData.hexCode,
          colorImage: colorData.colorImage,
        },
        variantType: colorData.variantType,
        price: matchingVariant?.price || 0,
        markupPricePerKg: matchingVariant?.markupPricePerKg || 0,
        available: matchingVariant?.available || 0,
        gstOnProduct: gstOnProduct || selectedProduct?.gstOnProduct || 0,
        productImage: imageUrl,
        variantId: matchingVariant?.id,
      };
    });

    console.log("New cart items created:", newCartItems);

    // Ensure existingCartItems is an array
    const currentExistingItems = Array.isArray(existingCartItems) ? existingCartItems : [];
    
    // Create a Set of existing item keys for faster duplicate checking
    const existingItemKeys = new Set(
      currentExistingItems.map(item => createCartItemKey(item))
    );

    console.log("Existing item keys:", Array.from(existingItemKeys));

    // Filter new items to exclude exact duplicates
    const itemsToAdd = [];
    const skippedDuplicates = [];

    newCartItems.forEach(newItem => {
      const newItemKey = createCartItemKey(newItem);
      console.log(`Checking item key: ${newItemKey}`);
      
      if (existingItemKeys.has(newItemKey)) {
        skippedDuplicates.push(newItem);
        console.log(`Skipping duplicate: ${newItem.productName} - ${newItem.size} - ${newItem.color?.name} - ${newItem.variantType}`);
      } else {
        itemsToAdd.push(newItem);
        console.log(`Adding new item: ${newItem.productName} - ${newItem.size} - ${newItem.color?.name} - ${newItem.variantType}`);
      }
    });

    console.log("Items to add:", itemsToAdd);
    console.log("Skipped duplicates:", skippedDuplicates);

    // Show appropriate messages
    if (itemsToAdd.length === 0) {
      if (skippedDuplicates.length > 0) {
        showToast("All selected items are already in your cart", "info");
      }
      return;
    }

    // Call the parent's add to cart function with only new items
    if (onAddToCart) {
      try {
        onAddToCart(itemsToAdd);
        
        // Create success message
        let message = `${itemsToAdd.length} item${itemsToAdd.length !== 1 ? 's' : ''} added to cart successfully!`;
        if (skippedDuplicates.length > 0) {
          message += ` (${skippedDuplicates.length} duplicate${skippedDuplicates.length !== 1 ? 's' : ''} skipped)`;
        }
        
        showToast(message, "success");
        
        // Clear selected colors after successful addition
        setSelectedColors([]);
        
        // Optional: Close the catalogue and return to products view
        onClose();
        
      } catch (error) {
        console.error("Error adding items to cart:", error);
        showToast("Failed to add items to cart. Please try again.", "error");
      }
    } else {
      // Fallback: Use the existing onColorSelect method if onAddToCart is not available
      console.warn("onAddToCart prop not available, using onColorSelect fallback");
      if (onColorSelect) {
        // For fallback, we still only pass items that aren't duplicates
        onColorSelect(itemsToAdd.map(item => ({
          colorName: item.color.name,
          hexCode: item.color.hex,
          variantType: item.variantType,
          colorImage: item.color.colorImage
        })));
        
        let message = `${itemsToAdd.length} item${itemsToAdd.length !== 1 ? 's' : ''} selected successfully!`;
        if (skippedDuplicates.length > 0) {
          message += ` (${skippedDuplicates.length} duplicate${skippedDuplicates.length !== 1 ? 's' : ''} skipped)`;
        }
        
        showToast(message, "success");
        setSelectedColors([]);
        onClose();
      } else {
        showToast("Add to cart function not available", "error");
        console.error("Both onAddToCart and onColorSelect props are missing");
      }
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
    if (tempCustomColors.length === 0) {
      showToast("Please select at least one color before adding.", "error");
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

          averagePriceMap[variant.size] = averagePriceMap[variant.size] || {};
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
            variantType: variantType.toUpperCase(),
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

  const groupedByColorAndType = variant?.variants?.reduce((acc, variant) => {
    const baseKey = `${variant.colorName}-${variant.hexCode.toLowerCase()}`;
    
    variant.variants.forEach((innerVariant) => {
      const fullKey = `${baseKey}-${innerVariant.variantType}`;
      
      if (!acc[fullKey]) {
        acc[fullKey] = {
          colorName: variant.colorName,
          hexCode: variant.hexCode,
          variantType: innerVariant.variantType,
          colorImage: innerVariant.colorImage
        };
      }
    });

    return acc;
  }, {}) || {};

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
            <div className="container p-0 mt-3" style={{  height: "calc(83vh - 200px)", overflow: "auto" }}> 
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
                        className={`grid-6 col-md-3 w-5 border rounded p-2 ${isSelected ? "border-primary" : ""}`}
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
        </button>          
            </div>
            ):(
          <div className="d-flex justify-content-between w-100">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => {
                setUpdatedColors([]);
                onClose();
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleAddToCart}
              disabled={selectedColors.length === 0}
            >
              <HiShoppingCart className="me-2" />
              Add to Cart ({selectedColors.length})
            </button>
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