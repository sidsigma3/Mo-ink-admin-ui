import React from 'react'
import ImportBtn from '../../../../components/Buttons/Import/ImportBtn'
import ExportBtn from '../../../../components/Buttons/Export/ExportBtn'
import ProductFilter from '../../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { useVendorOrderContext } from '../../../../components/Context/VendorOrderContext'
import { LuFileDown } from "react-icons/lu";
import { Table } from 'react-bootstrap'
import "./VendorOrder.css"
import { useNavigate } from 'react-router-dom'

const VendorOrder = () => {

    const navigate = useNavigate()

    const { orders } = useVendorOrderContext();

    const handleRowClick = (orderId) => {
        navigate(`/vendor-order-details/${orderId}`);
      };


  return (
    <div className='vendor-order'>
         <div className='top d-flex justify-content-between'>
            <h3>Vendor Orders</h3>

            <div className='btn-ctn d-flex gap-2'>
              

                <ExportBtn></ExportBtn>

                <ImportBtn></ImportBtn>

               
            </div>
        </div>


        <div className='order-filter-ctn d-flex gap-2 mb-2 w-50 mt-3'>
          
          <ProductFilter></ProductFilter>
    
          <StatusFilter status={"Active"}></StatusFilter>
        </div>


        <div className="table-responsive mt-3 table-ctn">
        <Table hover>
          <thead className="thead-dark">
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Order For</th>
              <th>Vendor</th>
              <th>Weight</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>P.O.</th>
             
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}onClick={() => handleRowClick(order.orderId)} style={{ cursor: "pointer" }}>
                <td>{order.orderId}</td>
                <td>{order.date}</td>
                <td>
                    <div 
                    style={{
                        padding:'0.2rem 0.4rem',
                        border:'1px solid',borderRadius:'0.2rem',textAlign:'center',width:'4rem',
                        backgroundColor:order.orderFor === 'Spinner' ? '#DBEAFE' : '#FEF3C7',
                        borderColor:order.orderFor === 'Spinner' ? '#93C5FD' : '#FCD34D' ,
                        color : order.orderFor === 'Spinner' ? '#1E40AF' : '#92400E' ,
                    }}
                    >
                    {order.orderFor}
                </div>
                </td>
                <td>{order.customer}</td>
                <td>{order.weight}</td>
                <td>{order.amount}</td>
                <td>
                    <div className={order.payment === "Paid" ? "green" : "grey"}>
                    {order.payment}
                    </div>
                </td>
                <td>
                   <div className='bg-secondary-subtle rounded-circle p-1 text-white w-50'><LuFileDown size={20}/></div>
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