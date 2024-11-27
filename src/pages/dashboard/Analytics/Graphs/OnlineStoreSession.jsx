import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";

const OnlineStoreSession = () => {
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
        label: "Store Session",
        data: [30000, 50000, 40000, 70000, 60000],
        borderColor: "#0561FC",
        backgroundColor: "rgba(5, 97, 252, 0.2)", // Simplified background
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
      title: { display: false, text: "Online Store Session" },
    },
  };

  // Table data
  const tableHeaders = ["Month", "Sales"];
  const tableRows = [
    ["January", 30000],
    ["February", 50000],
    ["March", 40000],
    ["April", 70000],
    ["May", 60000],
  ];

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "line",
        data: lineChartData,
        options: chartOptions,
        tableHeaders,
        tableRows,
        text:'Avg Order Value'
      },
    });
  };

  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      <GraphComponent type="line" data={lineChartData} options={chartOptions} text={"Online Store Sessions"} number={7259}/>
    </div>
  );
};

export default OnlineStoreSession;
