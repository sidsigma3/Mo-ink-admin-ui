import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const GraphComponentGradient = ({ data, options, text, number }) => {
  const chartRef = useRef(null);

  const applyGradient = () => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    // Only apply gradient if the chart area is available
    if (chartArea) {
      const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
      gradient.addColorStop(0, "rgba(5, 97, 252, 0.8)");
      gradient.addColorStop(1, "rgba(5, 97, 252, 0)");

      // Apply gradient to the first dataset's background color
      chart.data.datasets[0].backgroundColor = gradient;
      chart.update();
    }
  };

  // Apply the gradient when the chart is rendered
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      applyGradient();
    }
  }, [data]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>{text}</h5>
        <p className="text-primary fw-bold">{number}</p>
      </div>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default GraphComponentGradient;
