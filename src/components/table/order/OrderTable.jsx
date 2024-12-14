import React, { useState } from "react";
import "./OrderTable.css";
import { useOrderContext } from "../../Context/OrderContext";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import { BiWallet } from "react-icons/bi";
import { LuDot } from "react-icons/lu";
import ModalAssign from "../../Modal/ModalAssign";
const OrderTable = () => {
  const { orders } = useOrderContext();

  const [showModalAssign, setShowModalAssign] = useState(false);

  const navigate = useNavigate();

  const handleRowClick = (order) => {
    navigate("/create-order", { state: { order } });
  };

  const statusClassMap = {
    "New Order": "blue",
    Delivered: "green",
    Shipped: "yellow",
    Rejected: "red",
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

            <th style={{ width: "11.3rem" }}>Manufacturer</th>
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
              <td>{order.date}</td>
              <td>{order.customer}</td>
              <td>{order.quantity}</td>
              <td>{order.weight}</td>
              <td>{order.amount}</td>
              <td>
                <div className={order.payment === "Paid" ? "green" : "grey"}>
                  {order.payment}
                </div>
              </td>
              <td>
                <div className={statusClassMap[order.orderStatus]}>
                  {order.orderStatus}
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
            key={order.id}
            onClick={() => handleRowClick(order)}
          >
            <div className="d-flex justify-content-between">
              <h4>{order.date}</h4>
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
                <h3 className="m-0">{order.amount}</h3>
              </div>
            </div>

            <h3>#{order.orderId}</h3>

            <div className="d-flex justify-content-between">
              <p>
                {order.customer}{" "}
                <span>
                  <LuDot size={25} />
                </span>
              </p>
              <p>
                {order.quantity} Quantity{" "}
                <span>
                  <LuDot size={25} />
                </span>
              </p>
              <p>{order.weight}</p>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex justify-content-between gap-1">
                <h5 className={statusClassMap[order.orderStatus]}>
                  {order.orderStatus}
                </h5>
                <h5 className={order.payment === "Paid" ? "green" : "grey"}>
                  {order.payment}
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
};

export default OrderTable;
