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

    const [selectedStatus, setSelectedStatus] = useState("View All"); // Default status selection
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()

    const [data,setData] =useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [toasts, setToasts] = useState([]);
    const [vendorOrdersMap, setVendorOrdersMap] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getAllVendors();
            setData(data.data)
            setFilteredData(data.data)
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
      
        fetchData(); 
      }, []); 

      useEffect(() => {
        const fetchAllVendorOrders = async () => {
           console.log(filteredData)
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

      console.log(filteredData)
      console.log(vendorOrdersMap)

    const handleSelect = (status) => {
        setSelectedStatus(status);
        // if (onStatusChange) onStatusChange(status); // Pass selected status to parent
    };

  const [customers, setCustomers] = useState([
    {
      name: "John Doe",
      location: "New York",
      tag: "spinner", // Condition: "spinner" or "dyers"
      assignOrders: 5,
      lastOrder: "2024-11-21",
    },
    {
      name: "Jane Smith",
      location: "Los Angeles",
      tag: "dyers", // Condition: "spinner" or "dyers"
      assignOrders: 3,
      lastOrder: "2024-11-19",
    },
  ]);


  const handleRowClick = (index) => {
    navigate('/add-spinner-and-dyers', { state: { index , data } });
  };


  
  

  const handleDelete = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleDuplicate = (index) => {
    setData([data[index],...data]);
  };

  const handleExportExcel = () => {
    const excelData = data.map(customer => ({
      Name: `${customer.firstName} ${customer.lastName}`,
      Location: customer.city,
      Tag: customer.vendorType,
      "Assigned Orders": customer.assignOrders || 0,
      "Last Order": customer.lastOrder || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "customers.xlsx");
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

      setParsedData(jsonData); // Update parsedData correctly
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSubmit = async () => {
     const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
    if (!parsedData.length) 
      return 
    showToast("No data to submit!", "error");

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
    const lowercasedValue = value.trim().toLowerCase();

    if (!lowercasedValue) {
        setFilteredData(data); // Reset filter when input is empty
        return;
    }

    const filtered = data.filter((item) => {
        if (filter === "Name" && item.firstName) {
            return item.firstName.toLowerCase().includes(lowercasedValue);
        }
        if (filter === "City" && item.city) {
            return item.city.toLowerCase().includes(lowercasedValue);
        }
        return true; // Keep item if no valid filter
    });

    setFilteredData(filtered);
};

const formatToIST = (utcDateString) => {
  const utcDate = new Date(utcDateString + 'Z');

  // const utcDate = new Date(utcDateString);
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

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentPageData = filteredData.slice(startIndex, endIndex);

const paginationItems = [];

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


  return (
    <div className='spinner-page'>
         <div className='top d-flex justify-content-between mb-2'>
            <h4 style={{fontSize:'1.2rem'}}>Spinners & Dyers</h4>

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

                {/* <ImportBtn onClick={handleOpenModal}></ImportBtn> */}
        
                <Link to={'/add-spinner-and-dyers'}>
                <AddBtn text={"Add New"}></AddBtn>
                </Link>
            </div>
        </div>

        <div className='d-flex gap-2 filter-sec'>
            <div className='w-75'>
              <ProductFilter 
                  filterOptions={["Name","City"]} 
                  onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
              />
            </div>
         
            <div className='w-25'>
                <StatusFilter status={'Active'}></StatusFilter> 
            </div>
        </div>

        <div className='table-ctn'>
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
              const originalIndex = startIndex + index;
              return (
                <tr
                  key={originalIndex}
                  onClick={(e) =>
                    !e.target.closest('.dropdown') && handleRowClick(originalIndex)
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
                        <Dropdown.Item onClick={() => handleDuplicate(originalIndex)}>
                          Duplicate
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(originalIndex)}>
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

           



                <div className="data-cards">
        {filteredData.map((customer,index) => (
          <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{customer.firstName} {customer.lastName}</h3>
                 <p> 
                    <div
                     style={{
                        width:'5rem',
                        padding:'0.2rem 0.4rem',
                        border:'1px solid',borderRadius:'0.2rem',textAlign:'center',
                        backgroundColor:customer.tag === 'Spinner' ? '#DBEAFE' : '#FEF3C7',
                        borderColor:customer.tag === 'Spinner' ? '#93C5FD' : '#FCD34D' ,
                        color : customer.tag === 'Spinner' ? '#1E40AF' : '#92400E' ,
                    }}
                    >
                    {customer.vendorType}
                    </div>
                </p>
            </div>

            <p><strong></strong> {customer.phoneNumber}</p>
    

            <p className='fw-medium'><strong></strong> {customer.city}</p>

            <p className='text-body-tertiary'>Last Order on {customer.lastOrder}</p>

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