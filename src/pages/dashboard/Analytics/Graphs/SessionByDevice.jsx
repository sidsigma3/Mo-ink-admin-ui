import React from "react";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import { useNavigate } from "react-router-dom";
import "./SessionByDevice.css";

const SessionByDevice = () => {
  const navigate = useNavigate();

  const doughnutChartData = {
    labels: ["Mobile", "Desktop", "Tablet", "Others"],
    datasets: [
      {
        data: [300, 50, 100, 250],
        backgroundColor: [
          "#6B21A8",
          "#8B3EC8",
          "#A855F7",
          "#C084FC",
        ],
      },
    ],
  };

  const totalVisitors = doughnutChartData.datasets[0].data.reduce(
    (acc, value) => acc + value,
    0
  );

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.save();
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#6B21A8";
      ctx.fillText(`${totalVisitors} Visitors`, width / 2, height / 2);
    },
  };

  const chartOptions = {
    responsive: true,
    cutout: 80,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const tableHeaders = ["Device", "Session"];
  const tableRows = [
    ["Mobile", 300],
    ["Desktop", 50],
    ["Tablet", 100],
    ["Others", 250],
  ];

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "doughnut",
        data: doughnutChartData,
        options: chartOptions,
        tableHeaders,
        tableRows,
        text: "Session By Device Type",
      },
    });
  };

  return (
    <div className="session-device-card  p-3" onClick={handleClick}>
      <div className="session-device-graph">
        <GraphComponent
          type="doughnut"
          data={doughnutChartData}
          options={chartOptions}
          plugins={[centerTextPlugin]}
          text={"Session by device type"}
        />
      </div>
    </div>
  );
};

export default SessionByDevice;