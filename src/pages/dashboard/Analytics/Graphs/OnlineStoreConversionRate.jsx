import React from 'react'
import GraphComponent from '../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent';
import { useNavigate } from 'react-router-dom';

const OnlineStoreConversionRate = () => {

    const  navigate = useNavigate()

    const barChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [
          {
            label: "Orders",
            barThickness: 25,
            borderRadius: 7,
            // Convert percentages to numeric values
            data: [20, 30, 50, 45],
            backgroundColor: (() => {
              const data = [20, 30, 50, 45]; // Numeric data
              const maxValue = Math.max(...data); // Find the max value
      
              // Generate background colors dynamically
              return data.map((value) => (value === maxValue ? "#0561FC" : "#CDCDCD"));
            })(),
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
          title: { display: false, text: "Online Store Conversion Rate" },
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
            text:'Online Store Conversion Rate'
            },
        });
    };


    const tableHeaders = ["Month", "Conversion Rate"];
    const tableRows = [
      ["January", "20%"],
      ["February", "50%"],
      ["March", "40%"],
      ["April", "70%"],
      ["May", "60%"],
    ];



  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      <GraphComponent type="bar" data={barChartData} options={chartOptions} text={"Online Conversion Rate"} number={"5.34%"}/>
    </div>
  )
}

export default OnlineStoreConversionRate