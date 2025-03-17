import React , {useState , useEffect } from "react";
import { LuCalendarSearch } from "react-icons/lu";
import "./Dashboard.css";
import DashboardBox from "../../components/DashboardBox/DashboardBox";
import ProductSoldGraph from "../../components/Analylitcs/Graph/ProductSoldGraph";
import Filter from "../../components/Filter/DayFilter/Filter";
import { getAllCustomer } from "../../services/CustomerService";
import { getAllOrders } from "../../services/OrderService";

const Dashboard = () => {

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalWeightSold, setTotalWeightSold] = useState(0);
  const [toDispatch,setToDispatch] = useState(0)
  const [toVendor,setToVendor] = useState(0)
  const [fromVendor,setFromVendor] = useState(0)
  const [newOrder,setNewOrder] = useState(0)

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      
      const customerRes = await getAllCustomer()
      setTotalCustomers(customerRes.data.length);

  
      const orders = await getAllOrders()
      
      let revenue = 0;
      let weight = 0;
      let toDispatch = 0
      let toVendor = 0
      let fromVendor = 0
      let newOrder = 0

      orders.forEach(order => {
        revenue += order.totalAmount || 0;
        weight += order.totalWeight || 0;
        

        if (order.status === 'New Order') {
          newOrder += 1;
        } else if (order.status === 'Send to Vendor') {
          toVendor += 1;
        } else if (order.status === 'Dispatch from Vendor') {
          fromVendor += 1;
        } else if (order.status !== 'Delivered' && order.status!=='Order Cancelled') {
          toDispatch += 1; // This will count all non-delivered orders that don't fall into the above categories
        }

      });

      console.log(toDispatch,toVendor,fromVendor,newOrder)

      setNewOrder(newOrder)
      setFromVendor(fromVendor)
      setToVendor(toVendor)
      setToDispatch(toDispatch)
      setTotalOrders(orders.length);
      setTotalRevenue(revenue);
      setTotalWeightSold(weight);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };


  const formatNumber = (num) => {
   
    if (num >= 100000) {
        return (num / 100000).toFixed(2) + " L"; 
    }
        return num; 
};

  return (
    <div className="right-content w-100">
                    <div className="top d-flex justify-content-between w-100 mb-2">
                        <h3>Dashboard</h3>

                        {/* <div className="filter-ctn d-flex">
                        <button>
                            <span>
                            <LuCalendarSearch size={20} />
                            </span>
                            Last 12 Months
                        </button>
                        </div> */}
                        <Filter></Filter>
                    </div>

                    <div className="info-ctn row">
                        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
                        <DashboardBox  heading={'Total Visits'} number={2568}/>
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
                        <DashboardBox heading={'Total Customers'} number={totalCustomers}/>
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4 col-xl">
                        <DashboardBox heading={'Total Purchase Order'} number={totalOrders}/>
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-4 col-lg-4 col-xl">
                        <DashboardBox heading={'Total Revenue (Lacs)'} number={"₹ "+formatNumber(totalRevenue)}/>
                        </div>
                        <div className="dashboardBox-ctn col-12 col-md-4 col-lg-4 col-xl">
                        <DashboardBox heading={'Total Weight Sold'} number={'2250 Kgs'}/>
                        </div>
                    </div>

      <div className="bg-white graph-ctn shadow-sm p-3">
        <h5 style={{fontSize:'1.2rem'}}>Product Sold (Kgs)</h5>
       <h5 className="mb-3" style={{fontSize:'1rem'}}> <span className="text-success me-1">+3.4%</span>from last period</h5>
       <ProductSoldGraph></ProductSoldGraph>
      </div>


      <div className="current-status-ctn row">
        <h3>Current Status</h3>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
          <DashboardBox  heading={'New Orders To Fulfill'} number={newOrder}/>
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
          <DashboardBox heading={'Orders at Manufacturer'} number={toVendor}/>
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
          <DashboardBox heading={'Orders Received from Manufacturer'} number={fromVendor}/>
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
          <DashboardBox heading={'Orders Pending for Dispatch'} number={toDispatch}/>
        </div>
      </div>

      <div className="current-status-ctn row">
       
        <div className="dashboardBox-ctn col-6 col-md-4 col-lg">
          <DashboardBox  heading={'Payment Receivable'} number={'2.056 Lacs'}/>
        </div>
        <div className="dashboardBox-ctn col-6 col-md-4 col-lg">
          <DashboardBox heading={'New Order Received'} number={'48Kgs'}/>
        </div>
        <div className="dashboardBox-ctn col-12 col-md-4 col-lg">
          <DashboardBox heading={'Total Inventory Left'} number={'200 Kgs'}/>
        </div>
       
      </div>
    </div>
  );
};

export default Dashboard;
