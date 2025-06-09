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


const Orders = () => {
   
    const orderTableRef = useRef(null);
    const [orders,setOrders] = useState([])

    const [ordersData,setOrdersData] = useState([])
    const [filteredData, setFilteredData] = useState([]); 

    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalWeightSold, setTotalWeightSold] = useState(0);
    const [totalOrderWeight, setTotalOrderWeight] = useState(0);
    const [totalQuantity,setTotalQuantity] =useState(0)
    const [totalReceivedAmount, setTotalReceivedAmount] = useState(0);

    const [selectedStatus, setSelectedStatus] = useState([]); // Start with no status selected


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

    useEffect(() => {
        fetchDashboardData();
      }, []);

      const fetchDashboardData = async () => {
        try {
          const data = await getAllOrders();
          setOrdersData(data);
          setFilteredData(data);
          calculateDashboardStats(data); // ✅ Calculate stats for full data
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
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
    useEffect(() => {
      applyFilters(selectedFilter, searchValue, startDate, endDate, selectedStatus);
    }, [selectedStatus]);


   const handleFilterChange = (filter, value) => {
  setSelectedFilter(filter);
  setSearchValue(value.toLowerCase());
  applyFilters(filter, value.toLowerCase(), startDate, endDate, selectedStatus);
};


  const handleDateChange = (dates) => {
  const [start, end] = dates;
  setStartDate(start);
  setEndDate(end);
  if (start && end) {
    applyFilters(selectedFilter, searchValue, start, end, selectedStatus);
  }
};

const handleClearDateFilter = () => {
  setStartDate(null);
  setEndDate(null);
  setShowPicker(false);
  applyFilters(selectedFilter, searchValue, null, null, selectedStatus);
};


    
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

                <li className='col-lg col-md-6 col-sm-12 col-12'>
                <DashboardBox heading={'Order to Deliver'} number={ordersToDeliverCount}></DashboardBox>
                   
                </li>
            </ul>
        </div>

        <div className='order-filter-ctn d-flex gap-2 mb-2 w-30 mt-3'>
          
            <ProductFilter 
                filterOptions={["Order Id", "Customer"]} 
                onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
            />
          
                {/* <StatusFilter status={"Active"}></StatusFilter> */}
              <OrderFilter status={selectedStatus} onStatusChange={setSelectedStatus} />

        </div>

        
            <div className="order-table-ctn mt-4">
            <OrderTable ref={orderTableRef} data={filteredData}/>
            </div>

    </div>
  )
}

export default Orders