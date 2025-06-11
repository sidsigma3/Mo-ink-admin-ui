import React, {useState , useEffect} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import "./ColorLibrary.css"
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
import ImportBtn from '../../../components/Buttons/Import/ImportBtn'

const ColorLibrary =  ({setDemoData }) => {

  const navigate = useNavigate ()

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedData = [...demoData];
      updatedData[index].imageUrl = URL.createObjectURL(file); // preview only
      setDemoData(updatedData);
    }
  };

const demoData = [
  {
    colorName: "Red",
    colorCode: "AL565SD",
    // imageUrl: "https://saroj.in/cdn/shop/files/WhatsAppImage2023-04-08at5.01.46PM_2_1200x.jpg?v=1728303359",
    imageUrl: "",
    status: "Active",
  },
  {
    colorName: "Blue",
    colorCode: "BL112XY",
    imageUrl: "https://saroj.in/cdn/shop/files/WhatsAppImage2023-03-11at1.28.09PM_1.jpg?v=1728304968",
    status: "Inactive",
  },
  {
    colorName: "Green",
    colorCode: "GR221AB",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHOHFn9N_zncYXBZxMXDJShO9ZbZWTTL_Kzg&s",
    status: "Active",
  },
  {
    colorName: "Yellow",
    colorCode: "YL783CJ",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRykV6QQvWAT9--D3ltC6lggzIjHBoWHsXahQ&s",
    status: "Inactive",
  },
  {
    colorName: "Purple",
    colorCode: "PR991XY",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvjEbqjhtuOT1OUaDJhJeHK_aNH-i4V8USUg&s",
    status: "Active",
  },
  {
    colorName: "Orange",
    colorCode: "OR442HK",
    imageUrl: "https://saroj.in/cdn/shop/files/WhatsAppImage2023-03-06at6.55.16PM_1024x1024.jpg?v=1728303305",
    status: "Inactive",
  },
  {
    colorName: "Black",
    colorCode: "BK110XM",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzV4Vgn1r8wv-_htbDkNJgPhVRqAXF6vdEDw&s",
    status: "Active",
  },
  {
    colorName: "White",
    colorCode: "WH776PO",
    imageUrl: "https://saroj.in/cdn/shop/files/WhatsAppImage2023-03-08at8.03.22PM_1200x.jpg?v=1728304269",
    status: "Inactive",
  },
];
  
  
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
  

  const handleRowClick = (index) => {
    navigate('/add-discount', { state: { index , discountData} });
  };


  const handleDelete = (index) => {
    setDiscountData(discountData.filter((_, i) => i !== index));
  };

  const handleDuplicate = (index) => {
    setDiscountData([discountData[index],...discountData]);
  };


  const handleFilterChange = (filter, value) => {
    if (filter === "Color Name") {
      setSearchTerm(value);
      applyCombinedFilter(value, selectedStatus, startDate, endDate);
    } else if (filter === "Color Code") {
      setStartDate(value);
      applyCombinedFilter(searchTerm, selectedStatus, value, endDate);
    }
  };
  
  
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    applyCombinedFilter(searchTerm, status, startDate, endDate);
  };
  
  const handleStartDateChange = (date) => {
    setStartDate(date);
    applyCombinedFilter(searchTerm, selectedStatus, date, endDate);
  };
  
  const handleEndDateChange = (date) => {
    setEndDate(date);
    applyCombinedFilter(searchTerm, selectedStatus, startDate, date);
  };

  const applyCombinedFilter = (searchValue, status, start, end) => {
    const lowercasedSearch = searchValue?.toLowerCase?.() || "";
  
    const filtered = discountData.filter((item) => {
      const matchesSearch = item.discountCode.toLowerCase().includes(lowercasedSearch);
      const matchesStatus = status === 'All' || item.discountStatus === status;
  
      const itemStartDate = item.startDateTime ? new Date(item.startDateTime) : null;
      const itemEndDate = item.endDateTime ? new Date(item.endDateTime) : null;
  
      const matchesStartDate = !start || (itemStartDate && itemStartDate >= new Date(start));
      const matchesEndDate = !end || (itemEndDate && itemEndDate <= new Date(end));
  
      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });
  
    setFilteredData(filtered);
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

  const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
  const selectedProducts = discountData?.applicableProducts || [];
  const isAllProducts = allProducts.length === selectedProducts.length;
  const selectedProductText = isAllProducts ? "all products" : "selected products";


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedDiscounts = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationItems = [];

if (totalPages >=1) {
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
    <div className='colorlibrary'>
        <div className='top d-flex justify-content-between mb-2'>
            <h4 style={{fontSize:'1.2rem'}}>Color Library</h4>

            <div className='d-flex gap-2'>
                 <ExportBtn onClick={() => exportToExcel(filteredData)}></ExportBtn>
                 <ImportBtn></ImportBtn>
            </div>
        </div>

        <div className='d-flex gap-2 filter-sec'>
            <div className='w-75'>
              <ProductFilter 
                  filterOptions={["Color Name", "Color Code"]}
                  onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
              />
            </div>
         
            <div className='w-25'>
                <StatusFilter status={'All'} onStatusChange={handleStatusChange}></StatusFilter> 
            </div>
        </div>


        <div className='colorlibrary-table-ctn'>
          <Table hover>
            <thead>
              <tr>
                <th>Color Name</th>

                <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Color Code</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Image</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Status</th>
                <th style={{width:'1rem'}}></th>
              </tr>
            </thead>

            <tbody>
             <>
      {demoData.map((item, index) => (
        <tr key={index}>
          <td style={{ verticalAlign: "middle" }}>{item.colorName}</td>
          <td style={{ textAlign: "center", verticalAlign: "middle" }}>
            {item.colorCode}
          </td>
          <td style={{ textAlign: "center", verticalAlign: "middle" }}>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.colorName}
                width="40"
                height="40"
                style={{ borderRadius: "8px" }}
              />
            ) : (
              <>
                <label
                  htmlFor={`upload-${index}`}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    border: "1px dashed gray",
                    borderRadius: "8px",
                    display: "inline-block",
                  }}
                >
                  ➕
                </label>
                <input
                  type="file"
                  id={`upload-${index}`}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, index)}
                />
              </>
            )}
          </td>
          <td style={{ textAlign: "center", verticalAlign: "middle" }}>
            <button
              style={{
                padding: "6px 12px",
                backgroundColor: item.status === "Active" ? "#10B981" : "#E5E7EB",
                color: item.status === "Active" ? "white" : "#374151",
                border: "none",
                borderRadius: "4px",
                cursor: "default",
              }}
            >
              {item.status}
            </button>
          </td>
        </tr>
      ))}
    </>
            </tbody>

          </Table>

      

          <div className="data-cards">
        {filteredData.map((discount,index) => (
          <div className="data-card shadow-sm" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{discount.discountCode}</h3>
                 <p> 
                 <div style={{backgroundColor:discount.discountStatus.toLowerCase() === 'active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:discount.discountStatus.toLowerCase()==='active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'4rem'}}>
                  {discount.discountStatus}
                </div>
                </p>
            </div>

            <div className='d-flex mt-3'>
            
            <p className="text-muted m-0">
                  {discount.discountType === "Percentage"
                    ? `${discount.discountValue}% off on ${discount?.applicableProducts[0]?.productName}`
                    : `₹${discount.discountValue} off on cotton yarn`}
              </p>

            <span><LuDot  size={25}/></span>

            <p><strong></strong> {discount.minPurchaseRequirement}</p>

            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
           
            <div style={{ display: 'flex' }}>
                {product.colorVariants.map((color, index) => (
                <div
                    key={index}
                    style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    marginLeft: index === 0 ? '0' : '-10px',
                    border: '1px solid #fff',
                    }}
                 
                ></div>
                ))}
            </div>
            </div> */}
            </div>

            {/* <div className='d-flex justify-content-between mt-2 pe-4'>
                 <p> 
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:product.status === 'Active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:product.status==='Active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'100%'}}>
                    {product.status}
                    </div>
                </p>
                 <p>{product.stock} Kgs</p>
            </div> */}
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

export default ColorLibrary