import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TopSellingColor.css";

const TopSellingColor = ({ data }) => {
  const navigate = useNavigate();

  const colors = data?.topColors || [];
  const labels = colors.length > 0 ? colors.map(c => c.colorName) : ["Red", "Green", "Blue", "Yellow", "Pink"];
  const values = colors.length > 0 ? colors.map(c => c.value) : [150, 120, 100, 80, 60];
  const bgColors = colors.length > 0 ? colors.map(c => c.colorCode || "#6B21A8") : ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A6"];

  const chartDataTopColor = {
    labels,
    datasets: [
      {
        label: "Weight (kg)",
        data: values,
        backgroundColor: bgColors,
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
      x: { beginAtZero: true, grid: { display: false } },
      y: { grid: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} kg`,
        },
      },
    },
  };

  const tableHeaders = ["Color", "Weight (kg)"];
  const tableRows = labels.map((l, i) => [l, values[i]]);

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
      <div className="top-selling-color-grap">
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
