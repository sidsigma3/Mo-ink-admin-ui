import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import './AvgOrder.css';

const AvgOrder = () => {
  const navigate = useNavigate();

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Avg Order",
        data: [30000, 50000, 40000, 70000, 60000],
        borderColor: "#0561FC",
        backgroundColor: "rgba(5, 97, 252, 0.2)",
        fill: true,
        tension: 0.4,
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

  const tableHeaders = ["Month", "Sales"];
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
        type: "line",
        data: lineChartData,
        options: chartOptions,
        tableHeaders,
        tableRows,
        text: "Avg Order Value",
      },
    });
  };

  return (
    <div className="avg-order-card " onClick={handleClick}>
      {/* <h4>Average Order Value</h4>
      <h3>₹16,213.00</h3> */}
      <div className="avg-order-graph">
        <GraphComponent
          type="line"
          data={lineChartData}
          options={chartOptions}
          text="Average Order Value"
          number="₹51,580"
        />
      </div>
    </div>
  );
};

export default AvgOrder;