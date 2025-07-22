import React, { useEffect, useState } from "react";
import { Offcanvas, Badge } from "react-bootstrap";
import { IoClose, IoArrowBack, IoChevronDown } from "react-icons/io5";
import { HiShoppingCart } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { getProductById, updateProduct } from "../../services/ProductService";
import { getUnusedActiveColors } from "../../services/ColorService";
import ModalAddColor from "./ModalAddColor";
import Toast from "../Toast/Toast";
import "./ModalOrder.css";

const backendUrl = process.env.REACT_APP_IMAGE_URL;

const ModalOrder = ({ 
  show, 
  handleClose, 
  products, 
  addToCart, 
  onOrderCreate, 
  onProductUpdate,
  existingCartItems = []
}) => {
  // Main navigation state
  const [viewMode, setViewMode] = useState('products');
  const [expandedProducts, setExpandedProducts] = useState({});
  
  // Product selection state
  const [selectedColors, setSelectedColors] = useState({});
  
  // Catalogue view state
  const [currentVariant, setCurrentVariant] = useState(null);
  const [currentId, setCurrentId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImage, setProductImage] = useState([]);
  const [catalogueSelectedColors, setCatalogueSelectedColors] = useState([]);
  const [searchColor, setSearchColor] = useState('');
  
  // Custom color management state
  const [customColors, setCustomColors] = useState([]);
  const [tempCustomColors, setTempCustomColors] = useState([]);
  const [updatedColors, setUpdatedColors] = useState([]);
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [isAddingColors, setIsAddingColors] = useState(false); // Loading state for adding colors
  
  // UI state
  const [toasts, setToasts] = useState([]);

  // Reset modal state when it opens/closes
  useEffect(() => {
    if (!show) {
      setViewMode('products');
      setExpandedProducts({});
      setSelectedColors({});
      setCurrentVariant(null);
      setCurrentId('');
      setSelectedProduct(null);
      setProductImage([]);
      setCatalogueSelectedColors([]);
      setSearchColor('');
      setCustomColors([]);
      setTempCustomColors([]);
      setUpdatedColors([]);
      setShowAddColorModal(false);
      setIsAddingColors(false);
      setToasts([]);
    }
  }, [show]);

  // Utility functions
  const createCartItemKey = (item) => {
    return `${item.productId}-${item.size}-${item.color?.name?.toLowerCase()}-${item.color?.hex?.toLowerCase()}-${item.variantType?.toLowerCase()}`;
  };

  const showToast = (message, type = "error") => {
    const newToast = { 
      id: Date.now() + Math.random(),
      message, 
      type 
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  };

  // Fetch custom colors
  const fetchCustomColors = async () => {
    try {
      const variantTypes = ['CONE', 'HANK'];
      const results = await Promise.all(
        variantTypes.map(type => getUnusedActiveColors(currentId, currentVariant.size, type))
      );

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

  useEffect(() => {
    if (viewMode === 'catalogue' && currentId && currentVariant?.size) {
      fetchCustomColors();
    }
  }, [viewMode, currentId, currentVariant?.size]);

  // Event handlers
  const toggleProductExpansion = (productId) => {
    setExpandedProducts(prev => {
      const isCurrentlyExpanded = prev[productId];
      
      if (isCurrentlyExpanded) {
        // If clicking on an already expanded item, just close it
        return {
          ...prev,
          [productId]: false
        };
      } else {
        // If opening a new item, close all others and open this one
        const newExpandedProducts = {};
        Object.keys(prev).forEach(id => {
          newExpandedProducts[id] = false;
        });
        newExpandedProducts[productId] = true;
        return newExpandedProducts;
      }
    });
  };

  const openCatalogue = (variant, id, imageUrl) => {
    const product = products.find(p => p.productId === Number(id));
    setCurrentId(id);
    setCurrentVariant(variant);
    setSelectedProduct(product);
    setProductImage(imageUrl);
    setCatalogueSelectedColors([]);
    setSearchColor('');
    setUpdatedColors([]);
    setViewMode('catalogue');
  };

  const handleCatalogueColorClick = (color) => {
    setCatalogueSelectedColors((prevColors) => {
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

  const handleCustomColorSelect = (color, variantType) => {
    setTempCustomColors((prevColors) => {
      const isAlreadySelected = prevColors.some(
        (c) => c.hexCode === color.hexCode && 
               c.colorName.toLowerCase() === color.colorName.toLowerCase() &&
               c.variantType === variantType
      );

      if (isAlreadySelected) {
        return prevColors.filter(
          (c) => !(c.hexCode === color.hexCode && 
                   c.colorName.toLowerCase() === color.colorName.toLowerCase() &&
                   c.variantType === variantType)
        );
      } else {
        return [...prevColors, { ...color, variantType }];
      }
    });
  };

  const handleAddToCart = () => {
    if (catalogueSelectedColors.length === 0) {
      showToast("Please select at least one color", "error");
      return;
    }

    const newCartItems = catalogueSelectedColors.map((colorData) => {
      let matchingVariant = null;
      
      if (currentVariant?.variants) {
        currentVariant.variants.forEach(colorGroup => {
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

      return {
        productId: Number(currentId),
        productName: selectedProduct?.productName || "Unknown Product",
        size: currentVariant?.size || "Unknown Size",
        color: {
          name: colorData.colorName,
          hex: colorData.hexCode,
          colorImage: colorData.colorImage,
        },
        variantType: colorData.variantType,
        price: matchingVariant?.price || 0,
        markupPricePerKg: matchingVariant?.markupPricePerKg || 0,
        available: matchingVariant?.available || 0,
        gstOnProduct: selectedProduct?.gstOnProduct || 0,
        productImage: productImage,
        variantId: matchingVariant?.id,
      };
    });

    const currentExistingItems = Array.isArray(existingCartItems) ? existingCartItems : [];
    const existingItemKeys = new Set(
      currentExistingItems.map(item => createCartItemKey(item))
    );

    const itemsToAdd = [];
    const skippedDuplicates = [];

    newCartItems.forEach(newItem => {
      const newItemKey = createCartItemKey(newItem);
      
      if (existingItemKeys.has(newItemKey)) {
        skippedDuplicates.push(newItem);
      } else {
        itemsToAdd.push(newItem);
      }
    });

    if (itemsToAdd.length === 0) {
      if (skippedDuplicates.length > 0) {
        showToast("All selected items are already in your cart", "info");
      }
      return;
    }

    try {
      onOrderCreate(itemsToAdd, 'ADD_TO_EXISTING');
      
      let message = `${itemsToAdd.length} item${itemsToAdd.length !== 1 ? 's' : ''} added to cart successfully!`;
      if (skippedDuplicates.length > 0) {
        message += ` (${skippedDuplicates.length} duplicate${skippedDuplicates.length !== 1 ? 's' : ''} skipped)`;
      }
      
      showToast(message, "success");
      setCatalogueSelectedColors([]);
      setViewMode('products');
      
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error("Error adding items to cart:", error);
      showToast("Failed to add items to cart. Please try again.", "error");
    }
  };

  const handleAddColor = async () => {
    if (tempCustomColors.length === 0) {
      showToast("Please select at least one color before adding.", "error");
      return;
    }

    setIsAddingColors(true); // Start loading

    try {
      // Optimized: Fetch product data once and calculate averages more efficiently
      const response = await getProductById(currentId);
      const productData = response.data;
      const existingVariants = productData.variants || [];
      const groupedVariants = productData.groupedVariants || [];
      
      // Pre-calculate average prices for current size and variant types
      const allVariantTypes = ["CONE", "HANK"];
      const averagePriceMap = {};
      
      allVariantTypes.forEach((type) => {
        const filtered = existingVariants.filter(
          v => v.size === currentVariant.size && v.variantType === type
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

          averagePriceMap[type] = {
            pricePerKg: +(total.pricePerKg / filtered.length).toFixed(2),
            costPerKg: +(total.costPerKg / filtered.length).toFixed(2),
            markupPricePerKg: +(total.markupPricePerKg / filtered.length).toFixed(2),
          };
        } else {
          // Default values if no existing variants
          averagePriceMap[type] = {
            pricePerKg: 150,
            costPerKg: 200,
            markupPricePerKg: 250,
          };
        }
      });

      // Create new variants only for selected types
      const newVariants = [];
      tempCustomColors.forEach((color) => {
        const avg = averagePriceMap[color.variantType];
        
        newVariants.push({
          size: currentVariant.size,
          variantType: color.variantType,
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
        });
      });

      // Optimized duplicate check using Set for faster lookup
      const existingVariantKeys = new Set();
      groupedVariants.forEach(group => {
        if (group.size === currentVariant.size) {
          group.variants.forEach(existing => {
            existing.variants?.forEach(variant => {
              const key = `${existing.colorName.toLowerCase()}-${existing.hexCode.toLowerCase()}-${variant.variantType}`;
              existingVariantKeys.add(key);
            });
          });
        }
      });

      const filteredNewVariants = newVariants.filter(variant => {
        const key = `${variant.color.colorName.toLowerCase()}-${variant.color.colorCode.toLowerCase()}-${variant.variantType}`;
        return !existingVariantKeys.has(key);
      });

      if (filteredNewVariants.length === 0) {
        showToast("All selected variants already exist.", "error");
        return;
      }

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

      // Update product and get updated variants
      await updateProduct(currentId, formattedData);

      // Optimized: Process updated colors without redundant API call if possible
      const updatedColorsWithIds = [];
      const seen = new Set();

      filteredNewVariants.forEach((variant) => {
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
              variantType: variant.variantType.toLowerCase(),
              colorImage: match.variantType === "CONE" ? match.colorImageCone : match.colorImageHank,
            });

            seen.add(key);
          }
        }
      });

      // Update state efficiently
      setUpdatedColors(updatedColorsWithIds);
      setTempCustomColors([]);
      setViewMode('catalogue');
      
      // Fetch custom colors and update product in parallel
      await Promise.all([
        fetchCustomColors(),
        onProductUpdate?.()
      ]);
      
      showToast("New color variants added successfully!", "success");

    } catch (error) {
      console.error("Error adding color variant:", error);
      showToast("Failed to add color variant. Please try again.", "error");
    } finally {
      setIsAddingColors(false); // End loading
    }
  };

  const handleOrderCreation = () => {
    const newOrderItems = Object.entries(selectedColors).flatMap(([productId, sizes]) =>
      Object.entries(sizes).flatMap(([size, colorArray]) => {
        const product = products.find((p) => p.productId === Number(productId));
        if (!product) return [];

        const sizeGroup = product.groupedVariants.find((group) => group.size === size);
        if (!sizeGroup) return [];

        return colorArray.flatMap((colorData) => {
          const matchedColorGroup = sizeGroup.variants.find(
            (v) =>
              v.colorName?.toLowerCase() === colorData.colorName.toLowerCase() &&
              v.hexCode?.toLowerCase() === colorData.hexCode.toLowerCase()
          );

          if (!matchedColorGroup) return [];

          const variantsArray = matchedColorGroup.variants || [matchedColorGroup];
          const matchingVariant = variantsArray.find(
            (variant) =>
              variant.variantType?.toLowerCase() === (colorData.variantType || "").toLowerCase()
          );

          if (!matchingVariant) return [];

          return {
            productId: product.productId,
            productName: product.productName,
            size,
            color: {
              name: colorData.colorName,
              hex: colorData.hexCode,
              colorImage: colorData.colorImage,
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

    if (newOrderItems.length === 0) {
      return;
    }

    const currentExistingItems = Array.isArray(existingCartItems) ? existingCartItems : [];
    const existingItemKeys = new Set(
      currentExistingItems.map(item => createCartItemKey(item))
    );

    const itemsToAdd = [];
    const skippedDuplicates = [];
    
    newOrderItems.forEach(newItem => {
      const newItemKey = createCartItemKey(newItem);
      
      if (existingItemKeys.has(newItemKey)) {
        skippedDuplicates.push(newItem);
      } else {
        itemsToAdd.push(newItem);
      }
    });

    if (itemsToAdd.length > 0) {
      onOrderCreate(itemsToAdd, 'CREATE_WITH_EXISTING');
    }

    handleClose();
  };

  // Utility functions for counts
  const getTotalSelectedItems = () => {
    return Object.values(selectedColors).reduce((total, sizes) => {
      return total + Object.values(sizes).reduce((sizeTotal, colors) => {
        return sizeTotal + colors.length;
      }, 0);
    }, 0);
  };

  const getProductSelectedCount = (productId) => {
    const productColors = selectedColors[productId];
    if (!productColors) return 0;
    
    return Object.values(productColors).reduce((total, colors) => {
      return total + colors.length;
    }, 0);
  };

  const handleColorSelection = (selectedColorArray) => {
    if (!currentVariant) return;

    setSelectedColors((prev) => ({
      ...prev,
      [currentId]: {
        ...(prev[currentId] || {}),
        [currentVariant.size]: selectedColorArray,
      },
    }));

    setViewMode('products');
  };

  // Group colors for catalogue display
  const groupedByColorAndType = currentVariant?.variants?.reduce((acc, variant) => {
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

  // Render helper functions
  const renderProductsView = () => (
    <div className="products-dropdown-view">
      <div className="products-dropdown-list">
        {products
          .filter((product) => product.availableStatus === "ACTIVE")
          .map((product) => {
            const isExpanded = expandedProducts[product.productId];
            const selectedCount = getProductSelectedCount(product.productId);
            
            return (
              <div key={product.productId} className="product-dropdown-item">
                <div 
                  className="product-dropdown-header"
                  onClick={() => toggleProductExpansion(product.productId)}
                >
                  <div className="product-header-content">
                    <span className="product-dropdown-name">{product.productName}</span>
                    {selectedCount > 0 && (
                      <Badge bg="success" className="product-selected-badge">
                        {selectedCount}
                      </Badge>
                    )}
                  </div>
                  <IoChevronDown 
                    className={`dropdown-chevron ${isExpanded ? 'expanded' : ''}`}
                  />
                </div>

                {isExpanded && (
                  <div className="size-options-container">
                    <div className="size-options-grid">
                      {product.groupedVariants?.map((variant) => {
                        const sizeSelectedCount = selectedColors[product.productId]?.[variant.size]?.length || 0;
                        
                        return (
                          <button
                            key={variant.id}
                            className={`size-option-btn ${sizeSelectedCount > 0 ? 'has-selection' : ''}`}
                            onClick={() => openCatalogue(variant, product.productId, product.productImage)}
                          >
                            <span className="size-name">{variant.size}</span>
                            {sizeSelectedCount > 0 && (
                              <Badge bg="primary-custom" className="size-selected-count">
                                {sizeSelectedCount}
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {Object.keys(selectedColors).length > 0 && (
        <div className="selected-summary-section">
          <h6 className="summary-title">Selected Items Summary</h6>
          <div className="summary-list">
            {Object.entries(selectedColors).map(([productId, sizes]) => {
              const product = products.find(p => p.productId === Number(productId));
              if (!product) return null;

              return (
                <div key={productId} className="summary-product">
                  <div className="summary-product-name">{product.productName}</div>
                  {Object.entries(sizes).map(([size, colors]) => (
                    <div key={size} className="summary-size-group">
                      <span className="summary-size-label">
                        {size}: {colors.length} color{colors.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderCatalogueView = () => (
    <div className="catalogue-container">
      <input
        onChange={(e) => setSearchColor(e.target.value.toLowerCase())}
        className="form-control"
        placeholder="Search by name or hexcode"
        value={searchColor}
      />

      {customColors.length > 0 && (
        <div className="custom-colors-header">
          <h3>Custom Colors</h3>
          <button
            className="btn-add-color"
            onClick={() => setViewMode('addingColor')}
          >
            <FaPlus /> New color
          </button>
        </div>
      )}

      <h4 style={{ fontSize: '14px', fontWeight: '600', marginTop: '20px', marginBottom: '16px' }}>
        Preset Catalogue
      </h4>
      
      <div className="catalogue-grid">
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
            const isSelected = catalogueSelectedColors.some(
              (c) => c.hexCode === colorData.hexCode && c.variantType === colorData.variantType
            );

            return (
              <div
                key={index}
                className={`color-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleCatalogueColorClick(colorData)}
              >
                <div className="color-image">
                  <img
                    src={`${backendUrl}${colorData.colorImage}`}
                    alt={`${colorData.colorName} - ${colorData.variantType}`}
                  />
                </div>
                <div className="color-name">{colorData.colorName}</div>
                <div className="color-code">{colorData.hexCode}</div>
                <div className="color-type">{colorData.variantType}</div>
              </div>
            );
          })}
      </div>
    </div>
  );

  const renderAddingColorView = () => (
    <div className="adding-color-view">
      <h4>Select Custom Colors</h4>
      {customColors.length === 0 ? (
        <div className="no-colors-message">No unused custom colors available</div>
      ) : (
        <div className="custom-colors-grid">
          <div className="custom-color-grid">
            {customColors.map((item, index) => {
              // Add safety checks for undefined values
              const variantType = item.variantType || 'CONE';
              const colorImages = item.colorImage || [];
              
              const isSelected = tempCustomColors.some(
                (color) =>
                  color.colorName.toLowerCase() === item.colorName.toLowerCase() &&
                  color.hexCode.toLowerCase() === item.colorCode.toLowerCase() &&
                  color.variantType === variantType
              );

              const variantImage = colorImages.find((img) =>
                img && img.toLowerCase().includes(variantType.toLowerCase())
              );

              const imageForCone = colorImages.find((img) =>
                img && img.toLowerCase().includes("cone")
              ) || "";
              
              const imageForHank = colorImages.find((img) =>
                img && img.toLowerCase().includes("hank")
              ) || "";

              return (
                <div
                  key={index}
                  className={`custom-color-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    handleCustomColorSelect({
                      colorName: item.colorName,
                      hexCode: item.colorCode,
                      colorImageCone: imageForCone,
                      colorImageHank: imageForHank,
                    }, variantType);
                  }}
                >
                  <div className="custom-color-image">
                    <img
                      src={`${backendUrl}${variantImage || ''}`}
                      alt={`${item.colorName} - ${variantType}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="custom-color-name">{item.colorName}</div>
                  <div className="custom-color-code">{item.colorCode}</div>
                  <div className="custom-color-variants">{variantType}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'addingColor':
        return renderAddingColorView();
      case 'catalogue':
        return renderCatalogueView();
      default:
        return renderProductsView();
    }
  };

  const renderFooterButtons = () => {
    switch (viewMode) {
      case 'addingColor':
        return (
          <div className="modal-footer">
            <button 
              className="btn-secondary" 
              onClick={() => setViewMode('catalogue')}
              disabled={isAddingColors}
            >
              View Catalogue
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowAddColorModal(true)}
              disabled={isAddingColors}
            >
              Add Color
            </button>
          </div>
        );

      case 'catalogue':
        return (
          <div className="modal-footer">
            <button 
              className="btn-secondary"
              onClick={() => {
                setUpdatedColors([]);
                setViewMode('products');
              }}
            >
              <IoArrowBack style={{ marginRight: '6px' }} />
              Back to Products
            </button>
            <button 
              className="btn-primary" 
              onClick={handleAddToCart}
              disabled={catalogueSelectedColors.length === 0}
            >
              <HiShoppingCart style={{ marginRight: '6px' }} />
              Add to Cart ({catalogueSelectedColors.length})
            </button>
          </div>
        );

      default:
        return (
          <div className="modal-footer">
            <button 
              className="btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleOrderCreation}
              disabled={getTotalSelectedItems() === 0}
            >
              <HiShoppingCart style={{ marginRight: '6px' }} />
              Create Order ({getTotalSelectedItems()})
            </button>
          </div>
        );
    }
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={handleClose} 
      placement="end" 
      className="sidebarr-order"
      backdrop={true} // Changed from "static" to true to allow closing by clicking outside
    >
      {/* Header */}
      <div className="sidebarr-header">
        <div className="header-content">
          <div className="header-title">
            <h5>
              {viewMode === 'catalogue' && 'Select Colors'}
              {viewMode === 'addingColor' && 'Add Custom Colors'}
              {viewMode === 'products' && 'Product Catalog'}
            </h5>
          </div>
          {(getTotalSelectedItems() > 0 || catalogueSelectedColors.length > 0) && (
            <Badge bg="primary" className="item-count-badge">
              {viewMode === 'catalogue' ? catalogueSelectedColors.length : getTotalSelectedItems()}
            </Badge>
          )}
        </div>
        <button 
          className="close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          <IoClose />
        </button>
      </div>

      {/* Body */}
      <div className="sidebarr-body">
        {isAddingColors && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              {/* Option 1: Classic spinning circle */}
              <div className="spinner-circle"></div>
              
              {/* Option 2: Three bouncing dots (uncomment to use)
              <div className="spinner-dots">
                <div className="spinner-dot"></div>
                <div className="spinner-dot"></div>
                <div className="spinner-dot"></div>
              </div>
              */}
              
              {/* Option 3: Pulsing circle (uncomment to use)
              <div className="spinner-pulse"></div>
              */}
              
              <div className="loading-text">Adding colors...</div>
            </div>
          </div>
        )}
        {renderContent()}
      </div>

      {/* Footer */}
      {renderFooterButtons()}

      {/* Modals */}
      <ModalAddColor
        isOpen={showAddColorModal}
        onCancel={() => setShowAddColorModal(false)}
        onConfirm={() => {
          handleAddColor();
          setShowAddColorModal(false);
        }}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
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
    </Offcanvas>
  );
};

export default ModalOrder;