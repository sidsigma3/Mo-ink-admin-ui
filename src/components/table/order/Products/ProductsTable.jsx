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

const ProductsTable = forwardRef(({data},ref) => {

  const navigate = useNavigate();

  const [productData,setProductData] = useState([])


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
        const { size, color, availableWeight ,id } = variant;
  
        if (!acc[size]) {
          acc[size] = {
            id,
            size,
            variants: [],
            totalWeight: 0,
          };
        }

        
  
        // Add unique colors for this size
        if (!acc[size].variants.some((v) => v.colorName === color.colorName)) {
          acc[size].variants.push({
            colorName: color.colorName,
            hexCode: color.hexCode || "#ccc",
            available:variant.availableWeight,
            price:variant.pricePerKg,
            id:variant.id,
          });
        }
        
        // Accumulate availableWeight for this size
        acc[size].totalWeight += Number(availableWeight);
  
        return acc;
      }, {});
  
      // Return the aggregated product with grouped variants
      return {
        productId: product.id,
        productName: product.productName,
        productDescription: product.productDescription,
        productImage: product.productImage,
        compareAtPrice:product.productPrice?.compareAtPrice,
        costPerItemPerKg:product.productPrice?.costPerItemPerKg,
        gstOnProduct:product.productPrice?.gstOnProduct,
        pricePerKg:product.productPrice?.pricePerKg,
        availableStatus:product.availableStatus,
        groupedVariants: Object.values(groupedVariants),
      };
    });
  };


  const finalData = aggregateProductData(data)
  
  console.log(finalData)

  useImperativeHandle(ref, () => ({
    exportToExcel: () => {
      if (!finalData || !finalData.length) {
        alert("No product finalData available for export.");
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
    <div className="product-table">
      <Table hover>
        <thead className='z-1'>
          <tr>
            <th>Product Name</th>
            <th>Counter</th>
            <th>Color Variant</th>
            <th>Color</th>
            <th>Available</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {finalData.map((product, index) => (
            product.groupedVariants.map((item, ix) => (
              <tr 
                key={`${product.productId}-${ix}`} 
                onClick={() => handleRowClick(index,ix)} 
                style={{ cursor: "pointer" }}
              >
                <td>{product.productName}</td>
                <td>
                  <div 
                    style={{
                      padding: '0.3rem 0.5rem', 
                      backgroundColor: '#EFEFEF', 
                      border: '1px solid #B9C0CD', 
                      borderRadius: '0.9rem', 
                      width: '45%', 
                      textAlign: 'center'
                    }}
                  >
                    {item.size}
                  </div>
                </td>
                <td>{item.variants.length} Variants</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
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
                      {item.variants.length > 1 && (
                        <div
                          // style={{
                          //   width: '25px',
                          //   height: '25px',
                          //   borderRadius: '50%',
                          //   marginLeft: '-10px',
                          //   backgroundColor: '#ccc',
                          //   display: 'flex',
                          //   alignItems: 'center',
                          //   justifyContent: 'center',
                          //   fontSize: '18px',
                          //   color: '#000',
                          //   border: '1px solid #fff',
                          // }}
                          style={{
                            position:'absolute',
                            right:-22,
                          }}
                        >
                          {/* +{item.variants.length - 3} */}
                          +30
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td>{item.totalWeight}Kgs</td>
                <td>
                  <div 
                    style={{
                      backgroundColor: product.availableStatus === 'Active' ? '#D1FAE5' : '#F3F4F6',
                      border: '1px solid',
                      borderColor: product.availableStatus === 'Active' ? '#6EE7B7' : '#D1D5DB',
                      borderRadius: '0.2rem',
                      textAlign: 'center',
                      width: '70%',
                    }}
                  >
                    {product.availableStatus}
                  </div>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </Table>

      <div className='d-flex justify-content-end mt-2'>
        <Pagination className='z-index-n1'>{items}</Pagination>
      </div>

      <div className="product-cards">

      {finalData.map((product, index) => (
          product.groupedVariants.map((item, ix) => (

          <div className="product-card shadow-sm" key={ix} onClick={() => handleRowClick(index,ix)}>

            <div className='d-flex justify-content-between'>
                 <h3>{product.productName}</h3>
                 <div style={{padding:'0.3rem 0.5rem',backgroundColor:'#EFEFEF',border:'1px solid #B9C0CD' ,borderRadius:'1.2rem',width:'20%',textAlign:'center'}}>
                 <p><strong></strong> {item.size}</p>
                 </div>
            </div>

            <div className='d-flex mt-3'>
            
            <p><strong></strong> {item.variants.length} Variants</p>

            <span><LuDot  size={25}/></span>

            <div style={{ display: 'flex', alignItems: 'center' }}>
           
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
            </div>
            </div>

            <div className='d-flex justify-content-between mt-2 pe-4'>
                 <p> 
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:product.availableStatus === 'Active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:product.availableStatus==='Active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'100%'}}>
                    {product.availableStatus}
                    </div>
                </p>
                 <p>{item.totalWeight} Kgs</p>
            </div>
          </div>
        ))))}

      </div>
    </div>
  );
});

export default ProductsTable;
