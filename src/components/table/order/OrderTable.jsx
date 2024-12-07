import React ,{useState} from 'react'
import "./OrderTable.css"
import { useOrderContext } from '../../Context/OrderContext';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';

import { LuDot } from "react-icons/lu";
import ModalAssign from '../../Modal/ModalAssign';
const OrderTable = () => {

  const { orders } = useOrderContext();

  const [showModalAssign,setShowModalAssign] = useState(false)

  const navigate = useNavigate();

  const handleRowClick = (order) => {
    navigate('/create-order', { state: { order } });
  };

    const statusClassMap = {
      'New Order': 'blue',
      Delivered: 'green',
      Shipped: 'yellow',
      Rejected: 'red',
      'In Transit': 'grey',
    };
   
    
    
  return (
    <div className='order-table table-ctn-order'>
        <Table hover>
         <thead>
            <tr>
                <th>
                   Order ID
                </th>

                <th>
                  Date
                </th>

                <th>
                   Customer
                </th>

                <th>
                   Quantity
                </th>

                <th>
                   Weight
                </th>

                <th>
                   Amount
                </th>

                <th>
                   Payment
                </th>

                <th>
                  Order Status
                </th>

                <th>
                   Manufacturer
                </th>

            </tr>
         </thead>

            <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} style={{cursor:'pointer'}} onClick={() => handleRowClick(order)}>
                    <td style={{fontWeight:500}}>{order.orderId}</td>
                    <td>{order.date}</td>
                    <td>{order.customer}</td>
                    <td>{order.quantity}</td>
                    <td>{order.weight}</td>
                    <td>{order.amount}</td>
                    <td>
                        <div className={order.payment==='Paid' ? 'green' : 'grey'}>
                           {order.payment}
                        </div>
                    </td>
                    <td>
                        <div className={statusClassMap[order.orderStatus]}>  
                            {order.orderStatus}
                        </div>
                    </td>
                    <td>
                        <div className="manufacturer" >
                           {order.manufacturer ? (
                           <span >{order.manufacturer}</span>
                           ) : (
                           <button onClick={(e)=> 
                            {
                              e.stopPropagation()
                              setShowModalAssign(true)
                            }
                          } className="assign-button btn btn-primary w-75">Assign</button>
                           )}
                        </div>
                    </td>
                  </tr>
            ))}
            </tbody>
        </Table>
        
        <ModalAssign
          show={showModalAssign}
          handleClose={()=> setShowModalAssign(false)}
        ></ModalAssign>

        <div className="order-cards">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
               <div className='d-flex justify-content-between'>
                  <h4>{order.date}</h4>
                  <h3>{order.amount}</h3>
               </div>

               <h3>#{order.orderId}</h3>
              
              <div className='d-flex justify-content-between w-75'>
               
                  <p>{order.customer}</p> <span><LuDot  size={25}/></span>
                  <p>{order.quantity} Quantity</p><span><LuDot  size={25}/></span>
                  <p>{order.weight}</p>
              
                 
                
              </div>

              <div className='d-flex justify-content-between'>
                  <div className='d-flex justify-content-between gap-3'>
                     <h5 className={statusClassMap[order.orderStatus]}>{order.orderStatus}</h5>
                     <h5 className={order.payment==='Paid' ? 'green' : 'grey'}>{order.payment}</h5>
                  </div>

                  <div className="manufacturer">
                           {order.manufacturer ? (
                           <span className='manufacturer-name'>{order.manufacturer}</span>
                           ) : (
                           <button onClick={(e)=>{
                            e.preventDefault()
                            setShowModalAssign(true)
                           } } className="assign-button btn btn-primary p-1">Assign</button>
                           )}
                  </div>
              </div>

             
            </div>
          ))}
        </div>


    </div>
  )
}

export default OrderTable