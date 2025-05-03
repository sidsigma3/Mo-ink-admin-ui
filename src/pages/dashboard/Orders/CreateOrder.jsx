
import React , {useState , useEffect , useMemo , useRef , forwardRef , useImperativeHandle} from 'react'
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
import { updateOrder } from "../../../services/OrderService";
import { useCustomerContext } from '../../../components/Context/CustomerContext';
import { getAllProduct } from '../../../services/ProductService';
import { getAllCustomer , getWalletTransactions} from '../../../services/CustomerService';
import { getAllOrders , updateOrderVariantStatuses , updateOrderVariants} from '../../../services/OrderService';
import { Segment } from '@mui/icons-material';
import { getAllDiscount } from '../../../services/DiscountService';
import { createOrder } from '../../../services/OrderService';
import emailjs from 'emailjs-com';
import ReactWhatsapp from 'react-whatsapp';
import html2pdf from 'html2pdf.js';
import { FiAlertCircle } from "react-icons/fi";
import { emailInvoice } from '../../../services/InvoiceServices';





// Optional: style mapping
export const statusClassMap = {
  NEW: "text-primary",
  CONFIRMED: "text-info",
  MANUFACTURING: "text-warning",
  SHIPPED: "text-secondary",
  DELIVERED: "text-success",
  CANCELLED: "text-danger",
  RETURN_REQUESTED: "text-warning",
  RETURN_REJECTED: "text-muted",
  RETURNED: "text-success",
};

