import React, { useRef, useState , useEffect} from 'react';
import { Table } from 'react-bootstrap';
import ExportBtn from '../../../components/Buttons/Export/ExportBtn';
import DashboardBox from "../../../components/DashboardBox/DashboardBox";
import { BsDot } from 'react-icons/bs';
import "./InventoryDetails.css"
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate , useLocation } from 'react-router-dom';
import { getInventoryLogs } from '../../../services/InventoryService';
import { FaMinus } from "react-icons/fa";
import { MdAdd } from "react-icons/md";


const InventoryDetails = () => {
  const { state } = useLocation();
  const item = state?.item;
  const exportRef = useRef(null);
  const navigate = useNavigate()
  const [amount, setAmount] = useState(""); // Amount input
  const [source, setSource] = useState("");



  console.log(item)

  const [logsByVariant, setLogsByVariant] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getInventoryLogs(item.raw.variantId);
        setLogsByVariant(response.data); // wrap in array to keep rendering logic same
      } catch (error) {
        console.error('Error loading inventory logs:', error);
      }
    };
  
    if (item?.raw?.variantId) {
      fetchLogs();
    }
  }, [item]);
  

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
  

  const formatDateToIST = (dateStr) => {
    // Force it to be treated as UTC
    const utcDate = new Date(dateStr + 'Z');
  
    return utcDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className='inventory-wrapper bg p-1'>
      {/* Page Title */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
      <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
      <span onClick={() => navigate("/inventory")}>
          <IoArrowBackOutline size={25} />
        </span>
        <h4 className='page-title mb-0'>Inventory Details</h4>
        </div>
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
      <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.2rem' }}>{item.product}</h5>
      <BsDot size="1.8rem" color="#6c757d" /> 
      <span className="badge bg-light px-1 py-1"style={{ fontSize: '1.2rem', color: 'black', fontWeight: 500 }}>{item.raw.size}</span>
      <BsDot size="1.8rem" color="#6c757d" />
      <h5 className="mb-0 pl-2 fw-semibold" style={{ fontSize: '1.2rem' }}>{item.type}</h5>
      <BsDot size="1.8rem" color="#6c757d" />
      <span className="rounded-circle d-inline-block"style={{ width: 25, height: 25, backgroundColor: item.color.hexCode }}></span>
      <h5 className="mb-0 pl-2 fw-semibold" style={{ fontSize: '1.2rem' }}>{item.raw.color.colorName}</h5>


    </div>

    <div>
    <div>
                    <label>Add Inventory</label>
                    <div className='d-flex gap-2 mt-2'>
                    <input value={amount} onChange={(e) => setAmount(e.target.value)} className='rounded border border-secondary-subtle p-1 w-50' placeholder='weight(Kg)'></input>
                    {/* <AddBtn clickFunction={handleAddMoney}></AddBtn> */}
                    <input
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="rounded border border-secondary-subtle p-1 w-100"
                        placeholder="Comment / Source (e.g., Manual adjustment)"
                      />


                    <button className='btn btn-primary d-flex align-items-cneter' style={{height:'1.8rem',padding:'0.28rem 1.2rem'}}>
                    <MdAdd size={19}/>
                    </button>
                    
                    <button className='btn btn-danger d-flex align-items-cneter' style={{height:'1.8rem',padding:'0.55rem 1.2rem'}}>
                    <FaMinus size={12}/>
                    </button>
                    </div>
                </div>
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
        {logsByVariant.map((item, idx) => (
          <tr key={idx}>
            <td className="text-start py-3 px-4 fw-medium">{formatDateToIST(item.createdAt)}</td>
            <td>{item.source}</td>
            <td>{item.name}</td>
            <td className={item.type === 'Credit' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
              {item.action}
            </td>
            <td>{item.changedAvailableWeight}</td>
            <td>{item.finalReservedWeight}</td>
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
