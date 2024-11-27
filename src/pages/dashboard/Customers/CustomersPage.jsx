import React from 'react'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn'
import AddBtn from '../../../components/Buttons/Add/AddBtn'
import { Link } from 'react-router-dom'
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter'
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter'
import { Table } from 'react-bootstrap'
import "./CustomersPage.css"
import ImportBtn from '../../../components/Buttons/Import/ImportBtn'

const CustomersPage = () => {

    const customerData = [
        {
          name: "Rahul Sharma",
          email: "rahul.sharma@example.com",
          phone: "+91-9876543210",
          wallet: "₹5,000",
          location: "Mumbai",
          lastOrder: "2024-11-15",
        },
        {
          name: "Priya Gupta",
          email: "priya.gupta@example.com",
          phone: "+91-8765432109",
          wallet: "₹2,800",
          location: "Delhi",
          lastOrder: "2024-11-10",
        },
        {
          name: "Amit Patel",
          email: "amit.patel@example.com",
          phone: "+91-7654321098",
          wallet: "₹12,450",
          location: "Ahmedabad",
          lastOrder: "2024-11-20",
        },
        {
          name: "Sneha Nair",
          email: "sneha.nair@example.com",
          phone: "+91-6543210987",
          wallet: "₹9,600",
          location: "Kochi",
          lastOrder: "2024-11-18",
        },
        {
          name: "Karan Singh",
          email: "karan.singh@example.com",
          phone: "+91-5432109876",
          wallet: "₹3,300",
          location: "Chandigarh",
          lastOrder: "2024-11-05",
        },
      ];
      


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
            {customerData.map((customer, index) => (
              <tr key={index}>
                <td>{customer.name}</td>
                <td>{customer.location}</td>
                <td>{customer.phone}</td>
                <td>{customer.wallet}</td>
                <td>{customer.lastOrder}</td>
              </tr>
            ))}
          </tbody>

            </Table>
        </div>



    </div>
  )
}

export default CustomersPage