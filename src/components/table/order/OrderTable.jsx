import React, { useState , useEffect ,forwardRef ,useImperativeHandle } from "react";
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

const OrderTable = forwardRef(({data}, ref) => {
 
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(data || []);
  }, [data]);

  const [showModalAssign, setShowModalAssign] = useState(false);

  const navigate = useNavigate();

  const statusOptions = [
    "New Order",
    "Dispatch from Inventory",
    "Send to Vendor",
    "Dispatch from Vendor",
    "Delivered",
    "Order Cancelled",
  ];

  const paymentStatusOption = [
    "Unpaid",
    "Partially Paid",
    "Fully Paid"
  ]

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
        // fetchOrders(); // Refresh order list

        alert("Payment status updated successfully.");
    } catch (error) {
        console.error("Failed to update payment status:", error);
    }
};


  const handleStatusChange = async (orderId, newStatus) => {
    try {
        // Fetch the existing order details before updating
        const existingOrder = orders.find(order => order.orderId === orderId);

        if (!existingOrder) {
            console.error("Order not found.");
            return;
        }

        const updatedOrderData = {
            ...existingOrder, // Keep all existing fields
            status: newStatus, // Update only status
        };

        await updateOrder(orderId, updatedOrderData);
        // fetchOrders();

      alert("Order status updated successfully.");
    } catch (error) {
        console.error("Failed to update order status:", error);
    }
};



// const fetchOrders = async () => {
//   try {
//       const data = await getAllOrders();
//       setOrders(data);
//   } catch (error) {
//       console.error("Failed to fetch orders", error);
//   }
// };

// useEffect(() => {
//   fetchOrders();
// }, []);

  const handleRowClick = (order) => {
    navigate("/create-order", { state: { order } });
  };

  const statusClassMap = {
    "New Order": "blue",
    Delivered: "green",
    "Send to Vendor": "yellow",
    "Order Cancelled": "red",
    "In Transit": "grey",
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
      "Quantity": order.variants.length,
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

  return (
    <div className="order-table table-ctn-order">
      <Table hover>
        <thead>
          <tr>
            <th>Order ID</th>

            <th>Date</th>

            <th>Customer</th>

            <th>Quantity</th>

            <th>Weight</th>

            <th>Amount</th>

            <th>Payment</th>

            <th>Order Status</th>

            <th style={{ width: "11.3rem" }}>V.O I'D</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.orderId}
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(order)}
            >
              <td style={{ fontWeight: 500 }}>{order.orderId}</td>
              <td>{new Intl.DateTimeFormat('en-GB').format(new Date(order.createdAt))}</td>
              <td>{order.customer.customerName}</td>
              <td>{order.variants.length}</td>
              <td>{order.totalAmount}</td>
              <td>{order.payment.amount}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <select
                  className={order.payment.paymentStatus === "Fully Paid" ? "green" : order.payment.paymentStatus === 'Unpaid' ? "grey" :'yellow'}
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
              <td onClick={(e) => e.stopPropagation()}>
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
                {order.totalAmount} Quantity{" "}
                <span>
                  <LuDot size={25} />
                </span>
              </p>
              <p>{order.totalAmount}</p>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex justify-content-between gap-1">
                <h5 className={statusClassMap[order.status]}>
                  {order.status}
                </h5>
                <h5 className={order.payment === "Paid" ? "green" : "grey"}>
                  {order.payment.paymentStatus}
                </h5>
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
