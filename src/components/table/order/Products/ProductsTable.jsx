import React ,{ useContext } from 'react';
import './ProductsTable.css';
import { LuDot } from "react-icons/lu";
import { ProductContext } from "./../../../Context/ProductContext";
import { useNavigate } from "react-router-dom";
import { Table } from 'react-bootstrap';

const ProductsTable = ({sampleProducts}) => {

  const { products } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleRowClick = (index) => {
    navigate('/add-product', { state: { index } });
  };

  return (
    <div className="product-table">
      <Table hover>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Size</th>
            <th>Color Variant</th>
            <th>Color</th>
            <th>Available</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {products.map((product, index) => (
            <tr key={product.productId} onClick={() => handleRowClick(index)} style={{ cursor: "pointer" }}>
              <td>{product.productName}</td>
              <td>
                <div style={{padding:'0.3rem 0.5rem',backgroundColor:'#EFEFEF',border:'1px solid #B9C0CD' ,borderRadius:'0.9rem',width:'45%',textAlign:'center'}}>
                {product.size}
                </div>
                </td>
                <td>{product.colorVariants.length} Variants</td>
                <td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', marginLeft: '10px' }}>
                {product.colorVariants.map((color, index) => (
                <div
                    key={index}
                    style={{
                    width: '25px',
                    height: '25px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    marginLeft: index === 0 ? '0' : '-10px',
                    border: '1px solid #fff',
                    }}
                 
                ></div>
                ))}
            </div>
            </div>
            </td>
              <td>{product.stock} Kgs</td>
              <td>
                <div style={{backgroundColor:product.status === 'Active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:product.status==='Active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'50%'}}>
                {product.status}
                </div>          
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="product-cards">
        {sampleProducts.map((product,index) => (
          <div className="product-card" key={product.index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{product.productName}</h3>
                 <div style={{padding:'0.3rem 0.5rem',backgroundColor:'#EFEFEF',border:'1px solid #B9C0CD' ,borderRadius:'1.2rem',width:'20%',textAlign:'center'}}>
                 <p><strong></strong> {product.size}</p>
                 </div>
            </div>

            <div className='d-flex mt-3'>
            
            <p><strong></strong> {product.colorVariants.length} Variants</p>

            <span><LuDot  size={25}/></span>

            <div style={{ display: 'flex', alignItems: 'center' }}>
           
            <div style={{ display: 'flex' }}>
                {product.colorVariants.map((color, index) => (
                <div
                    key={index}
                    style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: color,
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
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:product.status === 'Active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:product.status==='Active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'100%'}}>
                    {product.status}
                    </div>
                </p>
                 <p>{product.stock} Kgs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsTable;
