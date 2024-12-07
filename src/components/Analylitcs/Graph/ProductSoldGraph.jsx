import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductSoldGraph = () => {
  const chartData = {
    labels: ['Cotton', 'Silk', 'Linen', 'Dyed', 'Nylon', 'Polyester', 'Jute', 'Weaving','Viscose','Spandex','Blended','Special'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [200, 150, 100, 80, 120, 90, 70, 50,40,60,180,90],
        backgroundColor: [
          '#0561FC'
        ],
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
        x: {
          grid: {
            display: false, // Hide grid lines on the x-axis
          },
        },
        y: {
          grid: {
            display: false, // Hide grid lines on the y-axis
          },
          beginAtZero: true,
          
        },
      },
    barThickness: 15
  };

  return (
    <div style={{height:'80%',width:'99%' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ProductSoldGraph;
