import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TopSellingCounter.css";

const TopSellingCounter = ({ data }) => {
  const navigate = useNavigate();

  const counters = data?.topCounters || [];
  const labels = counters.length > 0 ? counters.map(c => c.name) : ["2/92", "2/120", "2/72", "2/16", "2/80"];
  const values = counters.length > 0 ? counters.map(c => c.value) : [90, 70, 60, 55, 30];

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
      x: { grid: { display: false }, beginAtZero: true },
      y: { grid: { display: false }, beginAtZero: true },
    },
  };

  const tableHeaders = ["Counter", "Weight (kg)"];
  const tableRows = labels.map((l, i) => [l, values[i]]);

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
