import React from "react";
import "./GraphComponent.css"


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

// Register required Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GraphComponent = ({ type, data, options ,text ,number ,plugins}) => {



const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
        if (chart.config.type === "doughnut") {
        const { width, height, ctx } = chart;
        const total = chart.data.datasets[0].data.reduce(
            (acc, value) => acc + value,
            0
        );

        ctx.save();
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#0561FC";
        ctx.fillText(`${total} Visitors`, width / 2, height / 2-10);
        ctx.restore();
        }
    },
    };

  // Dynamically determine the chart component to render
  const ChartComponent = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut,
  }[type] || Line; // Default to Line chart if `type` is invalid



  return (
    <div className="graph-card">
    <h4>{text}</h4>
    <h3>{number}</h3>
    <div>
    <ChartComponent data={data} options={options}  plugins={type === "doughnut" ? [centerTextPlugin] : []}/>
    </div>
    </div>
  )
};

export default GraphComponent;
