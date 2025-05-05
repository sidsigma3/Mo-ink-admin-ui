// import React ,{useState,useEffect} from 'react'
// import { useBulkAssign } from '../../../../components/Context/BulkAssignContext'
// // import BulkAssignBox from '../../../../components/BulkAssignBox/BulkAssignBox';
// import { RxCross2 } from "react-icons/rx";
// import { FiAlertCircle } from "react-icons/fi";


// const handleStatusChange = async (orderId, orderVariantId, newStatus) => {
//   const confirmed = window.confirm(`Are you sure you want to change the status to "${newStatus}"?`);
//   if (!confirmed) return;

//   try {
//     await updateOrderVariantStatuses(orderId, [
//       {
//         orderVariantId,
//         status: newStatus,
//         reason: "Updated by admin",
//         remark: "Changed from UI",
//       },
//     ]);

   
//     setOrderDetails((prev) =>
//       prev.map((item) => ({
//         ...item,
//         colors: item.colors.map((color) =>
//           color.orderVariantId === orderVariantId
//             ? {
//                 ...color,
//                 status: newStatus,
//                 previousStatus: newStatus === "RETURN_REQUESTED" ? color.status : undefined,
//               }
//             : color
//         ),
//         variant: {
//           ...item.variant,
//           variants: item.variant.variants.map((color) =>
//             color.orderVariantId === orderVariantId
//               ? {
//                   ...color,
//                   status: newStatus,
//                   previousStatus: newStatus === "RETURN_REQUESTED" ? color.status : undefined,
//                 }
//               : color
//           ),
//         },
//       }))
//     );
    
    

//   } catch (err) {
//     alert("Failed to update status");
//     console.error(err);
//   }
// };

// const BulkAssignPage = ({setOrders}) => {

//   const [showModalOrder, setShowModalOrder] = useState(false);
//       const [showModalCustomer,setShowModalCustomer] =useState(false)
//       const [showModalAssign,setShowModalAssign] = useState(false)
//       const [showModalInvoice,SetShowModalInvoice] =useState(false)
//       const [weightChanged, setWeightChanged] = useState(false);
//       const [searchTerm, setSearchTerm] = useState("");
//       const [customers,setCustomer] = useState([])
//       const [openDropdown,setOpenDropdown] = useState(null)
  
//       // Filter customers based on search input
//       const filteredCustomers = customers.filter((customer) =>
//         (customer?.customerName?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
//          customer?.phoneNumber?.includes(searchTerm))
//       );

// const { bulkAssignData, addItem } = useBulkAssign();
// const [showAssign, setShowAssign] = useState({}); // State for showing product details
// const [selectedDetails, setSelectedDetails] = useState({})
// const [selectedSize, setSelectedSize] = useState({})

// const [orderList, setOrderList] = useState([]);

// useEffect(() => {
//     const initialShowAssign = bulkAssignData.reduce((acc, _, idx) => {
//       acc[idx] = false; // Initialize each index to false
//       return acc;
//     }, {});
//     setShowAssign(initialShowAssign);
//   }, [bulkAssignData]);


//    const statusFlow = [
//       "NEW",
//       "CONFIRMED",
//       "MANUFACTURING",
//       "SHIPPED",
//       "DELIVERED",
//       // "RETURN_REQUESTED",
//       // "RETURN_REJECTED",
//       // "RETURNED",
//       "CANCELLED",
//     ];


//     const isOdisha = selectedAddress?.state?.toLowerCase() === "odisha";

//     const orderVariants = orderDetails.flatMap(order =>
//       order.colors
//         .filter(color => color.id && color.weight > 0)
//         .map(color => {
//           const breakdown = calculatePriceBreakdown(
//             order,
//             color,
//             selectedDiscountValue,
//             discountPercentage,
//             selectedDiscountData
//           );
    
        
//           const gstRate = breakdown.gstRate || 0;
//           const gstAmount = breakdown.gstAmount || 0;
    
//           const weight = Number(color.weight);
//           const proportionalHandlingCharge = totalWeight > 0
//             ? Number(((weight / totalWeight) * handlingCharges ).toFixed(2))
//             : 0;
    
