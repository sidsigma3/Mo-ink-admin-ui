import React from 'react'
import GraphComponent from '../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent';
import { useNavigate } from 'react-router-dom';

const TopSellingCounter = () => {

    const navigate = useNavigate()

    const horizontalBarChartData = {
        labels: ["2/92", "2/120", "2/72","2/16","2/80"],
        datasets: [
          {
            label: "Sales",
            data: [90, 70, 60,55,30],
            barThickness: 25,
            borderRadius:7,
            backgroundColor: [
              "#0561FC",
            ],
      
          },
        ],
      };
      
      const horizontalBarChartOptions = {
        responsive: true,
        maintainAspectRatio:false,
        indexAxis: "y",  // Make the bar chart horizontal
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
            text: "Top Selling Counter",
          },
        },
        scales: {
          x: {
            grid:{display:false},
            beginAtZero: true, // Start the x-axis at 0
          },
          y: {
            grid:{display:false},
            beginAtZero: true, // Start the y-axis at 0
          },
        },
      };

   

    
    const handleClick = () => {
        navigate("/graph-details", {
            state: {
            type: "bar",
            data: horizontalBarChartData,
            options: horizontalBarChartOptions,
            tableHeaders,
            tableRows,
            text:'Top Selling Counter'
            },
        });
    };


    const tableHeaders = ["Month", "Orders"];
    const tableRows = [
      ["2/16", 30],
      ["2/120", 50],
      ["2/92", 40],
      ["2/72", 70],
      ["2/90", 60],
    ];



  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      <GraphComponent type="bar" data={horizontalBarChartData} options={horizontalBarChartOptions} text={"Top Selling Counter"}/>
    </div>
  )
}

export default TopSellingCounter