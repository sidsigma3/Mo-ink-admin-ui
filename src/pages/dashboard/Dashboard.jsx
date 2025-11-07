import React , {useState , useEffect , useRef} from "react";
import { LuCalendarSearch } from "react-icons/lu";
import "./Dashboard.css";
import DashboardBox from "../../components/DashboardBox/DashboardBox";
import ProductSoldGraph from "../../components/Analylitcs/Graph/ProductSoldGraph";
import Filter from "../../components/Filter/DayFilter/Filter";
import { getAllCustomer } from "../../services/CustomerService";
import { getAllOrders } from "../../services/OrderService";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import { enIN } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { getAllInventory } from "../../services/InventoryService";
import { getAllProduct } from "../../services/ProductService";
import { FiCalendar, FiX } from 'react-icons/fi';
// import BottomNav from "../../components/SideBar/BottomNav";
import { fetchDashboardAnalytics } from "../../services/analyticsService";

const Dashboard = () => {

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [showPicker, setShowPicker] = useState(false);
  const datePickerRef = useRef(null);
  

  // const [totalCustomers, setTotalCustomers] = useState(0);
 
  const [totalRevenue, setTotalRevenue] = useState(0);
  // const [totalWeightSold, setTotalWeightSold] = useState(0);
  const [toDispatch,setToDispatch] = useState(0)
  const [toVendor,setToVendor] = useState(0)
  const [fromVendor,setFromVendor] = useState(0)
  const [newOrder,setNewOrder] = useState(0)

  const [paymentReceivable, setPaymentReceivable] = useState(0);
  const [newOrderWeight, setNewOrderWeight] = useState(0);
  const [inventoryLeft, setInventoryLeft] = useState(0);
  const [productSoldData, setProductSoldData] = useState({});
  const [productList, setProductList] = useState([]);
  const [productListLoaded, setProductListLoaded] = useState(false);


  const [analytics, setAnalytics] = useState(null);

  

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const data = await getAllProduct();
//       setProductList(data.data);
//       setProductListLoaded(true);  // Set flag when loaded
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   fetchData();
// }, []);

// useEffect(() => {
//   if (productListLoaded) {
//     fetchDashboardData();
//   }
// }, [productListLoaded, startDate, endDate]);




useEffect(() => {
  const handleClickOutside = (event) => {
    if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
      // Check if the clicked element is not one of our toggle buttons
      const isToggleButton = event.target.closest('.date-btn');
      if (!isToggleButton) {
        setShowPicker(false);
      }
    }
  };

  if (showPicker) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showPicker]);

useEffect(() => {
  fetchDashboardData();
}, [startDate, endDate]);



const fetchDashboardData = async () => {
  const adjustedStartDate = startDate
    ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : undefined;

  const adjustedEndDate = endDate
    ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : undefined;

  const data = await fetchDashboardAnalytics(adjustedStartDate, adjustedEndDate);
  if (data) setAnalytics(data);
};






  if (!analytics) return <p>Loading...</p>;


  


//   const fetchDashboardData = async () => {
//   try {
 
//     const customerRes = await getAllCustomer();
//     setTotalCustomers(customerRes?.data?.length || 0);

   
//     const orders = await getAllOrders();

//     let revenue = 0;
//     let weight = 0;
//     let newOrder = 0;
//     let toDispatch = 0;
//     let toVendor = 0;
//     let fromVendor = 0;
//     let receivable = 0;
//     let newOrderKgs = 0;

   
//     const filteredOrders = (startDate && endDate)
//       ? orders.filter(order => {
//           const orderDate = new Date(order.createdAt);
//           return orderDate >= startDate && orderDate <= endDate;
//         })
//       : orders;

//       let productSoldMap = {};

//    const productIdToNameMap = {};
//     productList.forEach(p => {
//       productIdToNameMap[p.id] = p.productName;
//     });

//     filteredOrders.forEach(order => {
//       if (Array.isArray(order.orderVariantResponse)) {
//         order.orderVariantResponse.forEach(variant => {
//           const productId = variant.productId;
//           const productName = productIdToNameMap[productId] || 'Unknown';
//           const weight = Number(variant.orderWeight) || 0;

//           if (!productSoldMap[productName]) {
//             productSoldMap[productName] = 0;
//           }
//           productSoldMap[productName] += weight;
//         });
//       }
//     });


   
//     setProductSoldData(productSoldMap);



//     filteredOrders.forEach(order => {
//       const orderAmount = order.totalAmount || 0;
     
//       const orderWeight = Array.isArray(order.orderVariantResponse)
//       ? order.orderVariantResponse.reduce((sum, item) => sum + Number(item.orderWeight || 0), 0)
//       : 0;


