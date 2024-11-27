import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import "./Orders.css"
import { IoSearchOutline } from "react-icons/io5";
import Filter from '../../../components/Filter/DayFilter/Filter';
import DashboardBox from '../../../components/DashboardBox/DashboardBox';
import { MdKeyboardArrowDown } from "react-icons/md";
import OrderTable from '../../../components/table/order/OrderTable';
import { Link } from 'react-router-dom'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn';
import AddBtn from '../../../components/Buttons/Add/AddBtn';

const Orders = () => {
  return (
    <div className='order'>
        <div className='top'>
            <h3>Orders</h3>

            <div className='btn-ctn'>
              
                <Filter></Filter>

                <ExportBtn></ExportBtn>
                
                <Link to={'/create-order'}>
                    <AddBtn
                        text={"Create Order"}
                    ></AddBtn>
                </Link>
            </div>

            

        </div>


        <div className='info-ctn'>
            <ul className='row'>
                
                <li className='col-lg col-md-4 col-sm-6 col-6'>
                    <DashboardBox heading={'Total Orders'} number={356}></DashboardBox>
                    
                </li>

                <li className='col-lg col-md-4 col-sm-6 col-6'>
                <DashboardBox heading={'Ordered Quantity'} number={356}></DashboardBox>
                   
                </li>

                <li className='col-lg col-md-4 col-sm-6 col-6'>
                <DashboardBox heading={'Ordered Amount'} number={356}></DashboardBox>
                  
                </li>

                <li className='col-lg col-md-6 col-sm-6 col-6'>
                <DashboardBox heading={'Total Order Weight'} number={'141 Kgs'}></DashboardBox>
                   
                </li>

                <li className='col-lg col-md-6 col-sm-12 col-12'>
                <DashboardBox heading={'Order to Deliver'} number={12}></DashboardBox>
                   
                </li>
            </ul>
        </div>

        <div className='order-filter-ctn d-flex gap-2 '>
            <div className='d-flex bg-white  p-1 gap-3 border order-id'>
                <div className='d-flex gap-4 align-items-center w-50'>
                    <h5>Order ID</h5>
                    <span><MdKeyboardArrowDown size={18}/></span>
                </div>
            
            
                <div className='d-flex gap-5 align-items-center justify-content-between flex-grow-1' >
                    
                    <input type='text' placeholder='Search'></input>
                    <span>  <IoSearchOutline /></span>
                    
                </div>
            </div>

            <div className='d-flex bg-white p-1 gap-5 border  align-items-center justify-content-between status'>
                <h5>Status</h5>
                <span><MdKeyboardArrowDown size={20}/></span>
            </div>
        </div>

        <div className='order-table-ctn'>
            <OrderTable></OrderTable>
        </div>

    </div>
  )
}

export default Orders