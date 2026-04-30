import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "../../../../components/Analylitcs/Graph/Graph Cards/GraphComponent";
import "./TopCustomers.css";

const TopCustomers = ({ data }) => {
  const navigate = useNavigate();

  const customers = data?.topCustomers || [];
  const labels = customers.length > 0 ? customers.map(c => c.customerName) : ["Customer A", "Customer B", "Customer C"];
  const values = customers.length > 0 ? customers.map(c => c.totalPurchase) : [5000, 4000, 3000];

  const chartDataTopCustomer = {
    labels,
    datasets: [
      {
        label: "Purchase Amount",
        data: values,
        backgroundColor: labels.map((_, index) => {
          const opacity = 0.3 + (0.7 * (labels.length - index)) / labels.length;
          return `rgba(107, 33, 168, ${opacity})`;
        }),
        borderColor: "#6B21A8",
        borderWidth: 1,
        barThickness: 25,
        borderRadius: 7,
      },
    ],
  };

  const chartOptionsTopCustomer = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const sales = context.raw;
            return `₹${sales.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, title: { display: false } },
      y: { grid: { display: false }, title: { display: false } },
    },
  };

  const tableHeaders = ["Customer", "Purchase (₹)"];
  const tableRows = labels.map((l, i) => [l, `₹${values[i].toLocaleString('en-IN')}`]);

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