//           return {
//             variantId: color.id,
//             orderWeight: weight,
//             variantType: color.type || "Cone",
//             orderVariantCgst: isOdisha ? (gstAmount / 2 ).toFixed(1): 0,
//             orderVariantSgst: isOdisha ? (gstAmount / 2 ).toFixed(1): 0,
//             orderVariantIgst: isOdisha ? 0 : gstAmount.toFixed(1),
//             orderVariantDiscount: breakdown.discountAmount.toFixed(1) || 0,
//             orderVariantHandlingCharges: proportionalHandlingCharge,
//             orderVariantTotalAmount: (breakdown.finalTotal + gstAmount + proportionalHandlingCharge).toFixed(1),
//             status: "NEW",
//             statusReason: null,
//             statusRemark: null,
//           };
//         })
//     );
    

    

  
//   const handleRowClick = (index,details,name) => {
//     setShowAssign((prev) => ({
//       ...prev,
//       [index]: !prev[index], // Toggle visibility of the clicked index
//     }));
//     if (details) {
//         setSelectedDetails((prev) => ({
//           ...prev,
//           [index]: details, // Store details for the clicked row
//         }));
//         setSelectedSize((prev)=>({
//             ...prev,
//             [index]:name,
//         }))
//       }
//   };

//   const handleBack = (index) =>{
//         setShowAssign((prev) => ({
//             ...prev,
//             [index]:!prev[index]
//         }))
//   }


//   return (
//        <div className='products bg-white p-4 mb-3 rounded'>
//                           <h6>Order Details</h6>
                          
//                           <div className='d-flex justify-content-center gap-2 mb-1 mt-3 border-bottom pb-5'>
//                           {/* <SearchBox></SearchBox> */}
//                           <div>
//                           {isViewMode ? (
//                             <div>
//                             </div>
//                           ):(
//                           <button className='btn btn-sm btn-primary' onClick={() => setShowModalOrder(true)}>Browse Color Catalouge</button>
//                           )}
//                           </div>
//                           </div>
//                           {orderDetails.length > 0 && (
//                               <div className="order-detail">
//                                   {/* Table */}
//                                   <table className="table ">
//                                   {/* Table Header */}
//                                   <thead>
//                                       <tr>
//                                           <th className='fw-medium'>Product</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Counter</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Color</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Name</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Type</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Weight (Kgs)</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Cost</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Discount</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Total</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>CGST</th>
//                                           <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>SGST</th>
//                                           {isViewMode && (
//                                           <th  style={{ textAlign: 'center', verticalAlign: 'middle'}}   className='fw-medium'>Status</th>
//                                           )}
//                                            {isViewMode && (
//                                           <th className='fw-medium'></th>
//                                            )} 
//                                           <th></th>
//                                           {/* <th className='fw-medium' style={{textAlign:"center"}}>GST</th> */}
//                                           {/* <th className='fw-medium' style={{textAlign:"end"}}>Total</th> */}
//                                       </tr>
//                                   </thead>
      
//                                   <tbody>
//                                     {orderDetails.map((order, index) => {
//                                         // Initialize total price variables
//                                         let totalBasePrice = 0;
//                                         let totalGSTAmount = 0;
//                                         let totalFinalPrice = 0;
      
//                                         return (
//                                             <tr key={index}>
//                                                 {/* Product Name */}
//                                                 <td>{order.productName}</td>
      
//                                                 {/* Size */}
//                                                 <td style={{ textAlign: 'center'}}>
//                                                     <div className="badge fw-normal" style={{
//                                                         width: '70%',
//                                                         fontSize: '1rem',
//                                                         padding: '0.5rem 0.6rem',
//                                                         borderRadius: '1rem',
//                                                         backgroundColor: '#EFEFEF',
//                                                         border: '1px solid #B9C0CD',
//                                                         textAlign: 'center',
//                                                         color: 'black',
//                                                     }}>
//                                                         {order.size}
//                                                     </div>
//                                                 </td>
      
//                                                 {/* Colors Column */}
//                                                 <td  style={{ justifyItems: 'center'}}>
//                                                     <div className="d-flex flex-column gap-1">
//                                                         {order.colors.map((colorObj, colorIndex) => (
//                                                             <div
//                                                                 key={colorIndex}
//                                                                 style={{
//                                                                     backgroundColor: colorObj.hexCode,
//                                                                     width: '25px',
//                                                                     height: '25px',
//                                                                     borderRadius: '50%',
//                                                                     border: '2px solid #ccc',
//                                                                     margin: '5px',
//                                                                 }}
//                                                             ></div>
//                                                         ))}
//                                                     </div>
//                                                 </td>
      
