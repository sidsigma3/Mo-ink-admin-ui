import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TotalSales.css";

const TotalSales = ({ data }) => {
  const navigate = useNavigate();

  const months = data?.monthlySales?.map(m => m.month) || ["Jan", "Feb", "Mar", "Apr", "May"];
  const values = data?.monthlySales?.map(m => m.value) || [30, 50, 40, 70, 60];
  const total = data?.totalSales || 0;

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(107, 33, 168, 0.8)");
    gradient.addColorStop(1, "rgba(107, 33, 168, 0)");
    return gradient;
  };

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "",
        data: values,
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
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#6B21A8",
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
  const tableRows = months.map((m, i) => [m, values[i]]);

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
      <div className="total-sales-graph">
        <GraphComponent
          type="line"
          data={lineChartData}
          options={chartOptions}
          text={"Total Sales"}
          number={`₹${total.toLocaleString('en-IN')}`}
        />
      </div>
    </div>
  );
};

export default TotalSales;