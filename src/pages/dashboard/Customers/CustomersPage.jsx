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
import { LuDot } from "react-icons/lu";
import { getAllOrders } from '../../../services/OrderService'
import Toast from '../../../components/Toast/Toast'

const CustomersPage = () => {

    const navigate = useNavigate()

    const [customers, setCustomer] = useState([])
    const [orders, setOrders] = useState([]); 
    const [filteredData, setFilteredData] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Customer');
    const [selectedStatus, setSelectedStatus] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getAllCustomer();
            console.log('Customer data:', data);
            setCustomer(data.data)
            setFilteredData(data.data)
          } catch (error) {
            console.error('Error fetching Customers:', error);
          }
        };
      
        fetchData(); 
    }, []); 

    // Apply filters whenever filter states or customer data changes
    useEffect(() => {
        if (customers.length > 0) {
            applyCombinedFilter(selectedFilter, searchTerm, selectedStatus);
        }
    }, [customers, selectedFilter, searchTerm, selectedStatus]);

    const handleRowClick = (index) => {
        // Find the original index in customers array
        const originalIndex = customers.findIndex(customer => customer === filteredData[index]);
        navigate('/add-customer', { state: { index: originalIndex, customers} });
    };

    const handleDelete = (index) => {
        // Get the actual customer from filteredData and find its index in customers
        const customerToDelete = filteredData[index];
        const originalIndex = customers.findIndex(customer => customer === customerToDelete);
        
        if (originalIndex !== -1) {
            const updatedCustomers = customers.filter((_, i) => i !== originalIndex);
            setCustomer(updatedCustomers);
        }
    };

    const handleDuplicate = (index) => {
        // Get the actual customer from filteredData
        const customerToDuplicate = filteredData[index];
        setCustomer([customerToDuplicate, ...customers]);
    };

    const [walletBalances, setWalletBalances] = useState({});
    
    const calculateWallet = async (id) => {
        console.log("Fetching transactions...");

        try {
            const data = await getWalletTransactions(id);
            const transactions = data || [];
        
            if (transactions.length > 0) {
                const total = transactions.reduce((acc, item) => {
                    return item.type === "CREDIT"
                        ? acc + parseFloat(item.amount)
                        : acc - parseFloat(item.amount);
                }, 0);
                return total;
            } else {
                return 0;
            }
        } catch (error) {
            console.error("Error loading transactions:", error);
            return 0;
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

        if (customers.length > 0) {
            fetchWallets();
        }
    }, [customers]);

        const getCustomerOrderStats = (customerId) => {
            const customerOrders = orders.filter(order => order.customer.id === customerId);

            const totalOrders = customerOrders.length;

            let lastOrderDate = "No order";
            
            if (totalOrders > 0) {
                // Find the most recent order by comparing timestamps
                const mostRecentOrder = customerOrders.reduce((latest, current) => {
                    const latestDate = new Date(latest.createdAt);
                    const currentDate = new Date(current.createdAt);
                    return currentDate > latestDate ? current : latest;
                });

                // Format the date using the same function as OrderTable
                lastOrderDate = formatDateToIST(mostRecentOrder.createdAt);
            }

            return { totalOrders, lastOrderDate };
        };

        // Add the formatDateToIST function to CustomersPage (same as in OrderTable)
        const formatDateToIST = (dateStr) => {
            // Trim microseconds to avoid browser inconsistencies
            const trimmedDateStr = dateStr.split('.')[0] + 'Z'; // ensures it's treated as UTC
            const utcDate = new Date(trimmedDateStr);
            
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
        
    const exportToExcel = () => {
        const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
        };
        
        if (!customers || !customers.length) {
            showToast("No customer customers available for export.", "error");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(
            customers.map(customer => {
                const { totalOrders, lastOrderDate } = getCustomerOrderStats(customer.customerId)
                return {
                    "Customer Name": customer.customerName,
                    "City": customer.addresses[0]?.city || "N/A",
                    "Wallet Balance": walletBalances[customer.customerId] !== undefined ? walletBalances[customer.customerId] : "N/A",
                    "Address": customer.addresses[0]?.customerAddress || "N/A",
                    "Email": customer.email,
                    "Company": customer.company,
                    "Calling Number": customer.phoneNumber,
                    "WhatsApp Number": customer.whatsappNumber,
                    "PAN": customer.panNumber,
                    'GST Number': customer.gstNumber,
                    "Total Orders": totalOrders,
                    "Last Order": lastOrderDate || "N/A",
                    "Status": customer.customerStatus
                }
            })
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
        console.log('Filter changed:', filter, value);
        setSelectedFilter(filter);
        setSearchTerm(value || '');
    };

    const handleStatusChange = (status) => {
        console.log('Status changed:', status);
        setSelectedStatus(status || 'All');
    };

    const applyCombinedFilter = (filter, searchValue, status) => {
        console.log('Applying combined filter:', { filter, searchValue, status });
        
        if (!customers || customers.length === 0) {
            setFilteredData([]);
            return;
        }

        const lowercasedValue = searchValue?.toLowerCase() || '';

        const filtered = customers.filter((customer) => {
            // Search filter
            let matchesSearch = true;
            if (searchValue && searchValue.trim() !== '') {
                if (filter === "City") {
                    matchesSearch = customer.addresses.some(address => 
                        address.city && address.city.toLowerCase().includes(lowercasedValue)
                    );
                } else if (filter === "Customer") {
                    matchesSearch = customer.customerName.toLowerCase().includes(lowercasedValue);
                }
            }

            // Status filter
            const customerStatus = customer.customerStatus?.toLowerCase() || '';
            const filterStatus = status?.toLowerCase() || 'all';
            const matchesStatus = filterStatus === 'all' || customerStatus === filterStatus;

            const result = matchesSearch && matchesStatus;
            
            // Debug log for first few items
            if (customers.indexOf(customer) < 3) {
                console.log(`Customer ${customer.customerName}:`, {
                    matchesSearch,
                    matchesStatus,
                    result,
                    customerStatus,
                    filterStatus
                });
            }

            return result;
        });

        console.log(`Filtered ${filtered.length} customers from ${customers.length} total`);
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginatedCustomers = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const paginationItems = [];

    if (totalPages >= 1) {
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
        <div className='customer-page'>
            <div className='top d-flex justify-content-between align-items-center mt-3 mb-4 '>
                <h3 className='m-0' style={{fontSize:'1.2rem'}}>Customers</h3>

                <div className='d-flex gap-2'>
                    <ExportBtn onClick={exportToExcel}></ExportBtn>

                    <Link to={'/add-customer'}>
                    <AddBtn text={"Add New"}></AddBtn>
                    </Link>
                </div>
            </div>

            <div className='order-filter-cttn d-flex gap-2 mb-2 mt-3 '>
                <div className='col-sm-6 col-md-9'>
                    <ProductFilter 
                        filterOptions={["City", "Customer"]} 
                        onFilterChange={handleFilterChange}
                        searchTerm={searchTerm}
                    />
                </div>
             
                <div className='col-sm-6 col-md-3'>
                    <StatusFilter 
                        status={selectedStatus} 
                        onStatusChange={handleStatusChange}
                        statusOptions={['All', 'Active', 'Inactive']}
                    ></StatusFilter> 
                </div>
            </div>
            
            <div className='table-ctn rounded-2'>
                <Table hover>
                    <thead>
                        <tr>
                            <th style={{ verticalAlign: 'middle'}}>#ID</th>
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
                {paginatedCustomers.map((customer, index) => {
                  const { totalOrders, lastOrderDate } = getCustomerOrderStats(customer.customerId);

                  return (
                    <tr key={index} style={{ cursor: "pointer" }} onClick={(e) => !e.target.closest('.dropdown') && handleRowClick(index)}>
                      <td style={{ verticalAlign: 'middle'}}>{customer.customerId}</td>
                      <td style={{ verticalAlign: 'middle'}} >{customer.customerName}</td>
                      <td style={{ verticalAlign: 'middle'}} >{customer.email}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle'}} >{customer.addresses[0]?.city || ""}</td>
                      <td  className="wallet-balance-cell" style={{ color: "#3CAA82", textAlign: 'center', verticalAlign: 'middle' }}>
                        {walletBalances[customer.customerId] !== undefined ? (walletBalances[customer.customerId]).toFixed(0) : "Loading..."}
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle'}} >{totalOrders}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle'}} >{lastOrderDate}</td>
                      <td style={{ justifyItems: 'center', alignContent:'center'}}>
                        <div style={{backgroundColor:customer.customerStatus.toLowerCase() === 'active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:customer.customerStatus.toLowerCase()==='active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'6rem' ,padding: '4px'}}>
                        {customer.customerStatus}
                        </div>
                      </td>
                      <td>
                        <Dropdown align="end">
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

                <div className="data-cards rounded-4">
             {filteredData.map((customer,index) => {
                const { totalOrders, lastOrderDate } = getCustomerOrderStats(customer.customerId);
              return(
              <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

                <div className='d-flex justify-content-between align-items-center'>
                     <h3 className='fs-6 fw-medium	'>{customer.customerName}</h3>
                     <p> 
                       <div style={{  padding: '0.2rem 0.2rem',
                        fontSize: '0.8rem',
                        width: '7rem',
                        height: '2rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '0', backgroundColor: '#d1fae5',
                        border: '1px solid',
                        borderColor: '#6ee7b7',
                        borderRadius: '0.2rem',
                        textAlign: 'center',
                        color: '#065f46',
                        fontWeight: '500'
                        }}>
                          ₹ {walletBalances[customer.customerId] !== undefined ? walletBalances[customer.customerId] : "Loading..."} 
                        </div>
                    </p>
                </div>

              <div className="d-flex ">
                 <p className='fw-normal	'> {customer.phoneNumber}</p>
                 <span><LuDot size={25} /></span>
                 <p className="fw-normal"> {customer.addresses[0]?.city || "N/A"}</p>
                
              </div>

                <p style={{ fontSize: '0.8rem', color: '#93A3AB', fontWeight: 500 }}>Last Order on {lastOrderDate}</p>

               
              </div>
              )
            }
            )}
          </div>
            </div>

            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() =>
                            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                        }
                    />
                ))}
            </div>

            <div className='d-flex justify-content-end mt-2'>
               <Pagination>{paginationItems}</Pagination>
            </div>
        </div>
    )
}

export default CustomersPage