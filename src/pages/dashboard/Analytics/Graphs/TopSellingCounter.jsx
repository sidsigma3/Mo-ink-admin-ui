import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TopSellingCounter.css";

const TopSellingCounter = () => {
  const navigate = useNavigate();

  const data = [90, 70, 60, 55, 30];
  const labels = ["2/92", "2/120", "2/72", "2/16", "2/80"];

  const horizontalBarChartData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data,
        barThickness: 25,
        borderRadius: 7,
        backgroundColor: "#0561FC",
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
      x: { grid: { display: false }, beginAtZero: true },
      y: { grid: { display: false }, beginAtZero: true },
    },
  };

  const tableHeaders = ["Counter", "Sales"];
  const tableRows = [
    ["2/16", 30],
    ["2/120", 50],
    ["2/92", 40],
    ["2/72", 70],
    ["2/90", 60],
  ];

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "bar",
        data: horizontalBarChartData,
        options: horizontalBarChartOptions,
        tableHeaders,
        tableRows,
        text: "Top Selling Counter",
      },
    });
  };

  return (
    <div className="top-selling-card p-3" onClick={handleClick}>
      <h4>Top Selling Counter</h4>
      <h3>Counter 2/92</h3>
      <div className="top-selling-graph">
        <GraphComponent
          type="bar"
          data={horizontalBarChartData}
          options={horizontalBarChartOptions}
          text={"Top Selling Counter"}
        />
      </div>
    </div>
  );
};


export default TopSellingCounter;

