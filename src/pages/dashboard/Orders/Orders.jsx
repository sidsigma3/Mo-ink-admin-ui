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

const TabPanel = ({ children, value, index }) => {
    return value === index ? <div>{children}</div> : null;
  };
  


const Orders = () => {
    const [value, setValue] = useState(0);
    const orderTableRef = useRef(null);
    const [orders,setOrders] = useState([])

    const [ordersData,setOrdersData] = useState([])
    const [filteredData, setFilteredData] = useState([]); 

    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalWeightSold, setTotalWeightSold] = useState(0);
    const [totalQuantity,setTotalQuantity] =useState(0)

    useEffect(() => {
        fetchDashboardData();
      }, []);

    const fetchDashboardData = async () => {
        try {
          
          let revenue = 0;
          let weight = 0;
          let quantity = 0;

          const data = await getAllOrders()
          setOrdersData(data)
          setFilteredData(data)

          data.forEach(order => {
            revenue += order.totalAmount || 0;
            weight += order.totalWeight || 0;
            quantity += order.variants.length || 0
          });
    
          setTotalOrders(data.length);
          setTotalRevenue(revenue);
          setTotalWeightSold(weight);
          setTotalQuantity(quantity)
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };


    const handleFilterChange = (filter, value) => {
    const lowercasedValue = value.toLowerCase();

    const filtered = ordersData.filter((item) => {
        if (filter === "Order Id") return item.orderId.toString().includes(value);
        if (filter === "Customer") return item.customer.customerName.toLowerCase().includes(lowercasedValue);
        return true;
    });

    setFilteredData(filtered);
    };


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
              
                <Filter></Filter>

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

                <li className='col-lg col-md-6 col-sm-6 col-6'>
                <DashboardBox heading={'Total Order Weight'} number={'141 Kgs'}></DashboardBox>
                   
                </li>

                <li className='col-lg col-md-6 col-sm-12 col-12'>
                <DashboardBox heading={'Order to Deliver'} number={totalOrders}></DashboardBox>
                   
                </li>
            </ul>
        </div>

        <div className='order-filter-ctn d-flex gap-2 mb-2'>
          
            <ProductFilter 
                filterOptions={["Order Id", "Customer"]} 
                onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
            />
          
                <StatusFilter status={"Active"}></StatusFilter>
        </div>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs" >
            <Tab className="text-capitalize" label="Order Dashboard" />
            <Tab className="text-capitalize" label="Bulk Assign" />
            <Tab className="text-capitalize" label="Order Cart" />
            </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={value} index={0}>
            <div className="order-table-ctn">
            <OrderTable ref={orderTableRef} data={filteredData}/>
            </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <div className="bulk-assign-ctn">
          
           <BulkAssignPage setOrders={setOrders}></BulkAssignPage>
            </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
            <div className="order-cart-ctn">     
                <OrderCart orders={orders}></OrderCart>
            </div>
        </TabPanel>

       

    </div>
  )
}

export default Orders