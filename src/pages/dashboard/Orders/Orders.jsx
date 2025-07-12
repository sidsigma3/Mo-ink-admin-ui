import React ,{useState , useRef , useEffect}from 'react'
import "./Orders.css"
import { IoSearchOutline } from "react-icons/io5";
import Filter from '../../../components/Filter/DayFilter/Filter';
import DashboardBox from '../../../components/DashboardBox/DashboardBox';
import { MdKeyboardArrowDown } from "react-icons/md";
import OrderTable from '../../../components/table/order/OrderTable';
import { Link } from 'react-router-dom'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn';
import AddBtn from '../../../components/Buttons/Add/AddBtn';
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import { Pagination } from 'react-bootstrap';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import BulkAssignPage from './BulkAssign/BulkAssignPage';
import OrderCart from './OrderCart/OrderCart';
import Badge from '@mui/material/Badge';
import { getAllOrders } from '../../../services/OrderService';
import { DateRangePicker } from "react-date-range";
import { format, parseISO } from "date-fns";
import { enIN } from "date-fns/locale";
import "react-date-range/dist/styles.css"; // Main styles
import "react-date-range/dist/theme/default.css"; // Theme styles
import OrderFilter from '../../../components/Filter/OrderFilter/OrderFilter';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchPaginatedOrders } from '../../../services/OrderService';
import { fetchOrderAnalytics } from '../../../services/OrderService';
import { FiCalendar } from "react-icons/fi";


