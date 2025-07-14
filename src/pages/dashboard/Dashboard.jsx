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
import { FiCalendar } from "react-icons/fi";
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
  const [ totalOrders, setTotalOrders] = useState(0);
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
  totalPurchaseOrders,
  totalRevenueInLacs,
  totalWeightSold,
  productSoldByCategory,
  newOrdersToFulfill,
  ordersAtManufacturer,
  ordersDispatched,
  paymentReceivableInLacs,
  newOrderReceivedWeight,
  totalInventoryLeft,
} = analytics;



  const formatNumber = (num) => {
   
    if (num >= 100000) {
        return (num / 100000).toFixed(2) + " L"; 
    }
        return num; 
};

  return (
    <div className="right-content w-100">
                    <div className="top d-flex align-items-center justify-content-between w-100 mb-2">
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
                              className="ms-2 btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                setStartDate(null);
                                setEndDate(null);
                                // No need to call fetch here — useEffect will handle it!
                              }}
                            >
                              Clear
                            </button>
                          )}



                        {showPicker && (
                          <div ref={datePickerRef} style={{ zIndex: 1000, position: "absolute", right: "0" }}>
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
                          <DashboardBox heading={'Total Purchase Order'} number={totalPurchaseOrders} />
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4 col-xl">
                          <DashboardBox heading={'Total Revenue (Lacs)'} number={`₹ ${formatNumber(totalRevenueInLacs)}`} />
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4 col-xl">
                          <DashboardBox heading={'Total Weight Sold'} number={`${formatNumber(totalWeightSold)} Kgs`} />
                        </div>
                    </div>

      <div className="bg-white graph-ctn shadow-sm p-3">
        <h5 style={{fontSize:'1.2rem'}}>Product Sold (Kgs)</h5>
       <h5 className="mb-3" style={{fontSize:'1rem'}}> <span className="text-success me-1">+3.4%</span>from last period</h5>
      <ProductSoldGraph productData={productSoldByCategory} />

      </div>


      <div className="current-status-ctn row">
        <h3>Current Status</h3>
        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
          <DashboardBox heading={'New Orders To Fulfill'} number={newOrdersToFulfill} />
        </div>
        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
          <DashboardBox heading={'Orders at Manufacturer'} number={ordersAtManufacturer} />
        </div>
        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
          <DashboardBox heading={'Orders Shipped'} number={ordersDispatched} />
        </div>
     

      {/* <div className="current-status-ctn row"> */}
       
       <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
    <DashboardBox
      heading={'Payment Receivable'}
      number={`₹ ${formatNumber(paymentReceivableInLacs)} Lacs`}
    />
  </div>
  <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
    <DashboardBox
      heading={'New Order Received'}
      number={`${formatNumber(newOrderReceivedWeight)} Kgs`}
    />
  </div>
  <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4">
    <DashboardBox
      heading={'Total Inventory Left'}
      number={`${formatNumber(totalInventoryLeft)} Kgs`}
    />
  </div>
   {/* </div> */}
       
      </div>
    </div>
  );
};

export default Dashboard;
