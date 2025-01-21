import React , { useState} from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import { IoSearchOutline } from "react-icons/io5";
import { LuFileDown } from "react-icons/lu";
import ModalBulkAssign from '../../../../components/Modal/ModalBulkAssign';
import { RiDeleteBin6Line } from "react-icons/ri";


const OrderCart = ({orders}) => {
    
    const [showModal,setShowModal] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('Spinner'); 
    
      const handleSelect = (status) => {
        setSelectedStatus(status);
      };


      const handleSendInvoice = () => {
        console.log(showModal)
        setShowModal(true)
      }


  return (
    <div>
    <div className='d-flex gap-2 mt-2 overflow-auto'>
       {orders.map((item, index) => (
        <div key={index} className='bg-white p-3 rounded'>
            <div className='d-flex justify-content-between'> 
            <h5>#item {index+1}</h5>
            <span className='text-body-tertiary'><RiDeleteBin6Line /></span>
            </div>
          <p>Product: {item.productName}</p>
          <p>Size: {item.size}</p>
          <p>Color: {item.color}</p>
          <p>Price: ₹240/Kg</p>
          <p>Qnty to order:</p>
         
          <input value={item.quantity} className='rounded border-secondary-subtle px-2'></input>
           
        
        </div>
      ))}
    </div>

      <div className='bg-white mt-2 p-2 row gx-0 gap-2'>
        
        <div className='d-flex gap-2 align-items-center col-lg-3 col-sm-12 flex-grow-1'>
        <h6 className='m-0 w-25'>Order for:</h6>
        <Dropdown onSelect={handleSelect} size='sm' className='w-75'>
            <DropdownToggle style={{width:'10rem'}} variant='light' id='dropdown-basic' className="w-100 d-flex align-items-center justify-content-between gap-2 p-2">
                <p className='m-0'>{selectedStatus}</p>
            </DropdownToggle>

            <DropdownMenu>
                <Dropdown.Item eventKey='Spinner'>Spinner</Dropdown.Item>
                <Dropdown.Item eventKey='Dyer'>Dyer</Dropdown.Item>
                <Dropdown.Item eventKey='Spinner & Dyer'>Spinner & Dyer</Dropdown.Item>
            </DropdownMenu>

        </Dropdown>
        </div>

        <div className='col-lg-4 col-sm-5 flex-grow-1'>
            <div className='d-flex justify-content-between border rounded p-2 bg-white'>
                <input type='text' placeholder='Select Spinner' className='border-0 flex-grow-1'></input>
                <span> <IoSearchOutline /></span>
            </div>
        </div>

        <div className='col-lg-4 col-sm-5 flex-grow-1'>
            <div className='d-flex justify-content-between border rounded p-2 bg-white'>
                <input type='text' placeholder='Select Dyer' className='border-0 flex-grow-1'></input>
                <span> <IoSearchOutline /></span>
            </div>
        </div>

      </div>


      <div className='row gx-2'>

      <div className='col-lg-5 col-sm-12 mt-2'> 
        <div className='bg-white p-2 rounded'>
            <div className='d-flex justify-content-between'>
            <h6>Order for: <span className='text-primary'>Vishal Mega Mart</span></h6>

            <div className='px-2 rounded' style={{border:'1px solid #93C5FD', backgroundColor:'#DBEAFE',color:'#1E40AF'}}>
                <p className='m-0'>Spinner</p>
            </div>

            </div>
           
            <table className='w-100 mt-2 table'>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Counter</th>
                        <th>Weight</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order,index)=>(
                        <tr key={index}>
                             <td>{order.productName}</td>
                             <td>{order.size}</td>
                             <td>{order.quantity}</td>
                             <td >₹51,245</td>
                        </tr>
                    ))}
                   
                </tbody>

            </table>

        </div>


        <div className='bg-white rounded p-3 mt-2'>

            <div className='d-flex justify-content-between'>
                    <h6>Payment</h6>
                   
                    <div className='bg-secondary-subtle rounded-circle p-2 text-white'><LuFileDown size={20}/></div>
                </div>

            <table className="w-100 table border rounded mt-2">
                {/* <thead className="thead-light">
                <tr>
                    <th>Description</th>
                    <th>Details</th>
                    <th>Amount</th>
                </tr>
                </thead> */}
                <tbody>
                <tr>
                    <td>Subtotal</td>
                    <td>9 Items</td>
                    <td style={{textAlign:'end'}}>₹3,07,458</td>
                </tr>
                <tr>
                    <td>Wallet Balance</td>
                    <td>₹4,116</td>
                    <td style={{textAlign:'end'}}>-₹10,000</td>
                </tr>
                <tr>
                    <td>Discounts</td>
                    <td>5%</td>
                    <td style={{textAlign:'end'}}>-₹5,000</td>
                </tr>
                <tr>
                    <td>Shipping or Delivery</td>
                    <td></td>
                    <td style={{textAlign:'end'}}>₹2,156</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan="2" className="font-weight-bold">Total</td>
                    <td className="font-weight-bold" style={{textAlign:'end'}}>₹2,12,156</td>
                </tr>
                </tfoot>
            </table>

                    <div className='d-flex justify-content-end'>
                      <button className='btn btn-primary' onClick={handleSendInvoice}>Send P.O.</button>
                    </div>
                   
            </div>



      </div>

      <ModalBulkAssign show={showModal} handleClose={()=>setShowModal(false)}></ModalBulkAssign>


      <div className='col-lg-7 col-sm-12 mt-2'>
            
            <div  className='bg-white p-2 rounded flex-grow-1'>
            
            <div className='d-flex justify-content-between'>
            <h6>Order for: <span className='text-primary'>Amber NX</span></h6>

            <div className='px-2 rounded' style={{border:'1px solid #FCD34D', backgroundColor:'#FEF3C7',color:'#92400E'}}>
                <p className='m-0'>Dyer</p>
            </div>

            </div>
            <table className='w-100 mt-2 table'>
                <thead >
                    <tr>
                        <th>Product</th>
                        <th>Counter</th>
                        <th>Quality</th>
                        <th>Color</th> 
                        <th>Weight</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order,index)=>(
                        <tr key={index}>
                             <td>{order.productName}</td>
                             <td>{order.size}</td>
                             <td>Premium</td>
                             <td>{order.color}</td>
                             <td>{order.quantity}</td>
                             <td >₹51,245</td>
                        </tr>
                    ))}
                   
                </tbody>

            </table>

        </div>



            <div className='bg-white rounded p-3 flex-grow-1 mt-2'>
                <div className='d-flex justify-content-between'>
                    <h6>Payment</h6>
                   
                    <div className='bg-secondary-subtle rounded-circle p-2 text-white'><LuFileDown size={20}/></div>
                </div>

                <table className='w-100 table border rounded mt-2'>
                    
                    <tbody>
                         <tr>
                            <td>Subtotal</td>
                            <td>items</td>
                            <td style={{textAlign:'end'}}>₹3,07,458</td>
                        </tr>
                        <tr>
                            <td>Wallet Ballance</td>
                            <td>₹4116</td>
                            <td style={{textAlign:'end'}}>-₹10,000</td>

                        </tr>

                        <tr>
                            <td>Discounts</td>
                            <td>5%</td>
                            <td style={{textAlign:'end'}}>-₹5,000</td>
                            
                        </tr>

                        <tr>
                            <td>Shipping or delivery</td>
                            <td></td>
                            <td style={{textAlign:'end'}}>₹2,156</td>
                            
                        </tr>

                        <tr>
                            <td>Total</td>
                            <td></td>
                            <td style={{textAlign:'end'}}>₹2,121,156</td>
                            
                        </tr>




                    </tbody>
                </table>

                <div className='d-flex justify-content-end'>
                    <button className='btn btn-primary' onClick={handleSendInvoice}>Send P.O.</button>
                 </div>


            </div>




      </div>

      </div>




    </div>
  )
}

export default OrderCart