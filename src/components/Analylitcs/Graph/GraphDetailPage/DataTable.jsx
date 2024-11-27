import React from "react";
import { Table } from "react-bootstrap";
import "./DataTable.css"

const DataTable = ({ headers, rows }) => {
  return (
    <div className="data-table-ctn">
    <Table bordered hover className="data-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
};

export default DataTable;
