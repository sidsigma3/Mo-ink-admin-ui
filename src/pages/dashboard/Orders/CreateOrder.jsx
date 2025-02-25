import React , {useState , useEffect} from 'react'
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
import { getAllProduct } from '../../../services/ProductService';
import { getAllCustomer , getWalletTransactions} from '../../../services/CustomerService';
import { Segment } from '@mui/icons-material';
import { getAllDiscount } from '../../../services/DiscountService';
import { createOrder } from '../../../services/OrderService';

const CreateOrder = () => {
   

    const navigate = useNavigate();

   

    const {state} = useLocation()

    const order =state?.order || {};

    const [showModalOrder, setShowModalOrder] = useState(false);
    const [showModalCustomer,setShowModalCustomer] =useState(false)
    const [showModalAssign,setShowModalAssign] = useState(false)
    const [showModalInvoice,SetShowModalInvoice] =useState(false)

    const [cart, setCart] = useState([]);
    
    const [productData,setProductData] = useState([])

     const [customers,setCustomer] = useState([])
    
     useEffect(() => {
            const fetchData = async () => {
              try {
                const data = await getAllCustomer();
                setCustomer(data.data)
              
              } catch (error) {
                console.error('Error fetching Customers:', error);
              }
            };
          
          fetchData(); 
        }, []); 

      useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getAllProduct();
            setProductData(data.data)
            console.log(data)
            console.log(productData)
          
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
      
        fetchData(); 
      }, []);

      const [discountData , setDiscountData] = useState([])
        
            useEffect(() => {
                const fetchData = async () => {
                  try {
                    const data = await getAllDiscount();
                    console.log(data)
                    setDiscountData(data.data)
                    
                  } catch (error) {
                    console.error('Error fetching Customers:', error);
                  }
                };
              
              fetchData(); 
            }, []); 

  
    const handleReceiveOrder = (order) => {
      setOrderDetails(order);
   
    };

    const [selectedCustomer, setSelectedCustomer] = useState(order.customer || null);

    const handleAddCustomer = (newCustomer) => {
    setCustomer((prevCustomers) => [newCustomer ,...prevCustomers]);
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
      };

    const handleDeselectCustomer = () => {
    setSelectedCustomer(null);
    };
    

      const addToCart = (product) => {
        setCart([...cart, product]);
      };




      const handleWeightChange = (productId, size, colorIndex, weight) => {
        setOrderDetails(prevOrderDetails =>
          prevOrderDetails.map(order => {
            if (order.productId === productId && order.size === size) {
              const updatedColors = order.colors.map((color, index) =>
                index === colorIndex
                  ? typeof color === "string"  // If color is a string, convert it to an object
                    ? { hexCode: color.trim(), weight }
                    : { ...color, weight } // Otherwise, just update weight
                  : color
              );
      
              return { ...order, colors: updatedColors };
            }
            return order;
          })
        );
      };
      
      
      const transformOrderToProductDetails = (order) => {
        if (!order || !order.variants) return [];
      
        // Group variants by size
        const groupedVariants = {};
      
        order.variants.forEach((variant) => {
          const { size, color, availableWeight, pricePerKg, id } = variant;
      
          if (!groupedVariants[size]) {
            groupedVariants[size] = {
              productId: order.orderId, // Assuming orderId is the productId
              productName: "Silk", // Placeholder, ideally fetched from DB or API
              size: size,
              colors: [],
              variant: {
                id: id,
                size: size,
                variants: [],
                totalWeight: 0, // Will be calculated
              },
              product: {
                productId: order.orderId,
                productName: "Silk", // Placeholder, should be dynamic
                productDescription: "VERY GOOD",
                productImage: ["null"], // Placeholder for actual images
                compareAtPrice: 223, // Placeholder
                costPerItemPerKg: 212, // Placeholder
                gstOnProduct: "23", // Placeholder
                pricePerKg: 123, // Placeholder
                availableStatus: "Active",
                groupedVariants: [],
              },
            };
          }
      
          const colorDetails = {
            colorName: color.colorName,
            hexCode: color.hexCode,
            available: availableWeight,
            price: pricePerKg,
            id: id,
            weight: "2", // Placeholder, should be dynamically calculated
          };
      
          groupedVariants[size].colors.push(colorDetails);
          groupedVariants[size].variant.variants.push(colorDetails);
          groupedVariants[size].variant.totalWeight += parseFloat(availableWeight);
        });
      
        // Convert grouped object into array and fill groupedVariants in product
        const productDetailsArray = Object.values(groupedVariants);
        productDetailsArray.forEach((item) => {
          item.product.groupedVariants = [item.variant];
        });

        console.log(productDetailsArray)
        return productDetailsArray;
      };
            


      const [orderDetails, setOrderDetails] = useState(transformOrderToProductDetails(order) || []);





      const calculateTotal = (order) => {
        return order.colors.reduce((total, colorObj) => {
          const variant = order.variant.variants.find(item => item.hexCode === colorObj.hexCode);
          return total + (variant ? variant.price * Number(colorObj.weight) : 0);
        }, 0);
      };
      


      const statusClassMap = {
        'New Order': 'blue',
        Delivered: 'green',
        Shipped: 'yellow',
        Rejected: 'red',
        'In Transit': 'grey',
      };



      const aggregateProductData = (productData) => {
        return productData.map((product) => {
          const groupedVariants = product.variants.reduce((acc, variant) => {
            const { size, color, availableWeight ,id } = variant;
      
            if (!acc[size]) {
              acc[size] = {
                id,
                size,
                variants: [],
                totalWeight: 0,
              };
            }
    
            
      
            // Add unique colors for this size
            if (!acc[size].variants.some((v) => v.colorName === color.colorName)) {
              acc[size].variants.push({
                colorName: color.colorName,
                hexCode: color.hexCode || "#ccc",
                available:variant.availableWeight,
                price:variant.pricePerKg,
                id:variant.id,
              });
            }
            
            // Accumulate availableWeight for this size
            acc[size].totalWeight += Number(availableWeight);
      
            return acc;
          }, {});
      
          // Return the aggregated product with grouped variants
          return {
            productId: product.id,
            productName: product.productName,
            productDescription: product.productDescription,
            productImage: product.productImage,
            compareAtPrice:product.productPrice?.compareAtPrice,
            costPerItemPerKg:product.productPrice?.costPerItemPerKg,
            gstOnProduct:product.productPrice?.gstOnProduct,
            pricePerKg:product.productPrice?.pricePerKg,
            availableStatus:product.availableStatus,
            groupedVariants: Object.values(groupedVariants),
          };
        });
      };
    
     
    
    
    const finalData = aggregateProductData(productData)
    const [walletBalances, setWalletBalances] = useState(0);
    const [walletDeduction, setWalletDeduction] = useState(0);

    useEffect(() => {
        const fetchWallets = async () => {
          if (selectedCustomer) {
            const totalWallet = await getWalletTransactions(selectedCustomer.id);
      
            if (totalWallet.length > 0) {
              setWalletBalances(totalWallet[totalWallet.length - 1].totalAmount);
            } else {
              setWalletBalances(0); // Fallback if the array is empty
            }
          }
        };
      
        fetchWallets();
      }, [selectedCustomer]);

      const handleWalletDeductionChange = (value) => {
        // Prevent non-numeric input
        if (!/^\d*\.?\d*$/.test(value)) return;
    
        // Allow empty input for clearing the field
        if (value === "") {
            setWalletDeduction("");
            return;
        }
    
        const amount = parseFloat(value);
        if (amount <= walletBalances) {
            setWalletDeduction(amount);
        } else {
            setWalletDeduction(walletBalances); // Restrict to max wallet balance
        }
    };

    const calculateGrandTotal = (orderDetails = []) => {
      if (!Array.isArray(orderDetails)) return 0; // Ensure orderDetails is an array
    
      return orderDetails.reduce((grandTotal, order) => {
        if (!order || !Array.isArray(order.colors) || !order.variant?.variants) {
          return grandTotal; // Skip invalid order items
        }
    
        const orderTotal = order.colors.reduce((total, colorObj) => {
          if (!colorObj) return total; // Skip invalid color objects
    
          const colorHex = typeof colorObj === "string"
            ? colorObj.trim().toLowerCase()
            : colorObj.hexCode?.trim().toLowerCase();
    
          // Ensure we have a valid colorHex
          if (!colorHex) return total;
    
          // Find the matching variant item
          const matchingItem = order.variant.variants.find(
            item => item.hexCode?.trim().toLowerCase() === colorHex
          );
    
          if (matchingItem) {
            const baseTotal = (colorObj.weight || 1) * matchingItem.price; // Default weight = 1
            const gstRate = order.product?.gstOnProduct || 0; // Get GST%
            const gstAmount = (baseTotal * gstRate) / 100;
            return total + baseTotal + gstAmount;
          }
    
          return total;
        }, 0);
    
        return grandTotal + orderTotal;
      }, 0);
    };
    
      
      
      
      const [selectedDiscount,setSelectedDiscount] = useState('Add discount code')

      const handleSelectDiscount = (value) =>{
        setSelectedDiscount(value)
      }


      console.log(orderDetails)

      const shippingCharge = (calculateGrandTotal(orderDetails) * 5) / 100;

