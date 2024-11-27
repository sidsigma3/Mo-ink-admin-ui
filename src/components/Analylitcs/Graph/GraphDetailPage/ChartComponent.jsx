import React, { useEffect } from "react";
import Chart from "chart.js/auto";

const ChartComponent = ({ type, data, options, id }) => {
  useEffect(() => {
    const ctx = document.getElementById(id).getContext("2d");
    new Chart(ctx, {
      type,
      data,
      options,
    });

    // Cleanup to avoid creating multiple charts on re-render
    return () => {
      const chartInstance = Chart.getChart(id);
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [type, data, options, id]);

  return <canvas id={id} />;
};

export default ChartComponent;
