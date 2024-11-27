import React, {useState} from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import "./DiscountPage.css"
import { Link } from 'react-router-dom'
import { useDiscounts } from '../../../components/Context/DiscountContext'
import { useNavigate } from 'react-router-dom'
import { LuDot } from "react-icons/lu";

const DiscountsPage = () => {

  const navigate = useNavigate ()
  const { discountData } = useDiscounts();

  const handleRowClick = (index) => {
    navigate('/add-discount', { state: { index } });
  };


  return (
    <div className='discounts'>
        <div className='top d-flex justify-content-between'>
            <h4>Discounts</h4>

            <div className='d-flex gap-2'>
                <ExportBtn></ExportBtn>

                <Link to={'/add-discount'}>
                <AddBtn text={"Add Discount"}></AddBtn>
                </Link>
            </div>
        </div>

        <div className='w-50 d-flex gap-2'>
          <ProductFilter></ProductFilter>
          <StatusFilter status={'Active'}></StatusFilter>
        </div>


        <div className='discount-table-ctn'>
          <Table hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Method</th>
                <th>Customer</th>
                <th>Used</th>
              </tr>
            </thead>

            <tbody>
            {discountData.map((discount, index) => (
            <tr key={index} onClick={() => handleRowClick(index)} style={{ cursor: "pointer" }}>
              <td>{discount.discountCode}</td>
              <td>
                <div style={{backgroundColor:discount.status === 'Active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:discount.status==='Active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'50%'}}>
                {discount.status}
                </div>
              </td>
              <td>{discount.method}</td>
              <td style={{textTransform:'capitalize'}}>{discount.selectedOptionCustomer}</td>
              <td>{discount.used}</td>
            </tr>
          ))}
            </tbody>

          </Table>


          <div className="data-cards">
        {discountData.map((product,index) => (
          <div className="data-card" key={index}>

            <div className='d-flex justify-content-between'>
                 <h3>{product.discountCode}</h3>
                 <p> 
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:product.status === 'Active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:product.status==='Active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'100%'}}>
                    {product.status}
                    </div>
                </p>
            </div>

            <div className='d-flex mt-3'>
            
            <p><strong></strong> {product.method}</p>

            <span><LuDot  size={25}/></span>

            <p><strong></strong> {product.selectedOptionCustomer}</p>

            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
           
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
            </div> */}
            </div>

            {/* <div className='d-flex justify-content-between mt-2 pe-4'>
                 <p> 
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:product.status === 'Active'? '#D1FAE5' : '#F3F4F6',border:'1px solid' ,borderColor:product.status==='Active' ? '#6EE7B7' : '#D1D5DB',borderRadius:'0.2rem',textAlign:'center',width:'100%'}}>
                    {product.status}
                    </div>
                </p>
                 <p>{product.stock} Kgs</p>
            </div> */}
          </div>
        ))}
      </div>





        </div>

      

    </div>
  )
}

export default DiscountsPage