import React, { useState , useEffect } from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import { Link } from 'react-router-dom'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import "./CustomersPage.css"
import ImportBtn from '../../../components/Buttons/Import/ImportBtn'
import { useCustomerContext } from '../../../components/Context/CustomerContext'
import { useNavigate } from 'react-router-dom'
import { BiWallet } from "react-icons/bi";
import { Pagination } from 'react-bootstrap'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from 'react-bootstrap'
import { getAllCustomer , getWalletTransactions} from '../../../services/CustomerService'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAllOrders } from '../../../services/OrderService'

const CustomersPage = () => {

    const navigate = useNavigate()

    // const { customers ,setCustomer } = useCustomerContext();

    const [customers,setCustomer] = useState([])
    const [orders, setOrders] = useState([]); 
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getAllCustomer();
            // console.log(data)
            setCustomer(data.data)
            setFilteredData(data.data)
          } catch (error) {
            console.error('Error fetching Customers:', error);
          }
        };
      
      fetchData(); 
    }, []); 


    const handleRowClick = (index) => {
        navigate('/add-customer', { state: { index ,customers} });
      };

      let active = 2;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
  }



    
  const handleDelete = (index) => {
    setCustomer(customers.filter((_, i) => i !== index));
  };

  const handleDuplicate = (index) => {
    setCustomer([customers[index],...customers]);
  };


const [walletBalances, setWalletBalances] = useState({});
const calculateWallet = async (id) => {
  console.log("Fetching transactions...");

  try {
    const data = await getWalletTransactions(id); // Fetch transactions
    const transactions = data || []; // Extract transaction array from API response
  
    if (transactions.length > 0) {
      const total = transactions.reduce((acc, item) => {
        return item.type === "CREDIT"
          ? acc + parseFloat(item.amount)
          : acc - parseFloat(item.amount);
      }, 0);
      return total; // Return the calculated total
    } else {
      return 0; // Return 0 if there are no transactions
    }
  } catch (error) {
    console.error("Error loading transactions:", error);
    return 0; // Return 0 in case of an error
  }
};

useEffect(() => {
  const fetchWallets = async () => {
    const balances = {};
    for (const customer of customers) {
      balances[customer.customerId] = await calculateWallet(customer.customerId);
    }
    setWalletBalances(balances);
  };

  fetchWallets();
}, [customers])

const getCustomerOrderStats = (customerId) => {
  const customerOrders = orders.filter(order => order.customer.id === customerId);

  const totalOrders = customerOrders.length;
  const lastOrderDate = customerOrders.length > 0
    ? new Intl.DateTimeFormat("en-GB").format(new Date(
        Math.max(...customerOrders.map(order => new Date(order.createdAt)))
      ))
    : "No order"; // Default if no orders

  return { totalOrders, lastOrderDate };
};



