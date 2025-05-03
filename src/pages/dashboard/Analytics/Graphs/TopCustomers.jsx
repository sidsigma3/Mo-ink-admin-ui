import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TopCustomers.css";

const TopCustomers = () => {
  const navigate = useNavigate();

  const customersData = [
    { name: "Customer A", sales: 5000 },
    { name: "Customer B", sales: 4000 },
    { name: "Customer C", sales: 3000 },
    { name: "Customer D", sales: 2500 },
    { name: "Customer E", sales: 2000 },
    { name: "Customer F", sales: 1500 },
  ];

  const sortedCustomers = customersData.sort((a, b) => b.sales - a.sales);

  const chartDataTopCustomer = {
    labels: sortedCustomers.map((customer) => customer.name),
    datasets: [
      {
        label: "Customer Purchase",
        data: sortedCustomers.map((customer) => customer.sales),
        backgroundColor: sortedCustomers.map((_, index) => {
          const opacity = 0.2 + (0.8 * (index + 1)) / sortedCustomers.length;
          return `rgba(5, 97, 252, ${opacity})`; // Faded blue color for lower ranked customers
        }),
        borderColor: "rgba(5, 97, 252, 1)", // Solid blue for borders
        borderWidth: 1,
        barThickness: 25,
        borderRadius: 7,
      },
    ],
  };

  const chartOptionsTopCustomer = {
    indexAxis: "y", // To make the bars horizontal
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
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
        grid: { display: false },
        title: { display: false },
      },
      y: {
        grid: { display: false },
        title: { display: false },
      },
    },
  };

  const tableHeaders = ["Customer", "Sales"];
  const tableRows = sortedCustomers.map((customer) => [customer.name, customer.sales]);

  const handleClick = () => {
    navigate("/graph-details", {
      state: {
        type: "bar",
        data: chartDataTopCustomer,
        options: chartOptionsTopCustomer,
        tableHeaders,
        tableRows,
        text: "Top Customers",
      },
    });
  };

  return (
    <div className="top-customers-card p-3" onClick={handleClick}>
      <h4>Top Customers</h4>
      <h3>Customer A</h3>
      <div className="top-customers-graph">
        <GraphComponent
          type="bar"
          data={chartDataTopCustomer}
          options={chartOptionsTopCustomer}
          text={"Top Customers"}
        />
      </div>
    </div>
  );
};


export default TopCustomers;

