import React from 'react'
import GraphComponent from '../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent';
import { useNavigate } from 'react-router-dom';

const TotalOrders = () => {

    const  navigate = useNavigate()

    const barChartData = {
        labels: ["Jan", "Feb", "Mar" , "Apr"],
        datasets: [
          {
            label: "Orders",
            barThickness: 25,
            borderRadius:7,
            data: [3000, 4000, 5000 , 4500],
            backgroundColor: [ // Dynamically set color based on max value
              Math.max(...[3000, 4000, 5000]) === 3000 ? "#0561FC" : "#CDCDCD", // Blue if max
              Math.max(...[3000, 4000, 5000]) === 4000 ? "#0561FC" : "#CDCDCD", // Blue if max
              Math.max(...[3000, 4000, 5000]) === 5000 ? "#0561FC" : "#CDCDCD", // Blue if max
            ],
          },
        ],
       
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio	:false,
        scales: {
            x: {
              grid: { display: false },
            },
            y: {
              grid: { display: false },
              beginAtZero: true,
            },
          },
        plugins: {
          legend: { display: false },
          title: { display: false, text: "Total Orders" },
        },
      };

    
    const handleClick = () => {
        navigate("/graph-details", {
            state: {
            type: "bar",
            data: barChartData,
            options: chartOptions,
            tableHeaders,
            tableRows,
            text:'Total Orders'
            },
        });
    };


    const tableHeaders = ["Month", "Orders"];
    const tableRows = [
      ["January", 30],
      ["February", 50],
      ["March", 40],
      ["April", 70],
      ["May", 60],
    ];



  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      <GraphComponent type="bar" data={barChartData} options={chartOptions} text={"Total Orders"} number={"50 Orders"}/>
    </div>
  )
}

export default TotalOrders