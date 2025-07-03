import React ,{useContext, useEffect , useState } from 'react';
import './ProductsTable.css';
import { LuDot } from "react-icons/lu";
import { ProductContext } from "./../../../Context/ProductContext";
import { useNavigate } from "react-router-dom";
import { Table } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import { getAllProduct } from '../../../../services/ProductService';
import { forwardRef, useImperativeHandle } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Toast from '../../../Toast/Toast';



const ProductsTable = forwardRef(({data},ref) => {

  const navigate = useNavigate();
const [toasts, setToasts] = useState([]);

  const [productData,setProductData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProduct();
        setProductData(data.data)
      
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchData(); 
  }, []); 
  


  const handleRowClick = (index,ix) => {
    navigate('/add-product', { state: { index,ix,finalData } });
  };

  

  let active = 2;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
  }

  
  const aggregateProductData = (productData) => {
    return productData.map((product) => {
      const groupedVariants = product.variants.reduce((acc, variant) => {
        const { size, color, availableWeight, id, pricePerKg, markupPricePerKg, variantType , availableStatus , variantDescription } = variant;
  
        if (!acc[size]) {
          acc[size] = {
            id,
            size,
            variants: [],
            totalWeight: 0,
          };
        }
  
        const hex = color.colorCode?.toLowerCase() || "#ccc";
        const colorKey = `${color.colorName}-${hex}`;
  
        let colorGroup = acc[size].variants.find((v) => `${v.colorName}-${v.hexCode?.toLowerCase()}` === colorKey);
  
        if (!colorGroup) {
          colorGroup = {
            colorName: color.colorName,
            hexCode: hex,
            variants: [],
          };
          acc[size].variants.push(colorGroup);
        }
  
        colorGroup.variants.push({
          variantType: variantType?.toLowerCase() || "unknown",
          available: availableWeight,
          price: pricePerKg,
          id,
          markupPricePerKg,
          availableStatus,
          variantDescription,
        });
  
        acc[size].totalWeight += Number(availableWeight);
  
        return acc;
      }, {});
  
      return {
        productId: product.id,
        productName: product.productName,
        productDescription: product.productDescription,
        productImage: product.productImage,
        compareAtPrice: product.productPrice?.compareAtPrice,
        costPerItemPerKg: product.productPrice?.costPerItemPerKg,
        gstOnProduct: product.gstOnProduct,
        pricePerKg: product.productPrice?.pricePerKg,
        availableStatus: product.availableStatus,
        groupedVariants: Object.values(groupedVariants),
      };
    });
  };
  

  const finalData = aggregateProductData(data)

const flattenedData = finalData.flatMap((product, productIndex) =>
  product.groupedVariants.map((variantGroup, variantIndex) => ({
    productId: product.productId,
    productName: product.productName,
    gstOnProduct: product.gstOnProduct,
    availableStatus: product.availableStatus,
    size: variantGroup.size,
    totalWeight: variantGroup.totalWeight,
    variants: variantGroup.variants.flatMap((v) =>
      v.variants.map((variant) => ({
        colorName: v.colorName,
        hexCode: v.hexCode,
        ...variant,
      }))
    ),
    productIndex,
    variantIndex,
  }))
);


const totalRows = flattenedData.length;
const totalPages = Math.ceil(totalRows / rowsPerPage);

const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;

const currentRows = flattenedData.slice(indexOfFirstRow, indexOfLastRow);

const paginationItems = [];

