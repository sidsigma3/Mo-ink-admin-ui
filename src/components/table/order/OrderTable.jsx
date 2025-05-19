import React, { useState , useEffect ,forwardRef, useRef ,useImperativeHandle } from "react";
import "./OrderTable.css";
import { useOrderContext } from "../../Context/OrderContext";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import { BiWallet } from "react-icons/bi";
import { LuDot } from "react-icons/lu";
import ModalAssign from "../../Modal/ModalAssign";
import { getAllOrders } from "../../../services/OrderService";
import { updateOrder } from "../../../services/OrderService";
import * as XLSX from "xlsx";
import CreateOrder from "../../../pages/dashboard/Orders/CreateOrder";
import { FiDownload } from "react-icons/fi";
import { downloadInvoice } from "../../../services/InvoiceServices";
import { FiAlertCircle } from "react-icons/fi";
import { updateOrderPaymentStatuses } from "../../../services/OrderService";
import ModalPaid from "../../Modal/ModalPaid";
import ModalUnpaid from "../../Modal/ModalUnpaid";
import ModalPartiallypaid from "../../Modal/ModalPartiallypaid";
import moment from 'moment-timezone';
import Tooltip from "../../Tooltip/Tooltip";


const OrderTable = forwardRef(({data}, ref) => {
 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const createOrderRef = useRef(null);

  const [modalData, setModalData] = useState({
    isOpen: false,
    type: null, // 'order' or 'payment'
    status: null,
    orderId: null,
    variantId: null,
  });
  

  useEffect(() => {
    setOrders(data || []);
  }, [data]);

  const [showModalAssign, setShowModalAssign] = useState(false);

  const navigate = useNavigate();

  const statusOptions = [
    "Confirmed",
    "Cancel",
    "Manufactured",
    "shipped",
    "Delivered",
    "Returned",
    // "Partial return",
    // "Partial cancel",
   
  ];



  const paymentStatusOption = ["Unpaid", "Partially Paid", "Paid"];


  const handlePaymentStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId
          ? {
              ...order,
              payment: {
                ...order.payment,
                paymentStatus: newStatus,
              },
            }
          : order
      )
    );
  };
  


  const handleStatusChange = async (orderId, newStatus) => {
    try {
        // Fetch the existing order details before updating
        const existingOrder = orders.find(order => order.orderId === orderId);

        console.log(existingOrder)

        if (!existingOrder) {
            console.error("Order not found.");
            return;
        }

        const updatedOrderData = {
            ...existingOrder, 
            status: newStatus, 
        };

        await updateOrder(orderId, updatedOrderData);
        fetchOrders();

      alert("Order status updated successfully.");
    } catch (error) {
        console.error("Failed to update order status:", error);
    }
};



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



