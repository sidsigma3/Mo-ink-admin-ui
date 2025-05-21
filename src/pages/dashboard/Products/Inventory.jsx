import React, { useRef, useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import DashboardBox from "../../../components/DashboardBox/DashboardBox";
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import './Inventory.css';
import { getAllProduct } from '../../../services/ProductService'
import {getAllInventory} from '../../../services/InventoryService'
import * as XLSX from 'xlsx';


const Inventory = () => {

  const exportRef = useRef(null);

  const [product,setProduct] = useState([])
  const [filteredData, setFilteredData] = useState([]); 
  const [dashboardStats, setDashboardStats] = React.useState({
    totalSKU: 0,
    fromManufacturer: 0,
    totalCustomerOrder: 0,
    stockRemaining: 0,
  });

  const [allInventory, setAllInventory] = useState([]);
  const [inventory, setInventory] = useState([]);



    useEffect(() => {
           fetchProductdData();
     }, []);
 

     const navigate = useNavigate();

  const handleRowClick = (item) => {
    navigate('/inventorydetails', { state: { item } });
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await getAllInventory();
        const flatData = [];

        response?.data?.product?.forEach((product) => {
          product.variant.forEach((variant) => {
            flatData.push({
              product: product.productName,
              counter: variant.size,
              type: variant.variantType,
              color: variant.color,
              customerOrder: variant.reserveWeight,
              remainingWeight: variant.availableWeight,
              raw: variant,
            });
          });
        });
        
        setAllInventory(flatData);  
        setInventory(flatData);
  
        // Calculate dashboard numbers
        const totalSKU = flatData.length; // each variant is a SKU
  
        const fromManufacturer = flatData.reduce(
          (acc, item) => acc + (item.remainingWeight || 0),
          0
        );
  
        const totalCustomerOrder = flatData.reduce(
          (acc, item) => acc + (item.customerOrder || 0),
          0
        );
  
        const stockRemaining = fromManufacturer - totalCustomerOrder;
  
        setDashboardStats({
          totalSKU,
          fromManufacturer,
          totalCustomerOrder,
          stockRemaining,
        });
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    };
  
    fetchInventory();
  }, []);
  

 
     const fetchProductdData = async () => {
         try {
             const data = await getAllProduct();
             setProduct(data.data);
             setFilteredData(data.data); // Default filter
         } catch (error) {
             console.error("Error fetching dashboard data:", error);
         }
     };
 
 
     const handleFilterChange = (filter, value) => {
      const lowercasedValue = value.toLowerCase().trim();
    
      if (!lowercasedValue) {
        setInventory(allInventory);
        return;
      }
    
      const filtered = allInventory.filter((item) => {
        if (filter === "Product Name") {
          return item.product.toLowerCase().includes(lowercasedValue);
        }
        return true;
      });
    
      setInventory(filtered);
    };
    
 
 
       const handleStatusChange = (status) => {
         if (status === "All") {
             setFilteredData(product); // Show all products
         } else {
             const filtered = product.filter(item => item.availableStatus === status);
             setFilteredData(filtered);
         }
     };

  const renderColorDot = (color) => (
    <div
      title={color?.colorName}
      style={{
        backgroundColor: color?.hexCode,
        width: 20,
        height: 20,
        borderRadius: '50%',
        display: 'inline-block',
        border: '1px solid #999',
      }}
    />
  );
  
 
    const exportToExcel = (data) => {
      const exportData = data.map(item => ({
        Product: item.product,
        Counter: item.counter,
        Type: item.type,
        Color: item.color.colorName || item.color.colorName || '',
        'Customer Order (Kgs)': item.customerOrder,
        'Remaining Weight (Kgs)': item.remainingWeight,
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
      XLSX.writeFile(workbook, 'inventory.xlsx');
    };
  

  return (
    <div className='inventory-wrapper p-1'>
      {/* Page Title */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h4 className='page-title mb-0'>Inventory</h4>
        <div className='d-flex gap-2'>
        <ExportBtn onClick={() => exportToExcel(inventory)}></ExportBtn>

          {/* <button className='btn btn-primary d-flex align-items-center gap-2 px-3 add-product-btn'>
            + Add Product
          </button> */}
        </div>
      </div>

      {/* Summary Boxes */}
    <div className="info-ctn row">
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'Total SKU'} number={dashboardStats.totalSKU} />
        </div>
        {/* <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'From Manufacturer'} number={`${dashboardStats.fromManufacturer} Kgs`} />
        </div> */}
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'Total Customer Order'} number={`${dashboardStats.totalCustomerOrder} Kgs`} />
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'Stock Remaining'} number={`${dashboardStats.stockRemaining} Kgs`} />
        </div>
  </div>

  {/* <div>
  <div className='dashboardBox shadow-sm'>
        <div className='title d-flex justify-content-between'>
            <h4></h4>
           
        </div>

        <div className='mt-2'>
            <h3>{props.number}</h3>
        </div>
    </div>
  </div> */}

      {/* <div className='filter-sec d-flex gap-2 align-items-center mt-2'>
      
      <div className='w-75'>
          <ProductFilter 
              filterOptions={["Product Name"]} 
              onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
          />
      </div> */}
      
      {/* <div className='w-25'>
      <StatusFilter status="All" onStatusChange={handleStatusChange} />
      </div> */}
  {/* </div> */}

  <div className="inventory-container">
  {/* Table View (Visible on large screens) */}
  <div className="table-wrapper">
    <Table hover className="text-center align-middle mb-0 inventory-table">
      <thead className="table-light">
        <tr>
          <th className="text-start py-3">Product</th>
          <th className="py-3">Counter</th>
          <th className="py-3">Type</th>
          <th className="py-3">Color</th>
          {/* <th className="py-3">From Vendor</th> */}
          <th className="py-3">Customer Order</th>
          <th className="py-3">Available Weight</th>
        </tr>
      </thead>
      <tbody>
      {inventory.map((item, index) => (
        <tr 
          key={index} 
          onClick={()=>handleRowClick(item)} 
          style={{ cursor: 'pointer' }}
        >
          <td className="fw-medium text-start pl-3">{item.product}</td>
          <td>{item.counter}</td>
          <td>{item.type}</td>
          <td>{renderColorDot(item.color)}</td>
          {/* <td>150 Kgs</td> */}
          <td>{item.customerOrder} Kgs</td>
          <td>{item.remainingWeight} Kgs</td>
        </tr>
      ))}
    </tbody>
    </Table>
  </div>
 

  {/* Card View (Visible on smaller screens) */}
  <div className="card-view">
    {inventory.map((item, index) => (
      <div key={index} className="inventory-card">
        <h5 className=""style={{ fontSize: '1.2rem', color: 'black', fontWeight: 500 }}>{item.product}</h5>
        <div className="inventory-card-row">
          <span className="label">Counter:</span> <span>{item.counter}</span>
        </div>
        <div className="inventory-card-row ">
           <span className="label">Color:</span>
         <div className="color-dot">{renderColorDot(item.color)}</div>
         </div>
        {/* <div className="inventory-card-row">
          <span className="label">From Vendor:</span> <span>150 Kgs</span>
        </div> */}
        <div className="inventory-card-row">
          <span className="label">Customer Order:</span> <span>{item.customerOrder} Kgs</span>
        </div>
        <div className="inventory-card-row">
          <span className="label">Remaining Weight:</span> <span>{item.remainingWeight} Kgs</span>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* Pagination */}
      <div className='d-flex justify-content-between align-items-center mt-4 px-2 flex-wrap'>
        <small className='pagination-info text-muted'>Showing 1 to 10 of 10 results</small>
        <nav>
          <ul className='pagination pagination-sm mb-0'>
            <li className='page-item active'><span className='page-link'>1</span></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Inventory;