for (let i = 1; i <= totalPages; i++) {
  paginationItems.push(
    <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
      {i}
    </Pagination.Item>
  );
}


  useImperativeHandle(ref, () => ({
    exportToExcel: () => {
      
 const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
      if (!finalData || !finalData.length) {
        showToast("No product finalData available for export.", "error");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(
        finalData.map(product => ({
          "Product Name": product.productName,
          "Description": product.productDescription,
          "Available Status": product.availableStatus,
          "Price per Kg": product.pricePerKg || "N/A",
          "Total Variants": product.groupedVariants.length,
          "Total Weight (Kgs)": product.groupedVariants.reduce((sum, item) => sum + item.totalWeight, 0),
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(dataBlob, "Products_List.xlsx");
    },
  }));

  return (
    <div>
    <div className="product-table">
    <Table hover>
      <thead className='z-1'>
        <tr>
          <th style={{ textAlign: 'start', verticalAlign: 'middle' }}>Product Name</th>
          <th>Counter</th>
          <th>Color Variant</th>
          {/* <th>Color</th> */}
          <th>Available</th>
          <th>GST</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {currentRows.map((item, index) => (
          <tr
            key={`${item.productId}-${item.variantIndex}`}
            onClick={() => handleRowClick(item.productIndex, item.variantIndex)}
            style={{ cursor: "pointer" }}
          >
            <td style={{ textAlign: 'start', verticalAlign: 'middle' }}>{item.productName}</td>

            <td style={{ justifyItems: 'center', alignContent: 'center' }}>
              <div
                className='size'
                style={{
                  padding: '0.3rem 0.5rem',
                  backgroundColor: '#EFEFEF',
                  border: '1px solid #B9C0CD',
                  borderRadius: '0.9rem',
                  justifyContent: 'center',
                  width: '45%',
                  textAlign: 'center'
                }}
              >
                {item.size}
              </div>
            </td>

            <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
              {item.variants.length}
            </td>

            {/* <td style={{ verticalAlign: 'middle' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', marginLeft: '10px', position: 'relative' }}>
                    {item.variants.slice(0, 3).map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          style={{
                            width: '25px',
                            height: '25px',
                            backgroundColor: color.hexCode,
                            borderRadius: '50%',
                            marginLeft: colorIndex === 0 ? '0' : '-10px',
                            border: '1px solid #fff',
                          }}
                        ></div>
                      ))}
                  {item.variants.length > 3 && (
                    <div
                      style={{
                        position: 'absolute',
                        right: -22,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      +{item.variants.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </td> */}

            <td style={{ verticalAlign: 'middle' }}>{item.totalWeight}Kgs</td>
            <td style={{ verticalAlign: 'middle' }}>{item.gstOnProduct}%</td>

            <td style={{ justifyItems: 'center', alignContent: 'center' }}>
              <div
                style={{
                  color: item.availableStatus === 'ACTIVE' ? '#065F46' : '#991B1B',
                  backgroundColor: item.availableStatus === 'ACTIVE' ? '#D1FAE5' : '#FEE2E2',
                  border: '1px solid',
                  borderColor: item.availableStatus === 'ACTIVE' ? '#6EE7B7' : '#FCA5A5',
                  borderRadius: '0.2rem',
                  padding: '4px',
                  width: '6rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {item.availableStatus}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    


      <div className="product-cards">

      {finalData.map((product, index) => (
          product.groupedVariants.map((item, ix) => (

          <div className="product-card shadow-sm" key={ix} onClick={() => handleRowClick(index,ix)}>

            <div className='d-flex justify-content-between'>
                 <h3>{product.productName}</h3>
                 <div style={{ justifyItems: 'center', alignContent:'center'}} >
                 <p><strong></strong> {item.size}</p>
                 </div>
            </div>

            <div className='d-flex justify-content-between mt-3'>
            
            <p><strong></strong> {item.variants.length} Variants</p>

            <span><LuDot  size={25}/></span>

            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
           
            <div style={{ display: 'flex' }}>
                {item.variants.map((color, index) => (
                <div
                    key={index}
                    style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: color.colorName,
                    borderRadius: '50%',
                    marginLeft: index === 0 ? '0' : '-10px',
                    border: '1px solid #fff',
                    }}
                 
                ></div>
                ))}
            </div>
            </div> */}

            {/* <div className='d-flex justify-content-between mt-2 pe-4'> */}
                <p>{item.totalWeight} Kgs</p>
                <span><LuDot  size={25}/></span>
                 <p> 
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:product.availableStatus === 'ACTIVE'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:product.availableStatus==='ACTIVE' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'100%'}}>
                    {product.availableStatus}
                    </div>
                </p>
            </div>
          </div>
        ))))}

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
     <div className="d-flex justify-content-end mt-2 pagination">
        <Pagination className="z-index-n1">{paginationItems}</Pagination>
      </div>
    </div>
  );
});

export default ProductsTable;
