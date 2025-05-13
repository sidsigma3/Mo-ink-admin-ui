import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TotalOrders.css";

const TotalOrders = () => {
  const navigate = useNavigate();

  const orders = [3000, 4000, 5000, 4500];
  const maxOrder = Math.max(...orders);

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Orders",
        barThickness: 25,
        borderRadius: 7,
        data: orders,
        backgroundColor: orders.map((val) =>
          val === maxOrder ? "#0561FC" : "#CDCDCD"
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
  };

  const tableHeaders = ["Month", "Orders"];
  const tableRows = [
    ["January", 30],
    ["February", 50],
    ["March", 40],
    ["April", 70],
    ["May", 60],
  ];

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "bar",
        data: barChartData,
        options: chartOptions,
        tableHeaders,
        tableRows,
        text: "Total Orders",
      },
    });
  };

  return (
    <div className="total-orders-card p-3" onClick={handleClick}>
      {/* <h4>Total Orders</h4>
      <h3>50 Orders</h3> */}
      <div className="total-orders-graph">
        <GraphComponent
          type="bar"
          data={barChartData}
          options={chartOptions}
          text={"Total Orders"}
          number={"50 Orders"}
        />
      </div>
    </div>
  );
};


export default TotalOrders;

