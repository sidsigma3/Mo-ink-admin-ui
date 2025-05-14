import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TotalSales.css";

const TotalSales = () => {
  const navigate = useNavigate();

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(5, 97, 252, 0.8)");
    gradient.addColorStop(1, "rgba(5, 97, 252, 0)");
    return gradient;
  };

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "",
        data: [30, 50, 40, 70, 60],
        borderColor: "#0561FC",
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return "rgba(5, 97, 252, 0.2)";
          return createGradient(canvasCtx, chartArea);
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#0561FC",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#0561FC",
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
        text: "Total Sales",
      },
    });
  };

  return (
    <div className="total-sales-card p-3" onClick={handleClick}>
      {/* <h4>Total Sales</h4>
      <h3>₹1,04,804.00</h3> */}
      <div className="total-sales-graph">
        <GraphComponent
          type="line"
          data={lineChartData}
          options={chartOptions}
          text={"Total Sales"}
          number={"₹1,04,804.00"}
        />
      </div>
    </div>
  );
};

export default TotalSales;