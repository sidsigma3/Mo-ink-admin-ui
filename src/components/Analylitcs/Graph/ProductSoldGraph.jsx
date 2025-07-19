import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductSoldGraph = ({ productData }) => {
  const labels = Object.keys(productData);
  const weights = Object.values(productData);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights,
        backgroundColor: '#6B21A8',
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true },
    },
    barThickness: 15,
  };

  return (
    <div style={{ height: '80%', width: '99%' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ProductSoldGraph;
