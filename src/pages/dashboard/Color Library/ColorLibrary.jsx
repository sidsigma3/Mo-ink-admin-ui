import React, {useState , useEffect , useRef} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import "./ColorLibrary.css"
import { Link } from 'react-router-dom'
import { useDiscounts } from '../../../components/Context/DiscountContext'
import { useNavigate , useLocation} from 'react-router-dom'
import { LuDot } from "react-icons/lu";
import { Pagination } from 'react-bootstrap'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from 'react-bootstrap'
import { getAllDiscount } from '../../../services/DiscountService'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Toast from '../../../components/Toast/Toast'
import ImportBtn from '../../../components/Buttons/Import/ImportBtn'
import { IoArrowBackOutline } from 'react-icons/io5'
import { getColorsByProductId , updateColorsByProductId , uploadColorLibraryImage} from '../../../services/ColorService'
import Form from 'react-bootstrap/Form';
import { MdDelete } from 'react-icons/md';
import { deleteColorById } from '../../../services/ColorService'
import ModalDelete from '../../../components/Modal/ModalDelete'

const backendUrl = process.env.REACT_APP_IMAGE_URL

const ColorLibrary =  ({setDemoData }) => {

  const navigate = useNavigate ()

  const location = useLocation();
  const { productId } = location.state || {};
  const [colors, setColors] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [colorStatus, setColorStatus] = useState({});
  const [newColors, setNewColors] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedColorToDelete, setSelectedColorToDelete] = useState(null);

  // Fixed filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [filteredColors, setFilteredColors] = useState([]);

 const handleImageUpload = async (e, index, imageIndex) => {
  const file = e.target.files[0];
  if (!file) return;

  const type = imageIndex === 0 ? 'product-color-cone' : 'product-color-hank';

  try {
    const uploadedPath = await uploadColorLibraryImage(file, type); // returns { data: "/colors/xyz.jpg" }

    setColors(prev => {
      const updated = [...prev];
      const color = { ...updated[index] };

      const updatedImages = Array.isArray(color.colorImage) ? [...color.colorImage] : [];
      updatedImages[imageIndex] = uploadedPath.data; // Replace at cone (0) or hank (1)

      updated[index] = {
        ...color,
        colorImage: updatedImages,
        [`localPreview${imageIndex}`]: URL.createObjectURL(file), // for preview
      };

      return updated;
    });
  } catch (err) {
    console.error("Upload failed", err);
  }
};

const handleAddColor = () => {
    setNewColors(prev => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        colorName: '',
        colorCode: '',
        colorImage: [],
        status: 'ACTIVE',
        localPreview0: '',
        localPreview1: '',
      }
    ]);
  };

 
  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (productId) {
      fetchColors();
    }
  }, [productId]);

  const fetchColors = async () => {
  try {
    const data = await getColorsByProductId(productId);
    setColors(data);
    setFilteredColors(data); // Initialize filtered colors

    // Set initial checked status for each color (fallback to true if null)
    const statusMap = {};
    data.forEach((color) => {
      statusMap[color.id] = color.status === 'ACTIVE';
    });
    setColorStatus(statusMap);
  } catch (error) {
    console.error("Failed to fetch colors:", error);
  }
};

const handleSaveColors = async () => {
  try {
    const updatedColors = [
      ...colors.map((color) => ({
        id: color.id,
        colorName: color.colorName,
        colorCode: color.colorCode,
        colorImage: color.colorImage,
        status: colorStatus[color.id] ? 'ACTIVE' : 'INACTIVE',
      })),
      ...newColors.map((color) => ({
        id: null,
        colorName: color.colorName,
        colorCode: color.colorCode,
        colorImage: color.colorImage,
        status: color.status || 'INACTIVE',
      }))
    ];

    await updateColorsByProductId(productId, updatedColors);

    // ✅ Clear new rows and refetch full list
    setNewColors([]);  // if you were tracking new rows separately
    await fetchColors();  // reuses your existing logic

    setToasts(prev => [
      ...prev,
      { id: Date.now(), message: 'Colors updated successfully!', type: 'success' },
    ]);

    navigate('/colorlibrary-products')

  } catch (error) {
    console.error("Save failed", error);
    setToasts(prev => [
      ...prev,
      { id: Date.now(), message: 'Failed to update colors.', type: 'error' },
    ]);
  }
};

