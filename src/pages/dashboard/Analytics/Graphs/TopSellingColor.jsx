import React from 'react'
import GraphComponent from '../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent';
import { useNavigate } from 'react-router-dom';

const TopSellingColor = () => {

    const navigate = useNavigate()

    const topSellingColorsData = [
        { color: "#FF5733", sales: 150 }, // Red
        { color: "#33FF57", sales: 120 }, // Green
        { color: "#3357FF", sales: 100 }, // Blue
        { color: "#F3FF33", sales: 80 },  // Yellow
        { color: "#FF33A6", sales: 60 },  // Pink
      ];

      const chartDataTopColor = {
        labels: topSellingColorsData.map((item) => item.color), // Color names as labels
        datasets: [
          {
            label: "Sales",
            data: topSellingColorsData.map((item) => item.sales), // Sales topSellingColorsData for each color
            backgroundColor: topSellingColorsData.map((item) => item.color), // Using color for bars
            borderColor: "#FFFFFF", // Optional: white border for each bar
            borderWidth: 1,
            barThickness: 25,
            borderRadius:7,
          },
        ],
      };
    
      // Chart options
      const chartOptionsTopColor = {
        indexAxis:"y",
        maintainAspectRatio	:false,
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: false, // Hide gridlines for a cleaner look
            },
          },
          y: {
            grid: {
              display: false, // Hide y-axis gridlines
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide legend (if not needed)
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.raw} Sales`, // Custom tooltip label
            },
          },
        },
      };
    
   

    
    const handleClick = () => {
        navigate("/graph-details", {
            state: {
            type: "bar",
            data: chartDataTopColor,
            options: chartOptionsTopColor,
            tableHeaders,
            tableRows,
            text:'Top Selling Color'
            },
        });
    };


    const tableHeaders = ["Month", "Orders"];
    const tableRows = [
      ["#FF5733", 30],
      ["#33FF57", 50],
      ["2/92", 40],
      ["2/72", 70],
      ["2/90", 60],
    ];



  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      <GraphComponent type="bar" data={chartDataTopColor} options={chartOptionsTopColor} text={"Top Selling Colors"}/>
    </div>
  )
}

export default TopSellingColor