import React, { useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import ExportBtn from '../../../components/Buttons/Export/ExportBtn';
import DashboardBox from "../../../components/DashboardBox/DashboardBox";
import { BsDot } from 'react-icons/bs';
import "./InventoryDetails.css"

const InventoryDetails = () => {
  const exportRef = useRef(null);



  const [filteredData] = useState([
    { date: 'April 01, 2025', source: 'Manufacturer', Name: 'Heritage Corp', type: 'Credit', qty: '151 Kgs', total: '251 Kgs' },
    { date: 'March 25, 2025', source: 'Customer Order', Name: 'Nova Textiles', type: 'Debit', qty: '20 Kgs', total: '50 Kgs' },
    { date: 'March 25, 2025', source: 'Manufacturer', Name: 'FiberMax Ltd.', type: 'Credit', qty: '10 Kgs', total: '70 Kgs' },
    { date: 'March 25, 2025', source: 'Manufacturer', Name: 'CottonLeaf Mills', type: 'Credit', qty: '45 Kgs', total: '66 Kgs' },
    { date: 'March 25, 2025', source: 'Customer Order', Name: 'Urban Weaves', type: 'Debit', qty: '05 Kgs', total: '21 Kgs' },
    { date: 'March 25, 2025', source: 'Customer Order', Name: 'BlueThread Apparel', type: 'Debit', qty: '12 Kgs', total: '26 Kgs' },
    { date: 'March 25, 2025', source: 'Customer Order', Name: 'Spindle & Co.', type: 'Debit', qty: '14 Kgs', total: '38 Kgs' },
    { date: 'March 25, 2025', source: 'Customer Order', Name: 'Texon Garments', type: 'Debit', qty: '10 Kgs', total: '52 Kgs' },
    { date: 'March 25, 2025', source: 'Customer Order', Name: 'PureStitch Pvt. Ltd.', type: 'Debit', qty: '13 Kgs', total: '62 Kgs' },
    { date: 'March 01, 2025', source: 'Opening Stock', Name: 'Initial Balance', type: 'Credit', qty: '75 Kgs', total: '75 Kgs' },
  ]);
  

  return (
    <div className='inventory-wrapper bg p-1'>
      {/* Page Title */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h4 className='page-title mb-0'>Inventory Details</h4>
        <div className='d-flex gap-2'>
        <ExportBtn onClick={() => exportRef.current.exportToExcel()}></ExportBtn>

        </div>
      </div>

{/* Summary Boxes */}
<div className="info-ctn row">
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-4 col-xl">
           <DashboardBox heading="Stock Remaining" number="256 Kgs" />
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-4 col-xl">
           <DashboardBox heading="Total Credit" number="105 Kgs" />
        </div>
        <div className="dashboardBox-ctn col-12 col-md-12 col-lg-4 col-xl">
           <DashboardBox heading={'Total Debit'} number={'165 Kgs'}/>
        </div>
      </div>


       {/* Header Info */}
<div className="d-flex justify-content-start align-items-center gap-2 my-4">
  <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.2rem' }}>Cotton Yarn</h5>
  <BsDot size="1.8rem" color="#6c757d" /> 
  <span className="badge bg-light px-1 py-1"style={{ fontSize: '1.2rem', color: 'black', fontWeight: 500 }}>2/80</span>
  <BsDot size="1.8rem" color="#6c757d" />
  <span className="rounded-circle d-inline-block"style={{ width: 25, height: 25, backgroundColor: '#ffc107' }}></span>
  <h5 className="mb-0 pl-2 fw-semibold" style={{ fontSize: '1.2rem' }}>Yellow</h5>
</div>

<div className="stock-container">
  {/* Table View (Visible on large screens) */}
  <div className="table-wrapper">
    <Table hover className="text-center align-middle mb-0 inventory-table">
      <thead className="table-light">
        <tr>
          <th className="text-start py-3 px-4">Date</th>
          <th className="py-3">Source</th>
          <th className="py-3">Name</th>
          <th className="py-3">Type</th>
          <th className="py-3">Quantity</th>
          <th className="py-3">Total Stock</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item, idx) => (
          <tr key={idx}>
            <td className="text-start py-3 px-4 fw-medium">{item.date}</td>
            <td>{item.source}</td>
            <td>{item.Name}</td>
            <td className={item.type === 'Credit' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
              {item.type}
            </td>
            <td>{item.qty}</td>
            <td>{item.total}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>

  {/* Card View (Visible on smaller screens) */}
  <div className="card-view">
    {filteredData.map((item, idx) => (
      <div key={idx} className="stock-card">
        <div className="stock-card-row"><span className="label">Date:</span> <span>{item.date}</span></div>
        <div className="stock-card-row"><span className="label">Source:</span> <span>{item.source}</span></div>
        <div className="stock-card-row"><span className="label">Name:</span> <span>{item.Name}</span></div>
        <div className="stock-card-row">
          <span className="label">Type:</span>
          <span className={item.type === 'Credit' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
            {item.type}
          </span>
        </div>
        <div className="stock-card-row"><span className="label">Quantity:</span> <span>{item.qty}</span></div>
        <div className="stock-card-row"><span className="label">Total Stock:</span> <span>{item.total}</span></div>
      </div>
    ))}
  </div>
</div>

      {/* Pagination */}
      <div className='d-flex justify-content-between align-items-center mt-4 flex-wrap px-1'>
        <small className='text-muted'>Showing 1 to 10 of 10 results</small>
        <ul className='pagination pagination-sm mb-0'>
          <li className='page-item active'><span className='page-link'>1</span></li>
        </ul>
      </div>
    </div>
  );
};

export default InventoryDetails;
