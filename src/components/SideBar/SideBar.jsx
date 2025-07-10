import React, { useState ,useRef ,useEffect } from 'react'
import "./SideBar.css"
import { CiHome } from "react-icons/ci";
import { TbBuildingFactory } from "react-icons/tb";
import { TbClipboardList } from "react-icons/tb";

import { LuShoppingCart } from "react-icons/lu";
import { BsBox2 } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { TbRosetteDiscount } from "react-icons/tb";
import { GoPeople } from "react-icons/go";
import { LuFactory } from "react-icons/lu";
import { MdOutlineDiscount } from "react-icons/md";
import { GoHome  } from "react-icons/go";
import { LuBox } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { LuPackage } from "react-icons/lu";
import { GrBug } from "react-icons/gr";
import { MdOutlinePersonOutline } from "react-icons/md";
import { TfiMenuAlt } from "react-icons/tfi";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BsArrowReturnRight } from "react-icons/bs";
import { RiUserSettingsLine } from "react-icons/ri";
import { IconContext } from "react-icons";
import { useLocation } from 'react-router-dom';
import { AiOutlineLogout } from "react-icons/ai";
import { IoPricetagOutline } from "react-icons/io5";
import { IoColorPaletteOutline } from "react-icons/io5";
import ModalLogout from '../Modal/ModalLogout';