const CreateOrder = forwardRef(({ orderData }, ref) => {
   

    const navigate = useNavigate();

    const invoiceRef = useRef(null);

    const {state} = useLocation()

    const order =state?.order || {};

    const isViewMode = !!state

    const [showModalOrder, setShowModalOrder] = useState(false);
    const [showModalCustomer,setShowModalCustomer] =useState(false)
    const [showModalAssign,setShowModalAssign] = useState(false)
    const [showModalInvoice,SetShowModalInvoice] =useState(false)
    const [weightChanged, setWeightChanged] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [customers,setCustomer] = useState([])
    const [openDropdown,setOpenDropdown] = useState(null)

    // Filter customers based on search input
    const filteredCustomers = customers.filter((customer) =>
      (customer?.customerName?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
       customer?.phoneNumber?.includes(searchTerm))
    );

    const statusOptions = [
      { value: "NEW", label: "New Order" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "CONFIRMED", label: "Confirmed" },
      { value: "MANUFACTURING", label: "Manufactured" },
      { value: "SHIPPED", label: "Shipped" },
      { value: "DELIVERED", label: "Delivered" },
      // { value: "RETURNED", label: "Returned" },
      // { value: "RETURN_REQUESTED", label: "Return Requested" },
      // { value: "RETURN_REJECTED", label: "Return Rejected" },
    ];
    
    const statusFlow = [
      "NEW",
      "CONFIRMED",
      "MANUFACTURING",
      "SHIPPED",
      "DELIVERED",
      // "RETURN_REQUESTED",
      // "RETURN_REJECTED",
      // "RETURNED",
      "CANCELLED",
    ];
    
  
    
// const handleStatusChange = async (orderId, newStatus) => {
//     try {
//         // Fetch the existing order details before updating
//         const existingOrder = orders.find(order => order.orderId === orderId);

//         console.log(existingOrder)

//         if (!existingOrder) {
//             console.error("Order not found.");
//             return;
//         }

//         const updatedOrderData = {
//             ...existingOrder, 
//             status: newStatus, 
//         };

//         await updateOrder(orderId, updatedOrderData);
//         fetchOrders();

//       alert("Order status updated successfully.");
//     } catch (error) {
//         console.error("Failed to update order status:", error);
//     }
// };


const [orders, setOrders] = useState([]);

const fetchOrders = async () => {
  try {
      const data = await getAllOrders();
      setOrders(data);
  } catch (error) {
      console.error("Failed to fetch orders", error);
  }
};

useEffect(() => {
  fetchOrders();
}, []);


    const [cart, setCart] = useState([]);
    
    const [productData,setProductData] = useState([])

    const [selectedType,setSelectedType] = useState()
    
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
                
                    setDiscountData(data.data)
                    
                  } catch (error) {
                    console.error('Error fetching Customers:', error);
                  }
                };
              
              fetchData(); 
            }, []); 

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
                  gstOnProduct:product.gstOnProduct,
                  pricePerKg:product.productPrice?.pricePerKg,
                  availableStatus:product.availableStatus,
                  groupedVariants: Object.values(groupedVariants),
                };
              });
            };
          
           
          
          
    // const finalData = aggregateProductData(productData)

    const finalData = useMemo(() => {
      return aggregateProductData(productData);
    }, [productData]);
    
  
    const handleReceiveOrder = (order) => {
      console.log(order)

      setOrderDetails(order);
    };

    const [selectedCustomer, setSelectedCustomer] = useState(order.customer || null);

    const handleAddCustomer = (newCustomer) => {
    // setCustomer((prevCustomers) => [newCustomer ,...prevCustomers]);
      setSelectedCustomer(newCustomer)
      console.log(newCustomer)
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

      const handleTypeChange = (productId, size, colorIndex, value) => {
        setOrderDetails((prevOrders) =>
          prevOrders.map((order) => {
            if (order.productId === productId && order.size === size) {
              const updatedColors = order.colors.map((color, idx) =>
                idx === colorIndex ? { ...color, type: value } : color
              );
              return { ...order, colors: updatedColors };
            }
            return order;
          })
        );
      };


      const handleWeightChange = (productId, size, colorIndex, weight) => {
        setWeightChanged(true);
        setOrderDetails(prevOrderDetails =>
          prevOrderDetails.map(order => {
            if (order.productId === productId && order.size === size) {
              const updatedColors = order.colors.map((color, index) => {
                if (index === colorIndex) {
                  const updatedWeight = parseFloat(weight || 0);
                  return {
                    ...color,
                    weight: updatedWeight,
                    type: color.type || "Cone",
                    weightChanged: true
                  };
                }
                return color;
              });
      
              return { ...order, colors: updatedColors };
            }
            return order;
          })
        );
      };

      const variantToProductMap = {};
          finalData.forEach((p) => {
          p.groupedVariants?.forEach((gv) => {
            gv.variants?.forEach((v) => {
              variantToProductMap[v.id] = p;
            });
          });
      });
      
      
      
      const transformOrderToProductDetails = (order, finalData) => {
        if (!order || !order.orderVariantResponse) return [];
      
        const groupedVariants = {};
      
        order.orderVariantResponse.forEach((variant) => {
          const {
            size,
            color,
            orderVariantId,
            orderWeight,
            variantType,
            productId,
            status,
          } = variant;
      
          const product = finalData.find(p => p.productId === productId);
          if (!product) return;
      
          const key = `${productId}-${size}`;
      
          if (!groupedVariants[key]) {
            groupedVariants[key] = {
              productId: productId,
              productName: product?.productName,
              size: size,
              colors: [],
              variant: {
                id: orderVariantId,
                size: size,
                variants: [],
                totalWeight: 0,
              },
              product: {
                productId: product?.productId,
                productName: product?.productName,
                productDescription: product?.productDescription,
                productImage: product?.productImage || [],
                compareAtPrice: product?.compareAtPrice,
                costPerItemPerKg: product?.costPerItemPerKg,
                gstOnProduct: product?.gstOnProduct,
                pricePerKg: product?.pricePerKg,
                availableStatus: product?.availableStatus,
                groupedVariants: [],
              },
            };
          }
      
          // Find color details in product groupedVariants to fetch pricePerKg & availableWeight
          const sizeGroup = product.groupedVariants?.find(gv => gv.size === size);
          const matchingColor = sizeGroup?.variants?.find(c => c.hexCode?.toLowerCase() === color.hexCode?.toLowerCase());
      
          const colorDetails = {
            colorName: color.colorName,
            hexCode: color.hexCode,
            available: matchingColor?.available || 0,
            price: matchingColor?.price || 0,
            id: color.id,
            weight: orderWeight,
            type: variantType,
            status,
            orderVariantId,
            orderId:order.orderId
          };
      
          groupedVariants[key].colors.push(colorDetails);
          groupedVariants[key].variant.variants.push(colorDetails);
          groupedVariants[key].variant.totalWeight += parseFloat(orderWeight || 0);
        });
      
        const productDetailsArray = Object.values(groupedVariants);
      
        productDetailsArray.forEach((item) => {
          item.product.groupedVariants = [item.variant];
        });
      
        return productDetailsArray;
      };
      
            
      const [orderDetails, setOrderDetails] = useState([]);

      useEffect(() => {
        if (order && order.orderVariantResponse && finalData?.length > 0) {
          const details = transformOrderToProductDetails(order, finalData);
          setOrderDetails(details);
       
        } else {
          console.log("Waiting for order or finalData...");
        }
      }, [order, finalData]);

      console.log(order)
      console.log(orderDetails)
      console.log(transformOrderToProductDetails(order,finalData))

      const calculateTotal = (order) => {
        return order.colors.reduce((total, colorObj) => {
          const variant = order.variant.variants.find(item => item.hexCode === colorObj.hexCode);
          return total + (variant ? variant.price * Number(colorObj.weight) : 0);
        }, 0);
      };
      

      const statusClassMap = {
        "New Order": "blue",
        "Shipped": "yellow",
        "Manufactured": "purple",
        "Delivered": "green",
        "Cancelled": "red",
        "Returned": "grey",
        // "Partial return": "purple",
        // "Partial cancel": "muted-clay",
        
        };



   
    const [walletBalances, setWalletBalances] = useState(0);
    const [walletDeduction, setWalletDeduction] = useState(order?.walletAmount || 0);

    useEffect(() => {
      const fetchWallets = async () => {
        if (!selectedCustomer) return; // Ensure selectedCustomer exists
    
        try {
          const totalWallet = await getWalletTransactions(
            state ? selectedCustomer.id : selectedCustomer.customerId
          );
    
          setWalletBalances(
            totalWallet.length > 0 ? totalWallet[totalWallet.length - 1].totalAmount : 0
          );
        } catch (error) {
          console.error("Error fetching wallet transactions:", error);
          setWalletBalances(0); // Handle error gracefully
        }
      };
    
      fetchWallets();
    }, [selectedCustomer, state]); 
    

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
            return total + baseTotal;
          }
    
          return total;
        }, 0);
    
        return grandTotal + orderTotal;
      }, 0);
      
    };

    const calculateGrandTotals = (
      orderDetails = [],
      paymentDiscount = 0,
      couponDiscount = 0,
      selectedDiscountData = {}
    ) => {
      let baseTotal = 0;
      let totalGst = 0;
      let totalPaymentTypeDiscount = 0;
      let totalCouponTypeDiscount = 0
    
      for (const order of orderDetails) {
        if (!order || !Array.isArray(order.colors) || !order.variant?.variants) continue;
    
        for (const colorObj of order.colors) {
          const colorHex = typeof colorObj === "string"
            ? colorObj.trim().toLowerCase()
            : colorObj.hexCode?.trim().toLowerCase();
    
          if (!colorHex) continue;
    
          const variant = order.variant.variants.find(v =>
            v.hexCode?.trim().toLowerCase() === colorHex
          );
    
          if (!variant) continue;
    
          const weight = colorObj.weight || 0;
          const price = variant.price || 0;
          const gstRate = order.product?.gstOnProduct || 0;
    
          const rawTotal = weight * price;

          console.log(order)

          console.log(order.productId)
    
          
          console.log(selectedDiscountData)

          // 👇 Check if coupon discount is applicable to this product
          const isCouponApplicable = selectedDiscountData?.applicableProducts?.some(
            product => product.id === order.productId
          );

          
          
          const appliedCouponDiscount = isCouponApplicable ? couponDiscount : 0;
          const totalDiscountPercent = 
                Number(paymentDiscount) + Number(appliedCouponDiscount) - 
                (Number(paymentDiscount) * Number(appliedCouponDiscount)) / 100;


         console.log(paymentDiscount,appliedCouponDiscount)

          const  discountByCoupon = rawTotal * Number(appliedCouponDiscount)/100
          const  discountByPaymment = rawTotal * Number(paymentDiscount)/100

          const discount = rawTotal * totalDiscountPercent / 100;
          const discountedTotal = rawTotal - discount;
          const gstAmount = discountedTotal * gstRate / 100;
    

          totalCouponTypeDiscount +=discountByCoupon;
          totalPaymentTypeDiscount += discountByPaymment;
          baseTotal += rawTotal;
        
          totalGst += gstAmount;
           
        }
      }
    
      return {
        baseTotal,
        totalDiscount: totalCouponTypeDiscount + totalPaymentTypeDiscount,
        finalTotal: baseTotal - totalCouponTypeDiscount + totalPaymentTypeDiscount,
        cgst: totalGst / 2,
        sgst: totalGst / 2,
        totalCouponTypeDiscount,
        totalPaymentTypeDiscount,
      };
    };
    
    
    
      
      const [selectedPayment,setSelectedPayment] = useState('Select Payment Type')
      const [selectedDiscountData,setSelectedDiscountedData] = useState()
      const [selectedDiscount,setSelectedDiscount] = useState('')
      const [selectedDiscountValue, setSelectedDiscountValue] = useState(null);
      const [selectedDiscountId,setSelectedDiscountId] = useState('')

      useEffect(() => {
        if (discountData?.length && order?.discountId) {
          const selectedItem = discountData.find(item => item.discountId === order.discountId);
      
          if (selectedItem) {
            setSelectedDiscountedData(selectedItem)
            setSelectedDiscount(selectedItem.discountCode);
            setSelectedDiscountValue(selectedItem.discountValue);
            setSelectedDiscountId(selectedItem.discountId);
          }
        }
      }, [discountData, order]);

      const handleSelectDiscount = (discountCode) => {
        const selectedItem = discountData.find(item => item.discountCode === discountCode);
          
          if (selectedItem) {
            setSelectedDiscountedData(selectedItem)
            setSelectedDiscount(selectedItem.discountCode);
            setSelectedDiscountValue(selectedItem.discountValue);
            setSelectedDiscountId(selectedItem.discountId)
          }
      }

    
    const shippingCharge = (calculateGrandTotal(orderDetails) * 5) / 100;

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

  //   const sendOrderConfirmationEmail = (customerEmail, customerName, orderId, totalAmount) => {
  //     emailjs.send(
  //         "service_g6l5hk7",  // Replace with your EmailJS service ID
  //         "template_os7d9ze", // Replace with your EmailJS template ID
  //         {
  //             name: customerName,
  //             email: customerEmail,
  //             orderId: orderId,
  //             cost: totalAmount,
  //             price:totalAmount,

  //         },
  //         "LcIAnvNjmXt6o9EiS" // Replace with your EmailJS public key
  //     ).then((response) => {
  //         console.log("Order confirmation email sent successfully", response.status, response.text);
  //     }).catch((error) => {
  //         console.error("Error sending order confirmation email:", error);
  //     });
  // };


  // const sendWhatsAppMessage = (whatsappNumber, orderData) => {
  //   const message = `Hello! Your order (${orderData.order_id}) has been placed successfully! 🎉

  //     Order Details:
  //     --------------------
  //     ${orderData.orders.map(item => `📌 ${item.name} - ${item.units} units @ ₹${item.price}`).join("\n")}

  //     Total Amount: ₹${orderData.totalAmount}
  //     Payment Status: ${orderData.payment.paymentStatus}

  //     Thank you for shopping with us! 🚀`;

  //         window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  //     };

  

 
  const handleCreateOrder = async () => {
    try {
      if (!selectedCustomer) {
        alert("No customer selected!");
        return;
      }
  
      if (orderDetails.length === 0) {
        alert("No items in the order!");
        return;
      }
  
      const isOdisha = selectedAddress?.state?.toLowerCase() === "odisha";

      const orderVariants = orderDetails.flatMap(order =>
        order.colors
          .filter(color => color.id && color.weight > 0)
          .map(color => {
            const breakdown = calculatePriceBreakdown(
              order,
              color,
              selectedDiscountValue,
              discountPercentage,
              selectedDiscountData
            );
      
          
            const gstRate = breakdown.gstRate || 0;
            const gstAmount = breakdown.gstAmount || 0;
      
            const weight = Number(color.weight);
            const proportionalHandlingCharge = totalWeight > 0
              ? Number(((weight / totalWeight) * handlingCharges ).toFixed(2))
              : 0;
      
            return {
              variantId: color.id,
              orderWeight: weight,
              variantType: color.type || "Cone",
              orderVariantCgst: isOdisha ? (gstAmount / 2 ).toFixed(1): 0,
              orderVariantSgst: isOdisha ? (gstAmount / 2 ).toFixed(1): 0,
              orderVariantIgst: isOdisha ? 0 : gstAmount.toFixed(1),
              orderVariantDiscount: breakdown.discountAmount.toFixed(1) || 0,
              orderVariantHandlingCharges: proportionalHandlingCharge,
              orderVariantTotalAmount: (breakdown.finalTotal + gstAmount + proportionalHandlingCharge).toFixed(1),
              status: "NEW",
              statusReason: null,
              statusRemark: null,
            };
          })
      );
      
  
      const totalQuantity = orderVariants.reduce((sum, item) => sum + item.orderWeight, 0);
      const totalAmount = Number(calculateTotalAmount());
  
      if (orderVariants.length === 0 || totalQuantity === 0) {
        alert("No valid variants or zero weight!");
        return;
      }
  
      const walletUsed = Math.min(walletDeduction || 0, totalAmount);
  
      const billingAddress = selectedCustomer.addresses?.find(
        (addr) => addr.addressType === "HOME"
      );
      
      const formattedCustomer = {
        customerId: selectedCustomer.customerId,
        billingAddressId: billingAddress?.id || null,
        shippingAddressId: selectedAddress?.id || null,
      };
      
      const orderData = {
        customer: formattedCustomer,
        status: "NEW",
        totalAmount: toPay,
        discountId: selectedDiscountId || null,
        walletAmount: walletUsed,
        quantity: totalQuantity,
        paymentTypeDiscount: selectedPayment || "",
        payment: {
          paymentId: Date.now(),
          totalAmount: toPay,
          codAmount: codAmt.toFixed(2),
          onlineAmount: onlineAmt.toFixed(2),
          transactionId: "TXN" + Date.now(),
          paidAmount: onlineAmt.toFixed(2),
          pendingAmount: (codAmt).toFixed(2),
          paymentStatus: "UNPAID",
          totalDiscount:grandTotals.totalDiscount,
          totalSgst: isOdisha ? grandTotals.sgst.toFixed(2) : "0.00",
          totalCgst: isOdisha ? grandTotals.cgst.toFixed(2) : "0.00",
          totalIgst: isOdisha ? "0.00" : (grandTotals.cgst + grandTotals.sgst).toFixed(2)
          
        },
        orderVariants
      };
  
      console.log(orderData)
      const response = await createOrder(orderData);
      console.log("Order Created:", response);
  
      alert("Order created successfully!");
      navigate('/orders');
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Check console for details.");
    }
  };
  
    

    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [codPercentage, setCodPercentage] = useState(0);
    const [onlinePercentage, setOnlinePercentage] = useState(0);

    useEffect(() => {
      if (order?.paymentTypeDiscount) {
        handleSelectPayment(order.paymentTypeDiscount);
      }
    }, [order]);
  
    // Payment selection handler
    const handleSelectPayment = (paymentType) => {
      setSelectedPayment(paymentType);
  
      // Define discounts and payment split percentages
      const paymentOptions = {
        "100%": { discount: 1.5, cod: 0, online: 100 },
        "50%": { discount: 0.5, cod: 50, online: 50 },
        "30%": { discount: 0.3, cod: 70, online: 30 },
        "25%": { discount: 0.5, cod: 75, online: 25 },
        "0%": { discount: 0, cod: 100, online: 0 },
      };
  
      const selectedOption = paymentOptions[paymentType] || { discount: 0, cod: 0, online: 0 };
      setDiscountPercentage(selectedOption.discount);
      setCodPercentage(selectedOption.cod);
      setOnlinePercentage(selectedOption.online);
    };
  
    // Grand total calculation
    const grandTotal = calculateGrandTotal(orderDetails);
    
    // Discount calculation
    const discountAmount = ((grandTotal * discountPercentage) / 100).toFixed(2);
  
    // Total after discount
    const totalAfterDiscount = (grandTotal - discountAmount).toFixed(2);
  
    // Net payable amount
    const netPayable = (totalAfterDiscount - walletDeduction).toFixed(2);
    
    
    const calculatePriceBreakdown = (
      order,
      colorObj,
      selectedDiscount = 0,
      paymentDiscount = 0,
      selectedDiscountData = null // Pass full selected discount object
    ) => {
      if (!order || !order.variant || !order.variant.variants || !colorObj) {
        return {
          baseTotal: 0,
          gstAmount: 0,
          discountAmount: 0,
          finalTotal: 0,
          gstRate: 0,
          discountPercent: 0,
        };
      }

      console.log(colorObj)
    
      const colorHex = typeof colorObj === "string"
        ? colorObj.trim().toLowerCase()
        : colorObj.hexCode?.trim().toLowerCase() || "";
    
      const matchingItem = order.variant.variants.find(item =>
        item.hexCode?.trim().toLowerCase() === colorHex
      );
    
      const weight = colorObj.weight || 0;
      const price = colorObj?.price || 0;
      // const price = matchingItem?.price || 0;
    

      const baseTotal = weight * price;
      const gstRate = order.product?.gstOnProduct || 0;
      // const gstAmount = (baseTotal * gstRate) / 100;

    
      // Check if the selected discount is applicable to this product
      let productDiscountPercent = 0;
    
      if (selectedDiscountData && Array.isArray(selectedDiscountData.applicableProducts)) {
        const isApplicable = selectedDiscountData.applicableProducts.some(
          (p) => p.id === order.productId
        );
    
        if (isApplicable) {
          productDiscountPercent = Number(selectedDiscountValue); // Apply only if product is included
        }
      }
    
      const productDiscount = productDiscountPercent;
      const paymentDiscountValue = Number(paymentDiscount);
      
      const combinedDiscountPercent = productDiscount + paymentDiscountValue - (productDiscount * paymentDiscountValue) / 100;
      
      const discount = baseTotal * (combinedDiscountPercent / 100);

      const discountedBase = baseTotal - discount;
      const gstAmount = (discountedBase * gstRate) / 100;

      const finalTotal = baseTotal - discount;
    
      return {
        baseTotal: isNaN(baseTotal) ? 0 : baseTotal,
        gstAmount: isNaN(gstAmount) ? 0 : gstAmount,
        discountAmount: isNaN(discount) ? 0 : discount,
        finalTotal: isNaN(finalTotal) ? 0 : finalTotal,
        gstRate: isNaN(gstRate) ? 0 : gstRate,
        discountPercent: combinedDiscountPercent,
        isProductDiscountApplied: productDiscountPercent > 0
      };
    };
    
  

  const paymentDescriptions = {
    "100%": "100% Online Payment",
    "50%": "50% Online + 50% COD",
    "30%": "30% Online + 70% COD",
    "25%": "25% Online + 75% COD",
    "0%": "0% Online + 100% COD",
  };

  const [selectedAddress, setSelectedAddress] = useState(
    order?.address || {}
  );


  const handleSelectAddress = (addressType) => {
    const newSelectedAddress = selectedCustomer.addresses.find(
      (address) => address.addressType === addressType
    );
    if (newSelectedAddress) {
      setSelectedAddress(newSelectedAddress);
    }
  };

  const calculateShippingCost = (orderDetails, selectedCustomer) => {
    let state = "";
  
    if (isViewMode) {
      const parts = order.shippingAddress?.split(",") || [];
      if (parts.length >= 3) {
        state = parts[parts.length - 3]?.trim().toLowerCase(); // "Odisha" etc.
      }
    } else {
      state = selectedAddress?.state?.toLowerCase();
    }
  
    if (!state) return 0;
  
    const ratePerKg = state === "odisha" ? 3 : 5;
  
    const totalWeight = orderDetails.reduce((acc, item) => {
      const colorWeight = item.colors.reduce((sum, color) => sum + (Number(color.weight) || 0), 0);
      return acc + colorWeight;
    }, 0);
  
    return Number((totalWeight * ratePerKg).toFixed(2));
  };

  // const calculateShippingCost = (orderDetails, selectedCustomer) => {

  //   if (!selectedAddress?.state) return 0;
 
  //   const customerState = selectedAddress.state.toLowerCase();

  //   const ratePerKg = customerState === "odisha" ? 3 : 5;
  
  //   const totalWeight = orderDetails.reduce((acc, item) => {
  //     const colorWeight = item.colors.reduce((sum, color) => sum + (Number(color.weight) || 0), 0);
  //     return acc + colorWeight;
  //   }, 0);
  
  //   console.log(totalWeight)
    
  
  //   return Number((totalWeight * ratePerKg).toFixed(2));

  // };

  const totalWeight = orderDetails.reduce((acc, item) => {
    const colorWeight = item.colors.reduce((sum, color) => sum + (Number(color.weight) || 0), 0);
    return acc + colorWeight;
  }, 0);
  
  
  const grandTotals = calculateGrandTotals(
    orderDetails,
    Number(discountPercentage),
    Number(selectedDiscountValue || 0),
    selectedDiscountData
  );
  
  
  const handlingCharges = calculateShippingCost(orderDetails, selectedCustomer);
  const platformFee = 49;

  const netPayablePrice =
    grandTotals.baseTotal - grandTotals.totalDiscount +
    grandTotals.cgst +
    grandTotals.sgst +
    handlingCharges +
    platformFee;

  console.log(netPayablePrice)

  const toPay = netPayablePrice - walletDeduction;

  const codAmt = (toPay * codPercentage) / 100;
  const onlineAmt = (toPay * onlinePercentage) / 100;


  const currentCustomerId = selectedCustomer?.customerId;

