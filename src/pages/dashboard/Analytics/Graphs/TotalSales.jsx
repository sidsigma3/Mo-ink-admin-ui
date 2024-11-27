import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";

const TotalSales = () => {
  const navigate = useNavigate();

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(5, 97, 252, 0.8)"); // Start with solid blue
    gradient.addColorStop(1, "rgba(5, 97, 252, 0)"); // Fade to transparent
    return gradient;
  };

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "",
        data: [30, 50, 40, 70, 60], // Your dataset values
        borderColor: "#0561FC", // Line color
        backgroundColor: (ctx) => {
            const { chart } = ctx;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) {
              return "rgba(5, 97, 252, 0.2)"; // Placeholder before the chart is rendered
            }
            return createGradient(canvasCtx, chartArea);
          },
          fill: true, // Enables area fill
          tension: 0.4, // Curve the line
          pointBackgroundColor: "#fff", // Point background color
          pointBorderColor: "#0561FC", // Point border color
          pointHoverBackgroundColor: "#fff", // Point hover fill color
          pointHoverBorderColor: "#0561FC", // Point hover border color
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
      title: { display: false, text: "Total Sales" },
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
        text: "Total Sales",
      },
    });
  };

  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      <GraphComponent type="line" data={lineChartData} options={chartOptions} text={"Total Sales"} number={"₹1,04,804.00"}/>
    </div>
  );
};

export default TotalSales;
