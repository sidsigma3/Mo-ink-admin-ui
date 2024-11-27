import React, { useState } from 'react'
import "./SideBar.css"
import { CiHome } from "react-icons/ci";
import { LuShoppingCart } from "react-icons/lu";
import { BsBox2 } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { TbRosetteDiscount } from "react-icons/tb";
import { GoPeople } from "react-icons/go";
import { LuFactory } from "react-icons/lu";
import { MdOutlineDiscount } from "react-icons/md";
import { LuHome } from "react-icons/lu";
import { LuBox } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { GrBug } from "react-icons/gr";
import { MdOutlinePersonOutline } from "react-icons/md";
import { TfiMenuAlt } from "react-icons/tfi";
import { Link } from 'react-router-dom'

const SideBar = () => {
    const [selected,setSelected] = useState('dashboard')



  return (
    <div className='sideBar'>

        <div className='menu'>
        <ul className='on-mobile'>
            <li className={selected === 'dashboard' ? 'selected' : 'not-selected'}>
                <Link to={'/dashboard'}>
                <button onClick={()=>setSelected('dashboard')}><span className='icon'><LuHome size={25} /></span>Home</button>
                </Link>
            </li>

            <li className={selected === 'orders' ? 'selected' : 'not-selected'}>
                <Link to={'/orders'}>
                <button  onClick={()=>setSelected('orders')}><span className='icon'><LuShoppingCart  size={25}/></span>Orders</button>
                </Link>
            </li>

            <li className={selected === 'orders' ? 'selected show-on-mobile' : 'not-selected show-on-mobile'}>
               
                <button  onClick={()=>setSelected('profile')}><span className='icon'><MdOutlinePersonOutline  size={28}/></span>Profile</button>
                
            </li>

            <li className={selected === 'products' ? 'selected' : 'not-selected'}>
                 <Link to={'/products'}>
                <button  onClick={()=>setSelected('products')}><span className='icon'><LuBox  size={25}/></span>Products</button>
                </Link>
            </li>

            <li className='show-on-mobile'>
                <button  onClick={()=>setSelected('more')}><span className='icon'><TfiMenuAlt  size={28}/></span>More</button>
            </li>

            <li className={selected === 'analytics' ? 'selected hide-on-mobile' : 'not-selected hide-on-mobile'}>
                <Link to={'/analytics'}>
                <button  onClick={()=>setSelected('analytics')}><span className='icon'><GoGraph  size={25}/></span>Analytics</button>
                </Link>
            </li>

            <li className={selected === 'discount' ? 'selected hide-on-mobile' : 'not-selected hide-on-mobile'}> 
                <Link to={'/discounts'}>
                <button  onClick={()=>setSelected('discount')}><span className='icon'><TbRosetteDiscount  size={25}/></span>Discount</button>
                </Link>
            </li>
        </ul>

        <h3 className='hide-on-mobile'>My Team</h3>

        <ul className='hide-on-mobile'>
            <li className={selected === 'customers' ? 'selected' : 'not-selected'}>
                <Link to={'/customers'}>
                <button  onClick={()=>setSelected('customers')}><span className='icon'><GoPeople size={25} /></span>Customers</button>
                </Link>
            </li>

            <li>
                <button  onClick={()=>setSelected('manufactures')}><span className='icon'><LuFactory size={25}/></span>Manufactures</button>
            </li>

            <li>
                <button  onClick={()=>setSelected('sales-team')}><span className='icon'><MdOutlineDiscount size={25}/></span>Sales Team</button>
            </li>

        </ul>

        </div>

        
        <ul className='hide-on-mobile'>
            <li>
                <button  onClick={()=>setSelected('settings')}><span className='icon'><LuSettings size={25} /></span>Settings</button>
            </li>

            <li>
                <button  onClick={()=>setSelected('report')}><span className='icon'><GrBug size={25}/></span>Report a bug</button>
            </li>


        </ul>




    </div>
  )
}

export default SideBar