import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ModalLogout from '../Modal/ModalLogout';
import "./SideBar.css";
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Factory, 
  ClipboardList, 
  Palette, 
  BarChart3, 
  Tag, 
  Users, 
  UserCheck, 
  Settings, 
  Bug, 
  LogOut,
  Menu,
  Percent,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selected, setSelected] = useState('dashboard');
    const [hoverSelected, setHoverSelected] = useState('');
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [isCustomerSubmenuOpen, setIsCustomerSubmenuOpen] = useState(false);

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
      } else if (location.pathname.includes("/orders") || location.pathname.includes("/create-order")) {
        setSelected("orders");
      } else if (location.pathname.includes("/dashboard")) {
        setSelected("dashboard");
      } else if (location.pathname.includes("/products") || location.pathname.includes("/add-product")) {
        setSelected("products");
      } else if (location.pathname.includes("/colorlibrary")) {
        setSelected("colorlibrary");
      } else if (location.pathname.includes("/analytics")) {
        setSelected("analytics");
      } else if (location.pathname.includes("/discounts") || location.pathname.includes("/add-discount")) {
        setSelected("discount");
      } else if (location.pathname.includes("/customers") || location.pathname.includes("/add-customer")) {
        setSelected("customers");
        setIsCustomerSubmenuOpen(true);
      } else if (location.pathname.includes("/segments") || location.pathname.includes("/add-segments")) {
        setSelected("segments");
        setIsCustomerSubmenuOpen(true);
      } else if (location.pathname.includes("/inventory") || location.pathname.includes("/inventorydetails")) {
        setSelected("inventory");
      } else if (location.pathname.includes("/vendor-order") || location.pathname.includes("/vendor-order-details") || location.pathname.includes("/BulkAssignPage")) {
        setSelected("vendors");
      } else if (location.pathname.includes("/spinners-and-dyers") || location.pathname.includes("/add-spinner-and-dyers")) {
        setSelected("manufactures");
      } else if (location.pathname.includes("/users") || location.pathname.includes("/add-user")) {
        setSelected("users");
      } else if (location.pathname.includes("/reportbug")) {
        setSelected("reportbug");
      } else {
        setSelected(""); 
      }
    }, [location.pathname]);

    const handleLogout = () => {
      setIsModalOpen(true); 
    };

    const confirmLogout = () => {
      localStorage.removeItem("isAuthenticated"); 
      localStorage.removeItem("userData"); 
      console.log("User logged out");
      setIsModalOpen(false);  
      setIsLoggedOut(true);  
      navigate("/");         
    };

    const handleMoreMenuItemClick = (selectedItem) => {
      setSelected(selectedItem);
      setMoreMenuOpen(false); // Close the dropdown menu
    };

    const isDropdownItemActive = (itemKey) => {
      return selected === itemKey;
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };

    const toggleCustomerSubmenu = () => {
      setIsCustomerSubmenuOpen(!isCustomerSubmenuOpen);
    };

    return (
      <div className='sidebar-container' >
        <div className='sidebar-header'>
          <div className='logo-section'>
            <div className='logo-placeholder'></div>
            <span className='brand-name'>Dashboard</span>
          </div>
        </div>

        <div className='sidebar-menu' >
          {/* Mobile menu */}
          <ul className="mobile-menu z-40">
            <li className={`menu-item ${selected === 'dashboard' ? 'selected' : ''}`}>
              <Link to={'/dashboard'} className='menu-link'>
                <button onClick={() => setSelected('dashboard')} className='menu-button'>
                  <span className='menu-icon'><Home size={22} /></span>
                  <span className='menu-text'>Dashboard</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'orders' ? 'selected' : ''}`}>
              <Link to={'/orders'} className='menu-link'>
                <button onClick={() => setSelected('orders')} className='menu-button'>
                  <span className='menu-icon'><ShoppingCart size={22} /></span>
                  <span className='menu-text'>Orders</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'products' ? 'selected' : ''}`}>
              <Link to={'/products'} className='menu-link'>
                <button onClick={() => setSelected('products')} className='menu-button'>
                  <span className='menu-icon'><Package size={22} /></span>
                  <span className='menu-text'>Products</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'discount' ? 'selected' : ''}`}>
              <Link to={'/discounts'} className='menu-link'>
                <button onClick={() => setSelected('discount')} className='menu-button'>
                  <span className='menu-icon'><Percent size={22}/></span>
                  <span className='menu-text'>Discount</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'more' ? 'selected' : ''}`}>
              <button 
                ref={buttonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreMenuOpen(!isMoreMenuOpen);
                  setSelected('more');
                }}
                className='menu-button'
              >
                <span className='menu-icon'><Menu size={22}/></span>
                <span className='menu-text'>More</span>
              </button>
            </li>

            {isMoreMenuOpen && (
                <div ref={menuRef} className="more-menu-dropdown" style={{ zIndex: 5 }}>
                  <div className="dropdown-content">
                    <Link to="/vendor-order" onClick={() => handleMoreMenuItemClick('vendors')} 
                          className={`dropdown-items ${isDropdownItemActive('vendors') ? 'active' : ''}`}>
                      <Factory size={20} />
                      <span>Vendor Orders</span>
                    </Link>

                    <Link to="/inventory" onClick={() => handleMoreMenuItemClick('inventory')} 
                          className={`dropdown-items ${isDropdownItemActive('inventory') ? 'active' : ''}`}>
                      <ClipboardList size={20} />
                      <span>Inventory</span>
                    </Link>

                    <Link to="/colorlibrary-products" onClick={() => handleMoreMenuItemClick('colorlibrary')} 
                          className={`dropdown-items ${isDropdownItemActive('colorlibrary') ? 'active' : ''}`}>
                      <Palette size={20} />
                      <span>Color Library</span>
                    </Link>

                    <Link to="/analytics" onClick={() => handleMoreMenuItemClick('analytics')} 
                          className={`dropdown-items ${isDropdownItemActive('analytics') ? 'active' : ''}`}>
                      <BarChart3 size={20} />
                      <span>Analytics</span>
                    </Link>

                    <Link to="/customers" onClick={() => handleMoreMenuItemClick('customers')} 
                          className={`dropdown-items ${isDropdownItemActive('customers') ? 'active' : ''}`}>
                      <Users size={20} />
                      <span>Customers</span>
                    </Link>

                    <Link to="/segments" onClick={() => handleMoreMenuItemClick('segments')} 
                          className={`dropdown-items ${isDropdownItemActive('segments') ? 'active' : ''}`}>
                      <Tag size={20} />
                      <span>Segments</span>
                    </Link>

                    <Link to="/spinners-and-dyers" onClick={() => handleMoreMenuItemClick('manufactures')} 
                          className={`dropdown-items ${isDropdownItemActive('manufactures') ? 'active' : ''}`}>
                      <Factory size={20} />
                      <span>Spinners & Dyers</span>
                    </Link>

                    <Link to="/users" onClick={() => handleMoreMenuItemClick('users')} 
                          className={`dropdown-items ${isDropdownItemActive('users') ? 'active' : ''}`}>
                      <UserCheck size={20} />
                      <span>Users</span>
                    </Link>
                  </div>
                </div>
              )}
          </ul>

          {/* Desktop menu */}
          <ul className='desktop-menu'>
            <li className={`menu-item ${selected === 'dashboard' ? 'selected' : ''}`}>
              <Link to={'/dashboard'} className='menu-link'>
                <button onClick={() => setSelected('dashboard')} className='menu-button'>
                  <span className='menu-icon'><Home size={22} /></span>
                  <span className='menu-text'>Dashboard</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'orders' ? 'selected' : ''}`}>
              <Link to={'/orders'} className='menu-link'>
                <button onClick={() => setSelected('orders')} className='menu-button'>
                  <span className='menu-icon'><ShoppingCart size={22} /></span>
                  <span className='menu-text'>Orders</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'vendors' ? 'selected' : ''}`}>
              <Link to={'/vendor-order'} className='menu-link'>
                <button onClick={() => setSelected('vendors')} className='menu-button'>
                  <span className='menu-icon'><Factory size={22} /></span>
                  <span className='menu-text'>Vendor Orders</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'products' ? 'selected' : ''}`}>
              <Link to={'/products'} className='menu-link'>
                <button onClick={() => setSelected('products')} className='menu-button'>
                  <span className='menu-icon'><Package size={22} /></span>
                  <span className='menu-text'>Products</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'inventory' ? 'selected' : ''}`}>
              <Link to={'/inventory'} className='menu-link'>
                <button onClick={() => setSelected('inventory')} className='menu-button'>
                  <span className='menu-icon'><ClipboardList size={22} /></span>
                  <span className='menu-text'>Inventory</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'colorlibrary' ? 'selected' : ''}`}>
              <Link to={'/colorlibrary-products'} className='menu-link'>
                <button onClick={() => setSelected('colorlibrary')} className='menu-button'>
                  <span className='menu-icon'><Palette size={22} /></span>
                  <span className='menu-text'>Color Library</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'analytics' ? 'selected' : ''}`}>
              <Link to={'/analytics'} className='menu-link'>
                <button onClick={() => setSelected('analytics')} className='menu-button'>
                  <span className='menu-icon'><BarChart3 size={22} /></span>
                  <span className='menu-text'>Analytics</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'discount' ? 'selected' : ''}`}>
              <Link to={'/discounts'} className='menu-link'>
                <button onClick={() => setSelected('discount')} className='menu-button'>
                  <span className='menu-icon'><Percent size={22}/></span>
                  <span className='menu-text'>Discount</span>
                </button>
              </Link>
            </li>

            
            <li className={`menu-item ${selected === 'customers' ? 'selected' : ''}`}>
              <Link to={'/customers'} className='menu-link'>
                <button onClick={() => setSelected('customers')} className='menu-button'>
                  <span className='menu-icon'><Users size={22}/></span>
                  <span className='menu-text'>Customers</span>
                </button>
              </Link>
            </li>

            {/* Customer section with submenu */}
            {/* <li className={`menu-item submenu-parent ${selected === 'customers' || selected === 'segments' ? 'selected' : ''}`}> */}
              {/* <div className='submenu-container'> */}
                {/* <Link to={'/customers'} className='menu-link'>
                  <button onClick={() => setSelected('customers')} className='menu-button'>
                    <span className='menu-icon'><Users size={22} /></span>
                    <span className='menu-text'>Customers</span>
                    <span className='submenu-arrow' onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCustomerSubmenu();
                    }}>
                      {isCustomerSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  </button>
                </Link> */}
                
                {/* {isCustomerSubmenuOpen && (
                  <div className='submenu'>
                    <Link to={'/segments'} className='submenu-link'>
                      <button 
                        onClick={() => setSelected('segments')} 
                        className={`submenu-button ${selected === 'segments' ? 'selected' : ''}`}
                      >
                        <span className='submenu-icon'><Tag size={18}/></span>
                        <span className='submenu-text'>Segments</span>
                      </button>
                    </Link>
                  </div>
                )} */}
              {/* </div> */}
            {/* </li> */}

            <li className={`menu-item ${selected === 'segments' ? 'selected' : ''}`}>
              <Link to={'/segments'} className='menu-link'>
                <button onClick={() => setSelected('segments')} className='menu-button'>
                  <span className='menu-icon'><Tag size={22}/></span>
                  <span className='menu-text'>Segments</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'manufactures' ? 'selected' : ''}`}>
              <Link to={'/spinners-and-dyers'} className='menu-link'>
                <button onClick={() => setSelected('manufactures')} className='menu-button'>
                  <span className='menu-icon'><Factory size={22}/></span>
                  <span className='menu-text'>Spinners & Dyers</span>
                </button>
              </Link>
            </li>

            <li className={`menu-item ${selected === 'users' ? 'selected' : ''}`}>
              <Link to={'/users'} className='menu-link'>
                <button onClick={() => setSelected('users')} className='menu-button'>
                  <span className='menu-icon'><UserCheck size={22}/></span>
                  <span className='menu-text'>Users</span>
                </button>
              </Link>
            </li>
          </ul>
        </div>

        {/* Bottom section */}
        <div className='sidebar-footer'>
          <div className={`footer-menu ${selected === 'reportbug' ? 'selected' : ''}`}>
            <Link to={'/reportbug'} className='menu-link'>
              <button onClick={() => setSelected('report')} className='menu-button footer-button'>
                <span className='menu-icon'><Bug size={22}/></span>
                <span className='menu-text'>Report a bug</span>
              </button>
            </Link>

            <button onClick={handleLogout} className='menu-button logout-button'>
              <span className='menu-icon'><LogOut size={22} /></span>
              <span className='menu-text'>Log out</span>
            </button>
          </div>

          <ModalLogout
            isOpen={isModalOpen}
            onConfirm={confirmLogout}
            onCancel={closeModal}
          />

          {isLoggedOut && <p className='logout-message'>You have been logged out successfully.</p>}
        </div>
      </div>
    );
};

export default SideBar;