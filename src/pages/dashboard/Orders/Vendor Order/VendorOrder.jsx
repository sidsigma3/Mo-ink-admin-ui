import React ,{useState}from 'react'
import ImportBtn from '../../../../components/Buttons/Import/ImportBtn'
import ExportBtn from '../../../../components/Buttons/Export/ExportBtn'
import ProductFilter from '../../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { useVendorOrderContext } from '../../../../components/Context/VendorOrderContext'
import { LuFileDown } from "react-icons/lu";
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AddBtn from '../../../../components/Buttons/Add/AddBtn'
import "./VendorOrder.css"
import { useNavigate } from 'react-router-dom'

const VendorOrder = () => {

    const navigate = useNavigate()

    const { orders } = useVendorOrderContext();

    const [filteredData, setFilteredData] = useState([]); 

    const handleRowClick = (orderId) => {
        navigate(`/vendor-order-details/${orderId}`);
      };


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


  return (
    <div className='vendor-order'>
         <div className='top d-flex justify-content-between'>
            <h3>Vendor Orders</h3>

            <div className='btn-ctn d-flex gap-2'>
              

                <ExportBtn></ExportBtn>

                <ImportBtn></ImportBtn>

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


        <div className="table-responsive mt-3 table-ctn">
        <Table hover>
          <thead className="thead-dark">
            <tr>
              <th>V.O ID</th>
              <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Date</th>
              <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Order For</th>
              <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Vendor</th>
              <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Weight</th>
              <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Amount</th>
              <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Payment</th>
              <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Inovice</th>
             
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}onClick={() => handleRowClick(order.orderId)} style={{ cursor: "pointer" }}>
                <td style={{ verticalAlign: 'middle'}}>{order.orderId}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.date}</td>
                <td style={{ justifyItems: 'center', alignContent:'center'}}>
                    <div 
                    style={{
                        padding: '4px',
                        border:'1px solid',borderRadius:'0.2rem',textAlign:'center',width:'6rem', 
                        backgroundColor:order.orderFor === 'Spinner' ? '#DBEAFE' : '#FEF3C7',
                        borderColor:order.orderFor === 'Spinner' ? '#93C5FD' : '#FCD34D' ,
                        color : order.orderFor === 'Spinner' ? '#1E40AF' : '#92400E' ,
                    }}
                    >
                    {order.orderFor}
                </div>
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.customer}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.weight}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.amount}</td>
                <td style={{ justifyItems: 'center', alignContent:'center'}}>
                    <div style={{
                        padding: '4px',
                        border:'1px solid',borderRadius:'0.2rem',textAlign:'center',width:'6rem', 
                        backgroundColor:order.payment === 'Paid' ? '#D1FAE5' : '#F3F4F6',
                        borderColor:order.payment === 'Paid' ? '#6EE7B7' : '#D1D5DB' ,
                        color : order.payment === 'Paid' ? '#41b788' : '#3f3c3c' ,
                    }}>
                    {order.payment}
                    </div>

                </td>
                <td  style={{ justifyItems: 'center', alignContent:'center'}}>
                <div 
                   className="bg-secondary-subtle rounded-circle p-1 text-white d-flex justify-content-center align-items-center"
                     style={{ width: '40px', height: '40px' }}
                   >
                   <LuFileDown size={20} />
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
            </Table>
      </div>


    </div>
  )
}

export default VendorOrder