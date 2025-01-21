import React, { useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopSalesExecutiveChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const customersData = [
    { name: "Customer A", sales: 5000 },
    { name: "Customer B", sales: 4000 },
    { name: "Customer C", sales: 3000 },
    { name: "Customer D", sales: 2500 },
    { name: "Customer E", sales: 2000 },
    { name: "Customer F", sales: 1500 },
  ];

  const sortedCustomers = customersData.sort((a, b) => b.sales - a.sales);

  const chartData = {
    labels: sortedCustomers.map((customer) => customer.name),
    datasets: [
      {
        label: "Customer Purchase",
        data: sortedCustomers.map((customer) => customer.sales),
        backgroundColor: sortedCustomers.map((_, index) => {
          const opacity = 0.2 + (0.8 * (index + 1)) / sortedCustomers.length;
          return `rgba(5, 97, 252, ${opacity})`;
        }),
        borderColor: "rgba(5, 97, 252, 1)",
        borderWidth: 1,
        borderRadius: 7,
        barThickness: 25,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y", // Horizontal bars
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const customerName = context.label;
            const sales = context.raw;
            return `${customerName}: $${sales.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: false,
        },
      },
      y: {
        grid: { display: false },
        title: {
          display: false,
        },
      },
    },
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Destroy any existing chart instance before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar", // Specify the chart type
      data: chartData,
      options: chartOptions,
    });
  }, [chartData, chartOptions]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default TopSalesExecutiveChart;
