import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TopProducts.css";

const TopProducts = ({ data }) => {
  const navigate = useNavigate();

  const products = data?.topProducts || [];
  const labels = products.length > 0 ? products.map(p => p.name) : ["Cotton Yarn", "Linen Yarn", "Viscose Yarn"];
  const values = products.length > 0 ? products.map(p => p.value) : [9000, 7000, 6000];

  const horizontalBarChartData = {
    labels,
    datasets: [
      {
        label: "Weight (kg)",
        data: values,
        barThickness: 25,
        borderRadius: 7,
        backgroundColor: "#6B21A8",
      },
    ],
  };

  const horizontalBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { beginAtZero: true, grid: { display: false } },
      y: { beginAtZero: true, grid: { display: false } },
    },
  };

  const tableHeaders = ["Product", "Weight (kg)"];
  const tableRows = labels.map((l, i) => [l, values[i]]);

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
