import React, { useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  DoughnutController,
} from "chart.js";

// Register everything needed
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  BarController,
  LineController,
  DoughnutController,
  Title,
  Tooltip,
  Legend
);

const GraphComponent = ({ type, data, options, plugins = [], text, number }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type,
      data,
      options,
      plugins,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options, plugins]);

  return (
    <div className="graph-card">
      {text && <h4>{text}</h4>}
      {number && <h3>{number}</h3>}
      <div className="chart-container">
        <canvas   ref={chartRef}
        style={{
        maxWidth: '100%',
        height: '240px',
        boxSizing: 'border-box',
        display: 'block',
        width: '326px',
        // zIndex: '-1'
      }}>

      </canvas>
      </div>
    </div>
  );
};

export default GraphComponent;