//                                                 <td style={{ textAlign: 'center'}}>
//                                                     <div className="d-flex flex-column gap-3">
//                                                         {order.colors.map((colorObj, colorIndex) => (
//                                                             <div
//                                                                 key={colorIndex}
//                                                             >{colorObj.colorName}</div>
//                                                         ))}
//                                                     </div>
//                                                 </td>
      
//                                                 <td  style={{ justifyItems: 'center'}}>
//                                                 <div className="d-flex flex-column gap-3">
//                                                     {order.colors.map((colorObj, colorIndex) => (
//                                                        isViewMode ? (
//                                                         // Show plain text in view mode
//                                                         <span key={colorIndex} className=" w-75">
//                                                             {colorObj.type || 'N/A'}
//                                                         </span>
//                                                        ):(
//                                                       <select
//                                                         key={colorIndex}
//                                                         className="form-select form-select-sm"
//                                                         value={colorObj.type || "Cone"}
//                                                         onChange={(e) =>
//                                                           handleTypeChange(order.productId, order.size, colorIndex, e.target.value)
//                                                         }
//                                                         disabled={isViewMode}
//                                                       >
//                                                         <option value="Cone">Cone</option>
//                                                         <option value="Hank">Hank</option>
//                                                       </select>
//                                                        )
//                                                     ))}
//                                                   </div>
//                                                 </td>
      
//                                                 {/* Weight Inputs Column */}
//                                                 <td style={{ width: '8rem' }}>
//                                                 <div className="d-flex flex-column align-items-center">
//                                                 {order.colors.map((colorObj, colorIndex) => (
//                                                           // isViewMode ? (
//                                                           //     // Show plain text in view mode
//                                                           //     <span key={colorIndex} className="mb-1 p-1 w-75">
//                                                           //         {colorObj.weight || 'N/A'}
//                                                           //     </span>
//                                                           // ) : (
//                                                               // Show input field in edit mode
//                                                               <input
//                                                               key={colorIndex}
//                                                               type="number"
//                                                               style={{ border: '1px solid' }}
//                                                               placeholder="Weight"
//                                                               className="rounded border-secondary-subtle weight-input ps-2 mb-3 w-75"
//                                                               value={colorObj.weight || ''}
//                                                               onChange={(e) =>
//                                                                 handleWeightChange(order.productId, order.size, colorIndex, e.target.value)
//                                                               }
//                                                               disabled={["SHIPPED", "CANCELLED", "DELIVERED", "RETURN_REQUESTED", "RETURNED", "RETURN_REJECTED"].includes(colorObj.status)}
//                                                             />
//                                                           // )
//                                                       ))}
//                                                   </div>
//                                               </td>
      
//                                                 {/* Price Calculation */}
//                                                 <td style={{ textAlign: 'center'}} colSpan="5">
//                                                     <div className="">
//                                                     {order.colors.map((colorObj, colorIndex) => {
//                                                           const { 
//                                                             baseTotal,
//                                                             gstAmount,
//                                                             finalTotal,
//                                                             gstRate,
//                                                             discountPercent,
//                                                             isProductDiscountApplied
//                                                            } = calculatePriceBreakdown(order, colorObj  );
      
//                                                           return (
//                                                               <div key={colorIndex} className="d-flex justify-content-between mb-3">
//                                                                   <span>₹{baseTotal.toFixed(2)}</span>
//                                                                   {/* <span>₹{gstAmount.toFixed(2)} ({gstRate}%)</span> */}
//                                                                   <span>
//                                                                     {discountPercent.toFixed(2)}
//                                                                   </span>
//                                                                   {/* <span>{gstRate}%</span> */}
//                                                                   <span>₹{finalTotal.toFixed(2)}</span>
//                                                                   <span>{gstRate/2}%</span>
//                                                                   <span>{gstRate/2}%</span>
//                                                               </div>
//                                                           );
//                                                       })}
//                                                     </div>
//                                                 </td>
      
//                                                 {isViewMode && (
//                                                 <td>
//                                                   <div className="d-flex flex-column gap-3">
//                                                     {order.colors.map((colorObj, colorIndex) => {
//                                                       const currentStatus = colorObj.status;
//                                                       const currentIndex = statusFlow.indexOf(currentStatus);
//                                                       const isFinalStatus = ["DELIVERED", "RETURNED", "CANCELLED"].includes(currentStatus);
      
