import React ,{useState , useEffect , useRef }from 'react'
import ImportBtn from '../../../../components/Buttons/Import/ImportBtn'
import ExportBtn from '../../../../components/Buttons/Export/ExportBtn'
import ProductFilter from '../../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { useVendorOrderContext } from '../../../../components/Context/VendorOrderContext'
import { FiDownload } from "react-icons/fi";
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

const VendorOrder = () => {

    const navigate = useNavigate()

    const { order } = useVendorOrderContext();
    const [orders, setOrders] = useState([]);
    
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
    if (!orders || orders.length === 0) return;

    const data = orders.map((order) => {
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
         <div className='top d-flex justify-content-between'>
            <h3>Vendor Orders</h3>

            <div className='btn-ctn d-flex gap-2'>
                 <div className="date-filter position-relative">
                      <button
                        className="border rounded bg-white px-3 py-1"
                        onClick={() => setShowPicker(!showPicker)}
                      >
                        {startDate && endDate
                          ? `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
                          : "Select Date Range"}
                      </button>
  
                        {startDate && endDate && (
                            <button
                              className="ms-2 p-2 btn btn-sm btn-outline-secondary"
                              onClick={handleClearDateFilter}
                            >
                              Clear
                            </button>
                          )}
  
                      {showPicker && (
                        <div ref={datePickerRef} style={{ zIndex: 1000, position: "absolute" }}>
                          <DatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            inline
                            dateFormat="dd MMM yyyy"
                          />
                        </div>
                      )}
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
        <div className='info-ctn mt-3'>
          <ul className='row'>
            <li className='col-lg col-md-4 col-sm-6 col-6'>
              <DashboardBox heading={'Total Orders'} number={totalOrders} />
            </li>

            <li className='col-lg col-md-4 col-sm-6 col-6'>
              <DashboardBox heading={'Ordered Quantity'} number={`${totalQuantity} kg`} />
            </li>

            <li className='col-lg col-md-4 col-sm-6 col-6'>
              <DashboardBox heading={'Total Amount'} number={`₹${totalAmount.toFixed(0)}`} />
            </li>

            <li className='col-lg col-md-4 col-sm-6 col-6'>
              <DashboardBox heading={'Total Received'} number={totalReceived} />
            </li>

            <li className='col-lg col-md-4 col-sm-6 col-6'>
              <DashboardBox heading={'Total Pending'} number={totalPending} />
            </li>
          </ul>
        </div>



        <div className='order-filter-ctn d-flex gap-2 mb-2 w-50 mt-3'>
          
          <ProductFilter 
                filterOptions={["Order Id", "Vendor"]} 
                onFilterChange={handleFilterChange} 
          />
    
        <VendorOrderFilter status={statusFilter} onStatusChange={handleStatusChange} />


        </div>

        <div className="table-responsive mt-3 table-ctn">
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
              <td colSpan="8" style={{ textAlign: 'center' }}>
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
                <td  style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.vendorName}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{totalWeight.toFixed(2)} kg</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.totalAmount.toFixed(2)}</td>
                <td style={{ justifyItems: 'center', alignContent:'center'}}>
                  <div className={statusClassMap[order.status]}>
                    {[order.status]}
                  </div>
                    {/* <div style={{
                        padding: '4px',
                        border:'1px solid',borderRadius:'0.2rem',textAlign:'center',width:'6rem', 
                        backgroundColor:order.payment === 'Paid' ? '#D1FAE5' : '#F3F4F6',
                        borderColor:order.payment === 'Paid' ? '#6EE7B7' : '#D1D5DB' ,
                        color : order.payment === 'Paid' ? '#41b788' : '#3f3c3c' ,
                    }}>
                    {order.status}
                    </div> */}

                </td>
                <td  style={{ textAlign: 'center', verticalAlign: 'middle'}}>
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
            )}))}
          </tbody>
            </Table>
      </div>
    <div className="d-flex justify-content-end mt-2 pagination">
      <Pagination className="z-index-n1">{paginationItems}</Pagination>
    </div>



    </div>
  )
}

export default VendorOrder