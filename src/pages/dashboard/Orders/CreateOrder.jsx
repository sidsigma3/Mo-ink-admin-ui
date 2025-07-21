
import React , {useState , useEffect , useMemo , useRef , forwardRef , useImperativeHandle} from 'react'
import SearchBox from '../../../components/SearchBox/SearchBox'
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate ,useLocation, json } from 'react-router-dom';
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
import { Segment } from 'react';
import { getAllDiscount } from '../../../services/DiscountService';
import { createOrder, getCodOrderById , sendCodOrderById} from '../../../services/OrderService';
import emailjs from 'emailjs-com';
import ReactWhatsapp from 'react-whatsapp';
import html2pdf from 'html2pdf.js';
import { FiAlertCircle } from "react-icons/fi";
import { emailInvoice } from '../../../services/InvoiceServices';
import ModalCancelOrder from '../../../components/Modal/ModalCancelOrder';
import ModalConfirmOrder from '../../../components/Modal/ModalConfirmOrder';
import ModalManufactureOrder from '../../../components/Modal/ModalManufactureOrder';
import ModalShipOrder from '../../../components/Modal/ModalShipOrder';
import ModalDeliverOrder from '../../../components/Modal/ModalDeliverOrder';
import ModalReturnOrder from '../../../components/Modal/ModalReturnOrder';
import Tooltip from '../../../components/Tooltip/Tooltip';
import { RiFilePaper2Line } from 'react-icons/ri';
import ModalSendInvoice from '../../../components/Modal/ModalSendInvoice';
import Toast from "../../../components/Toast/Toast";
import ModalCollectAmount from '../../../components/Modal/ModalCollectAmount';


const backendUrl = process.env.REACT_APP_IMAGE_URL