//                                                       return (
//                                                         <div
//                                                           key={colorIndex}
//                                                           className="d-flex align-items-center justify-content-center"
//                                                         >
//                                                           {/*  Show plain text for RETURNED or RETURN_REJECTED */}
//                                                           {["RETURNED", "RETURN_REJECTED"].includes(currentStatus) ? (
//                                                             <span className="yellow text-capitalize">
//                                                               {currentStatus.replace("_", " ")}
//                                                             </span>
//                                                           ) : (
//                                                             <select
//                                                               value={
//                                                                 currentStatus === "RETURN_REQUESTED"
//                                                                   ? colorObj.previousStatus || "DELIVERED"
//                                                                   : currentStatus
//                                                               }
//                                                               disabled={
//                                                                 isFinalStatus || currentStatus === "RETURN_REQUESTED"
//                                                               }
//                                                               onChange={(e) => {
//                                                                 const selectedStatus = e.target.value;
      
//                                                                   handleStatusChange(colorObj.orderId, colorObj.orderVariantId, selectedStatus);
      
//                                                               }}
//                                                             >
//                                                               {statusOptions.map(({ value, label }) => {
//                                                                 const optionIndex = statusFlow.indexOf(value);
//                                                                 let shouldDisable = false;
      
//                                                                 if (isFinalStatus) {
//                                                                   shouldDisable = true;
//                                                                 } else if (currentStatus === "RETURN_REQUESTED") {
//                                                                   shouldDisable = true;
//                                                                 } else if (currentStatus === "NEW") {
//                                                                   shouldDisable = !["CONFIRMED", "CANCELLED"].includes(value);
//                                                                 } else if (currentStatus === "CONFIRMED") {
//                                                                   shouldDisable = optionIndex < currentIndex || value === "CANCELLED";
//                                                                 } else {
//                                                                   shouldDisable = value === "CANCELLED" || optionIndex < currentIndex;
//                                                                 }
      
//                                                                 // Never render RETURNED/RETURN_REJECTED/RETURN_REQUESTED unless actual status
//                                                                 const shouldRender =
//                                                                   ["RETURNED", "RETURN_REJECTED"].includes(currentStatus)
//                                                                     ? value === currentStatus
//                                                                     : !["RETURNED", "RETURN_REJECTED", "RETURN_REQUESTED"].includes(value);
      
//                                                                 return (
//                                                                   shouldRender && (
//                                                                     <option key={value} value={value} disabled={shouldDisable}>
//                                                                       {label}
//                                                                     </option>
//                                                                   )
//                                                                 );
//                                                               })}
//                                                             </select>
//                                                           )}
//                                                         </div>
//                                                       );
//                                                     })}
//                                                   </div>
//                                                 </td>
//                                               )}
      
      
      
      
      
//                                           {isViewMode && (
//                                             <td style={{ justifyItems: 'center', alignContent: 'center' }}>
//                                               <div className='d-flex flex-column gap-3'>
//                                                 {order.colors.map((colorObj, colorIndex) => (
//                                                   <div key={colorIndex} className="d-flex align-items-center justify-content-between position-relative">
//                                                     {colorObj.status === "RETURN_REQUESTED" && (
//                                                       <div className="position-relative">
//                                                         <button
//                                                           className="alert-icon-btn"
//                                                           data-bs-toggle="tooltip"
//                                                           data-bs-placement="top"
//                                                           title="Return requested for this variant"
//                                                           onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             const key = colorObj.orderVariantId;
//                                                             setOpenDropdown(openDropdown === key ? null : key);
//                                                           }}
                                                          
//                                                         >
//                                                           <div className="alert-icon-circle">
//                                                             <FiAlertCircle size={16} color="red" />
//                                                           </div>
//                                                         </button>
      
//                                                         {openDropdown === colorObj.orderVariantId && (
//                                                           <div className="position-absolute bg-white border rounded p-2 shadow-sm" style={{ zIndex: 10 }}>
//                                                             <button
//                                                               className="btn btn-sm btn-outline-success mb-1 w-100"
//                                                               onClick={() => handleStatusChange(colorObj.orderId, colorObj.orderVariantId, "RETURNED")}
//                                                             >
      
//                                                               Return Approve
      
//                                                             </button>
//                                                             <button
//                                                               className="btn btn-sm btn-outline-danger w-100"
//                                                               onClick={() => handleStatusChange(colorObj.orderId, colorObj.orderVariantId, "RETURN_REJECTED")}
//                                                             >
      
//                                                               Return Reject 
      
