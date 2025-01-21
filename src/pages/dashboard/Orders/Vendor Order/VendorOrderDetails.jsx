import React from "react";
import { useParams } from "react-router-dom";
import { useVendorOrderContext } from "../../../../components/Context/VendorOrderContext";
import { LuFileDown } from "react-icons/lu";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const VendorOrderDetails = () => {
  
  const navigate = useNavigate()
  const { orderId } = useParams();
  const { orders } = useVendorOrderContext();
  const order = orders.find((o) => o.orderId === orderId);

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="order-details">
       <div className='top d-flex justify-content-between mb-2 mt-2' style={{cursor:'pointer'}}>
                    <div className="d-flex gap-2">
                  <span onClick={() => navigate(-1)}><IoArrowBackOutline size={25}/></span>
                
                  <h5>Create Order</h5>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn bg-secondary-subtle">Print</button>
                    <button className="btn bg-secondary-subtle">Share</button>
                  </div>

        </div>

      <div className="row gx-2">  
      <div className=" mt-2 col-lg-5 col-md-12">
        <div className="bg-white p-2 rounded mt-2">
        <div className='d-flex justify-content-between'>
            <h6>Order for: <span className='text-primary'>Vishal Mega Mart</span></h6>

            <div className='px-2 rounded' style={{border:'1px solid #93C5FD', backgroundColor:'#DBEAFE',color:'#1E40AF'}}>
                <p className='m-0'>Spinner</p>
            </div>

            </div>
          <table className="w-100 mt-2 table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Weight</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.details.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.productName}</td>
                  <td>{detail.size}</td>
                  <td>{order.weight}</td>
                  <td>₹51,250</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className='bg-white rounded  p-3 mt-2'>
        
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
        
                           
                           
                    </div>


       

        </div>

        <div className='mt-2 col-lg-7 col-md-12'>
                    

          <div className="bg-white p-2 rounded mt-2">
        <div className='d-flex justify-content-between'>
            <h6>Order for: <span className='text-primary'>Amber NX</span></h6>

            <div className='px-2 rounded' style={{border:'1px solid #FCD34D', backgroundColor:'#FEF3C7',color:'#92400E'}}>
                <p className='m-0'>Dyer</p>
            </div>

            </div>
          <table className="w-100 mt-2 table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Quality</th>
                <th>Color</th>
                <th>Weight</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.details.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.productName}</td>
                  <td>{detail.size}</td>
                  <td>Premium</td>
                  <td>{detail.color}</td>
                  <td>{order.weight}</td>
                  <td>₹51,250</td>
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
        
                        <table className='w-100 mt-2'>
                            
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
        
                      
        
                    </div>
        
        
        
        
              </div>
              </div>
    
    </div>
  );
};

export default VendorOrderDetails;
