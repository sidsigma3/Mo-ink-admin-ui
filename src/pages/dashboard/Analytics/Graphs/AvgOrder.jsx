import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import './AvgOrder.css';

const AvgOrder = ({ data }) => {
  const navigate = useNavigate();

  const months = data?.monthlySales?.map(m => m.month) || ["Jan", "Feb", "Mar", "Apr", "May"];
  const orderValues = data?.monthlyOrders?.map(m => m.value) || [1, 1, 1, 1, 1];
  const salesValues = data?.monthlySales?.map(m => m.value) || [30000, 50000, 40000, 70000, 60000];
  const avgValues = months.map((_, i) => orderValues[i] > 0 ? Math.round(salesValues[i] / orderValues[i]) : 0);
  const avgTotal = data?.avgOrderValue || 0;

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(107, 33, 168, 0.6)");
    gradient.addColorStop(1, "rgba(107, 33, 168, 0)");
    return gradient;
  };

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Avg Order",
        data: avgValues,
        borderColor: "#6B21A8",
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return "rgba(107, 33, 168, 0.2)";
          return createGradient(canvasCtx, chartArea);
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#6B21A8",
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

  const tableHeaders = ["Month", "Avg Value"];
  const tableRows = months.map((m, i) => [m, `₹${avgValues[i].toLocaleString('en-IN')}`]);

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "line",
        data: lineChartData,
        options: chartOptions,
        tableHeaders,
        tableRows,
        text: "Avg Order Value",
      },
    });
  };

  return (
    <div className="avg-order-card " onClick={handleClick}>
      <div className="avg-order-graph">
        <GraphComponent
          type="line"
          data={lineChartData}
          options={chartOptions}
          text="Average Order Value"
          number={`₹${Math.round(avgTotal).toLocaleString('en-IN')}`}
        />
      </div>
    </div>
  );
};

export default AvgOrder;