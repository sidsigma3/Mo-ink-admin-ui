import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./OnlineStoreSession.css";

const OnlineStoreSession = () => {
  const navigate = useNavigate();

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Store Session",
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
        text: "Online Store Sessions",
      },
    });
  };

  return (
    <div className="online-store-card p-3" onClick={handleClick}>
      <h4>Online Store Sessions</h4>
      <div className="online-store-graph">
        <GraphComponent
          type="line"
          data={lineChartData}
          options={chartOptions}
          text="Online Store Sessions"
          number={7259}
        />
      </div>
    </div>
  );
};

export default OnlineStoreSession;
