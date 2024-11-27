import React from 'react'
import "./OrderTable.css"
// import sampleOrders from './orderData'
import { LuDot } from "react-icons/lu";
const OrderTable = () => {

   const sampleOrders = [
      {
        orderId: 'ORD12345',
        date: 'Nov 1, 3:02PM',
        customer: 'John Doe',
        quantity: 5,
        weight: '10 kg',
        amount: '₹1,500',
        payment: 'Paid',
        orderStatus: 'Delivered',
        manufacturer: '',
      },
      {
        orderId: 'ORD12346',
        date: 'Nov 1, 5:45PM',
        customer: 'Jane Smith',
        quantity: 2,
        weight: '4 kg',
        amount: '₹750',
        payment: 'Unpaid',
        orderStatus: 'New Order',
        manufacturer: '',
      },
      {
        orderId: 'ORD12347',
        date: 'Nov 2, 11:20AM',
        customer: 'Emily Johnson',
        quantity: 10,
        weight: '20 kg',
        amount: '₹3,000',
        payment: 'Paid',
        orderStatus: 'Shipped',
        manufacturer: 'TexHub',
      },
      {
        orderId: 'ORD12348',
        date: 'Nov 3, 1:10PM',
        customer: 'Michael Brown',
        quantity: 7,
        weight: '14 kg',
        amount: '₹2,100',
        payment: 'Paid',
        orderStatus: 'In Transit',
        manufacturer: 'FiberWorks',
      },
      {
        orderId: 'ORD12349',
        date: 'Nov 3, 9:25AM',
        customer: 'Sarah Davis',
        quantity: 4,
        weight: '8 kg',
        amount: '₹1,200',
        payment: 'Unpaid',
        orderStatus: 'Rejected',
        manufacturer: 'FineTextile',
      },
      {
        orderId: 'ORD12350',
        date: 'Nov 4, 2:15PM',
        customer: 'David Wilson',
        quantity: 3,
        weight: '6 kg',
        amount: '₹900',
        payment: 'Paid',
        orderStatus: 'Delivered',
        manufacturer: 'WeaveCo',
      },
      {
        orderId: 'ORD12351',
        date: 'Nov 4, 10:00AM',
        customer: 'Emma Martinez',
        quantity: 6,
        weight: '12 kg',
        amount: '₹1,800',
        payment: 'Unpaid',
        orderStatus: 'In Transit',
        manufacturer: 'Textura Mills',
      },
      {
        orderId: 'ORD12352',
        date: 'Nov 5, 4:35PM',
        customer: 'Oliver Garcia',
        quantity: 8,
        weight: '16 kg',
        amount: '₹2,400',
        payment: 'Paid',
        orderStatus: 'Shipped',
        manufacturer: 'Thread Factory',
      },
      {
        orderId: 'ORD12353',
        date: 'Nov 6, 3:15PM',
        customer: 'Sophia White',
        quantity: 1,
        weight: '2 kg',
        amount: '₹300',
        payment: 'Unpaid',
        orderStatus: 'New Order',
        manufacturer: 'CottonCraft',
      },
      {
        orderId: 'ORD12354',
        date: 'Nov 6, 6:45PM',
        customer: 'James Thomas',
        quantity: 12,
        weight: '24 kg',
        amount: '₹3,600',
        payment: 'Paid',
        orderStatus: 'Delivered',
        manufacturer: 'LoomLine',
      },
    ];
    

    const statusClassMap = {
      'New Order': 'blue',
      Delivered: 'green',
      Shipped: 'yellow',
      Rejected: 'red',
      'In Transit': 'grey',
    };
    
  
    
   
  return (
    <div className='order-table'>
        <table>
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
                {sampleOrders.map((order) => (
                    <tr key={order.orderId}>
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
                    <td className='d-flex justify-content-start'>
                        <div className="manufacturer" >
                           {order.manufacturer ? (
                           <span >{order.manufacturer}</span>
                           ) : (
                           <button className="assign-button btn btn-primary w-100">Assign</button>
                           )}
                        </div>
                    </td>
                  </tr>
            ))}
            </tbody>
        </table>


        <div className="order-cards">
          {sampleOrders.map((order) => (
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
                           <button className="assign-button btn btn-primary">Assign</button>
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