import React ,{useState , useEffect , useRef }from 'react'
import ImportBtn from '../../../../components/Buttons/Import/ImportBtn'
import ExportBtn from '../../../../components/Buttons/Export/ExportBtn'
import ProductFilter from '../../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { useVendorOrderContext } from '../../../../components/Context/VendorOrderContext'
import { FiDownload } from "react-icons/fi";
import { LuDot } from "react-icons/lu";
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AddBtn from '../../../../components/Buttons/Add/AddBtn'
import "./VendorOrder.css"
import { useNavigate } from 'react-router-dom'
import { getVendorOrder } from '../../../../services/OrderService'
import { downloadVendorInvoice } from '../../../../services/InvoiceServices'
import * as XLSX from "xlsx";
import VendorOrderFilter from '../../../../components/Filter/OrderFilter/VendorOrderFilter'
import DashboardBox from '../../../../components/DashboardBox/DashboardBox'
import { Pagination } from 'react-bootstrap';
import { format, parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import { fetchPaginatedVendorOrders , fetchVendorOrderAnalytics} from '../../../../services/OrderService'
import { FiCalendar, FiX } from 'react-icons/fi';


const VendorOrder = () => {

    const navigate = useNavigate()

    const { order } = useVendorOrderContext();
    const [orders, setOrders] = useState([]);
    const [ordersAll,setOrdersAll] = useState([])
    const [searchFilter, setSearchFilter] = useState({ filter: "", value: "" });
    const [statusFilter, setStatusFilter] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [filteredData, setFilteredData] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 
    const [totalOrders , setTotalOrders ] = useState(0)
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [totalReceived , setTotalReceived] = useState(0)
    const [totalPending, setTotalPending] = useState(0)


      useEffect(() => {
            fetchAllOrders()
        }, []);
    
         const fetchAllOrders = async () => {
          try {
            const data = await getVendorOrder();
            setOrdersAll(data);
          } catch (error) {
            console.error("Error fetching all orders:", error);
          }
        };
    


    const handleRowClick = (correlationId) => {
      const relatedOrders = orders.filter(order => order.correlationId === correlationId);
      navigate(`/vendor-order-details/${correlationId}`, { state: { relatedOrders } });
    };
    
    const statusClassMap = {
        PLACED: "vendor blue",
        CONFIRMED: "vendor yellow",
        RECEIVED: "vendor green",
        RETURNED: "vendor grey",
        REPLACED: "vendor purple",
        CANCELLED: "vendor red",
      };

      const statusOption = [
      "PLACED",
      "CONFIRMED",
      "RECEIVED",
      "RETURNED",
      "REPLACED",
      "CANCELLED",
    ];

    const fetchVendorOrders = async () => {
      try {
        const adjustDate = (date) => date ? new Date(date.getTime() + 24 * 60 * 60 * 1000) : undefined;

        const payload = {
          page: currentPage,
          size: itemsPerPage,
          status: statusFilter,
          orderId: searchFilter?.filter === "Order Id" ? searchFilter?.value : undefined,
          startDate: adjustDate(startDate),
          endDate: adjustDate(endDate),
        };

        const data = await fetchPaginatedVendorOrders(payload);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch vendor orders:", error);
      }
    };



const fetchVendorAnalytics = async () => {
  try {
    const adjustDate = (date) => date ? new Date(date.getTime() + 24 * 60 * 60 * 1000) : undefined;

    const payload = {
      status: statusFilter,
      orderId: searchFilter?.filter === "Order Id" ? searchFilter?.value : undefined,
      startDate: adjustDate(startDate),
      endDate: adjustDate(endDate),
    };

    const res = await fetchVendorOrderAnalytics(payload);

    const data = res?.data;
    if (!data) return;

    setTotalOrders(data.totalOrders || 0);
    setTotalQuantity(data.orderedQuantity || 0);
    setTotalAmount(data.totalAmount || 0);
    setTotalReceived(data.totalReceived || 0);
    setTotalPending(data.totalPending || 0);
  } catch (error) {
    console.error("Failed to fetch vendor analytics:", error);
  }
};



    const handleDateChange = (dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
      setCurrentPage(1);
    };

    const handleClearDateFilter = () => {
      setStartDate(null);
      setEndDate(null);
      setCurrentPage(1);
    };

  const handleFilterChange = (filter, value) => {
    setSearchFilter({ filter, value });
    setCurrentPage(1);
  };

  const handleStatusChange = (newStatuses) => {
    setStatusFilter(newStatuses);
    setCurrentPage(1);
  };


 const applyCombinedFilters = (search, statusArray) => {
  let filtered = orders;

  const lowercasedValue = search.value.toLowerCase().trim();

  // Apply text filter
  if (lowercasedValue) {
    filtered = filtered.filter((item) => {
      if (search.filter === "PO") return item.correlationId.toString().includes(lowercasedValue);
      if (search.filter === "Vendor") return item.vendorName.toLowerCase().includes(lowercasedValue);
      return true;
    });
  }

  // Apply status filter (support multiple selections)
  if (statusArray.length > 0) {
    filtered = filtered.filter((item) => statusArray.includes(item.status));
  }

  setFilteredData(filtered);
};


      const datePickerRef = useRef(null);

      // Close date picker when clicking outside
      useEffect(() => {
          const handleClickOutside = (event) => {
              if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                  setShowPicker(false);
              }
          };
  
          if (showPicker) {
              document.addEventListener("mousedown", handleClickOutside);
          }
  
          return () => {
              document.removeEventListener("mousedown", handleClickOutside);
          };
      }, [showPicker]);


     

      useEffect(() => {
        fetchVendorAnalytics();
      }, [startDate, endDate, statusFilter, searchFilter]);
      
      
      useEffect(() => {
        fetchVendorOrders();
      }, [currentPage, startDate, endDate, statusFilter, searchFilter]);
      


      const formatDateToIST = (dateStr) => {
        // Force it to be treated as UTC
        const utcDate = new Date(dateStr + 'Z');
      
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
      
      
 const handleExport = () => {
    if (!ordersAll || ordersAll.length === 0) return;

    const data = ordersAll.map((order) => {
      const totalWeight = order.vendorOrderVariantResponse.reduce(
        (sum, variant) => sum + variant.vendorOrderWeight,
        0
      );

      return {
        "ID": order.vendorOrderId,
        "PO": order.correlationId,
        "Date": new Date(order.orderDate).toLocaleDateString('en-IN'),
        "Order For": order.vendorType,
        "Vendor": order.vendorName,
        "Weight (kg)": totalWeight.toFixed(2),
        "Amount": order.totalAmount.toFixed(2),
        "Status": order.status
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendor Orders");
    XLSX.writeFile(workbook, "Vendor_Orders.xlsx");
  };



const uniquePOMap = new Map();

filteredData.forEach((order) => {
  const key = order.correlationId;
  if (!uniquePOMap.has(key)) {
    uniquePOMap.set(key, {
      correlationId: order.correlationId,
      weight: order.vendorOrderVariantResponse.reduce((sum, variant) => sum + variant.vendorOrderWeight, 0),
      amount: order.totalAmount,
      status: order.status,
    });
  } else {
    const existing = uniquePOMap.get(key);
    existing.weight += order.vendorOrderVariantResponse.reduce((sum, variant) => sum + variant.vendorOrderWeight, 0);
    existing.amount += order.totalAmount;
  }
});

const uniquePOs = Array.from(uniquePOMap.values());

// const totalOrders = uniquePOs.length;
// const totalQuantity = uniquePOs.reduce((sum, order) => sum + order.weight, 0).toFixed(0);
// const totalAmount = uniquePOs.reduce((sum, order) => sum + order.amount, 0).toFixed(0);
// const totalReceived = uniquePOs.filter(order => order.status === 'RECEIVED').length;
// const totalPending = uniquePOs.filter(order => order.status === 'CONFIRMED').length;



const totalPages = Math.ceil(totalOrders / itemsPerPage); 

// const paginatedData = filteredData
//   .slice()
//   .reverse()
//   .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

const paginationItems = [];

if (totalPages > 1) {
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
    <div className='vendor-order'>
         <div className='top d-flex justify-content-between align-items-center  mt-3 mb-4'>
            <h3 className='m-0' style={{fontSize:'1.2rem'}}>Vendor Orders</h3>

            <div className='btn-ctn d-flex justify-content-center align-items-center gap-2'>
                   <div className='btn-ctn'>
                                          <div className="date-filter d-flex position-relative align-items-center">
                                            {/* Main date button - desktop */}
                                            <button
                                              className="date-btn btn lg-btn fw-medium d-flex align-items-center justify-content-center position-relative"
                                              onClick={() => setShowPicker(!showPicker)}
                                            >
                                              <span className="d-none d-sm-inline">
                                                {startDate && endDate
                                                  ? `${format(startDate, "dd MMM yy")} - ${format(endDate, "dd MMM yy")}`
                                                  : "Select Date"}
                                              </span>
                                              
                                              {/* Clear button integrated into main button - desktop */}
                                              {startDate && endDate && (
                                                <button
                                                  className="btn-clear position-absolute d-none d-sm-flex align-items-center justify-content-center"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setStartDate(null);
                                                    setEndDate(null);
                                                  }}
                                                  style={{
                                                    right: '8px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    backgroundColor: '#ef44441f',
                                                    color: '#ef4444',
                                                    fontSize: '12px',
                                                    zIndex: 1
                                                  }}
                                                  title="Clear dates"
                                                >
                                                  <FiX size={12} />
                                                </button>
                                              )}
                                            </button>
                      
                                            {/* Mobile date button with calendar icon */}
                                            <button 
                                              className="date-btn btn sm-bttn position-relative"
                                              onClick={() => setShowPicker(!showPicker)}
                                            >
                                              <FiCalendar size={20} />
                                              
                                              {/* Clear icon on top-right for mobile */}
                                              {startDate && endDate && (
                                                <button
                                                  className="position-absolute d-sm-none d-flex align-items-center justify-content-center"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setStartDate(null);
                                                    setEndDate(null);
                                                  }}
                                                  style={{
                                                    top: '-6px',
                                                    right: '-6px',
                                                    width: '18px',
                                                    height: '18px',
                                                    borderRadius: '50%',
                                                    border: '1px solid white',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    fontSize: '10px',
                                                    zIndex: 2,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                  }}
                                                  title="Clear dates"
                                                >
                                                  <FiX size={10} />
                                                </button>
                                              )}
                                            </button>
                      
                                            {/* Date picker dropdown */}
                                            {showPicker && (
                                              <div 
                                                ref={datePickerRef} 
                                                style={{ 
                                                  zIndex: 1000, 
                                                  position: "absolute", 
                                                  right: "0",
                                                  top: "100%",
                                                  marginTop: "4px"
                                                }}
                                              >
                                                <DatePicker
                                                  selected={startDate}
                                                  onChange={(dates) => {
                                                    const [start, end] = dates;
                                                    setStartDate(start);
                                                    setEndDate(end);
                                                  }}
                                                  startDate={startDate}
                                                  endDate={endDate}
                                                  selectsRange
                                                  inline
                                                  dateFormat="dd MMM yyyy"
                                                />
                                              </div>
                                            )}
                                          </div>
                                       </div>

                <ExportBtn onClick={handleExport}></ExportBtn>

                {/* <ImportBtn></ImportBtn> */}

                <Link to={'/BulkAssignPage'}>
                                    <AddBtn
                                        text={"Order to vendor"}
                                    ></AddBtn>
                                </Link>

               
            </div>
        </div>
        <div className='info-ctn row mt-3'>
            <div className='dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl'>
              <DashboardBox heading={'Total Orders'} number={totalOrders} />
            </div>

            <div className='dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl'>
              <DashboardBox heading={'Ordered Quantity'} number={`${totalQuantity} kg`} />
            </div>

            <div className='dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl'>
              <DashboardBox heading={'Total Amount'} number={`₹${totalAmount.toFixed(0)}`} />
            </div>

            <div className='dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl'>
              <DashboardBox heading={'Total Received'} number={totalReceived} />
            </div>

            <div className='dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl'>
              <DashboardBox heading={'Total Pending'} number={totalPending} />
            </div>
        </div>



        <div className='order-filter-cttn d-flex gap-2 mb-2 mt-3 '>
                                    <div className='col-sm-6 col-md-9'>
                                        <ProductFilter  
                filterOptions={["Order Id", "Vendor"]} 
                onFilterChange={handleFilterChange} 
          />
    </div>
            <div className='col-sm-6 col-md-3'>
        <VendorOrderFilter status={statusFilter} onStatusChange={handleStatusChange} />
        </div>


        </div>

        {/* Desktop Table */}
        <div className="d-none d-md-block">
          <div className="table-responsive mt-3 rounded-2 table-ctn" style={{height: '60vh'}}>
            <Table hover>
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th style={{ textAlign: 'center' }}>PO</th>
                  <th style={{ textAlign: 'center' }}>Date</th>
                  <th style={{ textAlign: 'center' }}>Order For</th>
                  <th style={{ textAlign: 'center' }}>Vendor</th>
                  <th style={{ textAlign: 'center' }}>Weight</th>
                  <th style={{ textAlign: 'center' }}>Amount</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center' }}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const totalWeight = order.vendorOrderVariantResponse.reduce(
                      (sum, variant) => sum + variant.vendorOrderWeight,
                      0
                    );

                    return (
                      <tr key={order.vendorOrderId} onClick={() => handleRowClick(order.correlationId)} style={{ cursor: 'pointer' }}>
                        <td style={{ verticalAlign: 'middle'}}>{order.vendorOrderId}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.correlationId}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{formatDateToIST(order.orderDate)}</td>
                        <td style={{ justifyItems: 'center', alignContent:'center'}}>
                          <div 
                            style={{
                              padding: '4px',
                              border:'1px solid',borderRadius:'0.2rem',textAlign:'center',width:'6rem', 
                              backgroundColor:order.vendorType === 'SPINNER' ? '#DBEAFE' : '#FEF3C7',
                              borderColor:order.vendorType === 'SPINNER' ? '#93C5FD' : '#FCD34D' ,
                              color : order.vendorType === 'SPINNER' ? '#1E40AF' : '#92400E' ,
                            }}  
                          >
                            {order.vendorType}
                          </div>    
                        </td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.vendorName}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{totalWeight.toFixed(0)} kg</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>₹ {order.totalAmount.toFixed(0)}</td>
                        <td style={{ justifyItems: 'center', alignContent:'center'}}>
                          <div className={statusClassMap[order.status]} style={{
                              padding: '4px',
                              border:'1px solid',borderRadius:'0.2rem',textAlign:'center',width:'6rem'}}>
                            {order.status}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>
                          <button
                            className="border-0 btn"
                            onClick={(e)=>{
                              e.stopPropagation()
                              downloadVendorInvoice(order.vendorOrderId)
                            }}
                          >
                            <FiDownload size={20}/>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="d-block d-md-none mt-3">
          {orders.length === 0 ? (
            <div className="mmobile-empty-state">
              <p>No orders found</p>
            </div>
          ) : (
            orders.map((order) => {
              const totalWeight = order.vendorOrderVariantResponse.reduce(
                (sum, variant) => sum + variant.vendorOrderWeight,
                0
              );

              return (
                <div 
                  key={order.vendorOrderId} 
                  className="ccard rounded-3"
                  onClick={() => handleRowClick(order.correlationId)}
                >
                  {/* Header */}
                  <div className="ccard-header">
                    <div className="order-tag-id">
                    <h3 className='m-0' style={{fontSize: '1rem'}}>#{order.vendorOrderId}</h3>
                    </div>
                    <div className="ddates-time">
                    <h4 className="ddate-time">{formatDateToIST(order.orderDate)}</h4>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="ccard-content">
                    <div className="vvendor-info  d-flex justify-content-between">
                      <div className="vvendor-name"><p style={{fontSize: '16px', fontWeight: '500'}}>{order.vendorName}</p></div>
                      <span> <LuDot size={25} /></span>
                      <div className="">
                        <span className="wweight">{totalWeight.toFixed(0)} kg</span>
                        <span> <LuDot size={25} /></span>
                        <span className="aamount">₹ {order.totalAmount.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="ccard-footer">
                    <div className="ttag-container">
                      <div className="vvendor-type-tag" data-type={order.vendorType}>
                        {order.vendorType}
                      </div>
                    </div>
                    <div className="sstatus-container">
                      <div className={`sstatus-tag ${statusClassMap[order.status]}`}>
                        {order.status}
                      </div>
                      <button
                        className="ddownload-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadVendorInvoice(order.vendorOrderId);
                        }}
                      >
                        <FiDownload size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
    <div className="d-flex justify-content-end mt-2 pagination">
      <Pagination className="z-index-n1">{paginationItems}</Pagination>
    </div>



    </div>
  )
}

export default VendorOrder