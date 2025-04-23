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

const OrderTable = forwardRef(({data}, ref) => {
 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const createOrderRef = useRef(null);

  useEffect(() => {
    setOrders(data || []);
  }, [data]);

  const [showModalAssign, setShowModalAssign] = useState(false);

  const navigate = useNavigate();

  const statusOptions = [
    "New Order",
    "Shipped",
    "Manufactured",
    "Delivered",
    "Cancelled",
    "Returned",
    // "Partial return",
    // "Partial cancel",
   
  ];



  const paymentStatusOption = ["Unpaid", "Partially Paid", "Paid"];


  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
        // Find the existing order details
        const existingOrder = orders.find(order => order.orderId === orderId);

        if (!existingOrder) {
            console.error("Order not found.");
            return;
        }

        // Prepare updated order data with new payment status
        const updatedOrderData = {
            ...existingOrder,
            payment: {
                ...existingOrder.payment,
                paymentStatus: newStatus, // Update payment status
            },
        };

        // Send update request to backend
        await updateOrder(orderId, updatedOrderData);
        fetchOrders(); // Refresh order list

        alert("Payment status updated successfully.");
    } catch (error) {
        console.error("Failed to update payment status:", error);
    }
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
  "New Order": "blue",
  "Shipped": "yellow",
  "Manufactured": "purple",
  "Delivered": "green",
  "Cancelled": "red",
  "Returned": "grey",
  // "Partial return": "purple",
  // "Partial cancel": "muted-clay",
  
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

    const formattedData = orders.map((order) => ({
      "Order ID": order.orderId,
      "Date": new Intl.DateTimeFormat("en-GB").format(new Date(order.createdAt)),
      "Customer": order.customer.customerName,
      "Quantity": order.orderVariantResponse.length,
      "Weight": order.totalAmount,
      "Amount": order.payment.amount,
      "Payment Status": order.payment.paymentStatus,
      "Order Status": order.status,
    }));

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



  return (
    <div className="order-table table-ctn-order">
      <Table hover>
        <thead>
          <tr>

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
          {orders.map((order) => (
            <tr
              key={order.orderId}
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(order)}
            >

              <td style={{ verticalAlign: 'middle', fontWeight: 500 }}>{order.orderId}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{new Intl.DateTimeFormat('en-GB').format(new Date(order.createdAt))}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.customer.customerName}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>{order.orderVariantResponse.length}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>
                {order.orderVariantResponse.reduce((sum, variant) => sum + (Number(variant.orderWeight) || 0), 0).toFixed(2)} kg
              </td>

              <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>₹{order.totalAmount}</td>
              <td  style={{ textAlign: 'center', verticalAlign: 'middle'}} onClick={(e) => e.stopPropagation()}>

                <select
                  className={
                    order.payment.paymentStatus === "Paid"
    ? "green"
    : order.payment.paymentStatus === "Partially Paid"
    ? "purple"
    : order.payment.paymentStatus === "Unpaid"
    ? "yellow"
    : "defaultColor"
                  }
                  value={order.payment.paymentStatus}
                  onChange={(e) => handlePaymentStatusChange(order.orderId, e.target.value)}
                >
                  {paymentStatusOption.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td   style={{ textAlign: 'center', verticalAlign: 'middle'}} onClick={(e) => e.stopPropagation()}>
              <select
                className={statusClassMap[order.status]}
                value={order.status}
                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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

              <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>
  {/* {order.hasReturnRequest && ( */}
  <button
      className="alert-icon-btn"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Return requested for this order"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="alert-icon-circle">
        <FiAlertCircle size={16} color="red" />
      </div>
    </button>
  {/* )} */}
</td>

            </tr>
          ))}
        </tbody>
      </Table>

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
