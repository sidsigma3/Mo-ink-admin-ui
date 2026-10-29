import React, {useState , useEffect} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import "./DiscountPage.css"
import { Link } from 'react-router-dom'
import { useDiscounts } from '../../../components/Context/DiscountContext'
import { useNavigate } from 'react-router-dom'
import { LuDot } from "react-icons/lu";
import { Pagination } from 'react-bootstrap'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from 'react-bootstrap'
import { getAllDiscount } from '../../../services/DiscountService'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Toast from '../../../components/Toast/Toast'
import { getAllProduct } from '../../../services/ProductService'

const DiscountsPage = () => {

  const navigate = useNavigate ()
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [discountData , setDiscountData] = useState([])
  const [filteredData, setFilteredData] = useState([]);
  
      useEffect(() => {
          const fetchData = async () => {
            try {
              const data = await getAllDiscount();
              console.log(data)
              setDiscountData(data.data)
              setFilteredData(data.data)
            } catch (error) {
              console.error('Error fetching Customers:', error);
            }
          };
        
        fetchData(); 
      }, []); 
  
  // Re-apply filters whenever any filter state changes
  useEffect(() => {
    if (discountData.length > 0) {
      applyCombinedFilter(searchTerm, selectedStatus, startDate, endDate);
    }
  }, [discountData, searchTerm, selectedStatus, startDate, endDate]);

  const handleRowClick = (index) => {
    // Use the original index from discountData instead of filtered index
    const originalIndex = discountData.findIndex(item => item === filteredData[index]);
    navigate('/add-discount', { state: { index: originalIndex , discountData} });
  };

  const handleDelete = (index) => {
    // Get the actual item from filteredData and find its index in discountData
    const itemToDelete = filteredData[index];
    const originalIndex = discountData.findIndex(item => item === itemToDelete);
    
    if (originalIndex !== -1) {
      const updatedData = discountData.filter((_, i) => i !== originalIndex);
      setDiscountData(updatedData);
    }
  };

  const handleDuplicate = (index) => {
    // Get the actual item from filteredData
    const itemToDuplicate = filteredData[index];
    setDiscountData([itemToDuplicate, ...discountData]);
  };

  const handleFilterChange = (filter, value) => {
    console.log('Filter changed:', filter, value); // Debug log
    if (filter === "Discount Code") {
      setSearchTerm(value || '');
    } else if (filter === "Start Date") {
      setStartDate(value);
    } else if (filter === "End Date") {
      setEndDate(value);
    }
  };
  
  const handleStatusChange = (status) => {
    console.log('Status changed:', status); // Debug log
    setSelectedStatus(status || 'All');
  };

  const applyCombinedFilter = (searchValue, status, start, end) => {
    console.log('Applying filter with:', { searchValue, status, start, end }); // Debug log
    
    if (!discountData || discountData.length === 0) {
      setFilteredData([]);
      return;
    }

    const lowercasedSearch = searchValue?.toLowerCase?.() || "";
  
    const filtered = discountData.filter((item) => {
      // Search term matching (discount code)
      const matchesSearch = !searchValue || 
        item.discountCode?.toLowerCase().includes(lowercasedSearch);
      
      // Status matching - make it case-insensitive
      const itemStatus = item.discountStatus?.toLowerCase() || '';
      const filterStatus = status?.toLowerCase() || 'all';
      const matchesStatus = filterStatus === 'all' || itemStatus === filterStatus;
  
      // Date range matching
      const itemStartDate = item.startDateTime ? new Date(item.startDateTime) : null;
      const itemEndDate = item.endDateTime ? new Date(item.endDateTime) : null;
  
      const matchesStartDate = !start || (itemStartDate && itemStartDate >= new Date(start));
      const matchesEndDate = !end || (itemEndDate && itemEndDate <= new Date(end));

      const result = matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
      
      // Debug logging for first few items
      if (discountData.indexOf(item) < 3) {
        console.log(`Item ${item.discountCode}:`, {
          matchesSearch,
          matchesStatus,
          matchesStartDate,
          matchesEndDate,
          result,
          itemStatus,
          filterStatus
        });
      }
      
      return result;
    });
  
    console.log(`Filtered ${filtered.length} items from ${discountData.length} total`); // Debug log
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  const exportToExcel = (discounts) => {
       const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
      if (!discounts || !discounts.length) {
        showToast("No discounts available for export.", "error");
        return;
      }
    
      const worksheet = XLSX.utils.json_to_sheet(
        discounts.map((discount) => {
          const applicableProduct = discount?.applicableProducts[0]?.productName || "N/A";
          const discountInfo =
            discount.discountType === "Percentage"
              ? `${discount.discountValue}% off on ${applicableProduct}`
              : `₹${discount.discountValue} off on ${applicableProduct}`;
          return {
            "Title": discount.discountCode,
            "Status": discount.discountStatus,
            "Method": discount.discountMethod,
            "Eligible Customers": discount.eligibleCustomers.length,
            "Used": discount.used,
            "Discount Details": discountInfo,
            "Minimum Purchase Requirement": discount.minPurchaseRequirement || "N/A"
          };
        })
      );
    
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Discounts");
    
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(dataBlob, "Discounts_List.xlsx");
    };



const [totalProducts, setTotalProducts] = useState(0);

useEffect(() => {
  const fetchTotalProducts = async () => {
    try {
      const data = await getAllProduct(); // Use your existing service
      setTotalProducts(data.data.length);
    } catch (error) {
      console.error('Error fetching total products:', error);
    }
  };
  
  fetchTotalProducts();
}, []);

const getProductText = (discount) => {
  if (!discount.applicableProducts || discount.applicableProducts.length === 0) {
    return "no products";
  }
  
  if (discount.applicableProducts.length === totalProducts) {
    return "All products";
  }
  
  if (discount.applicableProducts.length === 1) {
    return discount.applicableProducts[0].productName || "product";
  }
  
  return `${discount.applicableProducts.length} products`;
};


  // const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
  // const selectedProducts = discountData?.applicableProducts || [];
  // const isAllProducts = allProducts.length === selectedProducts.length;
  // const selectedProductText = isAllProducts ? "all products" : "selected products";

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedDiscounts = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationItems = [];

  if (totalPages >= 1) {
    paginationItems.push(
      <Pagination.Prev
        key="prev"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      />
    );

    for (let number = 1; number <= totalPages; number++) {
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

    paginationItems.push(
      <Pagination.Next
        key="next"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      />
    );
  }

  return (
    <div className='discounts'>
        <div className='top d-flex justify-content-between align-items-center mt-3 mb-4 '>
            <h4 className='m-0' style={{fontSize:'1.2rem'}}>Discounts</h4>

            <div className='d-flex gap-2'>
                <ExportBtn onClick={() => exportToExcel(filteredData)}></ExportBtn>

                <Link to={'/add-discount'} className='text-decoration-none'>
                <AddBtn text={"Add Discount"}></AddBtn>
                </Link>
            </div>
        </div>

         <div className='order-filter-cttn d-flex gap-2 mb-2 mt-3 '>
                            <div className='col-sm-6 col-md-9'>
                                <ProductFilter 
                  filterOptions={["Discount Code", "Start Date", "End Date"]}
                  onFilterChange={handleFilterChange}
                  searchTerm={searchTerm}
                  startDate={startDate}
                  endDate={endDate}
              />
            </div>
         
            <div className='col-sm-6 col-md-3'>
                <StatusFilter 
                  status={selectedStatus} 
                  onStatusChange={handleStatusChange}
                  statusOptions={['All', 'Active', 'Inactive', 'Expired']}
                ></StatusFilter> 
            </div>
        </div>

        <div className='discount-table-ctn rounded-2' style={{height: '60vh'}}>
          <Table hover>
            <thead>
              <tr>
                <th>Title</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Start Date</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>End Date</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Status</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Customer</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Used</th>
                <th style={{width:'1rem'}}></th>
              </tr>
            </thead>

            <tbody>
            {paginatedDiscounts.map((discount, index) => (
            <tr key={index} onClick={(e) => !e.target.closest('.dropdown') && handleRowClick(index)} style={{ cursor: "pointer" }}>
              <td>
                <div>
                <h5>{discount.discountCode}</h5>
                <div className='d-flex gap-3 align-itmes-cenetr'>
                <p className="text-muted m-0">
                  {discount.discountType === "Percentage"
                    ? `${discount.discountValue}% off on ${getProductText(discount)}`
                    :  `₹${discount.discountValue} off on ${getProductText(discount)}`}
                </p>
               
                <p className='text-muted m-0'>{discount.minPurchaseRequirement}</p>
                </div>
                </div>
                
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>
                 {new Intl.DateTimeFormat('en-GB').format(new Date(discount.startDateTime))}
                </td>

                <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>
                  {discount.endDateTime
                    ? new Intl.DateTimeFormat('en-GB').format(new Date(discount.endDateTime))
                    : ''}
                </td>

              <td style={{ justifyItems: 'center', alignContent:'center'}}   >
                <div style={{backgroundColor:discount.discountStatus.toLowerCase() === 'active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:discount.discountStatus.toLowerCase()==='active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'6rem' ,padding: '4px'}}>
                {discount.discountStatus}
                </div>
              </td>
            
              <td style={{textTransform:'capitalize', textAlign: 'center', verticalAlign: 'middle'}}  >{discount.eligibleCustomers.length}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle'}}  >{discount.used}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                   <Dropdown align="end" style={{ zIndex: 10 }}>
                     <Dropdown.Toggle variant="light" id="dropdown-basic" className='border border-0 ms-auto' style={{ marginRight: '10px'}}>
                     <BsThreeDotsVertical />
                     </Dropdown.Toggle>
                   
                        <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleDuplicate(index)}>Duplicate</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(index)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </td>
            </tr>
          ))}
            </tbody>
          </Table>

          <div className="data-cards">
        {paginatedDiscounts.map((discount,index) => (
          <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3 className='fs-6 fw-medium m-0	'>{discount.discountCode}</h3>
                 <p className='m-0'> 
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
                      discount.discountStatus.toLowerCase() === 'active' ? '#d1fae5' : '#FEE2E2',
                    border: '1px solid',
                    borderColor:
                      discount.discountStatus.toLowerCase() === 'active' ? '#6ee7b7' : '#FCA5A5',
                    borderRadius: '0.2rem',
                    textAlign: 'center',
                    color:
                      discount.discountStatus.toLowerCase() === 'active' ? '#065f46' : '#be5757',
                    fontWeight: '500',
                  }}
                >
                  {discount.discountStatus.toUpperCase()}
                </div>
                </p>
            </div>

            <div className='d-flex mt-3'>
            
            <p className="text-muted m-0">
              {discount.discountType === "Percentage"
                ? `${discount.discountValue}% off on ${getProductText(discount)}`
                : `₹${discount.discountValue} off on ${getProductText(discount)}`}
            </p>

            <span><LuDot  size={25}/></span>

            <p className="text-muted m-0"> {discount.minPurchaseRequirement}</p>
            </div>
          </div>
        ))}
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

          <div className='d-flex justify-content-end mt-2 pagination'>
          <Pagination>{paginationItems}</Pagination>
        </div>

    </div>
  )
}

export default DiscountsPage