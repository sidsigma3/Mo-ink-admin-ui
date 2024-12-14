import React ,{useState} from 'react'
import { Link } from 'react-router-dom'
import "./header.css"
import SearchBox from '../SearchBox/SearchBox'
import { FaRegBell } from "react-icons/fa6";

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
import { useNavigate } from 'react-router-dom';


const Header = () => {

    const navigate = useNavigate ()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        navigate('/profile')

    };

    



  return (
   <>
        <header className='shadow-sm'>
            <div className='container-fluid d-flex align-items-center px-4'>
                <div className='d-flex align-items-center justify-content-between w-100'>
                    <div className='logo-ctn'>
                        <Link to={'/'}><img src='./logo.png' className='logo'></img></Link>
                    </div>

                    {/* <div className='col-sm-6 col-lg-6 d-flex align-items-center'>
                        <SearchBox></SearchBox>
                    </div> */}

                    {/* <div className='col-sm-1 col-lg-1 d-flex align-items-center justify-content-center bell-icon'>
                       
                   
                    </div> */}

                    <div className='myAcc-ctn d-flex align-items-center justify-content-center gap-4'>
                        <button>
                            <FaRegBell size={25} />
                        </button>

                        <button className='avatar-mob' onClick={handleClick} > <img src='./profile-pic.png'></img></button>

                        <button className='d-flex myAcc align-items-center gap-2 w-100 justify-content-center' onClick={handleClick} > <img src='./profile-pic.png'></img>
                        
                        <div className='profile-ctn'>
                            <h4>Johny Larsen</h4>
                            <p>Admin</p>
                        </div>

                        </button>
                       
                        
                    </div>

                </div>


            </div>
        </header>
   
   </>
  )
}

export default Header