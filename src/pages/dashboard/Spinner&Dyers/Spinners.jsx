import React,{useState , useEffect} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import ImportBtn from '../../../components/Buttons/Import/ImportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import { Link } from 'react-router-dom'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import { Dropdown, Table } from 'react-bootstrap'
import { useSpinnerDyers } from '../../../components/Context/SpinnersAndDyersContext';
import { useNavigate } from 'react-router-dom'
import { LuDot } from "react-icons/lu";
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Pagination } from 'react-bootstrap'
import { BsThreeDotsVertical } from "react-icons/bs";
import "./Spinners.css"
import { addVendor, getAllVendors } from '../../../services/VendorsService'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Button } from "react-bootstrap";
import Toast from '../../../components/Toast/Toast'
import { getVendorOrdersByVendorId } from '../../../services/OrderService'

const Spinners = () => {

    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [vendorOrdersMap, setVendorOrdersMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Name');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getAllVendors();
            console.log('Vendors data:', data);
            setData(data.data)
            setFilteredData(data.data)
          } catch (error) {
            console.error('Error fetching vendors:', error);
          }
        };
      
        fetchData(); 
    }, []); 

    // Apply filters whenever filter states or data changes
    useEffect(() => {
        if (data.length > 0) {
            applyCombinedFilter(selectedFilter, searchTerm, selectedStatus);
        }
    }, [data, selectedFilter, searchTerm, selectedStatus]);

    useEffect(() => {
        const fetchAllVendorOrders = async () => {
          const ordersMap = {};
          await Promise.all(
            filteredData.map(async (vendor) => {
              try {
                const orders = await getVendorOrdersByVendorId(vendor.vendorId);
                ordersMap[vendor.vendorId] = orders;
              } catch (err) {
                console.error(`Failed to fetch orders for vendor ${vendor.vendorId}`, err);
                ordersMap[vendor.vendorId] = [];
              }
            })
          );
          setVendorOrdersMap(ordersMap);
        };

        if (filteredData.length > 0) {
          fetchAllVendorOrders();
        }
    }, [filteredData]);

    const handleRowClick = (index) => {
        // Find the original index in data array
        const originalIndex = data.findIndex(vendor => vendor === filteredData[index]);
        navigate('/add-spinner-and-dyers', { state: { index: originalIndex, data } });
    };

    const handleDelete = (index) => {
        // Get the actual vendor from filteredData and find its index in data
        const vendorToDelete = filteredData[index];
        const originalIndex = data.findIndex(vendor => vendor === vendorToDelete);
        
        if (originalIndex !== -1) {
            const updatedData = data.filter((_, i) => i !== originalIndex);
            setData(updatedData);
        }
    };

    const handleDuplicate = (index) => {
        // Get the actual vendor from filteredData
        const vendorToDuplicate = filteredData[index];
        setData([vendorToDuplicate, ...data]);
    };

    const handleExportExcel = () => {
        const excelData = data.map(customer => ({
            Name: `${customer.firstName} ${customer.lastName}`,
            Location: customer.city,
            Tag: customer.vendorType,
            "Assigned Orders": customer.assignOrders || 0,
            "Last Order": customer.lastOrder || "N/A",
            "Status": customer.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "vendors.xlsx");
    };

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
        
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            setParsedData(jsonData);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleSubmit = async () => {
        const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
        };
        
        if (!parsedData.length) {
            showToast("No data to submit!", "error");
            return;
        }

        try {
            await Promise.all(
                parsedData.map(async (customer) => {
                    const newCustomer = {
                        firstName: customer["First Name"] || "",
                        lastName: customer["Last Name"] || "",
                        email: customer["Email"] || "",
                        phoneNumber: customer["Phone Number"] || "",
                        whatsappNumber: customer["WhatsApp Number"] || "",
                        gstNumber: customer["GST Number"] || "",
                        status: (customer["Status"] || "ACTIVE").toUpperCase(),
                        vendorType: (customer["Vendor Type"] || "SPINNER").toUpperCase(),
                        zipcode: customer["Zip Code"] || "",
                        street: customer["Street"] || "",
                    };
                    await addVendor(newCustomer);
                })
            );
            showToast("Upload Successful!", "success");
        } catch (error) {
            console.error("Error uploading vendors:", error);
            showToast("Upload Failed!", "error");
        }
    };

    const handleFilterChange = (filter, value) => {
        console.log('Filter changed:', filter, value);
        setSelectedFilter(filter);
        setSearchTerm(value || '');
    };

    const handleStatusChange = (status) => {
        console.log('Status changed:', status);
        setSelectedStatus(status || 'All');
    };

    const applyCombinedFilter = (filter, searchValue, status) => {
        console.log('Applying combined filter:', { filter, searchValue, status });
        
        if (!data || data.length === 0) {
            setFilteredData([]);
            return;
        }

        const lowercasedValue = searchValue?.toLowerCase() || '';

        const filtered = data.filter((vendor) => {
            // Search filter
            let matchesSearch = true;
            if (searchValue && searchValue.trim() !== '') {
                if (filter === "Name") {
                    matchesSearch = vendor.firstName?.toLowerCase().includes(lowercasedValue) ||
                                   vendor.lastName?.toLowerCase().includes(lowercasedValue);
                } else if (filter === "Spinners") {
                    // Filter for only SPINNER type vendors
                    matchesSearch = vendor.vendorType?.toLowerCase() === 'spinner' &&
                                   (vendor.firstName?.toLowerCase().includes(lowercasedValue) ||
                                    vendor.lastName?.toLowerCase().includes(lowercasedValue));
                } else if (filter === "Dyers") {
                    // Filter for only DYER type vendors  
                    matchesSearch = vendor.vendorType?.toLowerCase() === 'dyer' &&
                                   (vendor.firstName?.toLowerCase().includes(lowercasedValue) ||
                                    vendor.lastName?.toLowerCase().includes(lowercasedValue));
                }
            } else {
                // If no search term, show all for Name, but filter by type for Spinners/Dyers
                if (filter === "Spinners") {
                    matchesSearch = vendor.vendorType?.toLowerCase() === 'spinner';
                } else if (filter === "Dyers") {
                    matchesSearch = vendor.vendorType?.toLowerCase() === 'dyer';
                }
            }

            // Status filter
            const vendorStatus = vendor.status?.toLowerCase() || '';
            const filterStatus = status?.toLowerCase() || 'all';
            const matchesStatus = filterStatus === 'all' || vendorStatus === filterStatus;

            const result = matchesSearch && matchesStatus;
            
            // Debug log for first few items
            if (data.indexOf(vendor) < 3) {
                console.log(`Vendor ${vendor.firstName}:`, {
                    matchesSearch,
                    matchesStatus,
                    result,
                    vendorStatus,
                    filterStatus,
                    vendorType: vendor.vendorType
                });
            }

            return result;
        });

        console.log(`Filtered ${filtered.length} vendors from ${data.length} total`);
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const formatToIST = (utcDateString) => {
        const utcDate = new Date(utcDateString + 'Z');
        return utcDate.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, endIndex);

    const paginationItems = [];

    if (totalPages >= 1) {
        paginationItems.push(
            <Pagination.Prev
                key="prev"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            />
        );

        for (let page = 1; page <= totalPages; page++) {
            paginationItems.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </Pagination.Item>
            );
        }

        paginationItems.push(
            <Pagination.Next
                key="next"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            />
        );
    }

    return (
        <div className='spinner-page'>
            <div className='top d-flex justify-content-between align-items-center mt-2 mb-4 '>
                <h3 className='m-0' style={{fontSize:'1.2rem'}}>Spinners & Dyers</h3>

                <div className='d-flex gap-2'>
                    <ExportBtn onClick={handleExportExcel}></ExportBtn>

                    <Modal show={showModal} onHide={handleCloseModal} centered>
                      <Modal.Header closeButton>
                        <Modal.Title>Upload Excel File</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <input type="file" accept=".xlsx" onChange={handleFileUpload} />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                          Cancel
                        </Button>
                        <Button variant="success" onClick={handleSubmit}>
                          Process File
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <Link to={'/add-spinner-and-dyers'}>
                    <AddBtn text={"Add New"}></AddBtn>
                    </Link>
                </div>
            </div>

            <div className='order-filter-cttn d-flex gap-2 mb-2 mt-3 '>
                <div className='col-sm-6 col-md-9'>
                    <ProductFilter  
                        filterOptions={["Name", "Spinners", "Dyers"]} 
                        onFilterChange={handleFilterChange}
                        searchTerm={searchTerm}
                    />
                </div>
             
                <div className='col-sm-6 col-md-3'>
                    <StatusFilter 
                        status={selectedStatus} 
                        onStatusChange={handleStatusChange}
                        statusOptions={['All', 'Active', 'Inactive']}
                    ></StatusFilter> 
                </div>
            </div>

            <div className='table-ctn rounded-2'>
                <Table hover>
                    <thead>
                        <tr>
                            <th style={{ verticalAlign: 'middle'}} >Name</th>
                            <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Location</th>
                            <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Tag</th>
                            <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Total Orders</th>
                            <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Last Order</th>
                            <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Status</th>
                            <th style={{width:'1rem'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map((customer, index) => {
                          return (
                            <tr
                              key={index}
                              onClick={(e) =>
                                !e.target.closest('.dropdown') && handleRowClick(index)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <td style={{ verticalAlign: 'middle' }}>
                                {customer.firstName} {customer.lastName}
                              </td>
                              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                {customer.city}
                              </td>
                              <td style={{ justifyItems: 'center', alignContent: 'center' }}>
                                <div
                                  style={{
                                    padding: '4px',
                                    border: '1px solid',
                                    borderRadius: '0.2rem',
                                    textAlign: 'center',
                                    width: '6rem',
                                    backgroundColor:
                                      customer.vendorType === 'SPINNER' ? '#DBEAFE' : '#FEF3C7',
                                    borderColor:
                                      customer.vendorType === 'SPINNER' ? '#93C5FD' : '#FCD34D',
                                    color: customer.vendorType === 'SPINNER'
                                      ? '#1E40AF'
                                      : '#92400E',
                                  }}
                                >
                                  {customer.vendorType}
                                </div>
                              </td>
                              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                {vendorOrdersMap[customer.vendorId]?.length || 'No order'}
                              </td>
                              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                {vendorOrdersMap[customer.vendorId]?.length
                                  ? formatToIST(
                                      vendorOrdersMap[customer.vendorId].at(-1).orderDate
                                    )
                                  : 'No order'}
                              </td>
                              <td style={{ textAlign: 'center', verticalAlign: 'middle' , justifyItems:'center'}}>
                                <div style={{backgroundColor:customer.status.toLowerCase() === 'active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:customer.status.toLowerCase()==='active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'6rem' ,padding: '4px'}}>
                                {customer.status}
                                </div>
                              </td>
                              <td>
                                <Dropdown align="end" style={{ zIndex: 10 }}>
                                  <Dropdown.Toggle
                                    variant="light"
                                    id="dropdown-basic"
                                    className="border border-0"
                                  >
                                    <BsThreeDotsVertical />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleDuplicate(index)}>
                                      Duplicate
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleDelete(index)}>
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                </Table>

                <div className="data-cards rounded-4">
                    {filteredData.map((customer,index) => (
                      <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

                        <div className='d-flex justify-content-between align-items-center'>
                             <h3 className='fs-6 fw-medium	'>{customer.firstName} {customer.lastName}</h3>
                             <p> 
                        <div
                          style={{
                            padding: '0.2rem 0.2rem',
                            fontSize: '0.8rem',
                            width: '7rem',
                            height: '2rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '0',
                            backgroundColor:
                              customer.vendorType === 'SPINNER' ? '#dbeafe' : '#fef3c7',
                            border: '1px solid',
                            borderColor:
                              customer.vendorType === 'SPINNER' ? '#93c5fd' : '#fcd34d',
                            borderRadius: '0.2rem',
                            textAlign: 'center',
                            color:
                              customer.vendorType === 'SPINNER' ? '#1e40af' : '#92400e',
                            fontWeight: '500',
                          }}
                        >
                          {customer.vendorType.toUpperCase()}
                        </div>

                            </p>
                        </div>

                         <div className="d-flex ">
                         <p className='fw-normal	'> {customer.phoneNumber}</p>
                         <span><LuDot size={25} /></span>
                         <p className="fw-normal">{customer.city}</p>
                        
                      </div>

                        <p style={{ fontSize: '0.8rem', color: '#93A3AB', fontWeight: 500 }}>Last Order on {customer.lastOrder}</p>

                      </div>
                    ))}
                </div>
            </div>

            <div className="d-flex justify-content-end mt-2">
                <Pagination>{paginationItems}</Pagination>
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
        </div>
    )
}

export default Spinners