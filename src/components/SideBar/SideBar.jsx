import React, { useState ,useRef ,useEffect } from 'react'
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
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BsArrowReturnRight } from "react-icons/bs";
import { RiUserSettingsLine } from "react-icons/ri";
import { IconContext } from "react-icons";
import { useLocation } from 'react-router-dom';
import { AiOutlineLogout } from "react-icons/ai";

const SideBar = () => {

    const navigate = useNavigate()
    const location =useLocation()

    const [selected,setSelected] = useState('dashboard')

    const [hoverSelected , setHoverSelected] = useState('')

    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);


    const menuRef = useRef(null);
    const buttonRef = useRef(null);


  // Close the menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {

        if (
            menuRef.current && !menuRef.current.contains(event.target) && 
            buttonRef.current && !buttonRef.current.contains(event.target)
          ) {
            setMoreMenuOpen(false); // Close the menu
          }
    };

    // Add event listener to the document body
    document.body.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup the listener
      document.body.removeEventListener('mousedown', handleClickOutside);
    };
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
    localStorage.removeItem("isAuthenticated"); 
    localStorage.removeItem("userData"); 
    // sessionStorage.removeItem("authToken");
    navigate("/"); 
  };
  


  return (
    <div className='sideBar shadow'>

        <div className='menu'>
        <ul className='on-mobile'>
            <li className={selected === 'dashboard' ? 'selected' : 'not-selected'}>
                <Link to={'/dashboard'}>
                <button onClick={()=>setSelected('dashboard')}><span className='icon'><LuHome size={22} /></span>Home</button>
                </Link>
            </li>


            <div  
                onMouseEnter={() => setHoverSelected('orders')}  
                onMouseLeave={() => {
                  if (selected !== 'vendors') setHoverSelected(null);
                }}
              >
                <li className={selected === 'orders' ? 'selected' : 'not-selected'}>
                  <Link to={'/orders'}>
                    <button onClick={() => setSelected('orders')}>
                      <span className='icon'><LuShoppingCart size={22} /></span>Orders
                    </button>
                  </Link>
                </li>

                {(hoverSelected === 'orders' || selected === 'vendors') && (
                  <div className={selected === 'vendors' ? 'selected mt-2 ps-4 mb-2' : 'not-selected mt-2 ps-4 mb-2'}>
                    <Link to={'/vendor-order'}>
                      <button 
                        onClick={() => {
                          setSelected('vendors');
                          setHoverSelected('orders'); // Keep it open
                        }} 
                        className='d-flex gap-3' 
                        style={{ border: 'none', background: 'none', textDecoration: 'none', fontSize: "0.85rem" }}
                      >
                        <span><BsArrowReturnRight /></span>Vendor Orders
                      </button>
                    </Link>
                  </div>
                )}
              </div>

            {/* <li className={selected === 'profile' ? 'selected show-on-mobile' : 'not-selected show-on-mobile'}>
               
                <button 
                 onClick={()=>{
                    setSelected('profile')
                    navigate('/profile')
                }}><span className='icon'><MdOutlinePersonOutline  size={28}/></span>Profile</button>
                
            </li> */}

            <li className={selected === 'products' ? 'selected' : 'not-selected'}>
                 <Link to={'/products'}>
                <button  onClick={()=>setSelected('products')}><span className='icon'><LuBox  size={22}/></span>Products</button>
                </Link>
            </li>


            <li className={selected === 'analytics' ? 'selected' : 'not-selected'}>
                <Link to={'/analytics'}>
                <button  onClick={()=>setSelected('analytics')}>
              
                    <span className='icon'>
                        <GoGraph  size={22} style={{ strokeWidth: '0.4'}}/>
                    </span>
             
                    Analytics</button>
                </Link>
            </li>

            <li className={selected === 'more' ? 'selected show-on-mobile' : 'not-selected show-on-mobile'}>
                <button   ref={buttonRef} onClick={() => {
                    setMoreMenuOpen(!isMoreMenuOpen)
                    setSelected('more')
                    }}><span className='icon'><TfiMenuAlt  size={28}/></span>More</button>
            </li>


            {isMoreMenuOpen && (
        <div className="more-menu" ref={menuRef}>
            <ul>
          {/* <li
            className={`${
              selected === 'analytics' ? 'selected' : 'not-selected'
            }`}
          >
            <Link to={'/analytics'}>
              <button onClick={() => setSelected('analytics')}>
                <span className="icon">
                  <GoGraph size={22} style={{ strokeWidth: '0.4' }} />
                </span>
                Analytics
              </button>
            </Link>
          </li> */}

          <li
            className={`${
              selected === 'discount' ? 'selected' : 'not-selected'
            }`}
          > 
            <Link to={'/discounts'}>
              <button onClick={() => setSelected('discount')}>
                <span className="icon">
                  <TbRosetteDiscount size={27} />
                </span>
                Discount
              </button>
            </Link>
          </li>


          <div  
              onMouseEnter={() => setHoverSelected('customers')}  
              onMouseLeave={() => {
                if (selected !== 'segments') setHoverSelected(null);
              }}
            >
              <li 
                className={selected === 'customers' ? 'selected' : 'not-selected'}  
              >
                <Link to={'/customers'}>
                  <button  
                    onClick={() => setSelected('customers')} 
                    style={{ fontSize: "1rem" }} // Ensure font size applies
                  >
                    <span className='icon'>
                      <GoPeople size={22} style={{ strokeWidth: '0.4' }} />
                    </span>
                    Customers
                  </button>
                </Link>
              </li>

              {/* Submenu stays visible when either hovered or selected */}
              {(hoverSelected === 'customers' || selected === 'segments') && (
                <div 
                  className="mt-2 ps-4 mb-2"
                  onMouseEnter={() => setHoverSelected('customers')}  
                  onMouseLeave={() => {
                    if (selected !== 'segments') setHoverSelected(null);
                  }}
                >
                  <Link to={'/segments'}>
                    <button 
                      onClick={() => {
                        setSelected('segments');
                        // setHoverSelected('customers'); 
                      }} 
                      className="d-flex gap-3" 
                      style={{ 
                        border: 'none', 
                        background: 'none', 
                        textDecoration: 'none', 
                        fontSize: "0.85rem" // Ensure font size applies
                      }}
                    >
                      <span><BsArrowReturnRight /></span>Segments
                    </button>
                  </Link>
                </div>
              )}
            </div>


            <li className={selected === 'manufactures' ? 'selected' : 'not-selected'}>
                <Link to={'/spinners-and-dyers'}>
                <button  onClick={()=>setSelected('manufactures')}><span className='icon'><LuFactory size={22}/></span><div>Spinners &</div><div> Dyers</div></button>
                </Link>
            </li>

            <li>
                <Link to={'/users'}>
                <button  onClick={()=>setSelected('users')}><span className='icon'><RiUserSettingsLine  size={22}/></span>Users</button>
                </Link>
            </li>
          </ul>
        </div>
      )}



           

            <li className={selected === 'discount' ? 'selected hide-on-mobile' : 'not-selected hide-on-mobile'}> 
                <Link to={'/discounts'}>
                <button  onClick={()=>setSelected('discount')}><span className='icon'><TbRosetteDiscount  size={27}/></span>Discount</button>
                </Link>
            </li>
        </ul>

        <h3 className='hide-on-mobile'>My Team</h3>

        <ul className='hide-on-mobile'>
          <div  
              onMouseEnter={() => setHoverSelected('customers')}  
              onMouseLeave={() => {
                if (selected !== 'segments') setHoverSelected(null); // Keep open if "segments" is selected
              }}
            >
            <li className={selected === 'customers' ? 'selected' : 'not-selected'}  onMouseEnter={() => setHoverSelected('customers')} >
                <Link to={'/customers'}>
                <button  onClick={()=>setSelected('customers')}><span className='icon'><GoPeople size={22} style={{ strokeWidth: '0.4'}}/></span>Customers</button>
                </Link>
                
            </li>
            {(hoverSelected === 'customers' || selected === 'segments') && (
                <div className={selected === 'segments' ? 'selected mt-2 ps-4 mb-2' : 'not-selected mt-2 ps-4 mb-2'}>
                  <Link to={'/segments'}>
                    <button 
                      onClick={() => {
                        setSelected('segments');
                        setHoverSelected('customers'); 
                      }} 
                      className='d-flex gap-3' 
                      style={{ border: 'none', background: 'none', textDecoration: 'none', fontSize: "0.85rem" }}
                    >
                      <span><BsArrowReturnRight /></span>Segments
                    </button>
                  </Link>
                </div>
              )}

            </div>

            <li className={selected === 'manufactures' ? 'selected' : 'not-selected'}>
                <Link to={'/spinners-and-dyers'}>
                <button  onClick={()=>setSelected('manufactures')}><span className='icon'><LuFactory size={22}/></span>Spinners & Dyers</button>
                </Link>
            </li>

            <li className={selected === 'users' ? 'selected' : 'not-selected'}>
                <Link to={'/users'}>
                <button  onClick={()=>setSelected('users')}><span className='icon'><RiUserSettingsLine  size={22}/></span>Users</button>
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
                <button  onClick={()=>setSelected('report')}><span className='icon'><GrBug size={22}/></span>Report a bug</button>
            </li>

            <li onClick={()=>handleLogout()}>
              <button ><span className='icon' ><AiOutlineLogout size={22}/></span>Log out</button>
            </li>


        </ul>




    </div>
  )
}

export default SideBar