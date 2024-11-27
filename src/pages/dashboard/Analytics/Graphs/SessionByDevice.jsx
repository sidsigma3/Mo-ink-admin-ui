import React from "react";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import { useNavigate } from "react-router-dom";

const SessionByDevice = () => {
  const navigate = useNavigate();

  const doughnutChartData = {
    labels: ["Mobile", "Desktop", "Tablet", "Others"],
    datasets: [
      {
        data: [300, 50, 100, 250],
        backgroundColor: [
          "#0561FC", // Main color
          "#0350D2", // A darker shade of #0561FC
          "#3A73FF", // A lighter shade of #0561FC
          "#7A9FFF", // Another variation
        ],
      },
    ],
  };

  // Calculate the total visitors
  const totalVisitors = doughnutChartData.datasets[0].data.reduce(
    (acc, value) => acc + value,
    0
  );

  // Custom plugin to display total visitors in the center
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
      const {
        width,
        height,
        ctx
      } = chart;
      ctx.save();
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0561FC";
      ctx.fillText(
        `${totalVisitors} Visitors`,
        width / 2,
        height / 2
      );
    },
  };

  const chartOptions = {
    responsive: true,
    cutout:80,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false, text: "Session By Device Type" },
    },
    scales: {
      x: { display: false }, // Hide x-axis
      y: { display: false }, // Hide y-axis
    },
  };

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

  const tableHeaders = ["Device", "Session"];
  const tableRows = [
    ["Mobile", 300],
    ["Desktop", 50],
    ["Tablet", 100],
    ["Others", 250],
  ];

  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      <GraphComponent
        type="doughnut"
        data={doughnutChartData}
        options={chartOptions}
        plugins={[centerTextPlugin]} // Pass the plugin here
        text={"Session by device type"}
      />
    </div>
  );
};

export default SessionByDevice;
