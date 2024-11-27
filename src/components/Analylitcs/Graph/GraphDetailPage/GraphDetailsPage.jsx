import React from "react";
import { useLocation ,useNavigate } from "react-router-dom";
import GraphComponent from "../Graph Cards/GraphComponent";
import DataTable from "./DataTable";
import { IoArrowBackOutline } from "react-icons/io5";
import Filter from "../../../Filter/DayFilter/Filter";
import ExportBtn from "../../../Buttons/Export/ExportBtn";
const GraphDetailsPage = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { type, data, options, tableHeaders, tableRows,text } = location.state || {};


  return (
    <div className="container mt-4">
       <div className='top d-flex gap-3 justify-content-between' style={{cursor:"pointer"}}>
            <div className="d-flex gap-2">
            <span onClick={() => navigate('/analytics')}><IoArrowBackOutline size={25}/></span>
            <h5>{text}</h5>
            </div>
            <div className="d-flex gap-2">
            <Filter></Filter>
            <ExportBtn></ExportBtn>
            </div>
        </div>
      <div className="mb-5 mt-2">
        <GraphComponent type={type} data={data} options={options} />
      </div>

    
      <DataTable headers={tableHeaders} rows={tableRows} />
    </div>
  );
};

export default GraphDetailsPage;
