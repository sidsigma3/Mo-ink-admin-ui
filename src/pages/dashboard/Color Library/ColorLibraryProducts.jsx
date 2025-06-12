import React, {useState , useEffect} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import "./ColorLibraryProducts.css"
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



const ColorLibraryProducts =  () => {

  const navigate = useNavigate ()


const yarnData = [
  {
    name: "Cotton",
    sku: "6 SKU",
    colors: "89 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn3.jpg?updatedAt=1749718954222",
  },
  {
    name: "Excel",
    sku: "5 SKU",
    colors: "25 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn2.jpg?updatedAt=1749718954429",
  },
  {
    name: "Micro Modal",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn5.jpg?updatedAt=1749718954471",
  },
  {
    name: "Bamboo",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn4.jpg?updatedAt=1749718954196",
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
  

    // const exportToExcel = (discounts) => {
    //    const showToast = (message, type = "error") => {
    //         setToasts([{ message, type }]);
    //         setTimeout(() => setToasts([]), 3000);
    //       };
    //   if (!discounts || !discounts.length) {
    //     showToast("No discounts available for export.", "error");
    //     return;
    //   }
    
    //   const worksheet = XLSX.utils.json_to_sheet(
    //     discounts.map((discount) => {
    //       const applicableProduct = discount?.applicableProducts[0]?.productName || "N/A";
    //       const discountInfo =
    //         discount.discountType === "Percentage"
    //           ? `${discount.discountValue}% off on ${applicableProduct}`
    //           : `₹${discount.discountValue} off on ${applicableProduct}`;
    //       return {
    //         "Title": discount.discountCode,
    //         "Status": discount.discountStatus,
    //         "Method": discount.discountMethod,
    //         "Eligible Customers": discount.eligibleCustomers.length,
    //         "Used": discount.used,
    //         "Discount Details": discountInfo,
    //         "Minimum Purchase Requirement": discount.minPurchaseRequirement || "N/A"
    //       };
    //     })
    //   );
    
    //   const workbook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(workbook, worksheet, "Discounts");
    
    //   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //   const dataBlob = new Blob([excelBuffer], {
    //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   });
    //   saveAs(dataBlob, "Discounts_List.xlsx");
    // };

//   const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
//   const selectedProducts = discountData?.applicableProducts || [];
//   const isAllProducts = allProducts.length === selectedProducts.length;
//   const selectedProductText = isAllProducts ? "all products" : "selected products";


//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const paginatedDiscounts = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const paginationItems = [];

// if (totalPages >=1) {
//   paginationItems.push(
//     <Pagination.Prev
//       key="prev"
//       onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//       disabled={currentPage === 1}
//     />
//   );

//   for (let number = 1; number <= totalPages; number++) {
//     paginationItems.push(
//       <Pagination.Item
//         key={number}
//         active={number === currentPage}
//         onClick={() => setCurrentPage(number)}
//       >
//         {number}
//       </Pagination.Item>
//     );
//   }

//   paginationItems.push(
//     <Pagination.Next
//       key="next"
//       onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//       disabled={currentPage === totalPages}
//     />
//   );
// }


  return (
    <div className='colorlibrary'>
        <div className='top d-flex justify-content-between mt-2 mb-2'>
            <h4 style={{fontSize:'1.2rem'}}>Color Library</h4>

            {/* <div className='d-flex gap-2'>
                 <ExportBtn onClick={() => exportToExcel(filteredData)}></ExportBtn>
                 <ImportBtn></ImportBtn>
            </div> */}
        </div>

        {/* <div className='d-flex gap-2 filter-sec'>
            <div className='w-75'>
              <ProductFilter 
                  filterOptions={["Color Name", "Color Code"]}
                  onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
              />
            </div>
         
            <div className='w-25'>
                <StatusFilter status={'All'} onStatusChange={handleStatusChange}></StatusFilter> 
            </div>
        </div> */}



               <div className=" py-5">
                <div className="row g-4 justify-content-center">
                  {yarnData.map((item, index) => (
                    <div className="col-12 col-sm-6 col-lg-2" key={index}>
                      <div className="card h-100 shadow-sm border-0 rounded-4 position-relative">
                        <div className="overflow-hidden rounded-top-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-100 rounded-4 p-3 zoom-img"
                            onClick={() => navigate("/colorlibrary")}
                          />
                        </div>
                        <div className="card-body text-center">
                          <h6 className="fw-bold text-dark mb-2">{item.name}</h6>
                          <p className="mb-0 text-muted">{item.colors}</p>
                        </div>
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
          {/* <Pagination>{paginationItems}</Pagination> */}
        </div>

    </div>
  )
}

export default ColorLibraryProducts