const handleColorChange = (index, field, value) => {
  const updatedColors = [...colors];
  updatedColors[index][field] = value;
  setColors(updatedColors);
};

const handleNewColorChange = (index, field, value) => {
  setNewColors(prev => {
    const updated = [...prev];
    updated[index][field] = value;
    return updated;
  });
};

const handleNewImageUpload = async (e, index, imageIndex) => {
  const file = e.target.files[0];
  if (!file) return;

  const type = imageIndex === 0 ? 'product-color-cone' : 'product-color-hank';

  try {
    const res = await uploadColorLibraryImage(file, type); // returns { data: '/colors/abc.jpg' }

    setNewColors(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };

      const colorImage = Array.isArray(item.colorImage) ? [...item.colorImage] : [];
      colorImage[imageIndex] = res.data;

      updated[index] = {
        ...item,
        colorImage,
        [`localPreview${imageIndex}`]: URL.createObjectURL(file),
      };

      return updated;
    });
  } catch (err) {
    console.error("Image upload failed", err);
  }
};

  // Fixed filter functions
  const handleFilterChange = (filter, value) => {
    console.log("Filter changed:", filter, value);
    setSearchTerm(value);
    applyCombinedFilter(value, selectedStatus);
  };

  const handleStatusChange = (status) => {
    console.log("Status filter changed to:", status);
    setSelectedStatus(status);
    applyCombinedFilter(searchTerm, status);
  };

  const applyCombinedFilter = (searchValue, status) => {
    const lowercasedSearch = searchValue?.toLowerCase?.() || "";
    
    let filtered = [...colors]; // Start with all colors

    // Apply search filter
    if (lowercasedSearch) {
      filtered = filtered.filter((item) => {
        const matchesColorName = item.colorName?.toLowerCase().includes(lowercasedSearch);
        const matchesColorCode = item.colorCode?.toLowerCase().includes(lowercasedSearch);
        return matchesColorName || matchesColorCode;
      });
    }

    // Apply status filter - Fixed logic
    if (status !== 'All') {
      filtered = filtered.filter((item) => {
        // Check both the original status and the current toggle state
        const currentToggleState = colorStatus[item.id];
        const itemStatus = currentToggleState ? 'ACTIVE' : 'INACTIVE';
        
        // Also check original status from data if toggle state is undefined
        const originalStatus = item.status === 'ACTIVE';
        const finalStatus = currentToggleState !== undefined ? currentToggleState : originalStatus;
        const statusString = finalStatus ? 'ACTIVE' : 'INACTIVE';
        
        console.log(`Item ${item.colorName}: toggle=${currentToggleState}, original=${item.status}, final=${statusString}, looking for=${status}`);
        return statusString === status;
      });
    }

    console.log("Filtered colors:", filtered);
    setFilteredColors(filtered);
  };

  // Update filter when colors or colorStatus changes + reset page when filtering
  useEffect(() => {
    applyCombinedFilter(searchTerm, selectedStatus);
    setCurrentPage(1); // Reset to first page when filters change
  }, [colors, colorStatus, searchTerm, selectedStatus]);

  const [toasts, setToasts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

const exportToExcel = (colors, colorStatus, fileName = 'colors.xlsx') => {
  const data = colors.map((item) => ({
    ColorName: item.colorName,
    ColorCode: item.colorCode,
    Status: colorStatus[item.id] ? 'ACTIVE' : 'INACTIVE',
    ConeImageURL: item.colorImage?.[0] || '',
    HankImageURL: item.colorImage?.[1] || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Colors');
  XLSX.writeFile(workbook, fileName);
};

const importFromExcel = (file, callback) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const formatted = jsonData.map((row) => ({
      id: null,
      colorName: row.ColorName || '',
      colorCode: row.ColorCode || '',
      colorImage: [row.ConeImageURL || '', row.HankImageURL || ''],
      localPreview0: row.ConeImageURL || '',
      localPreview1: row.HankImageURL || '',
      status: row.Status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
    }));

    callback(formatted);
  };

  reader.readAsArrayBuffer(file);
};

const fileInputRef = useRef();

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  importFromExcel(file, (importedColors) => {
    setNewColors(importedColors);
    setColors([]);
  });
};

  const totalPages = Math.ceil(filteredColors.length / itemsPerPage);
  const paginatedColors = filteredColors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fixed pagination with proper ellipsis logic
  const paginationItems = [];

  if (totalPages > 1) {
    // Previous button
    paginationItems.push(
      <Pagination.Prev
        key="prev"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      />
    );

    // Always show page 1
    paginationItems.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      >
        1
      </Pagination.Item>
    );

    // Show ellipsis if current page is far from start
    if (currentPage > 3) {
      paginationItems.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let number = startPage; number <= endPage; number++) {
      if (number !== 1 && number !== totalPages) {
        paginationItems.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </Pagination.Item>
        );
      }
    }

    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - 2) {
      paginationItems.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      paginationItems.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    paginationItems.push(
      <Pagination.Next
        key="next"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      />
    );
  }

 const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };

  return (
    <div className='colorlibrary'>
      <div className='top d-flex  justify-content-between mb-2 mt-2' style={{cursor:'pointer'}}>
                <div className='top d-flex gap-3 align-items-center'>
                <span onClick={() => navigate('/colorlibrary-products')}><IoArrowBackOutline size={25}/></span>
                <h5 className='m-0' style={{fontSize:'1.2rem'}}>Color Details</h5>
               </div>
             <div className='d-flex gap-2'>
                <ExportBtn onClick={() => exportToExcel(colors, colorStatus)} />
                <ImportBtn onClick={() => fileInputRef.current?.click()} />
                   <input
                    type="file"
                    accept=".xlsx, .csv"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <Link to={'/create-order'}>
                                <AddBtn
                                    text={"Add color"}
                                    onClick={handleAddColor}
                                ></AddBtn>
                            </Link>
              </div>
            
            </div>

        <div className='order-filter-cttn d-flex gap-2 mb-3 mt-4 '>
                    <div className='col-sm-6 col-md-9'>
                        <ProductFilter 
                  filterOptions={["Color Name", "Color Code"]}
                  onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
              />
            </div>
         
            <div className='col-sm-6 col-md-3'>
                <StatusFilter 
                  status={selectedStatus} 
                  statusOptions={['All', 'ACTIVE', 'INACTIVE']}
                  onStatusChange={handleStatusChange}
                />
            </div>
        </div>

        <div className='colorlibrary-table-ctn d-none d-md-block'>
          <Table hover>
        <thead>
          <tr>
            <th>Color Name</th>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              Color Code
            </th>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              Cone Image
            </th>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              Hank Image
            </th>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              Status
            </th>
            <th style={{ width: "1rem" }}></th>
          </tr>
        </thead>
        <tbody>
          {paginatedColors.map((item, index) => (
            <tr key={item.id}>
               <td style={{ verticalAlign: "middle" }}>
                  <Form.Control
                    type="text"
                    value={item.colorName}
                    onChange={(e) => {
                      const originalIndex = colors.findIndex(color => color.id === item.id);
                      handleColorChange(originalIndex, "colorName", e.target.value);
                    }}
                  />
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <Form.Control
                    type="text"
                    value={item.colorCode}
                    onChange={(e) => {
                      const originalIndex = colors.findIndex(color => color.id === item.id);
                      handleColorChange(originalIndex, "colorCode", e.target.value);
                    }}
                  />
                </td>
          {/* Cone Image TD */}
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <label
                      htmlFor={`upload-cone-${item.id}`}
                      style={{
                        cursor: "pointer",
                        display: "inline-block",
                        borderRadius: "8px",
                        border:
                          item[`localPreview0`] || item.colorImage?.[0] ? "1px solid #ccc" : "1px dashed gray",
                        padding: item[`localPreview0`] || item.colorImage?.[0] ? 0 : "10px",
                      }}
                      title="Click to upload Cone image"
                    >
                      {item[`localPreview0`] || item.colorImage?.[0] ? (
                        <img
                          src={item[`localPreview0`] || `${backendUrl}${item.colorImage[0]}`}
                          alt="Cone"
                          width="40"
                          height="40"
                          style={{ borderRadius: "8px", display: "block" }}
                        />
                      ) : (
                        "➕"
                      )}
                    </label>
                    <input
                      type="file"
                      id={`upload-cone-${item.id}`}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const originalIndex = colors.findIndex(color => color.id === item.id);
                        handleImageUpload(e, originalIndex, 0);
                      }}
                    />
                  </div>
                </td>

                {/* Hank Image TD */}
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <label
                      htmlFor={`upload-hank-${item.id}`}
                      style={{
                        cursor: "pointer",
                        display: "inline-block",
                        borderRadius: "8px",
                        border:
                          item[`localPreview1`] || item.colorImage?.[1] ? "1px solid #ccc" : "1px dashed gray",
                        padding: item[`localPreview1`] || item.colorImage?.[1] ? 0 : "10px",
                      }}
                      title="Click to upload Hank image"
                    >
                      {item[`localPreview1`] || item.colorImage?.[1] ? (
                        <img
                          src={item[`localPreview1`] || `${backendUrl}${item.colorImage[1]}`}
                          alt="Hank"
                          width="40"
                          height="40"
                          style={{ borderRadius: "8px", display: "block" }}
                        />
                      ) : (
                        "➕"
                      )}
                    </label>
                    <input
                      type="file"
                      id={`upload-hank-${item.id}`}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const originalIndex = colors.findIndex(color => color.id === item.id);
                        handleImageUpload(e, originalIndex, 1);
                      }}
                    />
                  </div>
                </td>

              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={colorStatus[item.id] || false}
                    onChange={() => {
                      setColorStatus(prev => ({
                        ...prev,
                        [item.id]: !prev[item.id]
                      }));
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </td>

              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                <button
                  className="btn btn-sm text-danger"
                  title="Delete Color"
                  onClick={() => {
                    setSelectedColorToDelete(item);
                    setShowDeleteModal(true);
                  }}
                >
                  <MdDelete size={18} />
                </button>
              </td>
            </tr>
          ))}

          {newColors.map((item, index) => (
            <tr key={item.id}>
              <td>
                <input
                  className="form-control"
                  placeholder="Enter Color Name"
                  value={item.colorName}
                  onChange={(e) => handleNewColorChange(index, 'colorName', e.target.value)}
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  className="form-control text-center"
                  placeholder="Enter Color Code"
                  value={item.colorCode}
                  onChange={(e) => handleNewColorChange(index, 'colorCode', e.target.value)}
                />
              </td>

              {/* Cone Image Upload */}
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <label
                    htmlFor={`new-upload-cone-${index}`}
                    style={{
                      cursor: "pointer",
                      display: "inline-block",
                      borderRadius: "8px",
                      border:
                        item.localPreview0 || item.colorImage?.[0] ? "1px solid #ccc" : "1px dashed gray",
                      padding: item.localPreview0 || item.colorImage?.[0] ? 0 : "10px",
                    }}
                    title="Upload Cone Image"
                  >
                    {item.localPreview0 || item.colorImage?.[0] ? (
                      <img
                        src={item.localPreview0 || `${backendUrl}${item.colorImage[0]}`}
                        alt="Cone"
                        width="40"
                        height="40"
                        style={{ borderRadius: "8px", display: "block" }}
                      />
                    ) : (
                      "➕"
                    )}
                  </label>
                  <input
                    type="file"
                    id={`new-upload-cone-${index}`}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleNewImageUpload(e, index, 0)}
                  />
                </div>
              </td>

              {/* Hank Image Upload */}
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <label
                    htmlFor={`new-upload-hank-${index}`}
                    style={{
                      cursor: "pointer",
                      display: "inline-block",
                      borderRadius: "8px",
                      border:
                        item.localPreview1 || item.colorImage?.[1] ? "1px solid #ccc" : "1px dashed gray",
                      padding: item.localPreview1 || item.colorImage?.[1] ? 0 : "10px",
                    }}
                    title="Upload Hank Image"
                  >
                    {item.localPreview1 || item.colorImage?.[1] ? (
                      <img
                        src={item.localPreview1 || `${backendUrl}${item.colorImage[1]}`}
                        alt="Hank"
                        width="40"
                        height="40"
                        style={{ borderRadius: "8px", display: "block" }}
                      />
                    ) : (
                      "➕"
                    )}
                  </label>
                  <input
                    type="file"
                    id={`new-upload-hank-${index}`}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleNewImageUpload(e, index, 1)}
                  />
                </div>
              </td>

              {/* Status Toggle */}
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={item.status === 'ACTIVE'}
                    onChange={() =>
                      handleNewColorChange(index, 'status', item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </td>
            </tr>
          ))}

        </tbody>
      </Table>

          <ModalDelete
              isOpen={showDeleteModal}
              onCancel={() => {
                setShowDeleteModal(false);
                setSelectedColorToDelete(null);
              }}
              onConfirm={async () => {
                try {
                  await deleteColorById(selectedColorToDelete.id);
                  showToast(`Deleted ${selectedColorToDelete.colorName}`, 'success');
                  setColors(prev => prev.filter(color => color.id !== selectedColorToDelete.id));
                } catch (err) {
                  showToast(`Failed to delete ${selectedColorToDelete.colorName}`, 'error');
                } finally {
                  setShowDeleteModal(false);
                  setSelectedColorToDelete(null);
                }
              }}
            />
        </div>

        <div className='d-block d-md-none'>
          {/* Existing Colors Cards */}
          {filteredColors.map((item, index) => (
            <div key={item.id} className="color-card mb-3  border rounded-3 overflow-hidden bg-white">
              {/* Card Header */}
              <div className="card-header bg-light px-3 py-2 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-semibold text-primary-custom">
                    {item.colorName || `Color #${index + 1}`}
                  </h6>
                  <div className="d-flex align-items-center header-actions">
                    {/* Status Toggle */}
                    <label className="switch mb-0">
                      <input
                        type="checkbox"
                        checked={colorStatus[item.id] || false}
                        onChange={() => {
                          setColorStatus(prev => ({
                            ...prev,
                            [item.id]: !prev[item.id]
                          }));
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                    
                    {/* Delete Button */}
                    <button
                      className="btn btn-sm btn-outline-danger p-1"
                      title="Delete Color"
                      onClick={() => {
                        setSelectedColorToDelete(item);
                        setShowDeleteModal(true);
                      }}
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body p-3">
                {/* Color Name and Code Row */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-medium text-muted small">Color Name</label>
                    <Form.Control
                      type="text"
                      value={item.colorName}
                      placeholder="Enter color name"
                      className="form-control-sm"
                      onChange={(e) => {
                        const originalIndex = colors.findIndex(color => color.id === item.id);
                        handleColorChange(originalIndex, "colorName", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium text-muted small">Color Code</label>
                    <Form.Control
                      type="text"
                      value={item.colorCode}
                      placeholder="Enter color code"
                      className="form-control-sm"
                      onChange={(e) => {
                        const originalIndex = colors.findIndex(color => color.id === item.id);
                        handleColorChange(originalIndex, "colorCode", e.target.value);
                      }}
                    />
                  </div>
                </div>

                {/* Images Section */}
                <div className="mb-3">
                  <div className="d-flex gap-2">
                    {/* Cone Image */}
                    <div className="image-upload-wrapper">
                      <label className="form-label small text-secondary mb-1">Cone</label>
                      <label
                        htmlFor={`upload-cone-mobile-${item.id}`}
                        className="image-upload-box d-flex align-items-center justify-content-center"
                      >
                        {item[`localPreview0`] || item.colorImage?.[0] ? (
                          <img
                            src={item[`localPreview0`] || `${backendUrl}${item.colorImage[0]}`}
                            alt="Cone"
                            className="uploaded-image"
                          />
                        ) : (
                          <div className="upload-placeholder">
                            <div className="upload-icon">➕</div>
                          </div>
                        )}
                      </label>
                      <input
                        type="file"
                        id={`upload-cone-mobile-${item.id}`}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const originalIndex = colors.findIndex(color => color.id === item.id);
                          handleImageUpload(e, originalIndex, 0);
                        }}
                      />
                    </div>

                    {/* Hank Image */}
                    <div className="image-upload-wrapper">
                      <label className="form-label small text-secondary mb-1">Hank</label>
                      <label
                        htmlFor={`upload-hank-mobile-${item.id}`}
                        className="image-upload-box d-flex align-items-center justify-content-center"
                      >
                        {item[`localPreview1`] || item.colorImage?.[1] ? (
                          <img
                            src={item[`localPreview1`] || `${backendUrl}${item.colorImage[1]}`}
                            alt="Hank"
                            className="uploaded-image"
                          />
                        ) : (
                          <div className="upload-placeholder">
                            <div className="upload-icon">➕</div>
                          </div>
                        )}
                      </label>
                      <input
                        type="file"
                        id={`upload-hank-mobile-${item.id}`}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const originalIndex = colors.findIndex(color => color.id === item.id);
                          handleImageUpload(e, originalIndex, 1);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Display */}
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small fw-medium text-muted">Status</span>
                  <div className="status-toggle-wrapper">
                    <span className={`status-label ${colorStatus[item.id] ? 'active' : 'inactive'}`}>
                      {colorStatus[item.id] ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* New Colors Cards */}
          {newColors.map((item, index) => (
            <div key={item.id} className="color-card mb-3 shadow-sm border rounded-3 overflow-hidden bg-white border-primary border-2">
              {/* Card Header */}
              <div className="card-header bg-primary bg-opacity-10 px-3 py-2 border-bottom border-primary">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-semibold text-primary">
                    <span className="badge bg-primary me-2">NEW</span>
                    {item.colorName || `Color #${colors.length + index + 1}`}
                  </h6>
                  <div className="d-flex align-items-center header-actions">
                    {/* Status Toggle */}
                    <label className="switch mb-0">
                      <input
                        type="checkbox"
                        checked={item.status === 'ACTIVE'}
                        onChange={() =>
                          handleNewColorChange(index, 'status', item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                    
                    {/* Remove Button */}
                    <button
                      className="btn btn-sm btn-outline-danger p-1"
                      title="Remove Color"
                      onClick={() => {
                        setNewColors(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body p-3">
                {/* Color Name and Code Row */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-medium text-muted small">Color Name</label>
                    <input
                      className="form-control form-control-sm"
                      placeholder="Enter color name"
                      value={item.colorName}
                      onChange={(e) => handleNewColorChange(index, 'colorName', e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium text-muted small">Color Code</label>
                    <input
                      className="form-control form-control-sm"
                      placeholder="Enter color code"
                      value={item.colorCode}
                      onChange={(e) => handleNewColorChange(index, 'colorCode', e.target.value)}
                    />
                  </div>
                </div>

                {/* Images Section */}
                <div className="mb-3">
                  <div className="d-flex gap-2">
                    {/* Cone Image */}
                    <div className="image-upload-wrapper">
                      <label className="form-label small text-secondary mb-1">Cone</label>
                      <label
                        htmlFor={`new-upload-cone-mobile-${index}`}
                        className="image-upload-box d-flex align-items-center justify-content-center"
                      >
                        {item.localPreview0 || item.colorImage?.[0] ? (
                          <img
                            src={item.localPreview0 || `${backendUrl}${item.colorImage[0]}`}
                            alt="Cone"
                            className="uploaded-image"
                          />
                        ) : (
                          <div className="upload-placeholder">
                            <div className="upload-icon">➕</div>
                          </div>
                        )}
                      </label>
                      <input
                        type="file"
                        id={`new-upload-cone-mobile-${index}`}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleNewImageUpload(e, index, 0)}
                      />
                    </div>

                    {/* Hank Image */}
                    <div className="image-upload-wrapper">
                      <label className="form-label small text-secondary mb-1">Hank</label>
                      <label
                        htmlFor={`new-upload-hank-mobile-${index}`}
                        className="image-upload-box d-flex align-items-center justify-content-center"
                      >
                        {item.localPreview1 || item.colorImage?.[1] ? (
                          <img
                            src={item.localPreview1 || `${backendUrl}${item.colorImage[1]}`}
                            alt="Hank"
                            className="uploaded-image"
                          />
                        ) : (
                          <div className="upload-placeholder">
                            <div className="upload-icon">➕</div>
                          </div>
                        )}
                      </label>
                      <input
                        type="file"
                        id={`new-upload-hank-mobile-${index}`}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleNewImageUpload(e, index, 1)}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Display */}
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small fw-medium text-muted">Status</span>
                  <div className="status-toggle-wrapper">
                    <span className={`status-label ${item.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                      {item.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

          <button className="btn-primary-custom mt-3" onClick={handleSaveColors}>
        Save Changes
      </button>

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

                  <div className='d-flex justify-content-end mt-2 pagination'>
          <Pagination>{paginationItems}</Pagination>
        </div>

    </div>
  )
}

export default ColorLibrary