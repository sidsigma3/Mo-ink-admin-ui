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



const CustomersPage = () => {

    const navigate = useNavigate()

    // const { customers ,setCustomer } = useCustomerContext();

    const [customers,setCustomer] = useState([])

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getAllCustomer();
            // console.log(data)
            setCustomer(data.data)
            
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



  return (
    <div className='customer-page'>
          <div className='top d-flex justify-content-between mb-2'>
            <h4 style={{fontSize:'1.3rem'}}>Customers</h4>

            <div className='d-flex gap-2'>
                <ExportBtn></ExportBtn>

                <ImportBtn></ImportBtn>

                <Link to={'/add-customer'}>
                <AddBtn text={"Add New"}></AddBtn>
                </Link>
            </div>

        </div>


        <div className='d-flex gap-2 filter-sec'>
            <div className='w-75'>
                <ProductFilter></ProductFilter>
            </div>
         
            <div className='w-25'>
                <StatusFilter status={'Active'}></StatusFilter> 
            </div>
        </div>


        <div className='table-ctn'>
            <Table hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Wallet</th>
                        <th>Orders</th>
                        <th>Last Order</th>
                        <th style={{width:'1rem'}}></th>
                    </tr>
                </thead>
                <tbody>
            {customers.map((customer, index) => (
              <tr key={index} onClick={(e) => !e.target.closest('.dropdown') && handleRowClick(index)} style={{ cursor: "pointer" }}>
                <td>{customer.customerName}</td>
                <td>{customer.addresses[0].city}</td>
                <td style={{ color: '#3CAA82' }}>
                {walletBalances[customer.customerId] !== undefined 
                  ? walletBalances[customer.customerId] 
                  : "Loading..."}
                </td>
                <td>{customer.totalOrders}</td>
                <td>{customer.lastOrder}</td>
                <td>
                    <Dropdown>
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
            ))}
          </tbody>

            </Table>

            <div className='d-flex justify-content-end mt-2'>
            <Pagination>{items}</Pagination>
            </div>


            <div className="data-cards">
         {customers.map((item,index) => (
          <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{item.name}</h3>
                 <p> 
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:'#D1FAE5',border:'1px solid' ,borderColor:'#6EE7B7',borderRadius:'0.2rem',textAlign:'center',width:'100%' ,color:'#00A65E'}}>
                      {/* <span><BiWallet /></span>      {item.wallet} */}
                    </div>
                </p>
            </div>

          
            
            <p><strong></strong> {item.phone}</p>
    
         

            <p className='fw-medium'><strong></strong> {item.location}</p>

            <p className='text-body-tertiary'>Last Order on {item.lastOrder}</p>

           
          </div>
        ))}
      </div>




        </div>



    </div>
  )
}

export default CustomersPage