const SideBar = () => {

    const navigate = useNavigate()
    const location =useLocation()

    const [selected,setSelected] = useState('dashboard')

    const [hoverSelected , setHoverSelected] = useState('')

    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);  

    const [isLoggedOut, setIsLoggedOut] = useState(false);  
  


    const menuRef = useRef(null);
    const buttonRef = useRef(null);



      useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target) && 
            buttonRef.current && !buttonRef.current.contains(event.target)) {
          setMoreMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


  useEffect(() => {
    if (location.pathname.includes("/vendor-order")) {
      setSelected("vendors");
    } else if  (location.pathname.includes("/orders") || location.pathname.includes("/create-order")) {
      setSelected("orders");
    } else if (location.pathname.includes("/dashboard")) {
      setSelected("dashboard");
    } else if (location.pathname.includes("/products") || location.pathname.includes("/add-product")) {
      setSelected("products");
    } else if (location.pathname.includes("/colorlibrary") || location.pathname.includes("/colorlibrary")) {
      setSelected("colorlibrary");
    }else if (location.pathname.includes("/analytics")) {
      setSelected("analytics");
    }else if (location.pathname.includes("/products") || location.pathname.includes("/add-product")) {
      setSelected("products");
    }else if (location.pathname.includes("/discounts") || location.pathname.includes("/add-discount")) {
      setSelected("discount");
    }else if (location.pathname.includes("/customers") || location.pathname.includes("/add-customer")) {
      setSelected("customers");
    }else if (location.pathname.includes("/segments") || location.pathname.includes("/add-segments")) {
      setSelected("segments");
    }else if (location.pathname.includes("/inventory") || location.pathname.includes("/inventorydetails")) {
      setSelected("inventory");
    }else if (location.pathname.includes("/vendor-order") || location.pathname.includes("/vendor-order-details") ||  location.pathname.includes("/BulkAssignPage")) {
      setSelected("vendors");
    }else if (location.pathname.includes("/spinners-and-dyers") || location.pathname.includes("/add-spinner-and-dyers")) {
      setSelected("manufactures");
    }else if (location.pathname.includes("/users") || location.pathname.includes("/add-user")) {
      setSelected("users");
    }
    
    else {
      
      setSelected(""); 
    }
  }, [location.pathname]);

  // const handleLogout = () => {
  //   localStorage.removeItem("isAuthenticated");
  //   setIsAuthenticated(false);
  // };

          const handleLogout = () => {
            setIsModalOpen(true); 
          };

          const confirmLogout = () => {
            localStorage.removeItem("isAuthenticated"); 
            localStorage.removeItem("userData"); 
            // sessionStorage.removeItem("authToken");
            
            console.log("User logged out");
            setIsModalOpen(false);  
            setIsLoggedOut(true);  
            navigate("/");         
          };

          const closeModal = () => {
            setIsModalOpen(false);
          };



  return (
    <div className='sideBar shadow'>

       <div className='menu'>

       {/* Mobile menu */}
        <ul className="on-mobile d-md-none bg-gray-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-2xl">
          {/* Always visible on mobile */}
          <li className={selected === 'dashboard' ? 'selected' : 'not-selected'}>
            <Link to={'/dashboard'}>
              <button onClick={()=>setSelected('dashboard')}><span className='icon'><GoHome  size={22} /></span>Dashboard</button>
            </Link>
          </li>

          <li className={selected === 'orders' ? 'selected' : 'not-selected'}>
            <Link to={'/orders'}>
              <button onClick={() => setSelected('orders')}>
                <span className='icon'><LuShoppingCart size={22} /></span>Orders
              </button>
            </Link>
          </li>

          <li className={selected === 'products' ? 'selected' : 'not-selected'}>
            <Link to={'/products'}>
              <button onClick={() => setSelected('products')}>
                <span className='icon'><LuPackage size={22} /></span>Product
              </button>
            </Link>
          </li>

          <li className={selected === 'discount' ? 'selected' : 'not-selected'}> 
            <Link to={'/discounts'}>
              <button onClick={()=>setSelected('discount')}><span className='icon'><TbRosetteDiscount size={27}/></span>Discount</button>
            </Link>
          </li>

          {/* More menu button - always visible on mobile */}
         <li className={selected === 'more' ? 'selected' : 'not-selected'}>
          <button 
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              setMoreMenuOpen(!isMoreMenuOpen);
              setSelected('more');
            }}
          >
            <span className='icon'><TfiMenuAlt size={28}/></span>More
          </button>
        </li>


            {isMoreMenuOpen && (
            <div
              ref={menuRef}
              className="more-menu position-fixed bg-white shadow rounded-3 p-2 border"
              style={{
                bottom: '70px',       
                right: '16px',       
                zIndex: 2147483647 ,
                width: '220px',
                animation: 'slideUp 0.3s ease-out'
              }}
            >
              <ul className="list-unstyled mb-0">
                <li className="d-flex align-items-center gap-2 p-2 rounded hover-bg">
                  <Link
                    to="/vendor-order"
                    onClick={() => setSelected('vendors')}
                    className={`text-decoration-none d-flex align-items-center gap-2 w-100 ${
                      selected === 'vendors' ? 'fw-semibold text-brand' : 'text-dark'
                    }`}
                  >
                    <TbBuildingFactory size={20} />
                    Vendor Orders
                  </Link>
                </li>

                <li className="d-flex align-items-center gap-2 p-2 rounded hover-bg">
                  <Link
                    to="/inventory"
                    onClick={() => setSelected('inventory')}
                    className={`text-decoration-none d-flex align-items-center gap-2 w-100 ${
                      selected === 'inventory' ? 'fw-semibold text-brand' : 'text-dark'
                    }`}
                  >
                    <TbClipboardList size={20} />
                    Inventory
                  </Link>
                </li>

                <li className="d-flex align-items-center gap-2 p-2 rounded hover-bg">
                  <Link
                    to="/colorlibrary-products"
                    onClick={() => setSelected('colorlibrary')}
                    className={`text-decoration-none d-flex align-items-center gap-2 w-100 ${
                      selected === 'colorlibrary' ? 'fw-semibold text-brand' : 'text-dark'
                    }`}
                  >
                    <IoColorPaletteOutline size={20} />
                    Color Library
                  </Link>
                </li>

                <li className="d-flex align-items-center gap-2 p-2 rounded hover-bg">
                  <Link
                    to="/analytics"
                    onClick={() => setSelected('analytics')}
                    className={`text-decoration-none d-flex align-items-center gap-2 w-100 ${
                      selected === 'analytics' ? 'fw-semibold text-brand' : 'text-dark'
                    }`}
                  >
                    <GoGraph size={20} style={{ strokeWidth: '0.4' }} />
                    Analytics
                  </Link>
                </li>

                <li className="d-flex align-items-center gap-2 p-2 rounded hover-bg">
                  <Link
                    to="/customers"
                    onClick={() => setSelected('customers')}
                    className={`text-decoration-none d-flex align-items-center gap-2 w-100 ${
                      selected === 'customers' ? 'fw-semibold text-brand' : 'text-dark'
                    }`}
                  >
                    <GoPeople size={20} style={{ strokeWidth: '0.4' }} />
                    Customers
                  </Link>
                </li>

                <li className="d-flex align-items-center gap-2 p-2 rounded hover-bg">
                  <Link
                    to="/segments"
                    onClick={() => setSelected('segments')}
                    className={`text-decoration-none d-flex align-items-center gap-2 w-100 ${
                      selected === 'segments' ? 'fw-semibold text-brand' : 'text-dark'
                    }`}
                  >
                    <IoPricetagOutline size={20} />
                    Segments
                  </Link>
                </li>

                <li className="d-flex align-items-center gap-2 p-2 rounded hover-bg">
                  <Link
                    to="/spinners-and-dyers"
                    onClick={() => setSelected('manufactures')}
                    className={`text-decoration-none d-flex align-items-center gap-2 w-100 ${
                      selected === 'manufactures' ? 'fw-semibold text-brand' : 'text-dark'
                    }`}
                  >
                    <LuFactory size={20} />
                    Spinners & Dyers
                  </Link>
                </li>

                <li className="d-flex align-items-center gap-2 p-2 rounded hover-bg">
                  <Link
                    to="/users"
                    onClick={() => setSelected('users')}
                    className={`text-decoration-none d-flex align-items-center gap-2 w-100 ${
                      selected === 'users' ? 'fw-semibold text-brand' : 'text-dark'
                    }`}
                  >
                    <RiUserSettingsLine size={20} />
                    Users
                  </Link>
                </li>
              </ul>
            </div>
          )}

        </ul>

        {/* Desktop menu */}
        <ul className='hide-on-mobile '>
          <li className={selected === 'dashboard' ? 'selected' : 'not-selected'}>
            <Link to={'/dashboard'}>
              <button onClick={()=>setSelected('dashboard')}><span className='icon'><GoHome  size={22} /></span>Dashboard</button>
            </Link>
          </li>

          <li className={selected === 'orders' ? 'selected' : 'not-selected'}>
            <Link to={'/orders'}>
              <button onClick={() => setSelected('orders')}>
                <span className='icon'><LuShoppingCart size={22} /></span>Orders
              </button>
            </Link>
          </li>

          <li className={selected === 'vendors' ? 'selected' : 'not-selected'}>
            <Link to={'/vendor-order'}>
              <button onClick={() => setSelected('vendors')}>
                <span className='icon'><TbBuildingFactory size={24} /></span>Vendor Orders
              </button>
            </Link>
          </li>

          <li className={selected === 'products' ? 'selected' : 'not-selected'}>
            <Link to={'/products'}>
              <button onClick={() => setSelected('products')}>
                <span className='icon'><LuPackage size={22} /></span>Product
              </button>
            </Link>
          </li>

          <li className={selected === 'inventory' ? 'selected' : 'not-selected'}>
            <Link to={'/inventory'}>
              <button onClick={() => setSelected('inventory')}>
                <span className='icon'><TbClipboardList size={24} /></span>Inventory
              </button>
            </Link>
          </li>

          <li className={selected === 'colorlibrary' ? 'selected' : 'not-selected'}>
            <Link to={'/colorlibrary-products'}>
              <button onClick={() => setSelected('colorlibrary')}>
                <span className='icon'><IoColorPaletteOutline size={24} /></span>Color Library
              </button>
            </Link>
          </li>

          <li className={selected === 'analytics' ? 'selected' : 'not-selected'}>
            <Link to={'/analytics'}>
              <button onClick={()=>setSelected('analytics')}>
                <span className='icon'><GoGraph size={22} style={{ strokeWidth: '0.4'}}/></span>Analytics
              </button>
            </Link>
          </li>

          <li className={selected === 'discount' ? 'selected' : 'not-selected'}> 
            <Link to={'/discounts'}>
              <button onClick={()=>setSelected('discount')}><span className='icon'><TbRosetteDiscount size={27}/></span>Discount</button>
            </Link>
          </li>

          <div  
            onMouseEnter={() => setHoverSelected('customers')}  
            onMouseLeave={() => {
              if (selected !== 'segments') setHoverSelected(null);
            }}
          >
            <li className={selected === 'customers' ? 'selected' : 'not-selected'} >
              <Link to={'/customers'}>
                <button onClick={()=>setSelected('customers')}><span className='icon'><GoPeople size={22} style={{ strokeWidth: '0.4'}}/></span>Customers</button>
              </Link>
            </li>
          
            <li className={selected === 'segments' ? 'selected mt-3 ' : 'not-selected mt-3 '}>
              <Link to={'/segments'}>
                <button 
                  onClick={() => {
                    setSelected('segments');
                  }} 
                  className='d-flex ' 
                  style={{ border: 'none', background: 'none', textDecoration: 'none', fontSize: "0.85rem" }}
                >
                  <span><IoPricetagOutline size={22}/></span>Segments
                </button>
              </Link>
            </li>
          </div>

          <li className={selected === 'manufactures' ? 'selected' : 'not-selected'}>
            <Link to={'/spinners-and-dyers'}>
              <button onClick={()=>setSelected('manufactures')}><span className='icon'><LuFactory size={22}/></span>Spinners & Dyers</button>
            </Link>
          </li>

          <li className={selected === 'users' ? 'selected' : 'not-selected'}>
            <Link to={'/users'}>
              <button onClick={()=>setSelected('users')}><span className='icon'><RiUserSettingsLine size={22}/></span>Users</button>
            </Link>
          </li>
        </ul>
      </div>

        
        <ul className='hide-on-mobile'>
            {/* <li className={selected === 'settings' ? 'selected' : 'not-selected'}>
                <Link to={'/settings'}>
                <button  onClick={()=>setSelected('settings')}><span className='icon'><LuSettings size={22} /></span>Store settings</button>
                </Link>
            </li> */}

            <li>
            <Link to={'/reportbug'}>
                <button  onClick={()=>setSelected('report')}><span className='icon'><GrBug size={22}/></span>Report a bug</button>
                </Link>
            </li>

            <div>
            <li>
              <button onClick={handleLogout}>
                <span className='icon'>
                  <AiOutlineLogout size={22} />
                </span>
                Log out
              </button>
            </li>


              <ModalLogout
              isOpen={isModalOpen}
              onConfirm={confirmLogout}
              onCancel={closeModal}
            />


              {isLoggedOut && <p>You have been logged out successfully.</p>}
            </div>
                    </ul>




    </div>
  )
}

export default SideBar