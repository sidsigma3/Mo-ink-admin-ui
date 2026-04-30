import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TotalOrders.css";

const TotalOrders = ({ data }) => {
  const navigate = useNavigate();

  const months = data?.monthlyOrders?.map(m => m.month) || ["Jan", "Feb", "Mar", "Apr"];
  const values = data?.monthlyOrders?.map(m => m.value) || [3, 4, 5, 4];
  const total = data?.totalOrders || 0;
  const maxOrder = Math.max(...values);

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Orders",
        barThickness: 25,
        borderRadius: 7,
        data: values,
        backgroundColor: values.map((val) =>
          val === maxOrder ? "#6B21A8" : "#CDCDCD"
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
  };

  const tableHeaders = ["Month", "Orders"];
  const tableRows = months.map((m, i) => [m, values[i]]);

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "bar",
        data: barChartData,
        options: chartOptions,
        tableHeaders,
        tableRows,
        text: "Total Orders",
      },
    });
  };

  return (
    <div className="total-orders-card p-3" onClick={handleClick}>
      <div className="total-orders-graph">
        <GraphComponent
          type="bar"
          data={barChartData}
          options={chartOptions}
          text={"Total Orders"}
          number={`${total} Orders`}
        />
      </div>
    </div>
  );
};

export default TotalOrders;