// Calculate GST (Weighted GST Based on Product Price)
    const totalPrice = calculateGrandTotal(orderDetails); // Get total price of all items
    const totalGST = (totalPrice * (Number(orderDetails[0]?.product?.gstOnProduct) || 0)) / 100; // Apply GST from product
    const effectiveGSTPercent = Number(orderDetails[0]?.product?.gstOnProduct) || 0; // Direct GST%


    const calculateTotalAmount = () => {
        const subtotal = calculateGrandTotal(orderDetails); // Base amount
        const discount = selectedDiscount
            ? discountData.reduce((acc, discount) => {
                  if (discount.discountCode === selectedDiscount) {
                      return discount.discountType === "Percentage"
                          ? (subtotal * discount.discountValue) / 100
                          : discount.discountValue;
                  }
                  return acc;
              }, 0)
            : 0;
    
        const shippingCharge = (subtotal * 5) / 100; // 5% of subtotal
        const total = subtotal - (walletDeduction || 0) - discount + shippingCharge;
    
        return total > 0 ? total.toFixed(2) : "0.00"; // Ensures total doesn't go negative
    };

    
 
    const handleCreateOrder = async () => {
      try {
        if (!selectedCustomer?.customerId) {
          alert("No customer selected!");
          return;
        }
    
        if (orderDetails.length === 0) {
          alert("No items in the order!");
          return;
        }
    
        // Extract variant IDs and total quantity from orderDetails
        const variantIds = orderDetails.flatMap(order => 
          order.colors.map(color => color.id) // Extract variant IDs
        );
    
        const totalQuantity = orderDetails.flatMap(order =>
          order.colors.map(color => Number(color.available) || 0) // Extract available quantity
        ).reduce((sum, qty) => sum + qty, 0);
    
        // Ensure we have variants
        if (variantIds.length === 0 || totalQuantity === 0) {
          alert("No variants selected or quantity is zero!");
          return;
        }
    
        // Construct the order data
        const orderData = {
          customer: {
            customerId: selectedCustomer.customerId,
          },
          status: "New Order",
          totalAmount: calculateTotalAmount(), 
          payment: {
            paymentId: Date.now(), // Unique timestamp-based ID
            paymentMethod: "Unspecified",
            amount: calculateTotalAmount(), 
            paymentStatus: "UNPAID",
          },
          variantIds: variantIds,
          quantity: totalQuantity,
        };
    
        // Send order data
        const response = await createOrder(orderData);
        console.log("Order Created:", response);
        alert("Order created successfully!");
    
      } catch (error) {
        console.error("Error creating order:", error);
        alert("Failed to create order. Check console for details.");
      }
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
             
                    {/* <p className={order.payment==='Paid' ? 'green' : 'grey'}>{order.payment}</p>
                    <p className={statusClassMap[order.orderStatus]}>{order.orderStatus}</p> 
               */}
                </div>
            )
           }
           
          
        </div>



        <ModalOrder
             show={showModalOrder}
             handleClose={() => setShowModalOrder(false)}
             products={finalData}
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
                                    <div className="d-flex flex-column">
                                        {order.colors.map((colorObj, colorIndex) => (
                                        <div
                                            key={colorIndex}
                                            style={{
                                            backgroundColor: colorObj.hexCode,
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
                                        {order.colors.map((colorObj, colorIndex) => (
                                        <input
                                            key={colorIndex}
                                            type="number"
                                            style={{border:'1px solid'}}
                                            placeholder="Weight"
                                            className="rounded border-secondary-subtle mb-2 p-1 weight-input"
                                            value={colorObj.weight || ''} 
                                            onChange={(e) =>
                                            handleWeightChange(order.productId, order.size, colorIndex, e.target.value)
                                            }
                                        />
                                        ))}
                                    </div>
                                    </td>
                                    <div className='d-flex flex-column'>
                                    {order.colors.map((colorObj, colorIndex) => {
                                    const colorHex = typeof colorObj === "string" 
                                        ? colorObj.trim().toLowerCase() 
                                        : colorObj.hexCode?.trim().toLowerCase();

                                    // Find the matching variant item
                                    const matchingItem = order.variant.variants.find(item => 
                                        item.hexCode.trim().toLowerCase() === colorHex
                                    );

                                    // Calculate base price
                                    const baseTotal = matchingItem ? (colorObj.weight * matchingItem.price) : 0;

                                    // Apply GST
                                    const gstRate = order.product.gstOnProduct || 0; // Get GST%
                                    const gstAmount = (baseTotal * gstRate) / 100;
                                    const finalTotal = baseTotal + gstAmount; // Price + GST

                                    return (
                                        <div key={colorIndex}>
                                        {matchingItem ? `₹${finalTotal.toFixed(2)}` : 'N/A'}
                                        </div>
                                    );
                                    })}
                                </div>

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
                    <table className="table">
                    <tbody>
                        {/* Subtotal */}
                        <tr>
                            <td>Subtotal</td>
                            <td>{orderDetails.reduce((acc, item) => acc + (item.colors.length || 0), 0)} items</td>
                            <td>₹{calculateGrandTotal(orderDetails).toFixed(2)}</td>
                        </tr>

                        {/* Wallet Deduction */}
                        <tr>
                            <td>Wallet Balance</td>
                            <td>₹{walletBalances.toFixed(2)}</td>
                            <td>
                                <input 
                                    className="rounded border w-50 border-secondary-subtle mb-2 p-1"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={walletDeduction}
                                    onChange={(e) => handleWalletDeductionChange(e.target.value)}
                                    min="0"
                                    max={walletBalances}
                                />
                            </td>
                        </tr>

                        {/* Discount Section */}
                        <tr>
                            <td>Discount</td>
                            <td >
                                {selectedDiscount && discountData.length > 0 ? (
                                    discountData.map((discount) =>
                                        discount.discountCode === selectedDiscount ? (
                                            discount.discountType === "Percentage"
                                                ? `${discount.discountValue}%`
                                                : `₹${discount.discountValue.toFixed(2)}`
                                        ) : null
                                    )
                                ) : (
                                    "--"
                                )}
                            </td>
                            <td>
                                {selectedDiscount && discountData.length > 0 ? (
                                    discountData.map((discount) =>
                                        discount.discountCode === selectedDiscount ? (
                                            discount.discountType === "Percentage"
                                                ? `₹${((calculateGrandTotal(orderDetails) * discount.discountValue) / 100).toFixed(2)}`
                                                : `₹${discount.discountValue.toFixed(2)}`
                                        ) : null
                                    )
                                ) : (
                                    "₹0.00"
                                )}
                            </td>
                        </tr>

                        {/* Shipping Charges */}
                        <tr>
                            <td>Shipping Charge</td>
                            <td>5%</td>
                            <td>₹{((calculateGrandTotal(orderDetails) * 5) / 100).toFixed(2)}</td>
                        </tr>

                        {/* Final Total */}
                        <tr>
                            <td><strong>Total</strong></td>
                            <td></td>
                            <td colSpan="2"><strong>₹{calculateTotalAmount()}</strong></td>
                        </tr>
                    </tbody>
                </table>
                      

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
                            {state?.index !== undefined ? (
                                <Button onClick={()=>SetShowModalInvoice(true)}>Send Invoice</Button>
     
                            ):
                            (
                                <Button onClick={handleCreateOrder}>Create Order</Button>
                            )
                            }
                       
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
                            <h5>{customer.customerName}</h5>
                            <span>{customer.phoneNumber}</span>
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
                             <p> {selectedCustomer.customerName}</p>
                        </div>

                        <div className='border-bottom mb-2'>
                            <h4 className='d-flex justify-content-between'>Contact Information <span><GoPencil /></span></h4>
                            <p>{selectedCustomer.email}</p>
                            <p>{selectedCustomer.phoneNumber}</p>
                        
                        </div>
                        <div>
                            <h4 className='d-flex justify-content-between'>Billing Address<span><GoPencil /></span></h4>
                            <p>{selectedCustomer.customerAddress}</p>
                        </div>
                        
                        
                        
                    </div>
                    )}

            </div>

            <div className='ctn mt-3'>
            <h5>Discounts</h5>

            <Dropdown onSelect={handleSelectDiscount} size="sm" className="status">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                className="d-flex align-items-center justify-content-between gap-2 w-100"
              >
                <p className="m-0 text-primary">{selectedDiscount || "Select Discount"}</p>
              </Dropdown.Toggle>

              <Dropdown.Menu className="w-100">
                {discountData.map((item, index) => (
                  <Dropdown.Item key={index} eventKey={item.discountCode}>
                    <div>
                      <strong>{item.discountCode}</strong> {/* Heading */}
                      <br />
                      <small className='flex-1'>
                        {item.discountValue}% off on {item.applicableProducts[0]?.productName || "this product"} | 
                        {/* {item.minPurchaseRequirement.replace("Minimum purchase amount (₹) :", "Min: ₹")} */}
                      </small> {/* Subheading */}
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>


            </div>
               
            </div>
        </div>
    </div>
  )
}

export default CreateOrder