import React from 'react'
import GraphComponent from '../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent';
import { useNavigate } from 'react-router-dom';

const TopProducts = () => {

    const navigate = useNavigate()

    const horizontalBarChartData = {
        labels: ["Cotton Yarn", "Linen Yarn", "Viscose Yarn","Nylon Yarn","Silk Yarn"],
        datasets: [
          {
            label: "Sales",
            data: [9000, 7000, 6000,5500,3000],
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
            text: "Top Products",
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
            text:'Top Products'
            },
        });
    };


    const tableHeaders = ["Month", "Orders"];
    const tableRows = [
      ["cotton Yarn", 30],
      ["Linen Yarn", 50],
      ["Viscose Yarn", 40],
      ["Nylon Yarn", 70],
      ["Silk Yarn", 60],
    ];



  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      <GraphComponent type="bar" data={horizontalBarChartData} options={horizontalBarChartOptions} text={"Top Products"} number={""}/>
    </div>
  )
}

export default TopProducts