//                                                             </button>
//                                                           </div>
//                                                         )}
      
//                                                       </div>
//                                                     )}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             </td>
//                                           )}
      
      
      
//                                                 <div className='d-flex flex-column gap-3'>
//                                                 {order.colors.map((colorObj, colorIndex) => (
//                                                 <div key={colorIndex} className="d-flex align-items-center justify-content-between">
                                            
//                                                 {!isViewMode && (
//                                                   <button
//                                                     className="ms-2"
//                                                     onClick={() => handleDeleteColor(order.productId, order.size, colorIndex)}
//                                                     title="Remove color"
//                                                     style={{
//                                                       border:'none',
//                                                       background:'transparent',
//                                                       color:'red'
//                                                     }}
//                                                   >
//                                                     <RxCross2/>
//                                                   </button>
//                                                 )}
//                                               </div>
//                                                 ))}
      
                                            
//                                                 </div>
      
                                              
      
                                                
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
      
//                                   </table>
//                               </div>
//                               )}
      
      
      
//                           <ModalAssign
//                               show={showModalAssign}
//                               handleClose={()=> setShowModalAssign(false)}
//                           >
//                           </ModalAssign>
//                           {/* {orderDetails.length > 0 && (
      
//                           <div className='d-flex justify-content-end w-100 mt-2'>
//                               <button onClick={()=> setShowModalAssign(true)} className='btn btn-primary btn-sm'>Assign</button>
//                           </div>
//                           )} */}
                                                      
//                       </div>
//   )
// }

// export default BulkAssignPage



import React, { useState, useEffect, useMemo } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import ModalOrder from '../../../../components/Modal/ModalOrder';
import { LuFileDown } from "react-icons/lu";
// import "./CreateOrder.css";
import { getAllProduct } from '../../../../services/ProductService';