const filteredDiscounts = discountData.filter((discount) => {
  const isActive = discount.discountStatus?.toUpperCase().trim() === "ACTIVE";

  const matchedCustomer = discount.eligibleCustomers.find(
    (customer) => customer.customerId == currentCustomerId // use loose check
  );


  return isActive && !!matchedCustomer;
});

const handleDeleteColor = (productId, size, colorIndexToDelete) => {
  const updatedOrderDetails = orderDetails.map(order => {
    if (order.productId === productId && order.size === size) {
      const updatedColors = order.colors.filter((_, idx) => idx !== colorIndexToDelete);
      return {
        ...order,
        colors: updatedColors
      };
    }
    return order;
  }).filter(order => order.colors.length > 0); // Optional: remove order if no colors left

  setOrderDetails(updatedOrderDetails);
};



const sendInvoice = async(orderId) =>{
    const result = await emailInvoice(orderId);
      if (!result.success) {
        alert("Failed to download invoice.");
      }
      alert("Invoice sent successfully")
}


const handleStatusChange = async (orderId, orderVariantId, newStatus) => {
  const confirmed = window.confirm(`Are you sure you want to change the status to "${newStatus}"?`);
  if (!confirmed) return;

  try {
    await updateOrderVariantStatuses(orderId, [
      {
        orderVariantId,
        status: newStatus,
        reason: "Updated by admin",
        remark: "Changed from UI",
      },
    ]);

   
    setOrderDetails((prev) =>
      prev.map((item) => ({
        ...item,
        colors: item.colors.map((color) =>
          color.orderVariantId === orderVariantId
            ? {
                ...color,
                status: newStatus,
                previousStatus: newStatus === "RETURN_REQUESTED" ? color.status : undefined,
              }
            : color
        ),
        variant: {
          ...item.variant,
          variants: item.variant.variants.map((color) =>
            color.orderVariantId === orderVariantId
              ? {
                  ...color,
                  status: newStatus,
                  previousStatus: newStatus === "RETURN_REQUESTED" ? color.status : undefined,
                }
              : color
          ),
        },
      }))
    );
    
    

  } catch (err) {
    alert("Failed to update status");
    console.error(err);
  }
};


