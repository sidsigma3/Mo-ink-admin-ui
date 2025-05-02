import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TopProducts.css";

const TopProducts = () => {
  const navigate = useNavigate();

  const horizontalBarChartData = {
    labels: ["Cotton Yarn", "Linen Yarn", "Viscose Yarn", "Nylon Yarn", "Silk Yarn"],
    datasets: [
      {
        label: "Sales",
        data: [9000, 7000, 6000, 5500, 3000],
        barThickness: 25,
        borderRadius: 7,
        backgroundColor: ["#0561FC"],
      },
    ],
  };

  const horizontalBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
      },
    },
  };

  const tableHeaders = ["Product", "Sales"];
  const tableRows = [
    ["Cotton Yarn", 9000],
    ["Linen Yarn", 7000],
    ["Viscose Yarn", 6000],
    ["Nylon Yarn", 5500],
    ["Silk Yarn", 3000],
  ];

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "bar",
        data: horizontalBarChartData,
        options: horizontalBarChartOptions,
        tableHeaders,
        tableRows,
        text: "Top Products",
      },
    });
  };

  return (
    <div className="top-products-card p-3" onClick={handleClick}>
      <h4>Top Products</h4>
      <h3>Cotton Yarn</h3>
      <div className="top-products-graph">
        <GraphComponent
          type="bar"
          data={horizontalBarChartData}
          options={horizontalBarChartOptions}
          text={"Top Products"}
        />
      </div>
    </div>
  );
};

export default TopProducts;