const BulkAssignPage = () => {
    const navigate = useNavigate();
    const [showModalOrder, setShowModalOrder] = useState(false);
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedSpinner, setSelectedSpinner] = useState(null);
    const [selectedDyer, setSelectedDyer] = useState(null);
    const {state} = useLocation()
    const order =state?.order || {};


    // Replicate the same product aggregation from CreateOrder
    const aggregateProductData = (productData) => {
        return productData.map((product) => {
            const groupedVariants = product.variants.reduce((acc, variant) => {
                const { size, color, id } = variant;
                if (!acc[size]) {
                    acc[size] = { id, size, variants: [], totalWeight: 0 };
                }
                if (!acc[size].variants.some(v => v.colorName === color.colorName)) {
                    acc[size].variants.push({
                        colorName: color.colorName,
                        hexCode: color.hexCode || "#ccc",
                        id: variant.id,
                        price: variant.pricePerKg,
                        available: variant.availableWeight
                    });
                }
                return acc;
            }, {});
            return {
                productId: product.id,
                productName: product.productName,
                productDescription: product.productDescription,
                gstOnProduct: product.gstOnProduct,
                groupedVariants: Object.values(groupedVariants),
            };
        });
    };

    const finalData = useMemo(() => aggregateProductData(productData), [productData]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProduct();
                setProductData(data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    // Replicate the order handling from CreateOrder
    const handleReceiveOrder = (product) => {
        setSelectedProducts(prev => {
            const existingProduct = prev.find(p => 
                p.productId === product.productId && 
                p.size === product.size
            );

            if (existingProduct) {
                return prev.map(p => {
                    if (p.productId === product.productId && p.size === product.size) {
                        return {
                            ...p,
                            colors: [...p.colors, ...product.colors]
                        };
                    }
                    return p;
                });
            }
            return [...prev, product];
        });
    };

    // Replicate the type change handler from CreateOrder
    const handleTypeChange = (productId, size, colorIndex, value) => {
        setSelectedProducts(prev => prev.map(product => {
            if (product.productId === productId && product.size === size) {
                const updatedColors = product.colors.map((color, idx) => 
                    idx === colorIndex ? { ...color, type: value } : color
                );
                return { ...product, colors: updatedColors };
            }
            return product;
        }));
    };

    // Replicate the weight change handler from CreateOrder
    const handleWeightChange = (productId, size, colorIndex, weight) => {
        setSelectedProducts(prev => prev.map(product => {
            if (product.productId === productId && product.size === size) {
                const updatedColors = product.colors.map((color, idx) => 
                    idx === colorIndex ? { ...color, weight: parseFloat(weight || 0) } : color
                );
                return { ...product, colors: updatedColors };
            }
            return product;
        }));
    };

    // Replicate the price calculation from CreateOrder
    const calculatePriceBreakdown = (product, colorObj) => {
        const price = colorObj.price || 0;
        const weight = colorObj.weight || 0;
        const baseTotal = weight * price;
        const gstRate = product.gstOnProduct || 0;
        const gstAmount = (baseTotal * gstRate) / 100;
        
        return {
            baseTotal,
            gstAmount,
            finalTotal: baseTotal + gstAmount,
            gstRate
        };
    };

    return (
        <div className='create-order'>
         <div className='top d-flex gap-3 mb-2 mt-2' style={{cursor:'pointer'}}>
                    <span onClick={() => navigate('/vendor-order')}><IoArrowBackOutline size={25}/></span>
                   { Object.keys(order).length === 0 ? (
                    <h5 style={{fontSize:'1.2rem'}}>Create Vendor Order</h5>
        
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
           <div className='products bg-white p-4 mb-3 rounded'>
    <h6>Order Details</h6>
    
    <div className='d-flex justify-content-center gap-2 mb-1 mt-3 border-bottom pb-5'>
        <div>
            <button className='btn btn-sm btn-primary' onClick={() => setShowModalOrder(true)}>
                Browse Color Catalogue
            </button>
        </div>
    </div>
    
    {selectedProducts.length > 0 && (
        <div className="order-detail">
            <table className="table">
                <thead>
                    <tr>
                        <th className='fw-medium'>Product</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Counter</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Color</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Name</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Type</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Weight (Kgs)</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Cost</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Discount</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>Total</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>CGST</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle'}} className='fw-medium'>SGST</th>
                    </tr>
                </thead>

                <tbody>
                    {selectedProducts.map((product, index) => (
                        <tr key={index}>
                            <td>{product.productName}</td>
                            <td style={{ textAlign: 'center'}}>
                                <div className="badge fw-normal" style={{
                                    width: '70%',
                                    fontSize: '1rem',
                                    padding: '0.5rem 0.6rem',
                                    borderRadius: '1rem',
                                    backgroundColor: '#EFEFEF',
                                    border: '1px solid #B9C0CD',
                                    textAlign: 'center',
                                    color: 'black',
                                }}>
                                    {product.size}
                                </div>
                            </td>

                            <td style={{ justifyItems: 'center'}}>
                                <div className="d-flex flex-column gap-1">
                                    {product.colors.map((colorObj, colorIndex) => (
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

                            <td style={{ textAlign: 'center'}}>
                                <div className="d-flex flex-column gap-3">
                                    {product.colors.map((colorObj, colorIndex) => (
                                        <div key={colorIndex}>{colorObj.colorName}</div>
                                    ))}
                                </div>
                            </td>

                            <td style={{ justifyItems: 'center'}}>
                                <div className="d-flex flex-column gap-3">
                                    {product.colors.map((colorObj, colorIndex) => (
                                        <select
                                            key={colorIndex}
                                            className="form-select form-select-sm"
                                            value={colorObj.type || "Cone"}
                                            onChange={(e) =>
                                                handleTypeChange(
                                                    product.productId,
                                                    product.size,
                                                    colorIndex,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Cone">Cone</option>
                                            <option value="Hank">Hank</option>
                                        </select>
                                    ))}
                                </div>
                            </td>

                            <td style={{ width: '8rem' }}>
                                <div className="d-flex flex-column align-items-center">
                                    {product.colors.map((colorObj, colorIndex) => (
                                        <input
                                            key={colorIndex}
                                            type="number"
                                            style={{ border: '1px solid' }}
                                            placeholder="Weight"
                                            className="rounded border-secondary-subtle weight-input ps-2 mb-3 w-75"
                                            value={colorObj.weight || ''}
                                            onChange={(e) =>
                                                handleWeightChange(
                                                    product.productId,
                                                    product.size,
                                                    colorIndex,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </td>

                            <td style={{ textAlign: 'center'}} colSpan="5">
                                <div className="">
                                    {product.colors.map((colorObj, colorIndex) => {
                                        const { 
                                            baseTotal,
                                            gstAmount,
                                            finalTotal,
                                            gstRate,
                                            discountPercent
                                        } = calculatePriceBreakdown(product, colorObj);

                                        return (
                                            <div key={colorIndex} className="d-flex justify-content-between mb-3">
                                                <span>₹{baseTotal.toFixed(2)}</span>
                                                <span>{discountPercent.toFixed(2)}</span>
                                                <span>₹{finalTotal.toFixed(2)}</span>
                                                <span>{gstRate/2}%</span>
                                                <span>{gstRate/2}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )}
</div>

<div className="p-3 bg-white rounded">
<div className="d-flex flex-column flex-md-row gap-4 align-items-md-center col-12 col-md-12 col-lg-6">

    {/* Label Div */}
    <div className="w-20">
      <label className="form-label fs-6 fw-medium mb-0">Order for:</label>
    </div>

    {/* Dropdown + Search Fields Div */}
    <div className="d-flex flex-column flex-md-row gap-3 flex-grow-1">

      {/* Dropdown */}
      <div style={{ minWidth: '150px' }}>
        <select className="form-select form-select-sm ps-3 pe-5 " style={{ height: '38px' }}>
          <option value="Spinner">Spinner</option>
          <option value="Dyer">Dyer</option>
          <option value="Dyer">Both</option>

        </select>
      </div>

      {/* Spinner Search */}
      <div className="position-relative flex-grow-1">
        <input
          type="text"
          className="form-control form-control-sm ps-3 pe-5"
          placeholder="Select Spinner"
          style={{ height: '38px' }}
        />
        <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
      </div>

      {/* Dyer Search */}
      <div className="position-relative flex-grow-1">
        <input
          type="text"
          className="form-control form-control-sm ps-3 pe-5"
          placeholder="Select Dyer"
          style={{ height: '38px' }}
        />
        <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
      </div>

    </div>
  </div>
</div>

 <div className="row gx-2">  
      <div className=" mt-2 col-lg-6 col-md-12">
        <div className="bg-white p-2 rounded mt-2">
        <div className='d-flex justify-content-between'>
            <h6>Order for: <span className='text-primary'>Vishal Mega Mart</span></h6>

            <div className='px-2 rounded' style={{border:'1px solid #93C5FD', backgroundColor:'#DBEAFE',color:'#1E40AF'}}>
                <p className='m-0'>Spinner</p>
            </div>

            </div>
            <table className="w-100 mt-2 table" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Weight</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {/* {order.details.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.productName}</td>
                  <td>{detail.size}</td>
                  <td>{order.weight}</td>
                  <td>₹51,250</td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>


        <div className='bg-white rounded  p-3 mt-2'>
        
                    <div className='d-flex justify-content-between' style={{ fontSize: '1rem', fontWeight: 500 }}>
                            <h6>Payment</h6>
                           
                            <div className='bg-secondary-subtle rounded-circle d-flex justify-content-center align-items-center text-white'  style={{ width: '2.5rem', height: '2.5rem' }}><LuFileDown size={20}/></div>
                        </div>
        
                    <table className="w-100 table border rounded mt-2" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
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

        <div className='mt-2 col-lg-6 col-md-12'>
                    

          <div className="bg-white p-2 rounded mt-2">
        <div className='d-flex justify-content-between'>
            <h6>Order for: <span className='text-primary'>Amber NX</span></h6>

            <div className='px-2 rounded' style={{border:'1px solid #FCD34D', backgroundColor:'#FEF3C7',color:'#92400E'}}>
                <p className='m-0'>Dyer</p>
            </div>

            </div>
            <table className="w-100 mt-2 table" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
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
              {/* {order.details.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.productName}</td>
                  <td>{detail.size}</td>
                  <td>Premium</td>
                  <td>{detail.color}</td>
                  <td>{order.weight}</td>
                  <td>₹51,250</td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
        
        
        
                    <div className='bg-white rounded p-3 mt-2'>
                        <div className='d-flex justify-content-between'style={{ fontSize: '1rem', fontWeight: 500 }}>
                            <h6>Payment</h6>
                           
                            <div className='bg-secondary-subtle rounded-circle d-flex justify-content-center align-items-center text-white'  style={{ width: '2.5rem', height: '2.5rem' }}><LuFileDown size={20}/></div>
                        </div>
        
                        <table className='w-100 table border rounded  mt-2' style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                            
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




            <ModalOrder
                show={showModalOrder}
                handleClose={() => setShowModalOrder(false)}
                products={finalData}
                onOrderCreate={handleReceiveOrder}
                addToCart={handleReceiveOrder}
            />
        </div>
    );
};

export default BulkAssignPage;