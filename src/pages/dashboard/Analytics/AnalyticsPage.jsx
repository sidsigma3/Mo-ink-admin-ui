import React from 'react'
import Filter from '../../../components/Filter/DayFilter/Filter'
import GraphComponent from '../../../components/Analylitcs/Graph/Graph Cards/GraphComponent';
import SalesMap from '../../../components/Analylitcs/Graph/Map/SalesMap';
import TotalSales from './Graphs/TotalSales';
import TotalOrders from './Graphs/TotalOrders';
import AvgOrder from './Graphs/AvgOrder';
import TopProducts from './Graphs/TopProducts';
import TopSellingCounter from './Graphs/TopSellingCounter';
import TopSellingColor from './Graphs/TopSellingColor';
import OnlineStoreConversionRate from './Graphs/OnlineStoreConversionRate';
import OnlineStoreSession from './Graphs/OnlineStoreSession';
import SessionByDevice from './Graphs/SessionByDevice';
import TopCustomers from './Graphs/TopCustomers';

const AnalyticsPage = () => {
    const customersData = [
        { name: "Customer A", sales: 5000 },
        { name: "Customer B", sales: 4000 },
        { name: "Customer C", sales: 3000 },
        { name: "Customer D", sales: 2500 },
        { name: "Customer E", sales: 2000 },
        { name: "Customer F", sales: 1500 },
      ];

      const createGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
        gradient.addColorStop(0, "rgba(5, 97, 252, 0.8)"); // Start with solid blue
        gradient.addColorStop(1, "rgba(5, 97, 252, 0)"); // Fade to transparent
        return gradient;
      };
        

      const lineChartData = {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            label: "Sales",
            data: [30, 50, 40, 70, 60], // Your dataset values
            borderColor: "#0561FC", // Line color
            backgroundColor: (ctx) => {
              const { chart } = ctx;
              const { ctx: canvasCtx, chartArea } = chart;
              if (!chartArea) {
                return "rgba(5, 97, 252, 0.2)"; // Placeholder before the chart is rendered
              }
              return createGradient(canvasCtx, chartArea);
            },
            fill: true, // Enables area fill
            tension: 0.4, // Curve the line
            pointBackgroundColor: "#fff", // Point background color
            pointBorderColor: "#0561FC", // Point border color
            pointHoverBackgroundColor: "#fff", // Point hover fill color
            pointHoverBorderColor: "#0561FC", // Point hover border color
          },
        ],
      };
      
    
      const barChartData = {
        labels: ["2020", "2021", "2022"],
        datasets: [
          {
            label: "Revenue",
            barThickness: 25,
            borderRadius:7,
            data: [3000, 4000, 5000],
            backgroundColor: [ // Dynamically set color based on max value
              Math.max(...[3000, 4000, 5000]) === 3000 ? "#0561FC" : "#CDCDCD", // Blue if max
              Math.max(...[3000, 4000, 5000]) === 4000 ? "#0561FC" : "#CDCDCD", // Blue if max
              Math.max(...[3000, 4000, 5000]) === 5000 ? "#0561FC" : "#CDCDCD", // Blue if max
            ],
          },
        ],
       
      };
      
    
      const doughnutChartData = {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: [
              "#0561FC", // Main color
              "#0350D2", // A darker shade of #0561FC
              "#3A73FF", // A lighter shade of #0561FC
            ],
          },
        ],
      };
    
      const chartOptions = {
        responsive: true,
        maintainAspectRatio	:false,
        scales: {
            x: {
              grid: { display: true },
            },
            y: {
              grid: { display: true },
              beginAtZero: true,
            },
          },
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Chart" },
        },
      };


      const horizontalBarChartData = {
        labels: ["2020", "2021", "2022"],
        datasets: [
          {
            label: "Revenue",
            data: [3000, 4000, 5000],
            barThickness: 25,
            borderRadius:7,
            backgroundColor: [
              "#0561FC",
            ],
            barThickness: 30,  // Set fixed bar width
          },
        ],
      };
      
      const horizontalBarChartOptions = {
        responsive: true,
        maintainAspectRatio:false,
        indexAxis: "y",  // Make the bar chart horizontal
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Revenue Over Years",
          },
        },
        scales: {
          x: {
            beginAtZero: true, // Start the x-axis at 0
          },
          y: {
            beginAtZero: true, // Start the y-axis at 0
          },
        },
      };


      const sortedCustomers = customersData.sort((a, b) => b.sales - a.sales);

      const chartDataTopCustomer = {
        labels: sortedCustomers.map(customer => customer.name),
        datasets: [
          {
            label: "Customer Sales",
            data: sortedCustomers.map(customer => customer.sales),
            backgroundColor: sortedCustomers.map((_, index) => {
              // Adjust opacity for each customer based on their rank
              const opacity = 0.2 + (0.8 * (index + 1)) / sortedCustomers.length;
              return `rgba(5, 97, 252, ${opacity})`; // Faded blue color for lower ranked customers
            }),
            borderColor: "rgba(5, 97, 252, 1)", // Solid blue for borders
            borderWidth: 1,
            barThickness: 25,
            borderRadius:7,
          },
        ],
      };
    
      // Chart options
      const chartOptionsTopCustomer = {
        indexAxis: "y", // To make the bars horizontal
        maintainAspectRatio:false,
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const customerName = context.label;
                const sales = context.raw;
                return `${customerName}: $${sales.toLocaleString()}`; // Show customer name and sales in the tooltip
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: false,
              text: "Sales",
            },
          },
          y: {
            title: {
              display: false,
              text: "Customers",
            },
          },
        },
      };

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
    

  return (
    <div className='analytics-page'>
        <div className='top d-flex justify-content-between'>
            <h4 style={{fontSize:'1.3rem'}}>Analytics</h4>
            <Filter></Filter>
        </div>

        <div >
    
      <div className="row">
        {/* <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <GraphComponent type="line" data={lineChartData} options={chartOptions} />
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <GraphComponent type="bar" data={barChartData} options={chartOptions} />
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <GraphComponent type="bar" data={horizontalBarChartData} options={horizontalBarChartOptions} />
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <GraphComponent type="doughnut" data={doughnutChartData} options={chartOptions} />
        </div>

       

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <GraphComponent type="bar" data={chartDataTopCustomer} options={chartOptionsTopCustomer} />
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <GraphComponent type="bar" data={chartDataTopColor} options={chartOptionsTopColor} />
        </div> */}

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <TotalSales/>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <TotalOrders></TotalOrders>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
           <AvgOrder></AvgOrder>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
           <TopProducts></TopProducts>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
           <TopSellingCounter></TopSellingCounter>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
           <TopSellingColor></TopSellingColor>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
           <OnlineStoreConversionRate></OnlineStoreConversionRate>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <OnlineStoreSession></OnlineStoreSession>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
           <SessionByDevice></SessionByDevice>
        </div>

        <div className='col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3'>
            <SalesMap></SalesMap>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mt-3">
          <TopCustomers></TopCustomers>
        </div>


        
      </div>
    </div>



    </div>
  )
}

export default AnalyticsPage