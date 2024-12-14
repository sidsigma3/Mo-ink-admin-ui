import React , {useState} from 'react'
import SearchBox from '../../../components/SearchBox/SearchBox'
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate ,useLocation } from 'react-router-dom';
import ModalOrder from '../../../components/Modal/ModalOrder';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import "./CreateOrder.css"
import ModalCustomer from '../../../components/Modal/ModalCustomer';
import { RxCross2 } from "react-icons/rx";
import { GoPencil } from "react-icons/go";
import { Button } from 'react-bootstrap';
import { IoAddCircleOutline } from "react-icons/io5";
import ModalAssign from '../../../components/Modal/ModalAssign';
import ModalInvoice from '../../../components/Modal/ModalInvoice';
import { useCustomerContext } from '../../../components/Context/CustomerContext';

const CreateOrder = () => {
    const { customers ,setCustomers} = useCustomerContext();

    const navigate = useNavigate();

    const location = useLocation();

    const order = location.state?.order || {};
   
    const [showModalOrder, setShowModalOrder] = useState(false);
    const [showModalCustomer,setShowModalCustomer] =useState(false)
    const [showModalAssign,setShowModalAssign] = useState(false)
    const [showModalInvoice,SetShowModalInvoice] =useState(false)

    const [cart, setCart] = useState([]);
    
    const [orderDetails, setOrderDetails] = useState(order?.orderDetail || []);

    // Callback to receive order details from child
    const handleReceiveOrder = (order) => {
      setOrderDetails(order);
   
    };

    const [selectedCustomer, setSelectedCustomer] = useState( customers.find((customer) => customer.name === order?.customer) || null);

    // const [customers, setCustomers] = useState([
    //     { name: 'Esthar Howard', contact: '+91 4855456781', address:'Suraj poll gate purani kekri 305404 kekri RJ, India' },
    //     { name: 'Michael Johnson', contact: '+91 9833548723', address:'Suraj poll gate purani kekri 305404 kekri RJ, India' },
    //     { name: 'Alice Williams', contact: '+91 7823412345', address:'Suraj poll gate purani kekri 305404 kekri RJ, India' },
    //     { name: 'John Doe', contact: '+91 9988776655', address:'Suraj poll gate purani kekri 305404 kekri RJ, India' },
    //     { name: 'Sarah Parker', contact: '+91 8877665544', address:'Suraj poll gate purani kekri 305404 kekri RJ, India' },
    //   ]);
    

    const handleAddCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => [newCustomer ,...prevCustomers]);
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
      };

    const handleDeselectCustomer = () => {
    setSelectedCustomer(null);
    };
    


    const products = [
        { id: 1, name: "Cotton Yarn", size: ["2/60", "2/74", "2/80","2/92"], colors: ["#FF5733", "#33FFCE", "#850713",'#3967FF','#00A65E','#000080','#030303',"#FF33A6", "#334CFF"]  ,stock: {
            "2/60": 30,  
            "2/74": 60, 
            "2/80": 90, 
            "2/92": 20   
          }},
        { id: 2, name: "Silk", size: ["2/60", "2/74", "2/80","2/92"], colors: ["#FF5733", "#33FFCE", "#850713",'#3967FF','#00A65E','#000080','#030303',"#FF33A6", "#334CFF"] ,   stock: {
            "2/60": 30,  
            "2/74": 60, 
            "2/80": 90,  
            "2/92": 20  
          } },
       
      ];
    
      const addToCart = (product) => {
        setCart([...cart, product]);
      };

      const handleWeightChange = (productId, size, colorIndex, weight) => {
        setOrderDetails(prevOrderDetails => 
          prevOrderDetails.map(order => {
            if (order.productId === productId && order.size === size) {
              const updatedColors = order.color.map((color, index) => 
                index === colorIndex ? { ...color, weight } : color
              );
              return { ...order, color: updatedColors };
            }
            return order;
          })
        );
      };

      const statusClassMap = {
        'New Order': 'blue',
        Delivered: 'green',
        Shipped: 'yellow',
        Rejected: 'red',
        'In Transit': 'grey',
      };
      


  return (
    <div className='create-order'>
        <div className='top d-flex gap-3 mb-2 mt-2' style={{cursor:'pointer'}}>
            <span onClick={() => navigate('/orders')}><IoArrowBackOutline size={25}/></span>
           { Object.keys(order).length === 0 ? (
            <h5>Create Order</h5>

           ): (
                <div className='d-flex gap-2'>
                <h5>{order.orderId}</h5>
             
                    <p className={order.payment==='Paid' ? 'green' : 'grey'}>{order.payment}</p>
                    <p className={statusClassMap[order.orderStatus]}>{order.orderStatus}</p> 
              
                </div>
            )
           }
           
          
        </div>



        <ModalOrder
             show={showModalOrder}
             handleClose={() => setShowModalOrder(false)}
             products={products}
             addToCart={addToCart}
             onOrderCreate={handleReceiveOrder}
        >

        </ModalOrder>

        <div className='main-sec d-flex gap-2'>
            <div className='left col-xl-9 col-lg-12 col-md-12 col-sm-12'>
                <div className='products bg-white p-4 mb-3 rounded'>
                    <h5>Products</h5>
                    
                    <div className='d-flex gap-2 mb-3 mt-3'>
                    <SearchBox></SearchBox>
                    <div>
                    <button className='btn btn-primary' onClick={() => setShowModalOrder(true)}>Browse</button>
                    </div>
                    </div>
                    {orderDetails.length > 0 && (
                        <div className="order-detail">
                            {/* Table */}
                            <table className="table ">
                            {/* Table Header */}
                            <thead>
                                <tr >
                                <th className='fw-medium'>Product</th>
                                <th className='fw-medium'>Counter</th>
                                <th className='fw-medium'>Color</th>
                                <th className='fw-medium'>Weight</th>
                                <th className='fw-medium'>Total</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {orderDetails.map((order, index) => (
                                <tr key={index}>
                                    {/* Product ID */}
                                    <td>{order.productName}</td>

                                    {/* Size */}
                                    <td>
                                    <div
                                        className="badge fw-normal"
                                        style={{
                                        width: '70%',
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '1rem',
                                        backgroundColor: '#EFEFEF',
                                        border: '1px solid #B9C0CD',
                                        textAlign: 'center',
                                        color: 'black',
                                        }}
                                    >
                                        {order.size}
                                    </div>
                                    </td>

                                    {/* Colors Column */}
                                    <td>
                                    <div className="d-flex flex-wrap">
                                        {order.color.map((colorObj, colorIndex) => (
                                        <div
                                            key={colorIndex}
                                            style={{
                                            backgroundColor: colorObj,
                                            width: '25px',
                                            height: '25px',
                                            borderRadius: '50%',
                                            border: '2px solid #ccc',
                                            margin: '5px',
                                            }}
                                        ></div>
                                        ))}
                                    </div>
                                    </td>

                                    {/* Weight Inputs Column */}
                                    <td>
                                    <div className="d-flex flex-column">
                                        {order.color.map((colorObj, colorIndex) => (
                                        <input
                                            key={colorIndex}
                                            type="number"
                                            placeholder="Weight"
                                            className="rounded border-secondary-subtle mb-2 p-1 weight-input"
                                            value={colorObj.weight || ''} // Use stored weight if available
                                            onChange={(e) =>
                                            handleWeightChange(order.productId, order.size, colorIndex, e.target.value)
                                            }
                                        />
                                        ))}
                                    </div>
                                    </td>

                                    {/* Total Column */}
                                    <td>
                                    <span>{/* Insert calculation or static value */}</span>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        )}



                    <ModalAssign
                        show={showModalAssign}
                        handleClose={()=> setShowModalAssign(false)}
                    >
                    </ModalAssign>
                    {/* {orderDetails.length > 0 && (

                    <div className='d-flex justify-content-end w-100 mt-2'>
                        <button onClick={()=> setShowModalAssign(true)} className='btn btn-primary btn-sm'>Assign</button>
                    </div>
                    )} */}
                                                
                </div>



                <div className='payment bg-white p-4 rounded'>
                    <h4>Payment</h4>

                    <div  className='container border p-3 rounded mb-3'>

                        <div className='d-flex justify-content-between'>
                            <h5>Subtotal</h5>
                            <h5>₹0.00</h5>
                        </div>

                        <div className='d-flex justify-content-between'>
                            <p>Search Products</p>
                            <p>₹0.00</p>
                        </div>

                        <div className='d-flex justify-content-between'>
                            <p>Add Shipping or Delivery</p>
                            <p>₹0.00</p>
                        </div>

                        <div className='d-flex justify-content-between'>
                            <p>Estimated Tax</p>
                            <p>₹0.00</p>
                        </div>


                        <div className='d-flex justify-content-between'>
                            <h5>Total</h5>
                            <h5>₹0.00</h5>
                        </div>

                    </div>
                    {orderDetails.length === 0 &&(
                         <h5>Add a Product to calculate total and view payment options</h5>
                    )}

                    <ModalInvoice
                        show={showModalInvoice}
                        handleClose={()=>SetShowModalInvoice(false)}
                    ></ModalInvoice>

                    {orderDetails.length > 0 &&(
                        <div className='d-flex justify-content-end w-100'>
                        <Button onClick={()=>SetShowModalInvoice(true)}>Send Invoice</Button>
                        </div>
                    )}
                   

                </div>
            </div>

            <div className='right col-xl-3 col-lg-12 col-md-12'>
                <div className='ctn'>
                    

                    {!selectedCustomer && (
                        
                        <div>
                        <h4>Customers</h4>
                        <DropdownButton className='drop-down mb-2' id="dropdown-light-button" title="Search or add Customer">
                        <Dropdown.Item className='d-flex align-items-center gap-3'  href="#/action-1" style={{backgroundColor:"#B9C0CD"}} onClick={() => setShowModalCustomer(true)}> 
                                <span><IoAddCircleOutline /></span>
                                Create New Customer
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                            <div>
                                <h4>Cody Fisher</h4>
                                <h5>codyFisher@gmail.com</h5>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                            <div>
                                <h4>Cody Fisher</h4>
                                <h5>codyFisher@gmail.com</h5>
                            </div>
                        </Dropdown.Item>
                        </DropdownButton>


                        <ModalCustomer
                        show={showModalCustomer}
                        handleClose={() => setShowModalCustomer(false)}
                        onSubmit={handleAddCustomer}
                        >

                        </ModalCustomer>


                    <div className='customer-list mt-3'>
                        <h4>Recent Customers</h4>
                        <ul>
                        {customers.map((customer, index) => (
                            <li key={index} onClick={() => handleSelectCustomer(customer)} style={{ cursor: 'pointer' }}>
                            <h5>{customer.name}</h5>
                            <span>{customer.phone}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                    )}

                    {selectedCustomer && (
                    <div className='selected-customer mt-2'>
                        <div className='d-flex justify-content-between align-items-center position-relative'>
                       
                        <button
                            onClick={handleDeselectCustomer}
                            style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.3rem',
                            cursor: 'pointer',
                            position:'absolute',
                            top:-3,
                            right:-4
                            }}
                            className='cross-btn'
                        >
                            <RxCross2 />
                        </button>
                        </div>

                        <div className='border-bottom mb-2'>
                            <h4>Customer</h4>
                             <p> {selectedCustomer.name}</p>
                        </div>

                        <div className='border-bottom mb-2'>
                            <h4 className='d-flex justify-content-between'>Contact Information <span><GoPencil /></span></h4>
                            <p>{selectedCustomer.email}</p>
                            <p>{selectedCustomer.phone}</p>
                        
                        </div>
                        <div>
                            <h4 className='d-flex justify-content-between'>Billing Address<span><GoPencil /></span></h4>
                            <p>{selectedCustomer.location}</p>
                        </div>
                        
                        
                        
                    </div>
                    )}

            </div>
            </div>


        </div>
    </div>
  )
}

export default CreateOrder