const handleRowClick = (order) => {
  navigate("/create-order", { state: { order, triggerDownload: true } });
};


  const statusClassMap = {
  "NEW": "blue",
  "SHIPPED": "yellow",
  "MANUFACTURING": "purple",
  "DELIVERED": "green",
  "CANCELLED": "red",
  "Returned": "grey",
  "RETURNED": "purple",
  "CONFIRMED": "muted-clay",
  "PENDING":"grey",
  "FAILED":"red"

  };

  let active = 2;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }


  const exportOrders = () => {
    if (!orders || orders.length === 0) {
      alert("No orders available to export.");
      return;
    }

    const formattedData = orders.map((order) => {
     const rawInput = order.createdAt; // get timestamp string

const rawDate = new Date(rawInput); // parse to Date object

const istDate = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
}).format(rawDate);

console.log(istDate);


    
    
      return {
        "Order ID": order.orderId,
        "Date": istDate,
        "Customer": order.customer.customerName,
        "Quantity": order.orderVariantResponse.length,
        "Weight": order.totalAmount,
        "Amount": order.payment.amount,
        "Payment Status": order.payment.paymentStatus,
        "Order Status": order.status,
      };
    });
  
    
    console.log(formattedData);
    


    // const formattedData = orders.map((order) => ({
    //   "Order ID": order.orderId,
    //   "Date": new Intl.DateTimeFormat("en-IN").format(new Date(order.createdAt)),
    //   "Customer": order.customer.customerName,
    //   "Quantity": order.orderVariantResponse.length,
    //   "Weight": order.totalAmount,
    //   "Amount": order.payment.amount,
    //   "Payment Status": order.payment.paymentStatus,
    //   "Order Status": order.status,
    // }));

    // Convert JSON to Sheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Download the Excel file
    XLSX.writeFile(workbook, "Orders.xlsx");
  };


  useImperativeHandle(ref, () => ({
    exportOrders,
  }));

  const handleDownloadInvoice = async(orderId) => {
    const result = await downloadInvoice(orderId);
    if (!result.success) {
      alert("Failed to download invoice.");
    }
  };


  const statusOption = {
    PENDING:"Pending",
    NEW: "New Order" ,
    CANCELLED: "Cancelled",
    CONFIRMED: "Confirmed",
    MANUFACTURING: "Manufactured",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    RETURNED: "Returned",
    RETURN_REQUESTED: "Return Requested",
    RETURN_REJECTED: "Return Rejected",
    FAILED:"Failed"
  };

  const renderModal = () => {
    if (!modalData.isOpen) return null;
  
    const commonProps = {
      isOpen: true,
      onCancel: () => setModalData({ isOpen: false, type: null, status: null, orderId: null, variantId: null }),
      onConfirm: async () => {
        if (modalData.type === "payment") {
          try {
            await updateOrderPaymentStatuses(modalData.orderId, {
              paymentStatus: modalData.status,
            });
            handlePaymentStatusChange(modalData.orderId, modalData.status);
          } catch (err) {
            console.error("Failed to update payment status:", err);
          }
        }
        setModalData({ isOpen: false, type: null, status: null, orderId: null, variantId: null });
      },
    };
  
    // Render payment status modals
    switch (modalData.status) {
      case "FULLY_PAID":
        return <ModalPaid {...commonProps} />;
      case "PARTIALLY_PAID":
        return <ModalPartiallypaid {...commonProps} />;
      case "UNPAID":
        return <ModalUnpaid {...commonProps} />;
      default:
        return null;
    }
  };
  
  const formatDateToIST = (dateStr) => {
    // Force it to be treated as UTC
    const utcDate = new Date(dateStr + 'Z');
  
    return utcDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  

  return (
    <div className="order-table table-ctn-order">
      <Table hover>
        <thead>
          <tr className="order-tablemain">

            <th style={{ verticalAlign: 'middle'}} >#POID</th>


            <th style={{ textAlign: 'center', verticalAlign: 'middle'}}  >Date</th>

            <th style={{ textAlign: 'center', verticalAlign: 'middle'}}  >Customer</th>

            <th style={{ textAlign: 'center', verticalAlign: 'middle'}}  >Quantity</th>

            <th style={{ textAlign: 'center', verticalAlign: 'middle'}}  >Weight</th>

            <th style={{ textAlign: 'center', verticalAlign: 'middle'}}  >Amount</th>

            <th style={{ textAlign: 'center', verticalAlign: 'middle'}}  >Payment</th>

            <th style={{ textAlign: 'center', verticalAlign: 'middle'}}  >Order Status</th>

            <th style={{ width: "11.3rem", textAlign: "center", verticalAlign: 'middle' }}>V.O I'D</th>

            <th style={{ textAlign: 'center', verticalAlign: 'middle'}}>Invoice</th>

            <th></th>
            

          </tr>
        </thead>

        <tbody>
        {[...orders]
        .reverse()
       .map((order) => (
    <tr
      key={order.orderId}
      style={{ cursor: "pointer" }}
      onClick={() => handleRowClick(order)}
    >

              <td style={{ verticalAlign: 'middle', fontWeight: 500 }}>{order.orderId}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {formatDateToIST(order.createdAt)}
              </td>

              <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.customer.customerName}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {
                  order.orderVariantResponse.filter(variant => variant.status !== 'CANCELLED').length
                }
              </td>

              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {
                  order.orderVariantResponse
                    .filter(variant => variant.status !== 'CANCELLED')
                    .reduce((sum, variant) => sum + (Number(variant.orderWeight) || 0), 0)
                    .toFixed(2)
                } kg
              </td>


              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                ₹{order.status === 'CANCELLED' ? '0' : order.totalAmount.toFixed(1)}
              </td>

              <td style={{ textAlign: 'center', verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                <select
                  className={
                    order.payment.paymentStatus === "FULLY_PAID"
                      ? "green"
                      : order.payment.paymentStatus === "PARTIALLY_PAID"
                      ? "purple"
                      : "yellow"
                  }
                  value={order.payment.paymentStatus}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    setModalData({
                      isOpen: true,
                      type: 'payment',
                      status: newStatus,
                      orderId: order.orderId,
                    });

                    try {
                      await updateOrderPaymentStatuses(order.orderId, {
                        paymentStatus: newStatus,
                      });

                      // ✅ Update local state to reflect changes immediately
                      handlePaymentStatusChange(order.orderId, newStatus); 
                    } catch (error) {
                      console.error("Failed to update payment status:", error);
                    }
                  }}
                >
                  {[
                    { label: "Unpaid", value: "UNPAID" },
                    { label: "Partially Paid", value: "PARTIALLY_PAID" },
                    { label: "Paid", value: "FULLY_PAID" },
                  ].map(({ label, value }) => {
                    const current = order.payment.paymentStatus;

                    const isDisabled =
                      (current === "PARTIALLY_PAID" && value === "UNPAID") ||
                      (current === "FULLY_PAID" && (value === "UNPAID" || value === "PARTIALLY_PAID"));

                    return (
                      <option key={value} value={value} disabled={isDisabled}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </td>

              <td   style={{ justifyItems: 'center', alignContent:'center'}}  onClick={(e) => e.stopPropagation()}>

                  <div className={statusClassMap[order.status]}>
                    {statusOption[order.status]}
                  </div>
            </td>
              <td>
                <div className="manufacturer">
                  {order.manufacturer ? (
                    <div>Assigned</div>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModalAssign(true);
                      }}
                      className="assign-button w-75"
                    >
                      Not Assigned
                    </div>
                  )}
                </div>
              </td>
              <td>
                <button
                className="border-0 btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering row click
                    handleDownloadInvoice(order.orderId);
                  }}
                >
                 <FiDownload size={20}/>
                </button>
              </td>

              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {order.orderVariantResponse?.some(variant => 
                 ["RETURN_REQUESTED", "RETURNED"].includes(variant.status)
              ) && (
                    <Tooltip />

                )}
              </td>


            </tr>
          ))}
        </tbody>
      </Table>
      {renderModal()}


      <div className="d-flex justify-content-end mt-2 pagination">
        <Pagination>{items}</Pagination>
      </div>

      <ModalAssign
        show={showModalAssign}
        handleClose={() => setShowModalAssign(false)}
      ></ModalAssign>

        {selectedOrder && (
          <div style={{ display: "none" }}>
            <CreateOrder ref={createOrderRef} orderData={selectedOrder} />
          </div>
        )}

      <div className="order-cards">
        {orders.map((order) => (
          <div
            className="order-card shadow-sm"
            key={order.orderId}
            onClick={() => handleRowClick(order)}
          >
            <div className="d-flex justify-content-between">
            <h4>{new Date(order.createdAt).toLocaleString()}</h4>
              <div
                style={{
                  padding: "0.2rem 0.4rem",
                  backgroundColor: "#D1FAE5",
                  border: "1px solid",
                  borderColor: "#6EE7B7",
                  borderRadius: "0.3rem",
                  textAlign: "center",
                  color: "#00A65E",
                  display: "flex",
                  alignItems:"center"
                }}
              >
                <span className="mb-1">
                  <BiWallet size={18}/>
                </span>
                <h3 className="m-0">{order.payment.amount}</h3>
              </div>
            </div>

            <h3>#{order.orderId}</h3>

            <div className="d-flex justify-content-between">
              <p>
                {order.customer.customerName}{" "}
                <span>
                  <LuDot size={25} />
                </span>
              </p>
              <p>
                {order.orderVariantResponse.length} Quantity{" "}
                <span>
                  <LuDot size={25} /> 
                </span>
              </p>
              <p>{order.totalAmount.toFixed(2)}</p>
            </div>

            <div className="d-flex justify-content-between align-items-center">
            <div className="dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
                <h5 
                  className={statusClassMap[order.status]}
                  onClick={(e) => e.stopPropagation()}
                >
                  {order.status}
                </h5>
                <select
                  className="dropdown-select" // ⛔ removed color class here
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
                {/* Payment Status Display */}
                <h5
                  className={
                    order.payment.paymentStatus === "PAID"
                      ? "green"
                      : order.payment.paymentStatus === "UNPAID"
                      ? "grey"
                      : "yellow"
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {order.payment.paymentStatus}
                </h5>

                {/* Payment Status Dropdown */}
                <select
                  className="dropdown-select"
                  value={order.payment.paymentStatus}
                  onChange={(e) => handlePaymentStatusChange(order.orderDetailId, e.target.value)}
                >
                  {paymentStatusOption.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>


              <div className="manufacturer">
                {order.manufacturer ? (
                  <div className="manufacturer-name rounded-pill px-2">
                    Assigned
                  </div>
                ) : (
                  <div
                    className="assign-button px-2 rounded-pill border border-secondary-subtle text-black"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Not Assigned
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default OrderTable;
