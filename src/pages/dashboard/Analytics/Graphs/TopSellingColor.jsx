import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TopSellingColor.css";

const TopSellingColor = () => {
  const navigate = useNavigate();

  const topSellingColorsData = [
    { color: "#FF5733", sales: 150 },
    { color: "#33FF57", sales: 120 },
    { color: "#3357FF", sales: 100 },
    { color: "#F3FF33", sales: 80 },
    { color: "#FF33A6", sales: 60 },
  ];

  const chartDataTopColor = {
    labels: topSellingColorsData.map((item) => item.color),
    datasets: [
      {
        label: "Sales",
        data: topSellingColorsData.map((item) => item.sales),
        backgroundColor: topSellingColorsData.map((item) => item.color),
        borderColor: "#FFFFFF",
        borderWidth: 1,
        barThickness: 25,
        borderRadius: 7,
      },
    ],
  };

  const chartOptionsTopColor = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
      },
      y: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} Sales`,
        },
      },
    },
  };

  const tableHeaders = ["Color", "Sales"];
  const tableRows = [
    ["#FF5733", 150],
    ["#33FF57", 120],
    ["#3357FF", 100],
    ["#F3FF33", 80],
    ["#FF33A6", 60],
  ];

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "bar",
        data: chartDataTopColor,
        options: chartOptionsTopColor,
        tableHeaders,
        tableRows,
        text: "Top Selling Color",
      },
    });
  };

  return (
    <div className="top-selling-color-card p-3" onClick={handleClick}>
  <h4>Top Selling Colors</h4>
  <h3>
    <span
      className="badge"
      style={{
        backgroundColor: '#FF5733',
        width: '16px',
        height: '20px',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '8px',
      }}
    ></span>
 Fiery Orange
  </h3>
  <div className="top-selling-color-graph">
    <GraphComponent
      type="bar"
      data={chartDataTopColor}
      options={chartOptionsTopColor}
      text={"Top Selling Colors"}
    />
  </div>
</div>

  );
};

export default TopSellingColor;