//       revenue += orderAmount;
//       weight += orderWeight;

  
//       if (["PENDING", "PARTIALLY_PAID"].includes(order.status)) {
//         receivable += order.payment.codAmount || 0; // Or use another field like `remainingAmount`
//       }

//       if (order.status === "NEW") {
//         newOrder += 1;
//         newOrderKgs += orderWeight;
//       }

    
//       switch (order.status) {
//         case "CONFIRMED":
//           toVendor += 1;
//           break;
//         case "MANUFACTURING":
//           fromVendor += 1;
//           break;
//         default:
//           if (!["DELIVERED", "CANCELLED", "RETURNED", "PENDING"].includes(order.status)) {
//             toDispatch += 1;
//           }
//           break;
//       }
//     });


//    const inventoryRes = await getAllInventory();
//     let totalRemainingWeight = 0;

//     console.log(inventoryRes);

//     if (Array.isArray(inventoryRes?.data?.product)) {
//       inventoryRes.data.product.forEach(entry => {
//         if (Array.isArray(entry?.variant)) {
//           entry.variant.forEach(item => {
//             totalRemainingWeight += item.availableWeight || 0;
//           });
//         }
//       });
//     }


//     setTotalOrders(filteredOrders.length);
//     setTotalRevenue(revenue);
//     setTotalWeightSold(weight);
//     setNewOrder(newOrder);
//     setFromVendor(fromVendor);
//     setToVendor(toVendor);
//     setToDispatch(toDispatch);
//     setPaymentReceivable(receivable);
//     setNewOrderWeight(newOrderKgs);
//     setInventoryLeft(totalRemainingWeight);
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//   }
// };

const {
  totalCustomers,
  totalOrders,
  totalRevenueInLacs,
  paymentReceivedInLacs,
  totalWeightSold,
  productSoldByCategory,
  newOrdersToFulfill,
  ordersAtManufacturer,
  ordersDispatched,
  paymentPendingInLacs,
  newOrderReceivedWeight,
  totalInventoryLeft,
} = analytics;



  const formatNumber = (num) => {
   
    if (num >= 100000) {
        return (num / 100000).toFixed(2) + " Lacs"; 
    }
        return num; 
};

  return (
    <div className="right-content w-100">
                    <div className="top d-flex align-items-center justify-content-between w-100 mt-3 mb-4">
                        <h3 className="mb-0">Dashboard</h3>

                        {/* <div className="filter-ctn d-flex">
                        <button>
                            <span>
                            <LuCalendarSearch size={20} />
                            </span>
                            Last 12 Months
                        </button>
                        </div> */}
                        {/* <Filter></Filter> */}

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


                    </div>

                    <div className="info-ctn row">
                         <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
                          <DashboardBox heading={'Total Customers'} number={totalCustomers} />
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4 col-xl">
                          <DashboardBox heading={'Total Order'} number={totalOrders} />
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4 col-xl">
                          <DashboardBox heading={'Total Revenue (Lacs)'} number={`₹ ${formatNumber(totalRevenueInLacs)}`} />
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4 col-xl">
                          <DashboardBox heading={'Total Weight Sold'} number={`${totalWeightSold.toFixed(2)} Kgs`} />
                        </div>
                    </div>

      <div className="bg-white graph-ctn shadow-sm p-3">
        <h5 style={{fontSize:'1.2rem'}}>Product Sold (Kgs)</h5>
       <h5 className="mb-3" style={{fontSize:'1rem'}}></h5>
      <ProductSoldGraph productData={productSoldByCategory} />

      </div>


      <div className="current-status-ctn row">
        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
          <DashboardBox heading={'New Orders'} number={newOrdersToFulfill} />
        </div>

         <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
          <DashboardBox
            heading={'New Orders (kgs)'}
            number={`${newOrderReceivedWeight.toFixed(2)} Kgs`}
          />
        </div>

        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
        <DashboardBox
          heading={'Pending Amount'}
          number={`₹ ${paymentPendingInLacs} Lacs`}
        />
      </div>

        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
          <DashboardBox 
            heading={'Received Amount'} 
            number={`₹ ${(paymentReceivedInLacs).toFixed(2)} Lacs`} 
          />
        </div>

        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
          <DashboardBox heading={'Order Delivered'} number={ordersDispatched} />
        </div>

          <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
            <DashboardBox
              heading={'Available Inventory'}
              number={`${totalInventoryLeft} Kgs`}
            />
          </div>
      {/* <div className="current-status-ctn row"> */}
       
   {/* </div> */}
      
      </div>
    </div>
    
  );
};

export default Dashboard;