const Orders = () => {
   
    const orderTableRef = useRef(null);
    const [ordersAll,setOrdersAll] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersData,setOrdersData] = useState([])
    const [filteredData, setFilteredData] = useState([]); 
    const [totalPages, setTotalPages] = useState(1);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalWeightSold, setTotalWeightSold] = useState(0);
    const [totalOrderWeight, setTotalOrderWeight] = useState(0);
    const [totalQuantity,setTotalQuantity] =useState(0)
    const [totalReceivedAmount, setTotalReceivedAmount] = useState(0);
    const [ordersToDeliver,setOrdersToDeliver] = useState(0)

    const [selectedStatus, setSelectedStatus] = useState([]);


    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [searchValue, setSearchValue] = useState("");
 
      
      
      // Function to adjust to Indian Standard Time (IST)
    const toIST = (date) => {
      return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    };

    const deliveryStatuses = ['CONFIRMED', 'MANUFACTURING', 'SHIPPED'];

    const ordersToDeliverCount = ordersData.filter(order =>
      deliveryStatuses.includes(order.status)
    ).length;

    // useEffect(() => {
    //     fetchAllOrders()
    //     // fetchDashboardData();
    // }, []);

    //  const fetchAllOrders = async () => {
    //   try {
    //     const data = await getAllOrders();
    //     setOrdersAll(data);
    //     const total = Math.ceil(data.length / 10);
    //     setTotalPages(total);
    //   } catch (error) {
    //     console.error("Error fetching all orders:", error);
    //   }
    // };



    const fetchDashboardData = async () => {
      try {
        const adjustedStartDate = startDate
          ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : undefined;

        const adjustedEndDate = endDate
          ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : undefined;

        const payload = {
          page: currentPage,
          size: 10,
          status: selectedStatus,
          orderId: selectedFilter === "Order Id" ? searchValue : undefined,
          startDate: adjustedStartDate,
          endDate: adjustedEndDate,
        };

        const data = await fetchPaginatedOrders(payload);
        setOrdersData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };



   const fetchDashboardAnalytics = async () => {
  try {
    const adjustDate = (date) => {
      return date ? new Date(date.getTime() + 24 * 60 * 60 * 1000) : undefined;
    };

    const payload = {
      status: selectedStatus,
      orderId: selectedFilter === "Order Id" ? searchValue : undefined,
      startDate: adjustDate(startDate),
      endDate: adjustDate(endDate),
    };

    const res = await fetchOrderAnalytics(payload);

    const analyticsData = res?.data;
    if (!analyticsData) return;

    setTotalOrders(analyticsData.totalOrders || 0);
    setTotalRevenue(analyticsData.orderedAmount || 0);
    setTotalOrderWeight(analyticsData.totalOrderWeight || 0);
    setTotalQuantity(analyticsData.orderedQuantity || 0);
    setTotalReceivedAmount(analyticsData.receivedAmount || 0);
    setOrdersToDeliver(analyticsData.orderToDeliver);

    const total = Math.ceil(analyticsData.totalOrders / 10);
    setTotalPages(total);
  } catch (error) {
    console.error("Error in dashboard analytics:", error);
  }
};




   const calculateDashboardStats = (data) => {
      let revenue = 0;
      let weight = 0;
      let quantity = 0;
      let received = 0;

      data.forEach(order => {
       
        revenue += order.totalAmount || 0;
        weight += order.orderVariantResponse.reduce(
          (total, variant) => total + (Number(variant.orderWeight) || 0), 
          0
        );
        quantity += order.orderVariantResponse.length || 0;

   
        const paymentStatus = order.payment?.paymentStatus;

        if (paymentStatus === "FULLY_PAID") {
          received += order.totalAmount - order.payment.totalAdjustedAmount - order.payment.totalRefundAmount|| 0;
        } else if (paymentStatus === "PARTIALLY_PAID") {
          received += order.payment?.totalAmountPaid || 0;
        }
      
      });

      setTotalOrders(data.length);
      setTotalRevenue(revenue);
      setTotalWeightSold(weight);
      setTotalOrderWeight(weight);
      setTotalQuantity(quantity);
      setTotalReceivedAmount(received);
    };




// ✅ Call applyFilters every time selectedStatus changes
const handleFilterChange = (filter, value) => {
  setSelectedFilter(filter);
  setSearchValue(value.toLowerCase());
  setCurrentPage(1); // Reset to first page
};

const handleDateChange = (dates) => {
  const [start, end] = dates;
  console.log(dates)
  setStartDate(start);
  setEndDate(end);
  setCurrentPage(1);
};

const handleClearDateFilter = () => {
  setStartDate(null);
  setEndDate(null);
  setCurrentPage(1);
};

const handleStatusChange = (status) => {
  setSelectedStatus(status);
  setCurrentPage(1);
};


useEffect(() => {
  fetchDashboardAnalytics();
}, [selectedStatus, selectedFilter, searchValue, startDate, endDate]);


useEffect(() => {
  fetchDashboardData();
}, [currentPage, selectedFilter, searchValue, startDate, endDate, selectedStatus]);


    
      // Apply both date and product filters
     const applyFilters = (filter, value, startDate, endDate, statusList = []) => {
  let filtered = ordersData;

  // Filter by Order ID or Customer
  if (filter && value) {
    filtered = filtered.filter((item) => {
      if (filter === "Order Id") return item.orderId.toString().includes(value);
      if (filter === "Customer") return item.customer.customerName.toLowerCase().includes(value.toLowerCase());
      return true;
    });
  }

  // Filter by Date Range
  if (startDate && endDate) {
    filtered = filtered.filter((item) => {
      const orderDate = toIST(new Date(item.createdAt));
      return orderDate >= toIST(startDate) && orderDate <= toIST(endDate);
    });
  }

  // Filter by Status (multi-select)
  if (statusList.length > 0) {
    filtered = filtered.filter((item) => statusList.includes(item.status));
  }

  setFilteredData(filtered);
  calculateDashboardStats(filtered);
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


    const formatNumber = (num) => {
        if (num >= 10000000) {
            return (num / 10000000).toFixed(2) + " Cr"; // Convert to Crores (if applicable)
        } else if (num >= 100000) {
            return (num / 100000).toFixed(2) + " L"; // Convert to Lakhs
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + " K"; // Convert to Thousands
        }
        return num; // Return as-is if less than 1000
    };


  return (
    <div className='order'>
        <div className='top'>
            <h3>Orders</h3>

            <div className='btn-ctn'>
            <div className="date-filter position-relative">
                     <button
                      className=" date-btn btn lg-btn fw-medium "
                      onClick={() => setShowPicker(!showPicker)}
                    >
                      <span className="d-none d-sm-inline">
                        {startDate && endDate
                          ? `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
                          : "Select Date"}
                      </span>
                       </button>

                        <button className="date-btn btn sm-bttn"
                        onClick={() => setShowPicker(!showPicker)}>
                      <FiCalendar className=" " size={20} />
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
                      <div ref={datePickerRef} style={{
                          zIndex: 1000,
                          position: "absolute",
                          right: 0,
                          width: "max-content",
                          maxWidth: "90vw", 
                          backgroundColor: "white",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.1)", }}>
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
              
                {/* <Filter></Filter> */}

                <ExportBtn onClick={() => orderTableRef.current?.exportOrders()}></ExportBtn>
                
                <Link to={'/create-order'}>
                    <AddBtn
                        text={"Create Order"}
                    ></AddBtn>
                </Link>
            </div>

            

        </div>


        <div className='info-ctn'>
            <ul className='row'>
                
                <li className='col-lg col-md-4 col-sm-6 col-6'>
                    <DashboardBox heading={'Total Orders'} number={totalOrders}></DashboardBox>
                    
                </li>

                <li className='col-lg col-md-4 col-sm-6 col-6'>
                <DashboardBox heading={'Ordered Quantity'} number={totalQuantity}></DashboardBox>
                   
                </li>

                <li className='col-lg col-md-4 col-sm-6 col-6'>
                <DashboardBox heading={'Ordered Amount'} number={'₹ '+formatNumber(totalRevenue)} />
                  
                </li>

                <li className='col-lg col-md-4 col-sm-6 col-6'>
                <DashboardBox heading={'Received Amount'} number={'₹ ' + formatNumber(totalReceivedAmount)} />
                  
                </li>

                <li className='col-lg col-md-6 col-sm-6 col-6'>
                <DashboardBox heading={'Total Order Weight'} number={totalOrderWeight + " Kg"}></DashboardBox>
                   
                </li>

                <li className='col-lg col-md-6 col-sm-6 col-6'>
                <DashboardBox heading={'Order to Deliver'} number={ordersToDeliver}></DashboardBox>
                   
                </li>
            </ul>
        </div>

        <div className='order-filter-ctn d-flex gap-2 mb-2 w-30 mt-3'>
          
            <ProductFilter 
                filterOptions={["Order Id", "Customer"]} 
                onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
            />
          
                {/* <StatusFilter status={"Active"}></StatusFilter> */}
              <OrderFilter status={selectedStatus} onStatusChange={handleStatusChange} />

        </div>

        
            <div className="order-table-ctn mt-4">
            <OrderTable ref={orderTableRef} data={ordersData}/>

            <Pagination className="mt-4 d-flex justify-content-end pagination">
              <Pagination.Prev
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => setCurrentPage(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </Pagination>

            </div>

    </div>
  )
}

export default Orders