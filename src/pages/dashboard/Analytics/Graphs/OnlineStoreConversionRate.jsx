import React from 'react';
import GraphComponent from '../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent';
import { useNavigate } from 'react-router-dom';
import './OnlineStoreConversionRate.css';

const OnlineStoreConversionRate = () => {
  const navigate = useNavigate();

  const rawData = [20, 30, 50, 45];

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Orders",
        barThickness: 25,
        borderRadius: 7,
        data: rawData,
        backgroundColor: rawData.map((val) =>
          val === Math.max(...rawData) ? "#0561FC" : "#CDCDCD"
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
      title: { display: false },
    },
  };

  const tableHeaders = ["Month", "Conversion Rate"];
  const tableRows = [
    ["January", "20%"],
    ["February", "50%"],
    ["March", "40%"],
    ["April", "70%"],
    ["May", "60%"],
  ];

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "bar",
        data: barChartData,
        options: chartOptions,
        tableHeaders,
        tableRows,
        text: 'Online Store Conversion Rate',
      },
    });
  };

  return (
    <div className="conversion-rate-card p-3" onClick={handleClick}>
      {/* <h4>Online Conversion Rate</h4> */}
      <div className="conversion-rate-graph">
        <GraphComponent
          type="bar"
          data={barChartData}
          options={chartOptions}
          text="Online Conversion Rate"
          number="5.34%"
        />
      </div>
    </div>
  );
};


export default OnlineStoreConversionRate;

