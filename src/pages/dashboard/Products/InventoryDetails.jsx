import React, { useRef, useState , useEffect} from 'react';
import { Table } from 'react-bootstrap';
import ExportBtn from '../../../components/Buttons/Export/ExportBtn';
import DashboardBox from "../../../components/DashboardBox/DashboardBox";
import {  BsDot, BsBoxSeam, BsRulers } from 'react-icons/bs';
import "./InventoryDetails.css"
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate , useLocation } from 'react-router-dom';
import { getInventoryLogs , adjustInventory } from '../../../services/InventoryService';
import { FaMinus } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import * as XLSX from 'xlsx';
import Toast from '../../../components/Toast/Toast';
import ModalInventoryChange from '../../../components/Modal/ModalInventoryChange';

const InventoryDetails = () => {
  const { state } = useLocation();
  const item = state?.item;
  const exportRef = useRef(null);
  const navigate = useNavigate()
  const [amount, setAmount] = useState(""); // Amount input
  const [source, setSource] = useState("");
  const [toasts, setToasts] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false); 
  const [pendingAction, setPendingAction] = useState(null); 

  const openConfirmationModal = (actionType) => {
    setPendingAction(actionType); 
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (pendingAction) {
      handleInventoryAdjust(pendingAction); 
    }
    setIsModalOpen(false);
    setPendingAction(null);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPendingAction(null);
  };




  console.log(item)

  const [logsByVariant, setLogsByVariant] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await getInventoryLogs(item.raw.variantId);
      setLogsByVariant(response.data);
    } catch (error) {
      console.error('Error loading inventory logs:', error);
    }
  };
  

  useEffect(() => {
    if (item?.raw?.variantId) {
      fetchLogs();
    }
  }, [item]);
  


  const handleInventoryAdjust = async (actionType) => {
     const showToast = (message, type = "error") => {
        setToasts([{ message, type }]);
        setTimeout(() => setToasts([]), 3000);
      };
    if (!amount || isNaN(amount) || amount <= 0) {
      showToast("Please enter a valid weight in kg.", "error");
      return;
    }

    if (!source.trim()) {
      showToast("Please enter a comment/source.", "error");
      return;
    }

    const payload = {
      variantId:item.raw.variantId,
      adjustWeight: Number(amount),
      remarks: source.trim(),
      actionType, // "INCREASE" or "DECREASE"
    };

    try {
      const response = await adjustInventory(payload,item.raw.variantId);
    
      showToast(`Inventory successfully ${actionType === "INCREASE" ? "added" : "reduced"}.`, "success" );
      fetchLogs();

     
      setAmount("");
      setSource("");
    } catch (error) {
      showToast("Failed to adjust inventory. See console for details.", "error");
    }
  };

  const formatDateToIST = (dateStr) => {
    const istDate = new Date(dateStr); // already in IST
    return istDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata', // no effect if date is already in IST
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const actionDisplayMap = {
    RESERVE: { label: 'Reserved', color: 'text-primary' },
    RELEASE: { label: 'Released', color: 'text-warning' },
    CONFIRM_SOLD: { label: 'Confirmed (Sold)', color: 'text-success' },
    RETURN: { label: 'Returned', color: 'text-danger' },
    INCREASE: { label: 'Increased', color: 'text-success' },
    DECREASE: { label: 'Decreased', color: 'text-danger' },
    CREATE: { label: 'Created', color: 'text-info' },
    UPDATE: { label: 'Updated', color: 'text-secondary' },
    VENDOR_RESTOCK: { label: 'Vendor Restock', color: 'text-success' },
    VENDOR_RETURN_STOCK: { label: 'Vendor Returned', color: 'text-warning' },
    ADJUSTMENT: { label: 'Adjusted', color: 'text-dark' },
  };

  const calculateLogStats = (logs) => {
    if (!logs || logs.length === 0) return {
      stockRemaining: 0,
      totalCredit: 0,
      totalDebit: 0,
    };
  
    // Latest stockRemaining from last log’s finalAvailableWeight
    const latestLog = logs[logs.length - 1];
    const stockRemaining = latestLog.finalAvailableWeight || 0;
    const totalOrders = latestLog.finalReservedWeight || 0
    // Total credit - sum of positive changedAvailableWeight on CREATE/UPDATE actions
    const totalCredit = logs.reduce((sum, log) => {
      if (
        (log.action === "CREATE" || log.action === "UPDATE") &&
        log.changedAvailableWeight > 0
      ) {
        return sum + log.changedAvailableWeight;
      }
      return sum;
    }, 0);
  
    // Total debit - sum of changedReservedWeight (assuming debit means reserved weight changes)
    const totalDebit = logs.reduce((sum, log) => sum + (log.changedReservedWeight || 0), 0);
  
    return { stockRemaining,totalOrders ,totalCredit, totalDebit };
  };

  
  const { stockRemaining, totalOrders,totalCredit, totalDebit } = calculateLogStats(logsByVariant);



  const exportLogsToExcel = (visibleLogs, fileName = 'inventory_logs.xlsx') => {
    const exportData = visibleLogs.map(log => ({
      Date: formatDateToIST(log.createdAt),
      Source: log.source || '-',
      Name: log.name || '-',
      Type: actionDisplayMap[log.action]?.label || log.action,
      Quantity: log.changedAvailableWeight,
      'Total Stock': log.finalAvailableWeight
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Logs');
    XLSX.writeFile(workbook, fileName);
  };
  

  return (
    <div className='inventory-wrapper bg p-0'>
      {/* Page Title */}
      <div className='d-flex justify-content-between align-items-center mt-2 mb-4'>
      <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
      <span onClick={() => navigate("/inventory")}>
          <IoArrowBackOutline size={25} />
        </span>
        <h3 className='page-title m-0' style={{fontSize:'1.2rem'}}>Inventory Details</h3>
        </div>
        <div className='d-flex gap-2'>
        <ExportBtn onClick={() => exportLogsToExcel(logsByVariant)}></ExportBtn>

        </div>
      </div>


{/* Summary Boxes */}
<div className="info-cttn row">
    <div className="dashboardBox-ctn col-6 col-md-6 col-lg-4 col-xl">
      <DashboardBox heading="Total Customer Order" number={`${totalOrders} Kgs`} />
    </div>
    <div className="dashboardBox-ctn col-6 col-md-6 col-lg-4 col-xl">
      <DashboardBox heading="Total Available Weight" number={`${stockRemaining} Kgs`} />
    </div>
    {/* <div className="dashboardBox-ctn col-6 col-md-6 col-lg-4 col-xl">
      <DashboardBox heading="Total Credit" number={`${totalCredit} Kgs`} />
    </div>
    <div className="dashboardBox-ctn col-12 col-md-12 col-lg-4 col-xl">
      <DashboardBox heading="Total Debit" number={`${totalDebit} Kgs`} />
    </div> */}
  </div>


       {/* Header Info */}
   <div className="header d-flex flex-wrap align-items-center gap-2 my-4">
          <div className="d-flex align-items-center flex-wrap gap-2">
            {/* Product Name */}
            <h5 className="mb-0 fw-semibold text-truncate" style={{ fontSize: 'clamp(1rem, 1rem, 1.5rem)' }}>
              {item.product}
            </h5>
            
            <BsDot size="1.8rem" color="#6c757d" />
            
            {/* Size */}
            <h5 className="mb-0 fw-semibold text-truncate" style={{ fontSize: 'clamp(1rem, 1rem, 1.5rem)' }}>
            {item.raw.size}
            </h5>
            
            <BsDot size="1.8rem" color="#6c757d" />
            
            {/* Product Type */}
            <h5 className="mb-0 fw-semibold text-truncate" style={{ fontSize: 'clamp(1rem, 1rem, 1.5rem)' }}>
              {item.type}
            </h5>
            
            <BsDot size="1.8rem" color="#6c757d" />
            
            {/* Color Name */}
            <h5 className="mb-0 fw-semibold" style={{ fontSize: 'clamp(1rem, 1rem, 1.5rem)' }}>
              {item.raw.color.colorName}
            </h5>
          </div>
        </div>
    <div>
      
      <label>Add Inventory</label>
        <div className='d-flex gap-2 mt-2'>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='rounded border border-secondary-subtle p-1 w-50'
          placeholder='Weight (Kg)'
        />

        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded border border-secondary-subtle p-1 w-100"
          placeholder="Add remarks"
        />

        {/* <button
          className='btn btn-primary d-flex align-items-center'
          style={{ height: '1.8rem', padding: '0.28rem 1.2rem' }}
          onClick={() => openConfirmationModal("INCREASE")}
        >
          <MdAdd size={19} />
        </button>

        <button
          className='btn btn-danger d-flex align-items-center'
          style={{ height: '1.8rem', padding: '0.55rem 1.2rem' }}
          onClick={() => openConfirmationModal("DECREASE")} // ✅
        >
          <FaMinus size={12} />
        </button> */}

         <div className='d-flex gap-2'>
          <button
                    className="btn d-flex p-0 align-items-center justify-content-center"
                    style={{
                      width: '2.2rem',
                      height: '2.2rem',
                      backgroundColor: '#6b21a818',
                      border: '1px solid #6B21A8',
                      color: '#6B21A8',
                      borderRadius: '0.4rem',
                    }}
                    onClick={openConfirmationModal}
                  >
                    <IoAddOutline size={24} />
                  </button>

                  {/* - Subtract Button */}
                  <button
                    className="btn d-flex p-0 align-items-center justify-content-center"
                    style={{
                      width: '2.2rem',
                      height: '2.2rem',
                      backgroundColor: '#FBEAEC',
                      border: '1px solid #dc3545',
                      color: '#dc3545',
                      borderRadius: '0.4rem',
                    }}
                    onClick={openConfirmationModal}
                  >
                    <FaMinus size={12} />
                  </button>
                  </div>


              {/* ✅ Modal component */}
            <ModalInventoryChange
              isOpen={isModalOpen}
              onConfirm={handleModalConfirm}
              onCancel={handleModalCancel}
            />
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
          <th className="py-3">Customer Order</th>
          <th className="py-3">Change in inventory</th>
        </tr>
      </thead>
      <tbody>
        {logsByVariant.slice().reverse().map((item, idx) => (
          <tr key={idx}>
            <td className="text-start py-3 px-4 fw-medium">{formatDateToIST(item.createdAt)}</td>
            <td>{item.source}</td>
            <td>{item.name}</td>
            <td className={`fw-semibold ${actionDisplayMap[item.action]?.color || 'text-muted'}`}>
              {actionDisplayMap[item.action]?.label || item.action}
            </td>
            <td>{item.changedReservedWeight}</td>
            <td>{item.changedAvailableWeight}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>



 
{/* Card View (Visible on smaller screens) */}
<div className="card-view">
  {logsByVariant.slice().reverse().map((item, idx) => {
    const actionConfig = actionDisplayMap[item.action] || { 
      label: item.action, 
      color: 'text-muted', 
      bg: 'bg-grey', 
    };
    
    return (
      <div key={idx} className="card border-1 overflow-hidden">
        <div className="card-body ">
          {/* Header section */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <h5 className="card-title mb-1">
                {item.name}
              </h5>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted d-flex align-items-center gap-1">
                  <span className="badge bg-gray rounded-pill" style={{width: '6px', height: '6px'}}></span>
                  {item.source}
                </small>
                <small className="text-muted">•</small>
                <small className="text-muted">{formatDateToIST(item.createdAt)}</small>
              </div>
            </div>
            
            {/* Action badge */}
            <span className={`badge ${actionConfig.bg} ${actionConfig.color} rounded-pill bg-gray px-3 py-2 d-flex align-items-center gap-2`}>
              <span>{actionConfig.icon}</span>
              {actionConfig.label}
            </span>
          </div>
          
          {/* Metrics section */}
          <div className="row g-3">
            <div className="col-6">
              <div className="bg-light rounded-3 p-2 border">
                <div className="text-uppercase text-muted fw-medium mb-1" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>
                  Customer Order
                </div>
                <div className="fw-medium text-dark h5 mb-0 d-flex align-items-center gap-2">
                  {item.changedReservedWeight}
                  <span className={`badge rounded-pill ${
                    item.changedReservedWeight && item.changedReservedWeight.toString().includes('+') ? 'bg-success' :
                    item.changedReservedWeight && item.changedReservedWeight.toString().includes('-') ? 'bg-danger' : 'bg-secondary'
                  }`} style={{width: '8px', height: '8px'}}></span>
                </div>
              </div>
            </div>
            
            <div className="col-6">
              <div className="bg-light rounded-3 p-2 border">
                <div className="text-uppercase text-muted fw-medium mb-1" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>
                Inventory change
                </div>
                <div className="fw-medium text-dark h5 mb-0 d-flex align-items-center gap-2">
                  {item.changedAvailableWeight}
                  <span className={`badge rounded-pill ${
                    item.changedAvailableWeight && item.changedAvailableWeight.toString().includes('+') ? 'bg-success' :
                    item.changedAvailableWeight && item.changedAvailableWeight.toString().includes('-') ? 'bg-danger' : 'bg-secondary'
                  }`} style={{width: '8px', height: '8px'}}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle bottom border for depth */}
        <div className="border-top border-light opacity-50 mx-3"></div>
      </div>
    );
  })}
</div>
</div>

      {/* Pagination */}
      <div className='d-flex justify-content-between align-items-center mt-4 flex-wrap px-1'>
        <small className='text-muted'>Showing 1 to 10 of 10 results</small>
        <ul className='pagination pagination-sm mb-0'>
          <li className='page-item active'><span className='page-link'>1</span></li>
        </ul>
      </div>
        {/* Toast Notification */}
     <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() =>
                            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                        }
                    />
                ))}
            </div>
    </div>
  );
};

export default InventoryDetails;