const getStateFromBillingAddress = (billingAddress) => {
  try {
    const beforePin = billingAddress.split("PIN:")[0];
    const parts = beforePin.split(",").map(p => p.trim()).filter(Boolean);
    const state = parts[parts.length - 1]?.toLowerCase(); // Safely get last non-empty entry
    return state;
  } catch (err) {
    console.error("Failed to parse billing address:", err);
    return "";
  }
};


const handleOrderChange = async () => {
  const payload = [];

  for (const orders of orderDetails) {
    for (const color of orders.colors) {
      if (color.status === "SHIPPED" || !color.weightChanged) continue; // skip unchanged or shipped

      const orderWeight = parseFloat(color.weight || 0);
      const pricePerKg = color.price || 0;
      const baseAmount = orderWeight * pricePerKg;

      // Get discount percent
      let productDiscountPercent = 0;
      if (selectedDiscountData?.applicableProducts?.some(p => p.id === orders.productId)) {
        productDiscountPercent = Number(selectedDiscountValue) || 0;
      }
      const paymentDiscountValue = Number(discountPercentage) || 0;
      const combinedDiscountPercent = productDiscountPercent + paymentDiscountValue - (productDiscountPercent * paymentDiscountValue) / 100;

      const discount = (baseAmount * combinedDiscountPercent) / 100;
      
      const stateForShipping = getStateFromBillingAddress(order.shippingAddress);
      const ratePerKg = stateForShipping === "odisha" ? 3 : 5;
      const handling = orderWeight * ratePerKg;

      const taxableAmount = baseAmount - discount + handling;

      const gst = orders.product?.gstOnProduct || 0;
      const state = getStateFromBillingAddress(order.billingAddress);

      console.log(gst)

      let cgst = 0, sgst = 0, igst = 0;

      if (state === "odisha") {
        cgst = (gst / 2 / 100) * taxableAmount;
        sgst = (gst / 2 / 100) * taxableAmount;
      } else {
        igst = (gst / 100) * taxableAmount;
      }

      const total = taxableAmount + cgst + sgst + igst;

      payload.push({
        orderVariantId: color.orderVariantId,
        orderWeight,
        orderVariantCgst: Number(cgst.toFixed(2)),
        orderVariantSgst: Number(sgst.toFixed(2)),
        orderVariantIgst: Number(igst.toFixed(2)),
        orderVariantDiscount: Number(discount.toFixed(2)),
        orderVariantHandlingCharges: Number(handling.toFixed(2)),
        orderVariantTotalAmount: Number(total.toFixed(2))
      });
    }
  }

  try {
    if (payload.length === 0) {
      alert("No changes to update.");
      return;
    }

    console.log(payload);
    await updateOrderVariants(order.orderId, payload);
    alert("Order updated successfully!");
    setWeightChanged(false); 
  } catch (err) {
    console.error(err);
    alert("Failed to update order");
  }
};



  console.log(orderDetails)  
  console.log(selectedAddress)


  return (
    <div className='create-order'>
        <div className='top d-flex gap-3 mb-2 mt-2' style={{cursor:'pointer'}}>
            <span onClick={() => navigate('/orders')}><IoArrowBackOutline size={25}/></span>
           { Object.keys(order).length === 0 ? (
            <h5 style={{fontSize:'1.2rem'}}>Create Order</h5>

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
            <div className='left col-xl-12 col-lg-12 col-md-12 col-12'>
                <div className='products bg-white p-4 mb-3 rounded'>
                    <h6>Order Details</h6>
                    
                    <div className='d-flex justify-content-center gap-2 mb-1 mt-3 border-bottom pb-5'>
                    {/* <SearchBox></SearchBox> */}
                    <div>
                    {isViewMode ? (
                      <div>
                      </div>
                    ):(
                    <button className='btn btn-sm btn-primary' onClick={() => setShowModalOrder(true)}>Browse Color Catalouge</button>
                    )}
                    </div>
                    </div>
                    {orderDetails.length > 0 && (
                        <div className="order-detail">
                            {/* Table */}
                            <table className="table ">
                            {/* Table Header */}
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
                                    {isViewMode && (
                                    <th  style={{ textAlign: 'center', verticalAlign: 'middle'}}   className='fw-medium'>Status</th>
                                    )}
                                     {isViewMode && (
                                    <th className='fw-medium'></th>
                                     )} 
                                    <th></th>
                                    {/* <th className='fw-medium' style={{textAlign:"center"}}>GST</th> */}
                                    {/* <th className='fw-medium' style={{textAlign:"end"}}>Total</th> */}
                                </tr>
                            </thead>

                            <tbody>
                              {orderDetails.map((order, index) => {
                                  // Initialize total price variables
                                  let totalBasePrice = 0;
                                  let totalGSTAmount = 0;
                                  let totalFinalPrice = 0;

                                  return (
                                      <tr key={index}>
                                          {/* Product Name */}
                                          <td>{order.productName}</td>

                                          {/* Size */}
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
                                                  {order.size}
                                              </div>
                                          </td>

                                          {/* Colors Column */}
                                          <td  style={{ justifyItems: 'center'}}>
                                              <div className="d-flex flex-column gap-1">
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

                                          <td style={{ textAlign: 'center'}}>
                                              <div className="d-flex flex-column gap-3">
                                                  {order.colors.map((colorObj, colorIndex) => (
                                                      <div
                                                          key={colorIndex}
                                                      >{colorObj.colorName}</div>
                                                  ))}
                                              </div>
                                          </td>

                                          <td  style={{ justifyItems: 'center'}}>
                                          <div className="d-flex flex-column gap-3">
                                              {order.colors.map((colorObj, colorIndex) => (
                                                 isViewMode ? (
                                                  // Show plain text in view mode
                                                  <span key={colorIndex} className=" w-75">
                                                      {colorObj.type || 'N/A'}
                                                  </span>
                                                 ):(
                                                <select
                                                  key={colorIndex}
                                                  className="form-select form-select-sm"
                                                  value={colorObj.type || "Cone"}
                                                  onChange={(e) =>
                                                    handleTypeChange(order.productId, order.size, colorIndex, e.target.value)
                                                  }
                                                  disabled={isViewMode}
                                                >
                                                  <option value="Cone">Cone</option>
                                                  <option value="Hank">Hank</option>
                                                </select>
                                                 )
                                              ))}
                                            </div>
                                          </td>

                                          {/* Weight Inputs Column */}
                                          <td style={{ width: '8rem' }}>
                                          <div className="d-flex flex-column align-items-center">
                                          {order.colors.map((colorObj, colorIndex) => (
                                                    // isViewMode ? (
                                                    //     // Show plain text in view mode
                                                    //     <span key={colorIndex} className="mb-1 p-1 w-75">
                                                    //         {colorObj.weight || 'N/A'}
                                                    //     </span>
                                                    // ) : (
                                                        // Show input field in edit mode
                                                        <input
                                                        key={colorIndex}
                                                        type="number"
                                                        style={{ border: '1px solid' }}
                                                        placeholder="Weight"
                                                        className="rounded border-secondary-subtle weight-input ps-2 mb-3 w-75"
                                                        value={colorObj.weight || ''}
                                                        onChange={(e) =>
                                                          handleWeightChange(order.productId, order.size, colorIndex, e.target.value)
                                                        }
                                                        disabled={["SHIPPED", "CANCELLED", "DELIVERED", "RETURN_REQUESTED", "RETURNED", "RETURN_REJECTED"].includes(colorObj.status)}
                                                      />
                                                    // )
                                                ))}
                                            </div>
                                        </td>

                                          {/* Price Calculation */}
                                          <td style={{ textAlign: 'center'}} colSpan="5">
                                              <div className="">
                                              {order.colors.map((colorObj, colorIndex) => {
                                                    const { 
                                                      baseTotal,
                                                      gstAmount,
                                                      finalTotal,
                                                      gstRate,
                                                      discountPercent,
                                                      isProductDiscountApplied
                                                     } = calculatePriceBreakdown(order, colorObj ,selectedDiscountValue, discountPercentage , selectedDiscountData);

                                                    return (
                                                        <div key={colorIndex} className="d-flex justify-content-between mb-3">
                                                            <span>₹{baseTotal.toFixed(2)}</span>
                                                            {/* <span>₹{gstAmount.toFixed(2)} ({gstRate}%)</span> */}
                                                            <span>
                                                              {discountPercent.toFixed(2)}
                                                            </span>
                                                            {/* <span>{gstRate}%</span> */}
                                                            <span>₹{finalTotal.toFixed(2)}</span>
                                                            <span>{gstRate/2}%</span>
                                                            <span>{gstRate/2}%</span>
                                                        </div>
                                                    );
                                                })}
                                              </div>
                                          </td>

                                          {isViewMode && (
                                          <td>
                                            <div className="d-flex flex-column gap-3">
                                              {order.colors.map((colorObj, colorIndex) => {
                                                const currentStatus = colorObj.status;
                                                const currentIndex = statusFlow.indexOf(currentStatus);
                                                const isFinalStatus = ["DELIVERED", "RETURNED", "CANCELLED"].includes(currentStatus);

                                                return (
                                                  <div
                                                    key={colorIndex}
                                                    className="d-flex align-items-center justify-content-center"
                                                  >
                                                    {/*  Show plain text for RETURNED or RETURN_REJECTED */}
                                                    {["RETURNED", "RETURN_REJECTED"].includes(currentStatus) ? (
                                                      <span className="yellow text-capitalize">
                                                        {currentStatus.replace("_", " ")}
                                                      </span>
                                                    ) : (
                                                      <select
                                                        value={
                                                          currentStatus === "RETURN_REQUESTED"
                                                            ? colorObj.previousStatus || "DELIVERED"
                                                            : currentStatus
                                                        }
                                                        disabled={
                                                          isFinalStatus || currentStatus === "RETURN_REQUESTED"
                                                        }
                                                        onChange={(e) => {
                                                          const selectedStatus = e.target.value;

                                                            handleStatusChange(colorObj.orderId, colorObj.orderVariantId, selectedStatus);

                                                        }}
                                                      >
                                                        {statusOptions.map(({ value, label }) => {
                                                          const optionIndex = statusFlow.indexOf(value);
                                                          let shouldDisable = false;

                                                          if (isFinalStatus) {
                                                            shouldDisable = true;
                                                          } else if (currentStatus === "RETURN_REQUESTED") {
                                                            shouldDisable = true;
                                                          } else if (currentStatus === "NEW") {
                                                            shouldDisable = !["CONFIRMED", "CANCELLED"].includes(value);
                                                          } else if (currentStatus === "CONFIRMED") {
                                                            shouldDisable = optionIndex < currentIndex || value === "CANCELLED";
                                                          } else {
                                                            shouldDisable = value === "CANCELLED" || optionIndex < currentIndex;
                                                          }

                                                          // Never render RETURNED/RETURN_REJECTED/RETURN_REQUESTED unless actual status
                                                          const shouldRender =
                                                            ["RETURNED", "RETURN_REJECTED"].includes(currentStatus)
                                                              ? value === currentStatus
                                                              : !["RETURNED", "RETURN_REJECTED", "RETURN_REQUESTED"].includes(value);

                                                          return (
                                                            shouldRender && (
                                                              <option key={value} value={value} disabled={shouldDisable}>
                                                                {label}
                                                              </option>
                                                            )
                                                          );
                                                        })}
                                                      </select>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </td>
                                        )}





                                    {isViewMode && (
                                      <td style={{ justifyItems: 'center', alignContent: 'center' }}>
                                        <div className='d-flex flex-column gap-3'>
                                          {order.colors.map((colorObj, colorIndex) => (
                                            <div key={colorIndex} className="d-flex align-items-center justify-content-between position-relative">
                                              {colorObj.status === "RETURN_REQUESTED" && (
                                                <div className="position-relative">
                                                  <button
                                                    className="alert-icon-btn"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    title="Return requested for this variant"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const key = colorObj.orderVariantId;
                                                      setOpenDropdown(openDropdown === key ? null : key);
                                                    }}
                                                    
                                                  >
                                                    <div className="alert-icon-circle">
                                                      <FiAlertCircle size={16} color="red" />
                                                    </div>
                                                  </button>

                                                  {openDropdown === colorObj.orderVariantId && (
                                                    <div className="position-absolute bg-white border rounded p-2 shadow-sm" style={{ zIndex: 10 }}>
                                                      <button
                                                        className="btn btn-sm btn-outline-success mb-1 w-100"
                                                        onClick={() => handleStatusChange(colorObj.orderId, colorObj.orderVariantId, "RETURNED")}
                                                      >

                                                        Return Approve

                                                      </button>
                                                      <button
                                                        className="btn btn-sm btn-outline-danger w-100"
                                                        onClick={() => handleStatusChange(colorObj.orderId, colorObj.orderVariantId, "RETURN_REJECTED")}
                                                      >

                                                        Return Reject 

                                                      </button>
                                                    </div>
                                                  )}

                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                    )}



                                          <div className='d-flex flex-column gap-3'>
                                          {order.colors.map((colorObj, colorIndex) => (
                                          <div key={colorIndex} className="d-flex align-items-center justify-content-between">
                                      
                                          {!isViewMode && (
                                            <button
                                              className="ms-2"
                                              onClick={() => handleDeleteColor(order.productId, order.size, colorIndex)}
                                              title="Remove color"
                                              style={{
                                                border:'none',
                                                background:'transparent',
                                                color:'red'
                                              }}
                                            >
                                              <RxCross2/>
                                            </button>
                                          )}
                                        </div>
                                          ))}

                                      
                                          </div>

                                        

                                          
                                      </tr>
                                  );
                              })}
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

                <div className='right col-xl-12 col-lg-12 col-md-12'>
                <div className='ctn mb-3'>
                  {!selectedCustomer && (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3 justify-content-between">
                        <h4>Customers</h4>
                        {/* 
                        <button
                          className="btn btn-sm btn-primary d-flex align-items-center gap-2"
                          onClick={() => setShowModalCustomer(true)}
                        >
                          <IoAddCircleOutline size={20} /> 
                        </button> 
                        */}
                      </div>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />

                      <ModalCustomer
                        show={showModalCustomer}
                        handleClose={() => setShowModalCustomer(false)}
                        onSubmit={handleAddCustomer}
                      />

                      {searchTerm.trim() !== "" && filteredCustomers.length > 0 && (
                        <div className="customer-list mt-3">
                          <h4>Results</h4>
                          <ul>
                            {filteredCustomers.map((customer, index) => (
                              <li
                                key={index}
                                onClick={() => handleSelectCustomer(customer)}
                                style={{ cursor: 'pointer' }}
                              >
                                <h5>{customer.customerName}</h5>
                                <span>{customer.phoneNumber}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                {selectedCustomer && (
                  <div className='selected-customer mt-2'>
                    <div className='d-flex flex-column flex-md-row justify-content-between align-items-start position-relative gap-3'>

                      {/* Dropdown + RxCross Button Row */}
                      <div className='position-absolute' style={{ top: 0, right: 0, zIndex: 2 }}>
                        <div className='d-flex align-items-center gap-2'>

                          {/* Address Dropdown */}
                          {!isViewMode && (
                            <Dropdown onSelect={handleSelectAddress} style={{ width: "8.5rem" }}>
                              <Dropdown.Toggle variant="light" id="dropdown-basic" className='w-100'>
                                {selectedAddress.addressType || "Select Address"}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {selectedCustomer.addresses.map((address, index) => (
                                  <Dropdown.Item key={index} eventKey={address.addressType}>
                                    {address.addressType}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          )}

                          {/* RxCross Close Button */}
                          {!isViewMode && (
                            <button
                              onClick={handleDeselectCustomer}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.3rem',
                                cursor: 'pointer'
                              }}
                              className='cross-btn'
                            >
                              <RxCross2 />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="flex-grow-1">
                        <div className='mb-2'>
                          <h4>Customer</h4>
                          <p>{selectedCustomer.customerName}</p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex-grow-1">
                        <div className='mb-2'>
                          <h4 className='d-flex justify-content-between'>Contact Information</h4>
                          <p>{selectedCustomer.email}</p>
                          <p>{selectedCustomer.phoneNumber}</p>
                        </div>
                      </div>


                        {isViewMode && (
                            <div className="flex-grow-1">
                            <h4>Billing Address</h4>
                              <p className="text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                          </div>
                        )}
                    

                      {/* Shipping Address */}
                      <div className="flex-grow-1">
                        <h4>Shipping Address</h4>
                        {isViewMode ? (
                          <p className="text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                        ) : (
                          <>
                            <p>{selectedAddress?.street}</p>
                            <p>{selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.zipCode}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </div>

            
        <div className="row mb-3 g-3">
          <div className="col-12 col-md-6">
            <div className="ctn bg-white rounded p-3">
              <h5 style={{fontSize:'1rem'}}>Discounts</h5>

              {isViewMode === true ? (
                <div>
                  <p>
                    {selectedDiscount
                      ? `${selectedDiscount} - ${selectedDiscountValue}% Off`
                      : "Select Discount"}
                  </p>
                </div>
              ) : (
                <Dropdown
                  onSelect={handleSelectDiscount}
                  size="sm"
                  className="status mt-2"
                >
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-basic"
                    className="d-flex align-items-center justify-content-between gap-2 w-100 border rounded"
                  >
                    <p className="m-0 text-primary">
                      {selectedDiscount
                        ? `${selectedDiscount} - ${selectedDiscountValue}% Off`
                        : "Select Discount"}
                    </p>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-75">
                    {filteredDiscounts.map((item, index) => (
                      <Dropdown.Item key={index} eventKey={item.discountCode}>
                        <div>
                          <strong>{item.discountCode}</strong>
                          <br />
                          <small>
                            {item.discountValue}% off on{" "}
                            {item.applicableProducts[0]?.productName || "this product"}
                          </small>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </div>

              <div className="col-12 col-md-6">
                <div className="ctn bg-white rounded p-3">
                  <h5 style={{fontSize:'1rem'}}>Payment Type</h5>

                  {isViewMode === true ? (
                    <div>
                      <p>{paymentDescriptions[selectedPayment]}</p>
                    </div>
                  ) : (
                    <Dropdown
                      onSelect={handleSelectPayment}
                      size="sm"
                      className="status mt-2"
                    >
                      <Dropdown.Toggle
                        variant="light"
                        id="dropdown-basic"
                        className="d-flex align-items-center justify-content-between gap-2 w-100 border rounded"
                      >
                        <p className="m-0 text-primary">
                          {paymentDescriptions[selectedPayment] || "Select Payment Type"}
                        </p>
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="w-75">
                        <Dropdown.Item eventKey={"100%"}>
                          <div className="p-2 border-bottom">
                            <h6 className="text-md font-normal">
                              <span className="text-primary">100%</span> Online Payment
                            </h6>
                            <h6>1.50% discount will be applied.</h6>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item eventKey={"50%"}>
                          <div className="p-2 border-bottom">
                            <h6 className="text-md font-normal">
                              <span className="text-primary">50%</span> Online +{" "}
                              <span className="text-primary">50%</span> COD
                            </h6>
                            <h6>0.50% discount will be applied.</h6>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item eventKey={"30%"}>
                          <div className="p-2 border-bottom">
                            <h6 className="text-md font-normal">
                              <span className="text-primary">30%</span> Online +{" "}
                              <span className="text-primary">70%</span> COD
                            </h6>
                            <h6>0.30% discount will be applied.</h6>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item eventKey={"25%"}>
                          <div className="p-2 border-bottom">
                            <h6 className="text-md font-normal">
                              <span className="text-primary">25%</span> Online +{" "}
                              <span className="text-primary">75%</span> COD
                            </h6>
                            <h6>0.50% discount will be applied.</h6>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item eventKey={"0%"}>
                          <div className="p-2 border-bottom">
                            <h6 className="text-md font-normal">
                              <span className="text-primary">0%</span> Online +{" "}
                              <span className="text-primary">100%</span> COD
                            </h6>
                            <h6>No discount will be applied.</h6>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              </div>
            </div>


          
            
            

                <div className='payment bg-white p-4 rounded' id="invoice-to-download" ref={invoiceRef}>
                    <h4>Payment</h4>

                    <div  className='container border p-3 rounded mb-3' >

                <table className="w-100 rounded mt-2 font-semibold">
                  <tbody>
                   
                    <tr>
                      <td className=" fw-medium ">Total Cost</td>
                      <td>{orderDetails.reduce((acc, item) => acc + (item.colors.length || 0), 0)} items</td>
                      <td style={{ textAlign: "end" }}>₹{calculateGrandTotal(orderDetails).toFixed(0)}</td>
                    </tr>

                   
                    <tr className='border-bottom'>
                      <td>
                        <div>
                          <p className=" fw-medium pt-2">Total Discount</p>
                          <p className="text-black-50  fw-medium my-2 ps-5" >By Payment Type</p>
                          <p className="text-black-50 fw-medium pb-2 ps-5">By Coupon Code</p>
                        </div>
                      </td>

                      <td>
                      <div>
                      <p>
                          {(
                            Number(discountPercentage) +
                            Number(selectedDiscountValue || 0) -
                            (Number(discountPercentage) * Number(selectedDiscountValue || 0)) / 100
                          ).toFixed(2)}%
                        </p>
                        <p>{discountPercentage}%</p>
                        <p className="text-gray-400">{selectedDiscountValue || 0}%</p>
                      </div>
                      </td>

                      <td>
                        <div>
                          <p className="text-end">
                            ₹{grandTotals.totalDiscount.toFixed(0)}
                          </p>
                          <p className="text-gray-400 text-end">
                            ₹{(grandTotals.totalPaymentTypeDiscount).toFixed(0)}
                          </p>
                          <p className="text-gray-400 text-end">
                            ₹{grandTotals.totalCouponTypeDiscount.toFixed(0)}
                          </p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className=" fw-medium pt-4">Final Cost</td>
                        <td></td>
                        <td className="text-end">₹{grandTotals.baseTotal-grandTotals.totalDiscount.toFixed(0)}</td>
                    </tr>

                    <tr>
                      <td className=" fw-medium pt-2">CGST</td>
                        <td></td>
                        <td className="text-end">₹{grandTotals.cgst.toFixed(0)}</td>
                    </tr>

                    <tr>
                      <td className=" fw-medium pt-2">SGST</td>
                        <td></td>
                        <td className="text-end">₹{grandTotals.sgst.toFixed(0)}</td>
                    </tr>
                    

                   
                    <tr>
                      <td className=" fw-medium pt-2">Handling Charges</td>
                      <td></td>
                      {/* <td className="text-end">₹{((calculateGrandTotal(orderDetails) * 5) / 100).toFixed(2)}</td> */}
                      <td className="text-end">₹{calculateShippingCost(orderDetails, selectedCustomer)}</td>
                    </tr>


                    <tr className="border-bottom">
                      <td className="fw-medium pt-2 pb-4">Platform Fee</td>
                      <td></td>
                      {/* <td className="text-end">₹{((calculateGrandTotal(orderDetails) * 5) / 100).toFixed(2)}</td> */}
                      {/* <td className="text-end">₹{calculateGrandTotal(orderDetails).toFixed(2)-((calculateGrandTotal(orderDetails) * (discountPercentage + (Number(selectedDiscountValue) || 0))) / 100)+49}</td> */}
                      <td className='text-end'>₹49</td>
                    </tr>
                  
                    <tr>
                      <td className='fw-medium pt-4 pt-2'>Net Pay</td>
                      <td ></td>
                      <td className='text-end'>₹{(netPayablePrice).toFixed(0)}</td>
                      {/* <td className="text-end pt-3">₹{calculateTotalAmount()}</td> */}
                    </tr>


                    <tr className="border-bottom">
                      <td className="fw-medium pt-2 pb-4 ">Wallet</td>
                      <td className="pb-3 pt-2">{walletBalances.toFixed(2)}</td>
                      <td style={{ textAlign: "end" }} className="pb-3 pt-2">
                      ₹ {isViewMode ? (
                              // Show plain text in view mode
                              <span>{walletDeduction ? `${walletDeduction}` : "0"}</span>
                          ) : (
                              // Show input field in edit mode
                              <input
                                  className="border border-secondary-subtle rounded-1 ps-2 text-end p-1"
                                  type="number"
                                  placeholder="Enter amount"
                                  value={walletDeduction}
                                  onChange={(e) => handleWalletDeductionChange(e.target.value)}
                                  min="0"
                                  max={walletBalances}
                                  disabled={isViewMode}
                              />
                          )}
                      </td>
                  </tr>

                  
                    <tr className="border-bottom">
                      <td className=" fw-medium py-4">To Pay</td>
                      <td></td>
                      <td className='text-end'>₹{(toPay).toFixed(0)}</td>
                      {/* <td className="text-end pb-3 pt-2">₹{netPayable}</td> */}
                    </tr>

                    <tr>
                      <td className="fw-medium pt-4 ">Advance Paid</td>
                      <td>{onlinePercentage}%</td>
                      <td className="text-end">₹{((toPay * onlinePercentage) / 100).toFixed(0)}</td>
                    </tr>

                    <tr>
                      <td className="fw-medium py-2">Balance Due</td>
                      <td className="pt-2">{codPercentage}%</td>
                      <td className="text-end pt-2">₹{((toPay * codPercentage) / 100).toFixed(0)}</td>
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

                    {/* <ReactWhatsapp number={selectedCustomer.whatsappNumber} message={"hdshuihuih"}>
                        <button className="whatsapp-btn">Send on WhatsApp</button>
                    </ReactWhatsapp> */}


                    {orderDetails.length > 0 && (
                      <div className='d-flex justify-content-end w-100'>
                        {isViewMode ? (
                          weightChanged ? (
                            <Button className='btn-sm' onClick={handleOrderChange}>Save Changes</Button>
                          ) : (
                            <Button className='btn-sm' onClick={() => sendInvoice(order.orderId)}>Send Invoice</Button>
                          )
                        ) : (
                          <Button className='btn-sm' onClick={handleCreateOrder}>Create Order</Button>
                        )}
                      </div>
                    )}

                   

                </div>
            </div>
            

            
        </div>
    </div>
  )
}
)

export default CreateOrder


