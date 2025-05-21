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

const VendorOrder = () => {

    const navigate = useNavigate()

    const { order } = useVendorOrderContext();
    const [orders, setOrders] = useState([]);
    

    const [filteredData, setFilteredData] = useState([]); 


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
        const lowercasedValue = value.toLowerCase().trim();
      
        if (!lowercasedValue) {
          setFilteredData(orders);
          return;
        }
      
        const filtered = orders.filter((item) => {
          if (filter === "Product Id") return item.id.toString().includes(value);
          if (filter === "Product Name") return item.productName.toLowerCase().includes(lowercasedValue);
          return true;
        });
      
        console.log(filtered);
        setFilteredData(filtered);
      };


      useEffect(() => {
        const fetchOrders = async () => {
          try {
            const data = await getVendorOrder();
            setOrders(data);
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
      
      
  return (
    <div className='vendor-order'>
         <div className='top d-flex justify-content-between'>
            <h3>Vendor Orders</h3>

            <div className='btn-ctn d-flex gap-2'>
              

                <ExportBtn></ExportBtn>

                {/* <ImportBtn></ImportBtn> */}

                <Link to={'/BulkAssignPage'}>
                                    <AddBtn
                                        text={"Order to vendor"}
                                    ></AddBtn>
                                </Link>

               
            </div>
        </div>


        <div className='order-filter-ctn d-flex gap-2 mb-2 w-50 mt-3'>
          
          <ProductFilter 
                filterOptions={["Order Id", "Customer"]} 
                onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
          />
    
          <StatusFilter status={"Active"}></StatusFilter>
        </div>

        {/* <div className="table-responsive mt-3 table-ctn">
      <Table hover bordered>
        <thead className="thead-dark">
          <tr>
            <th>V.O ID</th>
            <th style={{ textAlign: 'center' }}>Date</th>
            <th style={{ textAlign: 'center' }}>Order For</th>
            <th style={{ textAlign: 'center' }}>Vendor</th>
            <th style={{ textAlign: 'center' }}>Weight</th>
            <th style={{ textAlign: 'center' }}>Amount</th>
            <th style={{ textAlign: 'center' }}>Payment</th>
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
            orders.map((order) => {
              const totalWeight = order.vendorOrderVariantResponse.reduce(
                (sum, variant) => sum + variant.vendorOrderWeight,
                0
              );

              return (
                <tr key={order.vendorOrderId} onClick={() => handleRowClick(order.correlationId)} style={{ cursor: 'pointer' }}>
              
                  <td>{order.vendorOrderId}</td>
                  <td style={{ textAlign: 'center' }}>{formatDate(order.orderDate)}</td>
                  <td style={{ textAlign: 'center' }}>{order.vendorType}</td>
                  <td style={{ textAlign: 'center' }}>{order.vendorName}</td>
                  <td style={{ textAlign: 'center' }}>{totalWeight.toFixed(2)} kg</td>
                  <td style={{ textAlign: 'center' }}>₹ {order.totalAmount.toFixed(2)}</td>
                  <td style={{ textAlign: 'center' }}>{order.status}</td>
                  <td style={{ textAlign: 'center' }}>{order.correlationId || '-'}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div> */}


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
            orders.slice().reverse().map((order) => {
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


    </div>
  )
}

export default VendorOrder