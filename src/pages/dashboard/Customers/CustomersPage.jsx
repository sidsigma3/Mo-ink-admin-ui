import React from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import { Link } from 'react-router-dom'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import "./CustomersPage.css"
import ImportBtn from '../../../components/Buttons/Import/ImportBtn'
import { useCustomerContext } from '../../../components/Context/CustomerContext'
import { useNavigate } from 'react-router-dom'
import { BiWallet } from "react-icons/bi";

const CustomersPage = () => {

    const navigate = useNavigate()

    const { customers } = useCustomerContext();

    const handleRowClick = (index) => {
        navigate('/add-customer', { state: { index } });
      };
    

  return (
    <div className='customer-page'>
          <div className='top d-flex justify-content-between'>
            <h4>Customers</h4>

            <div className='d-flex gap-2'>
                <ExportBtn></ExportBtn>

                <ImportBtn></ImportBtn>

                <Link to={'/add-customer'}>
                <AddBtn text={"Add New"}></AddBtn>
                </Link>
            </div>

        </div>


        <div className='w-50 d-flex gap-2'>
            <ProductFilter></ProductFilter>
            <StatusFilter status={'Active'}></StatusFilter>
        </div>


        <div className='table-ctn'>
            <Table hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Wallet</th>
                        <th>Orders</th>
                        <th>Last Order</th>
                    </tr>
                </thead>
                <tbody>
            {customers.map((customer, index) => (
              <tr key={index} onClick={() => handleRowClick(index)} style={{ cursor: "pointer" }}>
                <td>{customer.name}</td>
                <td>{customer.location}</td>
                <td style={{color:'#3CAA82'}}>{customer.wallet}</td>
                <td>{customer.totalOrders}</td>
                <td>{customer.lastOrder}</td>
              </tr>
            ))}
          </tbody>

            </Table>


            <div className="data-cards">
        {customers.map((item,index) => (
          <div className="data-card" key={index} onClick={() => handleRowClick(index)}>

            <div className='d-flex justify-content-between'>
                 <h3>{item.name}</h3>
                 <p> 
                   <div style={{padding:'0.2rem 0.4rem' ,backgroundColor:'#D1FAE5',border:'1px solid' ,borderColor:'#6EE7B7',borderRadius:'0.2rem',textAlign:'center',width:'100%' ,color:'#00A65E'}}>
                      <span><BiWallet /></span>      {item.wallet}
                    </div>
                </p>
            </div>

          
            
            <p><strong></strong> {item.phone}</p>
    
         

            <p className='fw-medium'><strong></strong> {item.location}</p>

            <p className='text-body-tertiary'>Last Order on {item.lastOrder}</p>

           
          </div>
        ))}
      </div>




        </div>



    </div>
  )
}

export default CustomersPage