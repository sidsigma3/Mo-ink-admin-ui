import React, { useRef, useState , useEffect} from 'react';
import { Table } from 'react-bootstrap';
import ExportBtn from '../../../components/Buttons/Export/ExportBtn';
import DashboardBox from "../../../components/DashboardBox/DashboardBox";
import { BsDot } from 'react-icons/bs';
import "./InventoryDetails.css"
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate , useLocation } from 'react-router-dom';
import { getInventoryLogs , adjustInventory } from '../../../services/InventoryService';
import { FaMinus } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
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
        <ExportBtn onClick={() => exportLogsToExcel(logsByVariant)}></ExportBtn>

        </div>
      </div>


{/* Summary Boxes */}
<div className="info-ctn row w-50">
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
    <div className="d-flex justify-content-start align-items-center gap-2 my-4">
      <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.2rem' }}>{item.product}</h5>
      <BsDot size="1.8rem" color="#6c757d" /> 
      <span className="badge bg-light px-1 py-1"style={{ fontSize: '1.2rem', color: 'black', fontWeight: 500 }}>{item.raw.size}</span>
      <BsDot size="1.8rem" color="#6c757d" />
      <h5 className="mb-0 pl-2 fw-semibold" style={{ fontSize: '1.2rem' }}>{item.type}</h5>
      <BsDot size="1.8rem" color="#6c757d" />
      <span className="rounded-circle d-inline-block"style={{ width: 25, height: 25, backgroundColor: item.color.colorCode }}></span>
      <h5 className="mb-0 pl-2 fw-semibold" style={{ fontSize: '1.2rem' }}>{item.raw.color.colorName}</h5>


    </div>

    <div>
      
      <label>Add Inventory</label>
        <div className='d-flex gap-2 mt-2'>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='rounded border border-secondary-subtle p-1 w-50'
          placeholder='weight (Kg)'
        />

        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded border border-secondary-subtle p-1 w-100"
          placeholder="Comment / Source (e.g., Manual adjustment)"
        />

        <button
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
        </button>

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
    {logsByVariant.slice().reverse().map((item, idx) => (
      <div key={idx} className="stock-card">
        <div className="stock-card-row"><span className="label">Date:</span> <span>{formatDateToIST(item.createdAt)}</span></div>
        <div className="stock-card-row"><span className="label">Source:</span> <span>{item.source}</span></div>
        <div className="stock-card-row"><span className="label">Name:</span> <span>{item.name}</span></div>
        <div className="stock-card-row">
          <span className="label">Type:</span>
          <span className={`fw-semibold ${actionDisplayMap[item.action]?.color || 'text-muted'}`}>
            {actionDisplayMap[item.action]?.label || item.action}
          </span>
        </div>
        <div className="stock-card-row"><span className="label">Customer Order:</span> <span>{item.changedReservedWeight}</span></div>
        <div className="stock-card-row"><span className="label">Change in inventory:</span> <span>{item.changedAvailableWeight}</span></div>
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