const ConfirmWeightChangeModal = ({ onConfirm, onCancel }) => (
  <div className="sorder-overlay">
    <div className="sorder-box">
      <button className="sorder-close" onClick={onCancel}>
        &times;
      </button>
      <div className="sorder-icon sorder-icon--primary">
        <span>!</span>
      </div>
      <h2 className="sorder-title">Confirm Weight Change?</h2>
      <p className="sorder-message">
        This will save the updated weights and recalculate totals. Are you sure you want to proceed?
      </p>
      <div className="sorder-actions">
        <button className="sorder-btn sorder-btn--outline" onClick={onCancel}>
          Cancel
        </button>
        <button className="sorder-btn sorder-btn--primary" onClick={onConfirm}>
          Yes, Save Changes
        </button>
      </div>
    </div>
  </div>
);


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
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [selectedVariantForModal, setSelectedVariantForModal] = useState(null);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const [toasts, setToasts] = useState([]);

    console.log(isModalOpen)
    console.log(selectedOrderId)
    const onClickSaveWeightChanges = () => {
      setShowConfirmModal(true);
    };
    
    const confirmWeightChange = async () => {
      setShowConfirmModal(false);
      await handleOrderChange();
    };
    
    const cancelWeightChange = () => {
      setShowConfirmModal(false);
    };
    

   const user = JSON.parse(localStorage.getItem('userData'));


   
   const filteredCustomers = customers.filter((customer) =>
      customer?.customerStatus === "ACTIVE" &&
      (
        customer?.customerName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        customer?.phoneNumber?.includes(searchTerm)
      )
    );


    const [modalData, setModalData] = useState({
      isOpen: false,
      orderId: null,
      variantId: null,
      status: null,
    });


    const statusOptions = [
      { value: "NEW", label: "New Order" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "CONFIRMED", label: "Confirmed" },
      { value: "MANUFACTURING", label: "Manufactured" },
      { value: "SHIPPED", label: "Shipped" },
      { value: "DELIVERED", label: "Delivered" },
      { value: "RETURNED", label: "Returned" },
      { value: "RETURN_REQUESTED", label: "Return Requested" },
      { value: "RETURN_REJECTED", label: "Return Rejected" },
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

    const [transactionsCod, setTransactionsCod] = useState([]);

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

      const refreshAllProducts = async () => {
        try {
          const data = await getAllProduct();
          setProductData(data.data); // update all products
        } catch (error) {
          console.error("Failed to refresh all products", error);
        }
      };


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



            const fetchCodTransactions = async (orderId) => {
              try {
                const res = await getCodOrderById(orderId);
                const codTransactions = res.data?.paymentCodTransactions || [];

                const formattedTransactions = codTransactions.map((tx) => ({
                  transactionId: tx.razorpayReferenceId,
                  date: tx.paidAt,
                  payType: 'Online Payment Link',
                  amountCollected: tx.amountPaid,
                  remaining: tx.remainingAmount
                }));

                setTransactionsCod(formattedTransactions);
              } catch (error) {
                console.error("Failed to fetch COD transactions:", error);
              }
            };



            useEffect(() => {
              fetchCodTransactions(order?.orderId); // Make sure orderId is available
            }, [order?.orderId]);


            const aggregateProductData = (productData) => {
              return productData.map((product) => {
                const groupedVariants = product.variants.reduce((acc, variant) => {
                  const { size, color, availableWeight, id, pricePerKg, markupPricePerKg, variantType } = variant;
            
                  if (!acc[size]) {
                    acc[size] = {
                      id,
                      size,
                      variants: [],
                      totalWeight: 0,
                    };
                  }
            
                  const hex = color.colorCode?.toLowerCase() || "#ccc";
                  const colorKey = `${color.colorName}-${hex}`;
            
                  let colorGroup = acc[size].variants.find((v) => `${v.colorName}-${v.hexCode?.toLowerCase()}` === colorKey);
            
                  if (!colorGroup) {
                    colorGroup = {
                      colorName: color.colorName,
                      hexCode: hex,
                      variants: [],
                    };
                    acc[size].variants.push(colorGroup);
                  }
            
                  colorGroup.variants.push({
                    variantType: variantType?.toLowerCase() || "unknown",
                    available: availableWeight,
                    price: pricePerKg,
                    id,
                    markupPricePerKg,
                    colorImage:color.colorImage,
                  });
            
                  acc[size].totalWeight += Number(availableWeight);
            
                  return acc;
                }, {});
            
                return {
                  productId: product.id,
                  productName: product.productName,
                  productDescription: product.productDescription,
                  productImage: product.productImage,
                  compareAtPrice: product.productPrice?.compareAtPrice,
                  costPerItemPerKg: product.productPrice?.costPerItemPerKg,
                  gstOnProduct: product.gstOnProduct,
                  pricePerKg: product.productPrice?.pricePerKg,
                  availableStatus: product.availableStatus,
                  groupedVariants: Object.values(groupedVariants),
                };
              });
            };
          
    // const finalData = aggregateProductData(productData)

    const finalData = useMemo(() => {
      return aggregateProductData(productData);
    }, [productData]);
    

    console.log(finalData)
  
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

      const handleWeightChange = (orderIndex, newWeight) => {
        setWeightChanged(true)

        const updatedWeight = parseFloat(newWeight || 0);
        const updatedOrderDetails = [...orderDetails];
      
        updatedOrderDetails[orderIndex] = {
          ...updatedOrderDetails[orderIndex],
          color: {
            ...updatedOrderDetails[orderIndex].color,
            weight: updatedWeight,
            weightChanged: true,
          }
        };
      
        setOrderDetails(updatedOrderDetails);
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
    
        const flatDetails = [];
    
        order.orderVariantResponse.forEach((variant) => {
            const {
                size,
                color,
                orderVariantId,
                orderWeight,
                variantType,
                productId,
                status,
                statusReason,    
                returnWeight,
                statusRemark
            } = variant;
    
            const product = finalData.find(p => p.productId === productId);
            if (!product) return;
    
            // Find size group in finalData
            const sizeGroup = product.groupedVariants?.find(gv => gv.size === size);
            if (!sizeGroup) return;
    
            // Find matching color in the size group
            const matchingColor = sizeGroup?.variants?.find(c => c.hexCode?.toLowerCase() === color.colorCode?.toLowerCase());
            if (!matchingColor) return;
    
            // Find the specific variant for the variantType (e.g., 'cone' or 'hank')
            const variantDetails = matchingColor.variants.find(v => v.variantType.toLowerCase() === variantType.toLowerCase());
            if (!variantDetails) return;
    
            flatDetails.push({
                productId: product.productId,
                productName: product.productName,
                size: size,
                color: {
                    id: color.id,
                    name: color.colorName,
                    hex: color.colorCode,
                    colorImage:color.colorImage,
                    weight: parseFloat(orderWeight) || 0,
                },
                variantType,
                price: variantDetails.price || 0,
                available: variantDetails.available || 0,
                costPerKg: matchingColor.costPerItemPerKg || 0,
                markupPricePerKg: variantDetails.markupPricePerKg || 0,
                gstOnProduct: product.gstOnProduct || 0,
                productImage: product.productImage || ["null"],
                variantId: orderVariantId,
                status,
                statusReason,
                returnWeight,
                statusRemark,
                orderId: order.orderId
            });
        });
    
        return flatDetails;
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
        "NEW": "blue",
        "SHIPPED": "yellow",
        "MANUFACTURING": "purple",
        "DELIVERED": "green",
        "CANCELLED": "red",
        // "Returned": "grey",
        "RETURNED": "purple",
        "CONFIRMED": "muted-clay",
        
        };



   
    const [walletBalances, setWalletBalances] = useState(0);
    const walletAmount = order?.payment?.walletAmount || 0;
    const cancelRefundAmount = order?.payment?.cancelRefundAmount || 0;

    const [walletDeduction, setWalletDeduction] = useState(
      walletAmount > cancelRefundAmount ? walletAmount - cancelRefundAmount : 0
    );


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


  console.log(walletDeduction)

    const calculateGrandTotal = (orderDetails = []) => {
      if (!Array.isArray(orderDetails)) return 0; // Ensure orderDetails is an array
    
      return orderDetails.reduce((grandTotal, order) => {
        if (!order || !Array.isArray(order.colors) || !order.variant?.variants) {
          return grandTotal; // Skip invalid order items
        }
    
        const orderTotal = order.colors.reduce((total, colorObj) => {
          if (!colorObj) return total; // Skip invalid color objects
    
          if (colorObj.status === 'CANCELLED') return total

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
  let totalDiscount = 0;
  let totalPaymentTypeDiscount = 0;
  let totalCouponTypeDiscount = 0;
  let totalFinalTotal = 0;
  let totalWeight = 0;
  let totalBaseTotal = 0;


  for (const order of orderDetails) {
    if (!order || order.status === 'CANCELLED') continue;
    const weight = parseFloat(order.color.weight) || 0;
    const price = order.price || 0;
    totalBaseTotal += weight * price;
    totalWeight += weight;
  }

  const minReq = selectedDiscountData?.minPurchaseRequirement || "";
  let globalDiscountAllowed = true;

  if (minReq.includes("Minimum purchase amount")) {
    const amountMatch = minReq.match(/\₹\s?(\d+)/);
    const minAmount = amountMatch ? Number(amountMatch[1]) : 0;
    globalDiscountAllowed = totalBaseTotal >= minAmount;
  } else if (minReq.includes("Minimum quantity required")) {
    const qtyMatch = minReq.match(/(\d+)/);
    const minQty = qtyMatch ? Number(qtyMatch[1]) : 0;
    globalDiscountAllowed = totalWeight >= minQty;
  }


  for (const order of orderDetails) {
    if (!order || order.status === 'CANCELLED') continue;

    const weight = parseFloat(order.color.weight) || 0;
    const price = order.price || 0;
    const gstRate = order.gstOnProduct || 0;
    const rawTotal = weight * price;

    const isCouponApplicable = selectedDiscountData?.applicableProducts?.some(
      (product) => product.id === order.productId
    );

    // 🔥 Apply coupon discount based on type
   // Parse and check min purchase requirement
      const minReq = selectedDiscountData.minPurchaseRequirement || "";
      let discountAllowed = true;

      if (minReq.includes("Minimum purchase amount")) {
        const amountMatch = minReq.match(/\₹\s?(\d+)/);
        const minAmount = amountMatch ? Number(amountMatch[1]) : 0;
        discountAllowed = totalBaseTotal >= minAmount;
      } else if (minReq.includes("Minimum quantity required")) {
        const qtyMatch = minReq.match(/(\d+)/);
        const minQty = qtyMatch ? Number(qtyMatch[1]) : 0;
        discountAllowed = totalWeight >= minQty;
      }

// Then apply discount only if applicable and allowed
    const couponDiscountAmount = isCouponApplicable && discountAllowed
      ? selectedDiscountData.discountType === "FixedAmount"
        ? Number(selectedDiscountData.discountValue)
        : (rawTotal * couponDiscount) / 100
      : 0;


    const subtotalAfterCoupon = rawTotal - couponDiscountAmount;

    // Apply payment method discount
    const paymentDiscountAmount = (subtotalAfterCoupon * paymentDiscount) / 100;

    const discountedTotal = subtotalAfterCoupon - paymentDiscountAmount;
    const gstAmount = (discountedTotal * gstRate) / 100;

    const finalTotal = discountedTotal + gstAmount;
    const totalItemDiscount = couponDiscountAmount + paymentDiscountAmount;

    // Accumulate totals
    baseTotal += rawTotal;
    totalCouponTypeDiscount += couponDiscountAmount;
    totalPaymentTypeDiscount += paymentDiscountAmount;
    totalDiscount += totalItemDiscount;
    totalGst += gstAmount;
    totalFinalTotal += finalTotal;
  }

  return {
    baseTotal,
    totalGst,
    totalDiscount,
    totalFinalTotal,
    totalCouponTypeDiscount,
    totalPaymentTypeDiscount,
    cgst: totalGst / 2,
    sgst: totalGst / 2,
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

      console.log(selectedDiscountData)

    
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
  
      const homeAddress = selectedCustomer?.addresses?.find(addr => addr.addressType === "HOME");
      const isOdisha = homeAddress?.state?.toLowerCase() === "odisha";
  
      // Calculate total weight for proportional handling charges
      const totalWeight = orderDetails.reduce((sum, order) => {
        return sum + (Number(order.color.weight) || 0);
      }, 0);
  
      const orderVariants = orderDetails
        .filter(order => order.variantId && order.color?.weight > 0)
        .map(order => {
          const breakdown = calculatePriceBreakdown(
            { ...order.color,gstOnProduct:order.gstOnProduct,price:order.price, },
            selectedDiscountValue,
            discountPercentage,
            selectedDiscountData
          );

          console.log(breakdown)
  
          const gstRate = breakdown.gstRate || 0;
          const gstAmount = breakdown.gstAmount || 0;
          const weight = Number(order.color.weight) || 0;
  
          const proportionalHandlingCharge =
            totalWeight > 0 ? Number(((weight / totalWeight) * handlingCharges).toFixed(2)) : 0;
  
          return {
            variantId: order.variantId,
            orderWeight: weight,
            variantType: order.variantType || "Cone",
            orderVariantCgst: Number(isOdisha ? (gstAmount / 2).toFixed(0) : "0.0"),
            orderVariantSgst: Number(isOdisha ? (gstAmount / 2).toFixed(0) : "0.0"),
            orderVariantIgst: Number(isOdisha ? "0.0" : gstAmount.toFixed(0)),
            orderVariantDiscount: Number(breakdown.discountAmount?.toFixed(0)) || "0.0",
            orderVariantHandlingCharges: proportionalHandlingCharge,
            orderVariantTotalAmount: Number((breakdown.finalTotal + gstAmount + proportionalHandlingCharge).toFixed(0)),
            status: "NEW",
            statusReason: null,
            statusRemark: null
          };
        });

      console.log(orderVariants)
  
      const totalQuantity = orderVariants.reduce((sum, item) => sum + item.orderWeight, 0);
      const totalAmount = Number(calculateTotalAmount());
  
      if (orderVariants.length === 0 || totalQuantity === 0) {
        alert("No valid variants or zero weight!");
        return;
      }
  
      const walletUsed = walletDeduction || 0;
  
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
        totalAmount: Number(toPay.toFixed(0)),
        discountId: selectedDiscountId || null,
        quantity: totalQuantity,
        paymentTypeDiscount: selectedPayment || "",
        createdByUserId:user.userId,
        payment: {
          paymentId: Date.now(),
          totalAmount: Number(toPay.toFixed(0)),
          codAmount: Number(codAmt.toFixed(0)),
          onlineAmount: Number(onlineAmt.toFixed(0)),
          transactionId: "TXN" + Date.now(),
          paidAmount: Number(onlineAmt.toFixed(0)),
          pendingAmount: Number(codAmt.toFixed(0)),
          paymentStatus: onlinePercentage === 0 ? "UNPAID" : "PARTIALLY_PAID",
          totalDiscount: Number(grandTotals.totalDiscount.toFixed(0)),
          totalSgst: Number(isOdisha ? grandTotals.sgst.toFixed(0) : "0.00"),
          totalCgst: Number(isOdisha ? grandTotals.cgst.toFixed(0) : "0.00"),
          totalIgst: Number(isOdisha ? "0.00" : (grandTotals.cgst + grandTotals.sgst).toFixed(0)),
          walletAmount: walletUsed,
          totalHandlingCharges:handlingCharges,
        },
        orderVariants
      };
  
      const response = await createOrder(orderData);
    
      showToast('Order Created successfully','success')
      navigate('/orders');
    } catch (error) {
      console.error("Error creating order:", error);
      showToast('Failed to create order','erorr')
    }
  };
  

  const handleSendPaymentLink = () => {
    console.log('hello')
    setShowModal(true);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleModalConfirm = async (amountToCollect) => {
    try {
      const res = await sendCodOrderById(order?.orderId, amountToCollect);
      alert("Payment link sent successfully!");
      // Optionally refresh transactions or state here
    } catch (error) {
      alert("Failed to send payment link.");
    } finally {
      setShowModal(false);
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
  variant,
  selectedDiscount = 0,
  paymentDiscount = 0,
  selectedDiscountData = null
) => {
  if (!variant) {
    return {
      baseTotal: 0,
      gstAmount: 0,
      discountAmount: 0,
      finalTotal: 0,
      gstRate: 0,
      discountPercent: 0,
      combinedDiscountPercent: 0,
    };
  }

  const weight = parseFloat(variant.weight) || 0;
  const price = variant.price || 0;
  const baseTotal = weight * price;
  const gstRate = variant.gstOnProduct || 0;

  let productDiscountAmount = 0;
  let productDiscountPercent = 0;
  let discountAllowed = true;

  if (
    selectedDiscountData &&
    Array.isArray(selectedDiscountData.applicableProducts)
  ) {
    const isApplicable = selectedDiscountData.applicableProducts.some(
      (p) => p.id === variant.productId
    );

    // ✅ Check minimum requirement
    const minReq = selectedDiscountData.minPurchaseRequirement || "";
    if (minReq.includes("Minimum purchase amount")) {
      const amountMatch = minReq.match(/\₹\s?(\d+)/);
      const minAmount = amountMatch ? Number(amountMatch[1]) : 0;
      discountAllowed = baseTotal >= minAmount;
    } else if (minReq.includes("Minimum quantity required")) {
      const qtyMatch = minReq.match(/(\d+)/);
      const minQty = qtyMatch ? Number(qtyMatch[1]) : 0;
      discountAllowed = weight >= minQty;
    }

    if (isApplicable && discountAllowed) {
      if (selectedDiscountData.discountType === "Percentage") {
        productDiscountPercent = Number(selectedDiscount);
        productDiscountAmount = baseTotal * (productDiscountPercent / 100);
      } else if (selectedDiscountData.discountType === "FixedAmount") {
        productDiscountAmount = Number(selectedDiscountData.discountValue);
        productDiscountPercent = (productDiscountAmount / baseTotal) * 100;
      }
    }
  }
  
  // Payment discount
  const paymentDiscountValue = Number(paymentDiscount);
  let paymentDiscountAmount = 0;
  if (paymentDiscountValue > 0) {
    const afterProductDiscountBase = baseTotal - productDiscountAmount;
    paymentDiscountAmount = afterProductDiscountBase * (paymentDiscountValue / 100);
  }

  const totalDiscountAmount = productDiscountAmount + paymentDiscountAmount;
  const discountedBase = baseTotal - totalDiscountAmount;
  const gstAmount = (discountedBase * gstRate) / 100;
  const finalTotal = discountedBase + gstAmount;
  const combinedDiscountPercent = (totalDiscountAmount / baseTotal) * 100;

  return {
    baseTotal,
    gstAmount,
    discountAmount: totalDiscountAmount,
    finalTotal,
    gstRate,
    discountPercent: productDiscountPercent,
    combinedDiscountPercent,
    isProductDiscountApplied: productDiscountPercent > 0,
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
        state = parts[parts.length - 3]?.trim().toLowerCase(); // e.g., "Odisha"
      }
    } else {
      state = selectedAddress?.state?.toLowerCase();
    }
  
    if (!state) return 0;
  
    const ratePerKg = state === "odisha" ? 3 : 5;
  
    const totalWeight = orderDetails.reduce((acc, item) => {
      if (item.status === 'CANCELLED') return acc;
      return acc + (Number(item.color?.weight) || 0);
    }, 0);
  
    return Number((totalWeight * ratePerKg).toFixed(2));
  };
  
  


  const totalWeight = orderDetails.reduce((acc, item) => {
    // If item.color is not undefined and has a weight property, use it (or adjust based on your data structure)
    const colorWeight = item.color?.weight || 0; // Assuming color weight is a property of color object
    
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

const handleDeleteColor = (productId, size, colorName, variantType) => {
  const updatedOrderDetails = orderDetails.filter(
    (order) =>
      !(
        order.productId === productId &&
        order.size === size &&
        order.color?.name === colorName &&
        order.variantType === variantType
      )
  );
  setOrderDetails(updatedOrderDetails);
};


 const showToast = (message, type = "error") => {
    setToasts([{ message, type }]);
    setTimeout(() => setToasts([]), 3000);
  };

const sendInvoice = async (orderId) => {
  try {
    const result = await emailInvoice(orderId);
    if (!result) {
      showToast("Failed to send invoice.", "error");
    } else {
      showToast("Invoice sent successfully", "success");
    }
  } catch (error) {
    showToast("An error occurred while sending the invoice.", "error");
  }
};


const handleStatusChange = async (orderId, orderVariantId, newStatus,returnWeight) => {
  try {
    await updateOrderVariantStatuses(orderId, 
      {
        returnWeight,
        orderVariantId,
        status: newStatus,
        reason: "Updated by admin",
        remark: "Changed from UI",
      },
    );

    setOrderDetails((prev) =>
      prev.map((item) =>
        item.variantId === orderVariantId
          ? {
              ...item,
              status: newStatus,
              previousStatus:
                newStatus === "RETURN_REQUESTED" ? item.status : undefined,
            }
          : item
      )
    );

    
  } catch (err) {
    const errorMessage = err?.response?.data?.message || err.message || "Unknown error";
    alert(`Failed to update status: ${errorMessage}`);
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
  const updatedVariants = [];

  for (const item of orderDetails) {
    const { color, status, price, gstOnProduct, productId, orderId, variantId } = item;

    if (status === "SHIPPED" || !color.weightChanged) continue;

    const orderWeight = parseFloat(color.weight || 0);
    const pricePerKg = parseFloat(price || 0);
    if (!orderWeight || !pricePerKg) continue;

    const baseAmount = orderWeight * pricePerKg;

    // Calculate Discount
    let productDiscountPercent = 0;
    if (selectedDiscountData?.applicableProducts?.some(p => p.id === productId)) {
      productDiscountPercent = parseFloat(selectedDiscountValue) || 0;
    }
    const paymentDiscountPercent = parseFloat(discountPercentage) || 0;

    const combinedDiscountPercent =
      productDiscountPercent + paymentDiscountPercent -
      (productDiscountPercent * paymentDiscountPercent) / 100;

    const discount = (baseAmount * combinedDiscountPercent) / 100;

    // Handling Charges
    const shippingState = getStateFromBillingAddress(order.shippingAddress);
    const ratePerKg = shippingState?.toLowerCase() === "odisha" ? 3 : 5;
    const handling = orderWeight * ratePerKg;

    const taxableAmount = baseAmount - discount;

    // GST Calculation
    const gst = parseFloat(gstOnProduct || 0);
    const billingState = getStateFromBillingAddress(order.billingAddress);

    let cgst = 0, sgst = 0, igst = 0;
    if (billingState?.toLowerCase() === "odisha") {
      cgst = (gst / 2 / 100) * taxableAmount;
      sgst = (gst / 2 / 100) * taxableAmount;
    } else {
      igst = (gst / 100) * taxableAmount;
    }

    const total = taxableAmount + cgst + sgst + igst + handling;

    const singlePayload = {
      orderVariantId: variantId,
      orderWeight,
      orderVariantCgst: Number(cgst.toFixed(0)),
      orderVariantSgst: Number(sgst.toFixed(0)),
      orderVariantIgst: Number(igst.toFixed(0)),
      orderVariantDiscount: Number(discount.toFixed(0)),
      orderVariantHandlingCharges: Number(handling.toFixed(0)),
      orderVariantTotalAmount: Number(total.toFixed(0))
    };

    updatedVariants.push({ orderId, payload: singlePayload });
  }

  try {
    if (updatedVariants.length === 0) {
      alert("No changes to update.");
      return;
    }

    for (const { orderId, payload } of updatedVariants) {
      await updateOrderVariants(orderId, payload);
    }

    showToast('Order Updated successfully','success')
    
  } catch (err) {
    console.error(err);
    showToast('Failed to update order','erorr')
  }
};



const billingAddress = order?.billingAddress 
? getStateFromBillingAddress(order.billingAddress)
: selectedCustomer?.addresses?.find((addr) => addr.addressType === "HOME").state.toLowerCase();

const isOdisha = billingAddress === "odisha";


const renderModal = () => {
  if (!modalData.isOpen) return null;

  const modalProps = {
    isOpen: modalData.isOpen,
    onCancel: () =>
      setModalData({ isOpen: false, orderId: null, variantId: null, status: null }),
    onConfirm: () => {
      handleStatusChange(modalData.orderId, modalData.variantId, modalData.status,modalData.returnWeight);
      setModalData({ isOpen: false, orderId: null, variantId: null, status: null });
    },
  };

  switch (modalData.status) {
    case "CONFIRMED":
      return <ModalConfirmOrder {...modalProps} />;
    case "MANUFACTURING":
      return <ModalManufactureOrder {...modalProps} />;
    case "SHIPPED":
      return <ModalShipOrder {...modalProps} />;
    case "DELIVERED":
      return <ModalDeliverOrder {...modalProps} />;
    case "CANCELLED":
      return <ModalCancelOrder {...modalProps} />;
    default:
      return null;
  }
};


const openReturnModal = (variant) => {
  setSelectedVariantForModal(variant);
  setIsReturnModalOpen(true);
};

const closeReturnModal = () => {
  setSelectedVariantForModal(null);
  setIsReturnModalOpen(false);
};

const handleApprove = (variant) => {
  console.log(variant)
  handleStatusChange(variant.orderId, variant.orderVariantId, "RETURNED",variant.returnWeight);
  closeReturnModal();
};

const handleReject = (variant) => {
  handleStatusChange(variant.orderId, variant.orderVariantId, "RETURN_REJECTED",variant.returnWeight);
  closeReturnModal();
};




// Testing COD Details
// Testing COD Details
// Testing COD Details
// Testing COD Details
const [transactions, setTransactions] = useState([]);
const [showAddForm, setShowAddForm] = useState(false);
const [newTransaction, setNewTransaction] = useState({
  transactionId: '',
  date: new Date().toISOString().split('T')[0],
  payType: '',
  amountCollected: 0,
  remaining: 0
});

const remainingBalance = useMemo(() => {
  const openingBalance = isViewMode === true ? 
    (order?.payment.pendingAmount - order?.payment.totalAdjustedAmount) :
    ((toPay * codPercentage) / 100);
  
  const totalCollected = transactions.reduce((sum, transaction) => sum + transaction.amountCollected, 0);
  return Math.max(0, openingBalance - totalCollected);
}, [transactions, isViewMode, order, toPay, codPercentage]);

const handleAddPayment = () => {
  setShowAddForm(true);
  setNewTransaction({
    ...newTransaction,
    transactionId: `TXN${Date.now()}`,
    remaining: remainingBalance
  });
};

const handleSaveTransaction = () => {
  if (!newTransaction.transactionId || !newTransaction.payType || newTransaction.amountCollected <= 0) {
    alert('Please fill all required fields');
    return;
  }

  const calculatedRemaining = Math.max(0, remainingBalance - newTransaction.amountCollected);
  
  const transactionToAdd = {
    id: Date.now(),
    ...newTransaction,
    remaining: calculatedRemaining,
    date: newTransaction.date || new Date().toISOString().split('T')[0]
  };

  setTransactions([...transactions, transactionToAdd]);
  setShowAddForm(false);
  
  setNewTransaction({
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    payType: '',
    amountCollected: 0,
    remaining: 0
  });
};

const handleCancelTransaction = () => {
  setShowAddForm(false);
  setNewTransaction({
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    payType: '',
    amountCollected: 0,
    remaining: 0
  });
};


// Testing COD Details
// Testing COD Details
// Testing COD Details

  return (
    <div className='create-order'>
        <div className='top d-flex gap-3 mb-4 mt-2' style={{cursor:'pointer'}}>
            <span onClick={() => navigate('/orders')}><IoArrowBackOutline size={25}/></span>
           { Object.keys(order).length === 0 ? (
            <h3 className='m-0' style={{fontSize:'1.2rem'}}>Create Order</h3>

           ): (
                <div className='d-flex gap-2'>
                <h3 className='m-0' style={{fontSize:'1.2rem'}}>{order.orderId}</h3>
             
                    {/* <p className={order.payment==='Paid' ? 'green' : 'grey'}>{order.payment}</p>
                    <p className={statusClassMap[order.orderStatus]}>{order.orderStatus}</p> 
               */}
                </div>
            )
           }
           
          
        </div>

        {showConfirmModal && (
          <ConfirmWeightChangeModal
            onConfirm={confirmWeightChange}
            onCancel={cancelWeightChange}
          />
        )}


        <ModalOrder
             show={showModalOrder}
             handleClose={() => setShowModalOrder(false)}
             products={finalData}
             addToCart={addToCart}
             onOrderCreate={handleReceiveOrder}
            onProductUpdate={refreshAllProducts}
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
                    <button className='btn-secondary-custom' onClick={() => setShowModalOrder(true)}>Browse Color Catalouge</button>
                    )}
                    </div>
                    {renderModal()}
                    </div>
                    {orderDetails.length > 0 && (
                        <div className="order-detail">
                            {/* Table */}
                            <table className="table ">
                            {/* Table Header */}
                             <thead>
    <tr>
      <th className='fw-medium' style={{ minWidth: '80px', width: '8%' }}>Product</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '120px', width: '12%' }} className='fw-medium'>Count</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '100px', width: '10%' }} className='fw-medium'>Color</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '100px', width: '10%' }} className='fw-medium'>Name</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '80px', width: '8%' }} className='fw-medium'>Type</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '100px', width: '10%' }} className='fw-medium'>Weight (Kgs)</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '80px', width: '8%' }} className='fw-medium'>Cost</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '90px', width: '9%' }} className='fw-medium'>Discount</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '80px', width: '8%' }} className='fw-medium'>CGST</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '80px', width: '8%' }} className='fw-medium'>SGST</th>
      <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '80px', width: '8%' }} className='fw-medium'>Total</th>
      {isViewMode && (
        <th style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '120px', width: '12%' }} className='fw-medium'>Status</th>
      )}
      {isViewMode && (
        <th className='fw-medium' style={{ minWidth: '60px', width: '6%' }}></th>
      )}
      <th style={{ minWidth: '50px', width: '5%' }}></th>
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
                                          <td className="fw-medium" style={{
                                                fontSize: '0.8rem',
                                                textAlign: 'start',
                                                verticalAlign: 'middle' ,
                                                color: 'black'}}>{order.productName} </td>

                                          {/* Size */}
                                          <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>
                                              <div className="fw-medium" style={{
                                                fontSize: '0.8rem',
                                                textAlign: 'center',
                                                color: 'black',
                                                // width: '70%',
                                                // padding: '0.5rem 0.6rem',
                                                // borderRadius: '10rem',
                                                // backgroundColor: '#EFEFEF',
                                                // border: '1px solid #B9C0CD',
                                                whiteSpace: 'normal', 
                                                wordWrap: 'break-word', 
                                              }}>
                                                  {order.size}
                                              </div>
                                          </td>

                                         
                                          <td style={{ justifyItems: 'center'}}>
                                            <div className="d-flex align-items-center flex-column gap-1">
                                              <img
                                                src={`${backendUrl}${order.color.colorImage}`}
                                                alt={order.color.colorName}
                                                width="40"
                                                height="40"
                                                style={{ borderRadius: "8px", border: "1px solid #ccc" }}
                                              />
                                              <span className="text-truncate" style={{ fontSize: '0.8rem' }}>{order.color.hex}</span>
                                              {/* <div
                                                style={{
                                                  backgroundColor: order.color.hex, 
                                                  width: '25px',
                                                  height: '25px',
                                                  borderRadius: '50%',
                                                  border: '2px solid #ccc',
                                                  margin: '5px',
                                                }}
                                              ></div> */}
                                            </div>
                                          </td>

                                          <td  className="fw-medium" style={{
                                                fontSize: '0.8rem',
                                                textAlign: 'center',
                                                justifyItems: 'center',
                                                verticalAlign: 'middle' ,
                                                color: 'black'}}>
                                            <div className="d-flex flex-column gap-3">
                                          
                                              <div>{order.color.name}</div> 
                                            </div>
                                          </td>

                                          <td  className="fw-medium" style={{
                                                fontSize: '0.8rem',
                                                textAlign: 'center',
                                                justifyItems: 'center',
                                                verticalAlign: 'middle' ,
                                                color: 'black'}}>
                                            <div className="d-flex flex-column gap-3">
                                              <span className="w-75">
                                                {order.variantType || 'Cone'} {/* Show type or default to 'Cone' */}
                                              </span>
                                            </div>
                                          </td>



                                          {/* Weight Inputs Column */}
                                       
                                          <td style={{ width: '8rem',  justifyItems: 'center', alignContent:'center' }}>
                                          <div className="d-flex flex-column align-items-center">
                                          <input
                                            type="number"
                                            style={{ border: '1px solid' }}
                                            placeholder="Weight"
                                            className="rounded border-secondary-subtle weight-input ps-1 py-1 w-75"
                                            value={order.color.weight || ''}
                                            onChange={(e) => handleWeightChange(index, e.target.value)}
                                            disabled={["SHIPPED", "CANCELLED", "DELIVERED", "RETURN_REQUESTED", "RETURNED", "RETURN_REJECTED","NEW"].includes(order.status)}
                                          />

                                          </div>
                                        </td>



                                          {/* Price Calculation */}
                                                {(() => {
                                                  const {
                                                    baseTotal,
                                                    gstAmount,
                                                    finalTotal,
                                                    gstRate,
                                                    discountAmount,
                                                    discountPercent,
                                                    combinedDiscountPercent,
                                                  } = calculatePriceBreakdown(
                                                    {
                                                      ...order.color,
                                                      productId: order.productId,
                                                      gstOnProduct: order.gstOnProduct,
                                                      price: order.price,
                                                    },
                                                    selectedDiscountValue,
                                                    discountPercentage,
                                                    selectedDiscountData
                                                  );

                                                  const cgst = gstRate > 0 ? (gstRate / 2).toFixed(2) : "0.00";
                                                  const sgst = gstRate > 0 ? (gstRate / 2).toFixed(2) : "0.00";

                                                  return (
                                                    <>

                                                       <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <span className="fw-medium" style={{ fontSize: '0.8rem', color: 'black' }}>
                                                          ₹{Math.round(baseTotal)}
                                                        </span>
                                                      </td>
                                                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <span className="fw-medium" style={{ fontSize: '0.8rem', color: 'black' }}>
                                                          {discountPercent.toFixed(2)}%
                                                        </span>
                                                      </td>
                                                     
                                                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <span className="fw-medium" style={{ fontSize: '0.8rem', color: 'black' }}>
                                                          {(gstRate / 2).toFixed(2)}%
                                                        </span>
                                                      </td>
                                                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <span className="fw-medium" style={{ fontSize: '0.8rem', color: 'black' }}>
                                                          {(gstRate / 2).toFixed(2)}%
                                                        </span>
                                                      </td>

                                                       <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <span className="fw-medium" style={{ fontSize: '0.8rem', color: 'black' }}>
                                                          ₹{Math.round(finalTotal)}
                                                        </span>
                                                      </td>
                                                  
                                                    </>
                                                  );
                                                })()}
                                             




                                          {isViewMode && (
                                            <td  style={{ justifyItems: 'center', alignContent:'center'}}  >
                                              <div className="d-flex align-items-center justify-content-center">
                                                {["RETURNED", "RETURN_REJECTED"].includes(order.status) ? (
                                                  <div className={`${statusClassMap[order.status] || ''} defaultcolor text-capitalize`}>
                                                    {order.status.replace("_", " ")}
                                                  </div>
                                                ) : (
                                                  <select
                                                    value={
                                                      order.status === "RETURN_REQUESTED"
                                                        ? order.previousStatus || "DELIVERED"
                                                        : order.status
                                                    }
                                                    disabled={[
                                                      "DELIVERED",
                                                      "RETURNED",
                                                      "CANCELLED",
                                                      "RETURN_REQUESTED",
                                                    ].includes(order.status)}
                                                    onChange={(e) => {
                                                      const selectedStatus = e.target.value;
                                                      setModalData({
                                                        isOpen: true,
                                                        orderId: order.orderId,
                                                        variantId: order.variantId,
                                                        status: selectedStatus,
                                                      });
                                                    }}
                                                    className={`${statusClassMap[order.status] || ''} defaultcolor text-capitalize`}
                                                  >
                                                    {statusOptions.map(({ value, label }) => {
                                                      const currentIndex = statusFlow.indexOf(order.status);
                                                      const optionIndex = statusFlow.indexOf(value);

                                                      const shouldRender =
                                                        !["RETURNED", "RETURN_REJECTED", "RETURN_REQUESTED"].includes(
                                                          value
                                                        ) || value === order.status;

                                                        const shouldDisable = (() => {
                                                          const currentIndex = statusFlow.indexOf(order.status);
                                                          const optionIndex = statusFlow.indexOf(value);
                                                        
                                                          if (order.status === "RETURN_REQUESTED") return true;
                                                        
                                                          if (order.status === "NEW") {
                                                            // Only allow CONFIRMED or CANCELLED
                                                            return !["CONFIRMED", "CANCELLED"].includes(value);
                                                          }
                                                        
                                                          if (value === "CANCELLED" && order.status !== "NEW") {
                                                            return true; // Prevent cancelling after NEW
                                                          }
                                                        
                                                          // Prevent skipping SHIPPING before DELIVERED
                                                          if (
                                                            value === "DELIVERED" &&
                                                            order.status === "CONFIRMED" // trying to go directly to DELIVERED
                                                          ) {
                                                            return true;
                                                          }
                                                        
                                                          // Allow CONFIRMED → SHIPPING directly, but disallow skipping SHIPPING to DELIVERED
                                                          if (value === "DELIVERED" && !["SHIPPED"].includes(order.status)) {
                                                            return true;
                                                          }
                                                        
                                                          // Default: disallow going backward in flow
                                                          return optionIndex < currentIndex;
                                                        })();
                                                        
                                                        
                                                      

                                                      return (
                                                        shouldRender && (
                                                          <option key={value} value={value} disabled={shouldDisable} className={`${statusClassMap[value] || ''} defaultcolor text-capitalize`}>
                                                            {label}
                                                          </option>
                                                        )
                                                      );
                                                    })}
                                                  </select>
                                                )}
                                              </div>
                                            </td>
                                          )}




                                    
                                            {isViewMode && (
                                              <td>
                                                <div className='d-flex flex-column gap-3'>
                                                  {order.status === "RETURN_REQUESTED" && (
                                                   <div className="d-flex align-items-center justify-content-between position-relative">
                                                    <div
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        openReturnModal({
                                                          returnWeight:order.returnWeight,
                                                          statusReason: order.statusReason,
                                                          orderId: order.orderId,
                                                          orderVariantId: order.variantId,
                                                          statusRemark:order.statusRemark,
                                                        });
                                                      }}
                                                      
                                                      className="alert-icon-circle cursor-pointer"
                                                    >  
                                                    <Tooltip content="Initiate Return">
                                                      <FiAlertCircle size={16} color="red" />
                                                      </Tooltip>
                                                    </div>
                                                
                                                </div>


                                                  )}
                                                </div>
                                                <ModalReturnOrder
                                                  isOpen={isReturnModalOpen}
                                                  onClose={() => setIsReturnModalOpen(false)}
                                                  onCancel={handleReject}
                                                  onConfirm={handleApprove}
                                                  variantDetails={selectedVariantForModal}
                                                />
                                              </td>
                                            )}




                                    <div className='d-flex flex-column gap-3'>
                                      <div className="d-flex align-items-center justify-content-between">
                                        {!isViewMode && (
                                          <button
                                            className="ms-2"
                                            onClick={() =>
                                              handleDeleteColor(order.productId, order.size, order.color?.name, order.variantType)
                                            }
                                            title="Remove color"
                                            style={{
                                              border: 'none',
                                              background: 'transparent',
                                              color: 'red'
                                            }}
                                          >
                                            <RxCross2 />
                                          </button>
                                        )}
                                      </div>
                                    </div>


                                          
                                      </tr>
                                  );
                              })}
                          </tbody>

                            </table>
                        </div>
                        )}

                                                    {orderDetails.length > 0 && isViewMode && weightChanged && (
                                                      <div className='d-flex justify-content-center w-100'>
                                                        <Button className='btn btn-primary' onClick={onClickSaveWeightChanges}>
                                                          Save Changes
                                                        </Button>
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
                              <p className="text-gray-600 whitespace-pre-line">{order.billingAddress}</p>
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
                     {selectedDiscountData?.discountType === 'Percentage'
                      ? `${selectedDiscount} - ${selectedDiscountValue}% Off`
                      : selectedDiscountData?.discountType === 'FixedAmount'
                      ? `${selectedDiscount} - ₹${selectedDiscountValue}`
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
                            {item.discountValue}
                             {item.discountType==="Percentage" && (' %')}
                              {" "}off on{" "}
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


          
            
            

                <div className='payment mb-3 bg-white p-4 rounded' id="invoice-to-download" ref={invoiceRef}>
                    <h4>Payment</h4>

                    <div  className='container border p-3 rounded mb-3' >

                <table className="w-100 rounded mt-2 font-semibold">
                  <tbody>
                   
                    <tr>

                      <td className="fw-medium">Total Cost</td>
                      <td>
                        {
                          orderDetails.reduce((acc, item) => {
                            return acc + (item.status !== 'CANCELLED' ? 1 : 0);
                          }, 0)
                        } items
                      </td>

                      <td style={{ textAlign: "end" }}>₹{Math.round(grandTotals.baseTotal)}</td>
                    </tr>

                   
                    <tr className='border-bottom'>
                      <td>
                        <div>
                          <p className=" fw-medium pt-2">Total Discount</p>
                          <p className="text-black-50  fw-medium my-2 ps-5" >Pay Type</p>
                          <p className="text-black-50 fw-medium pb-2 ps-5">Coupon</p>
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
                          <p className='text-end text-success'>
                          <span className="mr-1 font-semibold">-</span> ₹{grandTotals.totalDiscount.toFixed(0)}
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
                        <td className="text-end pt-4">₹{Math.round(grandTotals.baseTotal - grandTotals.totalDiscount)}</td>
                    </tr>


                    {
                      isOdisha ? (
                        <>
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
                        </>
                      ) : (
                        <tr>
                          <td className=" fw-medium pt-2">IGST</td>
                          <td></td>
                          <td className="text-end">₹{(grandTotals.cgst + grandTotals.sgst).toFixed(0)}</td>
                        </tr>
                      )
                    }


                    

                   
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
                      <td className='text-end pt-2 pb-4'>₹49</td>
                    </tr>
                  
                    <tr>
                      <td className='fw-medium pt-4 pt-2'>Net Pay</td>
                      <td ></td>
                      <td className='text-end pt-4 '>₹{(netPayablePrice).toFixed(0)}</td>
                      {/* <td className="text-end pt-3">₹{calculateTotalAmount()}</td> */}
                    </tr>


                    <tr className="border-bottom">
                      <td className="fw-medium pt-2 pb-4 ">Wallet</td>
                      <td className="pb-3 pt-2">{walletBalances.toFixed(0)}</td>
                      <td style={{ textAlign: "end" }} className="pb-3 text-success pt-2">
                      <span className="mr-1 font-semibold">-</span> ₹ {isViewMode ? (
                              // Show plain text in view mode
                              <span>{walletDeduction ? `${walletDeduction.toFixed(0)}` : "0"}</span>
                          ) : (
                              // Show input field in edit mode
                              <input
                                className="border border-secondary-subtle text-success rounded-1 ps-2 text-end p-1"
                                type="number"
                                placeholder="Enter amount"
                                value={walletDeduction ? Math.min(walletDeduction.toFixed(0), Math.min(walletBalances.toFixed(0), netPayablePrice.toFixed(0))) : ""}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) {
                                    handleWalletDeductionChange(val);
                                  } else {
                                    handleWalletDeductionChange(""); // Clear input if invalid
                                  }
                                }}
                                min="0"
                                max={Math.min(walletBalances, netPayablePrice)}
                                disabled={isViewMode}
                              />

                          )}
                      </td>
                  </tr>

                  
                    <tr className="border-bottom">
                      <td className=" fw-medium py-4">To Pay</td>
                      <td></td>
                      <td className='text-end py-4'>₹{(toPay).toFixed(0)}</td>
                      {/* <td className="text-end pb-3 pt-2">₹{netPayable}</td> */}
                    </tr>

                    <tr>
                      <td className="fw-medium pt-4">Advance Paid</td>
                      <td className="pt-4">{onlinePercentage}%</td>
                      {isViewMode === true ? (
                        order?.createdByUser ? (
                          // If order created by admin, show actual onlineAmount paid
                          <td className="text-end pt-4">₹{order?.payment.onlineAmount.toFixed(0)}</td>
                        ) : (
                          // Otherwise show total amount paid
                          <td className="text-end pt-4">₹{order?.payment.totalAmountPaid.toFixed(0)}</td>
                        )
                      ) : (
                        // In edit mode, calculate based on percentage
                        <td className="text-end pt-4">₹{((toPay * onlinePercentage) / 100).toFixed(0)}</td>
                      )}
                    </tr>


                    <tr>
                      <td className="fw-medium pb-3 pt-2">Balance Due</td>
                      <td className="pb-3 pt-2">{codPercentage}%</td>

                      {isViewMode === true ? (
                          <td className="text-end pb-3 pt-2">₹{order?.payment.pendingAmount.toFixed(0)-order?.payment.totalAdjustedAmount.toFixed(0)}</td>
                        ):(
                          <td className="text-end pb-3 pt-2">₹{((toPay * codPercentage) / 100).toFixed(0)}</td>
                        )
                      }
                     
                    </tr>

                      {order?.payment?.cancelRefundAmount > 0 &&(
                         <tr className='border-top'>
                       <td className="fw-medium py-2">Refunded amount</td>
                      <td className="pt-2"></td>
                      <td className="text-end text-success">₹{order?.payment.cancelRefundAmount.toFixed(0)}</td>
                    </tr>
                      )}
                   

                   
                   

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
                              <div className="d-flex justify-content-center w-100">
                                {isViewMode && !weightChanged ? (
                                  <button
                                    className="btn-secondary-custom"
                                    onClick={() => {
                                      setSelectedOrderId(order.orderId);
                                      setIsModalOpen(true);
                                      console.log('hello')
                                    }}
                                  >
                                    Send Invoice
                                  </button>
                                ) : (
                                  !isViewMode && (
                                    <button className="btn-secondary-custom" onClick={handleCreateOrder}>
                                      Create Order
                                    </button>
                                  )
                                )}
                              </div>
                            )}

                            
                            {isModalOpen && (
                              <ModalSendInvoice
                                isOpen={isModalOpen}
                                onConfirm={async () => {
                                  await sendInvoice(selectedOrderId);
                                  setIsModalOpen(false);
                                }}
                                onCancel={() => setIsModalOpen(false)}
                              />
                            )}

                </div>



                    <div className='payment bg-white rounded-3 shadow-sm border-0' style={{padding: '24px'}}>
                {/* Header with Opening Balance */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4>COD Collection Details</h4>
                  </div>
                  {/* <div className="bg-light rounded-pill px-3 py-2 d-flex align-items-center gap-2">
                    <div className=" rounded-circle d-flex align-items-center justify-content-center" style={{width: '6px', height: '6px',  backgroundColor: '#6B21A8'}}></div>
                    <span className="text-muted small fw-medium">Opening Balance:</span>
                    <span className="fw-bold text-dark" style={{fontSize: '15px'}}>
                      ₹{isViewMode === true ? 
                        (order?.payment.pendingAmount.toFixed(0) - order?.payment.totalAdjustedAmount.toFixed(0)) :
                        ((toPay * codPercentage) / 100).toFixed(0)
                      }
                    </span>
                  </div> */}
                </div>

                {/* Table Container with Modern Styling */}
                <div className="container p-0 bg-white border rounded-3 mb-4 overflow-hidden" style={{boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
                  <table className="w-100">
                    <thead className="bg-light">
                      <tr>
                        <th className="fw-semibold text-dark border-0 py-3 px-4" style={{fontSize: '13px', letterSpacing: '0.02em'}}>
                          Transaction ID
                        </th>
                        <th className="fw-semibold text-dark border-0 py-3 px-4" style={{fontSize: '13px', letterSpacing: '0.02em'}}>
                          Date
                        </th>
                        <th className="fw-semibold text-dark border-0 py-3 px-4" style={{fontSize: '13px', letterSpacing: '0.02em'}}>
                          Payment Type
                        </th>
                        <th className="fw-semibold text-dark border-0 py-3 px-4 text-end" style={{fontSize: '13px', letterSpacing: '0.02em'}}>
                          Amount Collected
                        </th>
                        <th className="fw-semibold text-dark border-0 py-3 px-4 text-end" style={{fontSize: '13px', letterSpacing: '0.02em'}}>
                          Remaining
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Transaction Rows */}
                      {transactionsCod && transactionsCod.length > 0 && transactionsCod.map((transaction, index) => (
                        <tr key={transaction.id || index} className="border-bottom" style={{borderColor: '#f1f3f4 !important'}}>
                          <td className="py-3 px-4 text-dark" style={{fontSize: '14px'}}>
                            <div className="d-flex align-items-center gap-2">
                              <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '8px', height: '8px'}}>
                                <div className="bg-primary rounded-circle" style={{width: '4px', height: '4px'}}></div>
                              </div>
                              <span className="fw-medium">{transaction.transactionId}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted" style={{fontSize: '14px'}}>
                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-4" style={{fontSize: '14px'}}>
                            <span className="badge bg-light text-dark border px-2 py-1 rounded-pill" style={{fontSize: '12px', fontWeight: '500'}}>
                              {transaction.payType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-end fw-semibold text-success" style={{fontSize: '14px'}}>
                            ₹{transaction.amountCollected.toFixed(0)}
                          </td>
                          <td className="py-3 px-4 text-end fw-semibold text-primary" style={{fontSize: '14px'}}>
                            ₹{transaction.remaining.toFixed(0)}
                          </td>
                        </tr>
                      ))}

                      {/* Input Row for Adding New Transaction */}
                      {showAddForm && (
                        <tr className="bg-light bg-opacity-30 border-top border-2 border-primary border-opacity-20">
                          <td className="py-3 px-4">
                            <input 
                              type="text" 
                              className="form-control border-0 bg-white rounded-2 shadow-sm"
                              style={{fontSize: '14px', padding: '10px 14px', height: '40px'}}
                              placeholder="Enter transaction ID"
                              value={newTransaction.transactionId}
                              onChange={(e) => setNewTransaction({...newTransaction, transactionId: e.target.value})}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input 
                              type="date" 
                              className="form-control border-0 bg-white rounded-2 shadow-sm"
                              style={{fontSize: '14px', padding: '10px 14px', height: '40px'}}
                              value={newTransaction.date}
                              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <select 
                              className="form-select border-0 bg-white rounded-2 shadow-sm"
                              style={{fontSize: '14px', padding: '10px 14px', height: '40px', borderRadius: '20px'}}
                              value={newTransaction.payType}
                              onChange={(e) => setNewTransaction({...newTransaction, payType: e.target.value})}
                            >
                              <option value="" disabled>Select payment type</option>
                              <option value="Cash in Hand">💵 Cash in Hand</option>
                              <option value="Check">🏦 Check</option>
                              <option value="Online Transfer">💳 Online Transfer</option>
                              <option value="UPI">📱 UPI</option>
                              <option value="Card">💳 Card</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <input 
                              type="number" 
                              className="form-control border-0 bg-white rounded-2 shadow-sm text-end"
                              style={{fontSize: '14px', padding: '10px 14px', height: '40px'}}
                              placeholder="0"
                              value={newTransaction.amountCollected}
                              onChange={(e) => setNewTransaction({...newTransaction, amountCollected: parseFloat(e.target.value) || 0})}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <button 
                                className="btn btn-success rounded-2 border-0 d-flex align-items-center justify-content-center"
                                style={{width: '36px', height: '36px', fontSize: '14px'}}
                                onClick={handleSaveTransaction}
                              >
                                ✓
                              </button>
                              <button 
                                className="btn btn-light border rounded-2 d-flex align-items-center justify-content-center"
                                style={{width: '36px', height: '36px', fontSize: '14px'}}
                                onClick={handleCancelTransaction}
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Empty State */}
                  {(!transactions || transactions.length === 0) && !showAddForm && (
                    <div className="py-5 d-flex flex-column justify-content-center align-items-center text-center" style={{minHeight: '200px'}}>
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                        <RiFilePaper2Line size={32} className="text-muted" />
                      </div>
                      <h6 className="text-dark fw-semibold mb-2" style={{fontSize: '16px'}}>No transactions yet</h6>
                      <p className="text-muted mb-0 small">Start by adding your first COD collection entry</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-center align-items-center">
                 <button 
                    className="btn-secondary-custom px-2"
                    onClick={handleSendPaymentLink}
                    disabled={
                      (order?.payment.pendingAmount ?? 0) - (order?.payment.totalAdjustedAmount ?? 0) <= 0
                    }
                  >
                    <span className="fw-bold">Send Payment Link</span>
                  </button>



                  <ModalCollectAmount
                    isOpen={showModal}
                    onCancel={handleModalCancel}
                    onConfirm={handleModalConfirm}
                    // maxAmount={remainingBalance}
                  />
                  
                  {/* <div className="d-flex gap-3">
                    {!showAddForm ? (
                      <button 
                        className="btn-primary-custom px-2"
                        onClick={handleAddPayment}
                        disabled={remainingBalance <= 0}
                      >
                        <span className="fw-bold"></span>
                        Add Payment
                      </button>
                    ) : (
                      <button 
                        className="btn btn-light border rounded-3 d-flex align-items-center gap-2 px-4 py-2"
                        style={{fontSize: '14px', fontWeight: '500', height: '44px'}}
                        onClick={handleCancelTransaction}
                      >
                        Cancel
                      </button>
                    )}
                  </div> */}
                </div>
              </div>



            </div>
         



 {/* Toast Notification */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() =>
                            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                        }
                    />
                ))}
            </div>

            
        </div>
    </div>
  )
}
)

export default CreateOrder