const exportToExcel = () => {
  if (!customers || !customers.length) {
    alert("No customer customers available for export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(
    customers.map(customer => {
      const { totalOrders, lastOrderDate } = getCustomerOrderStats(customer.customerId)
      return {
      "Customer Name": customer.customerName,
      "City": customer.addresses[0]?.city || "N/A",
      "Wallet Balance": walletBalances[customer.customerId] !== undefined ? walletBalances[customer.customerId] : "N/A",
      "Address":customer.addresses[0].customerAddress,
      "Email":customer.email,
      "Company":customer.company,
    "Calling Number":customer.phoneNumber,
      "WhatsApp Number":customer.whatsappNumber,
      "PAN":customer.panNumber,
      'GST Number':customer.gstNumber,
      "Total Orders": totalOrders,
      "Last Order": lastOrderDate || "N/A",
    }})
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(dataBlob, "Customers_List.xlsx");
};

const fetchOrders = async () => {
  try {
      const data = await getAllOrders();
      setOrders(data);
  } catch (error) {
      console.error("Failed to fetch orders", error);
  }
};

useEffect(() => {
  fetchOrders();
}, []);

const handleFilterChange = (filter, value) => {
  const lowercasedValue = value.toLowerCase();

  const filtered = customers.filter((item) => {
    if (filter === "City") {
        return item.addresses.some(address => 
            address.city && address.city.toLowerCase().includes(lowercasedValue)
        );
    }
    if (filter === "Customer") {
        return item.customerName.toLowerCase().includes(lowercasedValue);
    }
    return true;
});

  setFilteredData(filtered);
  };

  return (
    <div className='customer-page'>
          <div className='top d-flex justify-content-between mb-2'>
            <h4 style={{fontSize:'1.2rem'}}>Customers</h4>

            <div className='d-flex gap-2'>
                <ExportBtn onClick={exportToExcel}></ExportBtn>

                {/* <ImportBtn></ImportBtn> */}

                <Link to={'/add-customer'}>
                <AddBtn text={"Add New"}></AddBtn>
                </Link>
            </div>

        </div>


        <div className='d-flex gap-2 filter-sec'>
            <div className='w-75'>
                <ProductFilter 
                    filterOptions={["City", "Customer"]} 
                    onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
                />
            </div>
         
            <div className='w-25'>
                <StatusFilter status={'Active'}></StatusFilter> 
            </div>
        </div>


        <div className='table-ctn'>
            <Table hover>
                <thead>
                    <tr>
                        <th style={{ verticalAlign: 'middle'}} >Name</th>
                        <th style={{ verticalAlign: 'middle'}} >Email</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Location</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Wallet</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Orders</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Last Order</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} >Status</th>
                        <th style={{width:'1rem'}}></th>
                    </tr>
                </thead>
                <tbody>
            {filteredData.map((customer, index) => {
              const { totalOrders, lastOrderDate } = getCustomerOrderStats(customer.customerId);

              return (
                <tr key={index} style={{ cursor: "pointer" }} onClick={() => handleRowClick(index)}>
                  <td style={{ verticalAlign: 'middle'}} >{customer.customerName}</td>
                  <td style={{ verticalAlign: 'middle'}} >{customer.email}</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle'}} >{customer.addresses[0]?.city || ""}</td>
                  <td style={{ color: "#3CAA82", textAlign: 'center', verticalAlign: 'middle' }}>
                    {walletBalances[customer.customerId] !== undefined ? walletBalances[customer.customerId] : "Loading..."}
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle'}} >{totalOrders}</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle'}} >{lastOrderDate}</td>
                  <td style={{ justifyItems: 'center', alignContent:'center'}}>
                    <div style={{backgroundColor:customer.customerStatus.toLowerCase() === 'active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:customer.customerStatus.toLowerCase()==='active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'6rem' ,padding: '4px'}}>
                    {customer.customerStatus}
                    </div>
                  </td>
                  <td>
                    <Dropdown align="end" style={{ zIndex: 10 }}>
                        <Dropdown.Toggle  variant="light" id="dropdown-basic" className='border border-0'>
                        <BsThreeDotsVertical />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleDuplicate(index)}>Duplicate</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(index)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </td>
                </tr>
              );
            })}
          </tbody>
            
            </Table>

            <div className='d-flex justify-content-end mt-2'>
            <Pagination>{items}</Pagination>
            </div>


            <div className="data-cards">
         {filteredData.map((customer,index) => {
            const { totalOrders, lastOrderDate } = getCustomerOrderStats(customer.customerId);
          return(
          <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{customer.customerName}</h3>
                 <p> 
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:'#D1FAE5',border:'1px solid' ,borderColor:'#6EE7B7',borderRadius:'0.2rem',textAlign:'center',width:'4rem' ,color:'#00A65E'}}>
                      ₹ {walletBalances[customer.customerId] !== undefined ? walletBalances[customer.customerId] : "Loading..."} 
                    </div>
                </p>
            </div>

          
            
            <p><strong></strong> {customer.phoneNumber}</p>
    
         

            <p className='fw-medium'><strong></strong> {customer.addresses[0]?.city || "N/A"}</p>

            <p className='text-body-tertiary'>Last Order on {lastOrderDate}</p>

           
          </div>
          )
        }
        )}
      </div>




        </div>



    </div>
  )
}

export default CustomersPage