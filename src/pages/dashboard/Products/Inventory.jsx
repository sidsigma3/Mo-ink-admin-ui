import React, { useRef, useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import DashboardBox from "../../../components/DashboardBox/DashboardBox";
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import { LuDot } from "react-icons/lu";
import './Inventory.css';
import { FiShoppingCart, FiSearch, FiX, FiFilter } from "react-icons/fi";
import { LuWeight } from "react-icons/lu";
import { getAllProduct } from '../../../services/ProductService'
import {getAllInventory} from '../../../services/InventoryService'
import * as XLSX from 'xlsx';
import TooltipVendor from '../../../components/Tooltip/TooltipVendor';
import { FaUser, FaChevronDown } from 'react-icons/fa';

const Inventory = () => {

  const exportRef = useRef(null);

  const [product,setProduct] = useState([])
  const [filteredData, setFilteredData] = useState([]); 
  const [dashboardStats, setDashboardStats] = React.useState({
    totalSKU: 0,
    fromManufacturer: 0,
    totalCustomerOrder: 0,
    stockRemaining: 0,
  });

  const [allInventory, setAllInventory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);

  // Updated filter state for single selection
  const [filters, setFilters] = useState({
    productName: '', // Changed from array to string
    size: '',        // Changed from array to string
    colors: [],      // Changed back to array for multiple color selection
    type: '',        // Changed from array to string
    isFilterOpen: false
  });

  const [searchTerms, setSearchTerms] = useState({
    productName: '',
    size: '',
    color: '',
    type: ''
  });

  // Available filter options
  const [filterOptions, setFilterOptions] = useState({
    productNames: [],
    sizes: [],
    colors: [],
    types: []
  });

  // New state for color suggestions
  const [colorSuggestions, setColorSuggestions] = useState([]);
  const [showColorSuggestions, setShowColorSuggestions] = useState(false);

  const [expandedProduct, setExpandedProduct] = useState(null);
  const [expandedSize, setExpandedSize] = useState(null);
  const [expandedType, setExpandedType] = useState(null);

  const toggleProduct = (product) => {
    setExpandedProduct(product === expandedProduct ? null : product);
    setExpandedSize(null);
    setExpandedType(null);
  };

  const toggleSize = (product, size) => {
    const key = `${product}-${size}`;
    setExpandedSize(key === expandedSize ? null : key);
    setExpandedType(null);
  };

  const toggleType = (product, size, type) => {
    const key = `${product}-${size}-${type}`;
    setExpandedType(key === expandedType ? null : key);
  };

  useEffect(() => {
    fetchProductdData();
  }, []);

  const navigate = useNavigate();

  const handleRowClick = (item) => {
    navigate('/inventorydetails', { state: { item } });
  };

  const groupInventory = (data) => {
    const grouped = {};

    data.forEach(item => {
      const { product, counter, type } = item;

      if (!grouped[product]) grouped[product] = {};
      if (!grouped[product][counter]) grouped[product][counter] = {};
      if (!grouped[product][counter][type]) grouped[product][counter][type] = [];

      grouped[product][counter][type].push(item);
    });

    return grouped;
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await getAllInventory();
        const flatData = [];

        response?.data?.product?.forEach((product) => {
          product.variant.forEach((variant) => {
            flatData.push({
              product: product.productName,
              counter: variant.size,
              type: variant.variantType,
              color: variant.color,
              customerOrder: variant.reserveWeight,
              remainingWeight: variant.availableWeight,
              raw: variant,
            });
          });
        });

        setAllInventory(flatData);
        setFilteredInventory(flatData);
        setInventory(groupInventory(flatData));

        // Extract unique filter options and filter out undefined/null values
        const uniqueProducts = [...new Set(flatData.map(item => item.product))].filter(Boolean);
        const uniqueSizes = [...new Set(flatData.map(item => item.counter))].filter(Boolean);
        const uniqueColors = [...new Set(flatData.map(item => item.color?.colorName))].filter(Boolean);
        const uniqueTypes = [...new Set(flatData.map(item => item.type))].filter(Boolean);

        setFilterOptions({
          productNames: uniqueProducts,
          sizes: uniqueSizes,
          colors: uniqueColors,
          types: uniqueTypes
        });

        // Dashboard stats
        const totalSKU = flatData.length;
        const stockRemaining = flatData.reduce((acc, item) => acc + (item.remainingWeight || 0), 0);
        const totalCustomerOrder = flatData.reduce((acc, item) => acc + (item.customerOrder || 0), 0);

        setDashboardStats({
          totalSKU,
          stockRemaining,
          totalCustomerOrder,
        });

      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    };

    fetchInventory();
  }, []);

  const fetchProductdData = async () => {
    try {
      const data = await getAllProduct();
      setProduct(data.data);
      setFilteredData(data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Get available sizes for selected product
  const getAvailableSizes = () => {
    if (!filters.productName) {
      return filterOptions.sizes;
    }
    
    const productSizes = allInventory
      .filter(item => item.product === filters.productName)
      .map(item => item.counter);
    
    return [...new Set(productSizes)].filter(Boolean);
  };

  // Get available types for selected product and size
  const getAvailableTypes = () => {
    let filtered = allInventory;
    
    if (filters.productName) {
      filtered = filtered.filter(item => item.product === filters.productName);
    }
    
    if (filters.size) {
      filtered = filtered.filter(item => item.counter === filters.size);
    }
    
    const types = filtered.map(item => item.type);
    return [...new Set(types)].filter(Boolean);
  };

  // Get available colors for selected product and size
  const getAvailableColors = () => {
    let filtered = allInventory;
    
    if (filters.productName) {
      filtered = filtered.filter(item => item.product === filters.productName);
    }
    
    if (filters.size) {
      filtered = filtered.filter(item => item.counter === filters.size);
    }
    
    const colors = filtered.map(item => item.color?.colorName).filter(Boolean);
    return [...new Set(colors)];
  };

  // Apply filters function
  const applyFilters = () => {
    let filtered = allInventory;

    // Apply product name filter
    if (filters.productName) {
      filtered = filtered.filter(item => item.product === filters.productName);
    }

    // Apply size filter
    if (filters.size) {
      filtered = filtered.filter(item => item.counter === filters.size);
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(item => 
        filters.colors.includes(item.color?.colorName)
      );
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    setFilteredInventory(filtered);
    setInventory(groupInventory(filtered));
  };

  // Handle single filter selection
  const handleFilterSelect = (filterType, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: prev[filterType] === value ? '' : value
      };
      
      // Reset dependent filters when product changes
      if (filterType === 'productName') {
        newFilters.size = '';
        newFilters.type = '';
      }
      
      // Reset type when size changes
      if (filterType === 'size') {
        newFilters.type = '';
      }
      
      return newFilters;
    });
  };

  // Handle search input change
  const handleSearchChange = (filterType, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [filterType]: value
    }));

    // Handle color suggestions
    if (filterType === 'color') {
      if (value.trim()) {
        const availableColors = getAvailableColors();
        const suggestions = availableColors.filter(color => 
          color && color.toLowerCase().includes(value.toLowerCase()) &&
          !filters.colors.includes(color)
        );
        setColorSuggestions(suggestions);
        setShowColorSuggestions(true);
      } else {
        setShowColorSuggestions(false);
      }
    }
  };

  // Add color from suggestions
  const addColorFromSuggestion = (color) => {
    if (!filters.colors.includes(color)) {
      setFilters(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }));
    }
    setSearchTerms(prev => ({
      ...prev,
      color: ''
    }));
    setShowColorSuggestions(false);
  };

  // Remove color tag
  const removeColorTag = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  // Get filtered suggestions - Updated for single selection
  const getFilteredSuggestions = (filterType) => {
    const searchTerm = searchTerms[filterType]?.toLowerCase() || '';
    let options = [];
    
    switch (filterType) {
      case 'productNames':
        options = filterOptions.productNames;
        break;
      case 'sizes':
        options = getAvailableSizes();
        break;
      case 'types':
        options = getAvailableTypes();
        break;
      default:
        options = filterOptions[filterType] || [];
    }
    
    if (!searchTerm) return options;
    
    return options.filter(option => 
      option && option.toString().toLowerCase().includes(searchTerm)
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      productName: '',
      size: '',
      colors: [],
      type: '',
      isFilterOpen: false
    });
    setSearchTerms({
      productName: '',
      size: '',
      color: '',
      type: ''
    });
    setShowColorSuggestions(false);
    setFilteredInventory(allInventory);
    setInventory(groupInventory(allInventory));
  };

  // Toggle filter sidebar
  const toggleFilterSidebar = () => {
    setFilters(prev => ({
      ...prev,
      isFilterOpen: !prev.isFilterOpen
    }));
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    applyFilters();
    setFilters(prev => ({
      ...prev,
      isFilterOpen: false
    }));
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.productName) count++;
    if (filters.size) count++;
    if (filters.colors.length > 0) count++;
    if (filters.type) count++;
    return count;
  };

  const handleStatusChange = (status) => {
    if (status === "All") {
      setFilteredData(product);
    } else {
      const filtered = product.filter(item => item.availableStatus === status);
      setFilteredData(filtered);
    }
  };

  const renderColorDot = (color) => (
    <div
      title={color?.colorName}
      style={{
        backgroundColor: color?.colorCode,
        width: 20,
        height: 20,
        borderRadius: '50%',
        display: 'inline-block',
        border: '1px solid #999',
      }}
    />
  );

  const exportToExcel = (data) => {
    const exportData = data.map(item => ({
      Product: item.product,
      Counter: item.counter,
      Type: item.type,
      Color: item.color?.colorName || '',
      'Customer Order (Kgs)': item.customerOrder,
      'Remaining Weight (Kgs)': item.remainingWeight,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, 'inventory.xlsx');
  };

  return (
    <div className='inventory-wrapper p-0 '>
      {/* Filter Sidebar Overlay */}
      {filters.isFilterOpen && (
        <div className="filter-overlay" onClick={toggleFilterSidebar}></div>
      )}

      {/* Filter Sidebar */}
      <div className={`filter-sidebar ${filters.isFilterOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h5>Filters</h5>
          <button 
            className="close-filter-btn"
            onClick={toggleFilterSidebar}
          >
            <FiX />
          </button>
        </div>

        <div className="filter-content">
          {/* Product Name Filter */}
          <div className="filter-section">
            <h6>Product Name</h6>
            <div className="filter-options">
              {getFilteredSuggestions('productNames').map(option => (
                <label key={option} className={`filter-option ${filters.productName === option ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="productName"
                    checked={filters.productName === option}
                    onChange={() => handleFilterSelect('productName', option)}
                    className="filter-checkbox"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="filter-section-size">
            <h6>Size</h6>
            <div className="filter-options-size">
              {getFilteredSuggestions('sizes').map(option => (
                <label key={option} className={`filter-option-size ${filters.size === option ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="size"
                    checked={filters.size === option}
                    onChange={() => handleFilterSelect('size', option)}
                    className="filter-checkbox"
                  />
                  <span className="filter-pill-size">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Filter - Enhanced with auto-suggest and tags */}
          <div className="filter-section">
            <h6>Color</h6>
            <div className="color-filter-container">
              <div className="search-input-container" style={{ position: 'relative' }}>
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search colors..."
                  value={searchTerms.color}
                  onChange={(e) => handleSearchChange('color', e.target.value)}
                  className="filter-search-input"
                />
                
                {/* Color Suggestions Dropdown */}
                {showColorSuggestions && colorSuggestions.length > 0 && (
                  <div className="color-suggestions-dropdown">
                    {colorSuggestions.map(color => (
                      <div
                        key={color}
                        className="color-suggestion-item"
                        onClick={() => addColorFromSuggestion(color)}
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Selected Color Tags */}
              {filters.colors.length > 0 && (
                <div className="color-tags-container">
                  {filters.colors.map(color => (
                    <span key={color} className="color-tag">
                      {color}
                      <button 
                        className="remove-color-tag"
                        onClick={() => removeColorTag(color)}
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Type Filter */}
          <div className="filter-section">
            <h6>Type</h6>
            <div className="filter-options">
              {getFilteredSuggestions('types').map(option => (
                <label key={option} className={`filter-option ${filters.type === option ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    checked={filters.type === option}
                    onChange={() => handleFilterSelect('type', option)}
                    className="filter-checkbox"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-footer">
          <button 
            className="btn btn-outline-secondary"
            onClick={clearAllFilters}
          >
            Clear All
          </button>
          <button 
            className="btn apply-btn"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className='d-flex justify-content-between align-items-center mt-2 mb-4'>
        <h3 className='page-title m-0' style={{fontSize:'1.2rem'}}>Inventory</h3>
        <div className='d-flex gap-2'>
          <ExportBtn onClick={() => exportToExcel(filteredInventory)} />
        </div>
      </div>

      {/* Summary Boxes */}
      <div className="info-ctn row">
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'Total SKU'} number={dashboardStats.totalSKU} />
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'Total Customer Order'} number={`${dashboardStats.totalCustomerOrder} Kgs`} />
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'Stock Remaining'} number={`${dashboardStats.stockRemaining} Kgs`} />
        </div>
      </div>

      {/* Filter Button and Active Filters */}
      <div className="filter-controls mt-1 mb-3 d-md-block d-lg-none">
        <button 
          className="filter-btn"
          onClick={toggleFilterSidebar}
        >
          <FiFilter />
          <span>Filter</span>
          {getActiveFilterCount() > 0 && (
            <span className="filter-count">{getActiveFilterCount()}</span>
          )}
        </button>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="active-filters">
            {filters.productName && (
              <span className="filter-badge">
                {filters.productName}
                <button 
                  className="remove-color-tags"
                  onClick={() => handleFilterSelect('productName', filters.productName)}
                >
                  <FiX />
                </button>
              </span>
            )}
            {filters.size && (
              <span className="filter-badge size-badge">
                {filters.size}
                <button 
                  className="remove-color-tags" 
                  onClick={() => handleFilterSelect('size', filters.size)}
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {filters.colors.map(color => (
              <span key={color} className="filter-badge">
                {color}
                <button 
                  className="remove-color-tags"
                  onClick={() => removeColorTag(color)}
                >
                  <FiX />
                </button>
              </span>
            ))}
            {filters.type && (
              <span className="filter-badge">
                {filters.type}
                <button 
                  className="remove-color-tags"
                  onClick={() => handleFilterSelect('type', filters.type)}
                >
                  <FiX />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="inventory-container">
        {/* Table View (Visible on large screens) */}
        <div className="table-wrapper">
          <Table hover className="text-center align-middle mb-0 inventory-table">
            <thead className="table-light">
              <tr>
                <th className="text-start py-3">Product</th>
                <th className="py-3">Count</th>
                <th className="py-3">Type</th>
                <th className="py-3">Color Code</th>
                <th className="py-3">Color Name</th>
                <th className="py-3">Customer Order</th>
                <th className="py-3">Available Weight</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(inventory).map(([product, sizes]) => (
                <React.Fragment key={product}>
                  {/* Product Row */}
                  <tr className="fw-bold text-start">
                    <td onClick={() => toggleProduct(product)} style={{ cursor: "pointer" }}>
                      {product}
                    </td>
                    <td colSpan={6}></td>
                  </tr>

                  {/* Size Level */}
                  {expandedProduct === product &&
                    Object.entries(sizes).map(([size, types]) => (
                      <React.Fragment key={`${product}-${size}`}>
                        <tr className="table-secondary">
                          <td></td>
                          <td onClick={() => toggleSize(product, size)} style={{ cursor: "pointer" }}>
                            {size}
                          </td>
                          <td colSpan={5}></td>
                        </tr>

                        {/* Type Level */}
                        {expandedSize === `${product}-${size}` &&
                          Object.entries(types).map(([type, variants]) => (
                            <React.Fragment key={`${product}-${size}-${type}`}>
                              <tr className="table-light">
                                <td></td>
                                <td></td>
                                <td onClick={() => toggleType(product, size, type)} style={{ cursor: "pointer" }}>
                                  {type}
                                </td>
                                <td colSpan={4}></td>
                              </tr>

                              {/* Variant Rows */}
                              {expandedType === `${product}-${size}-${type}` &&
                                variants.map((item, index) => (
                                  <tr
                                    key={`${product}-${size}-${type}-${index}`}
                                    onClick={() => handleRowClick(item)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{item.color?.colorCode}</td>
                                    <td>{item.color?.colorName}</td>
                                    <td>{item.customerOrder} Kgs</td>
                                    <td className=''>
                                      <div className='d-flex gap-2 align-items-center text-center justify-content-center'>
                                        {item.remainingWeight} Kgs
                                        {item.customerOrder > item.remainingWeight && (
                                          <TooltipVendor></TooltipVendor>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </React.Fragment>
                          ))}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Card View (Visible on smaller screens) */}
        <div className="card-view">
          {filteredInventory.map((item, index) => (
            <div key={index} className="inventory-card" onClick={() => handleRowClick(item)}>
              <div className="product-header">
                <h5 className="product-name">{item.product}</h5>
                <span className="product-counter">{item.counter}</span>
              </div>
              
              <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                <span className="" style={{ textTransform: 'capitalize'}}>
                  {item.type}
                </span>
                <span><LuDot size={25} /></span>
                <span>{item.color?.colorName}</span>
                <span><LuDot size={25} /></span>
                <span className="color-tag" style={{ backgroundColor: item.color?.colorCode }}>
                  {item.color?.colorCode}
                </span>
              </div>

              <div className="tag-container">
                <span className="order-tag">
                  <FiShoppingCart className="order-icon" />
                  <span>Orders: {item.customerOrder} Kg</span>
                </span>
                
                <span className="weight-tag">
                  <LuWeight className="weight-icon" />
                  <span>In Stock: {item.remainingWeight} Kg</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className='d-flex justify-content-between align-items-center mt-4 px-2 flex-wrap'>
        <small className='pagination-info text-muted'>
          Showing {filteredInventory.length} of {allInventory.length} results
        </small>
        <nav>
          <ul className='pagination pagination-sm mb-0'>
            <li className='page-item active'><span className='page-link'>1</span></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Inventory;