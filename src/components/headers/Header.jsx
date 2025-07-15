import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./header.css";
import SearchBox from '../SearchBox/SearchBox';
import { FaRegBell } from "react-icons/fa6";
import Notifications from '../Modal/Notifications';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

const Header = () => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const userDetails = JSON.parse(localStorage.getItem('userData'));


    const handleClick = (event) => {
        navigate('/profile');
    };


    return (
        <>
            <header className="shadow-sm position-relative z-40">
  <div className="container-fluid d-flex align-items-center px-4">
    <div className="d-flex align-items-center justify-content-between w-100">
      <div className="logo-ctn">
        <Link to={'/dashboard'}>
          <img src="./logo.png" className="logo" alt="Logo" />
        </Link>
      </div>
      
      <div className="myAcc-ctn  d-flex align-items-center justify-content-center gap-4 position-relative">
         {userDetails.role === "MASTER" && (
        <Notifications />
          )}

        <button className="avatar-mob" onClick={handleClick}>
          <img src="./profile-pic.png" alt="Profile" />
        </button>

        <button
          className="d-flex myAcc align-items-center gap-2 w-100 justify-content-center"
          onClick={handleClick}
        >
          <img src="./profile-pic.png" alt="Profile" />
          <div className="profile-ctn">
            <h4>{userDetails?.firstName} {userDetails?.lastName}</h4>
            <p>{userDetails?.role?.toLowerCase()}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</header>

        </>
    );
};

export default Header;
