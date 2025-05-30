import React ,{useState , useEffect }from 'react'
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

const VendorOrder = () => {

    const navigate = useNavigate()

    const { order } = useVendorOrderContext();
    const [orders, setOrders] = useState([]);
    
    const [searchFilter, setSearchFilter] = useState({ filter: "", value: "" });
    const [statusFilter, setStatusFilter] = useState([]);


    const [filteredData, setFilteredData] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 


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

  


    const handleFilterChange = (filter, value) => {
      setSearchFilter({ filter, value });
      applyCombinedFilters({ filter, value }, statusFilter);
    };

 const handleStatusChange = (newStatuses) => {
  setStatusFilter(newStatuses); // This is now an array
  applyCombinedFilters(searchFilter, newStatuses);
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




      useEffect(() => {
        const fetchOrders = async () => {
          try {
            const data = await getVendorOrder();
            setOrders(data);
            setFilteredData(data)
          } catch (error) {
            console.error("Failed to fetch vendor orders:", error);
          }
        };
    
        fetchOrders();
      }, []);

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

const totalOrders = uniquePOs.length;
const totalQuantity = uniquePOs.reduce((sum, order) => sum + order.weight, 0).toFixed(0);
const totalAmount = uniquePOs.reduce((sum, order) => sum + order.amount, 0).toFixed(0);
const totalReceived = uniquePOs.filter(order => order.status === 'RECEIVED').length;
const totalPending = uniquePOs.filter(order => order.status === 'CONFIRMED').length;



const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const paginatedData = filteredData
  .slice()
  .reverse()
  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
              <DashboardBox heading={'Total Amount'} number={`₹${totalAmount}`} />
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
                filterOptions={["PO", "Vendor"]} 
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
           paginatedData.map((order) => {
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