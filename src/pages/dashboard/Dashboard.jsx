import React from "react";
import { LuCalendarSearch } from "react-icons/lu";
import "./Dashboard.css";
import DashboardBox from "../../components/DashboardBox/DashboardBox";
import ProductSoldGraph from "../../components/Analylitcs/Graph/ProductSoldGraph";
import Filter from "../../components/Filter/DayFilter/Filter";

const Dashboard = () => {
  return (
    <div className="right-content w-100">
                    <div className="top d-flex justify-content-between w-100 mb-2">
                        <h3>Dashboard</h3>

                        {/* <div className="filter-ctn d-flex">
                        <button>
                            <span>
                            <LuCalendarSearch size={20} />
                            </span>
                            Last 12 Months
                        </button>
                        </div> */}
                        <Filter></Filter>
                    </div>

                    <div className="info-ctn row">
                        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
                        <DashboardBox  heading={'Total Visits'} number={2568}/>
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
                        <DashboardBox heading={'Total Customers'} number={236}/>
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-4 col-lg">
                        <DashboardBox heading={'Total Purchase Order'} number={359}/>
                        </div>
                        <div className="dashboardBox-ctn col-6 col-md-4 col-lg">
                        <DashboardBox heading={'Total Revenue'} number={'52.6 Lacs'}/>
                        </div>
                        <div className="dashboardBox-ctn col-12 col-md-4 col-lg">
                        <DashboardBox heading={'Total Weight Sold'} number={'2250 Kgs'}/>
                        </div>
                    </div>

      <div className="bg-white graph-ctn">
       <ProductSoldGraph></ProductSoldGraph>
      </div>


      <div className="current-status-ctn row">
        <h3>Current Status</h3>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
          <DashboardBox  heading={'New Orders TO Fulfill'} number={8}/>
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
          <DashboardBox heading={'Orders at Manufacturer'} number={48}/>
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
          <DashboardBox heading={'Orders Received from Manufacturer'} number={10}/>
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg">
          <DashboardBox heading={'Orders Pending for Dispatch'} number={5}/>
        </div>
      </div>

      <div className="current-status-ctn row">
       
        <div className="dashboardBox-ctn col-6 col-md-4 col-lg">
          <DashboardBox  heading={'Payment Receivable'} number={'2.056 Lacs'}/>
        </div>
        <div className="dashboardBox-ctn col-6 col-md-4 col-lg">
          <DashboardBox heading={'New Order Received'} number={'48Kgs'}/>
        </div>
        <div className="dashboardBox-ctn col-12 col-md-4 col-lg">
          <DashboardBox heading={'Total Inventory Left'} number={'200 Kgs'}/>
        </div>
       
      </div>
    </div>
  );
};

export default Dashboard;
