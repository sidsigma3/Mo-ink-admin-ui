import React from 'react'
import "./Orders.css"
import { IoSearchOutline } from "react-icons/io5";
import Filter from '../../../components/Filter/DayFilter/Filter';
import DashboardBox from '../../../components/DashboardBox/DashboardBox';
import { MdKeyboardArrowDown } from "react-icons/md";
import OrderTable from '../../../components/table/order/OrderTable';
import { Link } from 'react-router-dom'
import ExportBtn from '../../../components/Buttons/Export/ExportBtn';
import AddBtn from '../../../components/Buttons/Add/AddBtn';
import ProductFilter from '../../../components/Filter/DayFilter/ProductFilter/ProductFilter';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import { Pagination } from 'react-bootstrap';

const Orders = () => {


     
    let active = 2;
    let items = [];
    for (let number = 1; number <= 5; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active}>
          {number}
        </Pagination.Item>,
      );
    }



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

        <div className='order-filter-ctn d-flex gap-2'>
          
                <ProductFilter></ProductFilter>
          
                <StatusFilter status={"Active"}></StatusFilter>
        </div>

        <div className='order-table-ctn'>
            <OrderTable></OrderTable>
              
          <div className='d-flex justify-content-end mt-2'>
          <Pagination>{items}</Pagination>
          </div>

        </div>

    </div>
  )
}

export default Orders