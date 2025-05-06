import React, { useRef, useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import DashboardBox from "../../../components/DashboardBox/DashboardBox";
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import './Inventory.css';
import { getAllProduct } from '../../../services/ProductService'

const Inventory = () => {

  const exportRef = useRef(null);

 const [product,setProduct] = useState([])
   const [filteredData, setFilteredData] = useState([]); 
 
    useEffect(() => {
           fetchProductdData();
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
           setFilteredData(product);
           return;
         }
       
         const filtered = product.filter((item) => {
           if (filter === "Product Name") return item.productName.toLowerCase().includes(lowercasedValue);
           return true;
         });
       
         console.log(filtered);
         setFilteredData(filtered);
       };
 
 
       const handleStatusChange = (status) => {
         if (status === "All") {
             setFilteredData(product); // Show all products
         } else {
             const filtered = product.filter(item => item.availableStatus === status);
             setFilteredData(filtered);
         }
     };


  const inventoryData = [
    { product: 'Cotton Yarn', counter: '2/80', type: 'Cone', color: 'yellow' },
    { product: 'Polyester Yarn', counter: '2/80', type: 'Hank', color: 'red' },
    { product: 'Polyester Yarn', counter: '2/80', type: 'cone', color: 'blue' },
    { product: 'Polyester Yarn', counter: '2/80', type: 'Cone', color: 'black' },
    { product: 'Polyester Yarn', counter: '2/80', type: 'Hank', color: 'green' },
    { product: 'Silk Yarn', counter: '2/80', type: 'Hank', color: 'orange' },
    { product: 'Silk Yarn', counter: '2/80', type: 'Hank', color: 'pink' },
    { product: 'Silk Yarn', counter: '2/80', type: 'Cone', color: 'teal' },
    { product: 'Silk Yarn', counter: '2/80', type: 'Hank', color: 'grey' },
    { product: 'Silk Yarn', counter: '2/80', type: 'Hank', color: 'violet' },
  ];

  const renderColorDot = (color) => (
    <div className="color-dot" style={{
      backgroundColor: color,
      width: '25px',
      height: '25px',
      borderRadius: '50%',
      display: 'inline-block'
    }}></div>
  );

  return (
    <div className='inventory-wrapper p-1'>
      {/* Page Title */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h4 className='page-title mb-0'>Inventory</h4>
        <div className='d-flex gap-2'>
        <ExportBtn onClick={() => exportRef.current.exportToExcel()}></ExportBtn>

          {/* <button className='btn btn-primary d-flex align-items-center gap-2 px-3 add-product-btn'>
            + Add Product
          </button> */}
        </div>
      </div>

      {/* Summary Boxes */}
      <div className="info-ctn row">
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'Total SKU'} number={256} />
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'From Manufacturer'} number={'105 Kgs'} />
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'Total Customer Order'} number={'165 Kgs'} />
        </div>
        <div className="dashboardBox-ctn col-6 col-md-6 col-lg-6 col-xl">
          <DashboardBox heading={'Stock Remaining'} number={'206 Kgs'} />
        </div>
      </div>

      <div className='filter-sec d-flex gap-2 align-items-center mt-2'>
      
      <div className='w-75'>
          <ProductFilter 
              filterOptions={["Product Name"]} 
              onFilterChange={(filter, value) => handleFilterChange(filter, value)} 
          />
      </div>
      
      <div className='w-25'>
      <StatusFilter status="All" onStatusChange={handleStatusChange} />
      </div>
  </div>

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
          <th className="py-3">From Vendor</th>
          <th className="py-3">Customer Order</th>
          <th className="py-3">Remaining Weight</th>
        </tr>
      </thead>
      <tbody>
        {inventoryData.map((item, index) => (
          <tr key={index}>
            <td className="fw-medium text-start pl-3">{item.product}</td>
            <td>{item.counter}</td>
            <td>{item.type}</td>
            <td>{renderColorDot(item.color)}</td>
            <td>150 Kgs</td>
            <td>150 Kgs</td>
            <td>150 Kgs</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>

  {/* Card View (Visible on smaller screens) */}
  <div className="card-view">
    {inventoryData.map((item, index) => (
      <div key={index} className="inventory-card">
        <h5 className=""style={{ fontSize: '1.2rem', color: 'black', fontWeight: 500 }}>{item.product}</h5>
        <div className="inventory-card-row">
          <span className="label">Counter:</span> <span>{item.counter}</span>
        </div>
        <div className="inventory-card-row ">
           <span className="label">Color:</span>
         <div className="color-dot">{renderColorDot(item.color)}</div>
         </div>
        <div className="inventory-card-row">
          <span className="label">From Vendor:</span> <span>150 Kgs</span>
        </div>
        <div className="inventory-card-row">
          <span className="label">Customer Order:</span> <span>150 Kgs</span>
        </div>
        <div className="inventory-card-row">
          <span className="label">Remaining Weight:</span> <span>150 Kgs</span>
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
