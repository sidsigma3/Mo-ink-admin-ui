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
        <header>
            <div className='container-fluid d-flex align-items-center'>
                <div className='row d-flex align-items-center justify-content-between w-100'>
                    <div className='col-sm-2 col-lg-2 logo-ctn'>
                        <Link to={'/'}><img src='./logo.png' className='logo'></img></Link>
                    </div>

                    {/* <div className='col-sm-6 col-lg-6 d-flex align-items-center'>
                        <SearchBox></SearchBox>
                    </div> */}

                    {/* <div className='col-sm-1 col-lg-1 d-flex align-items-center justify-content-center bell-icon'>
                       
                   
                    </div> */}

                    <div className='col-sm-4 col-lg-3 myAcc d-flex align-items-center justify-content-center gap-2'>
                        <button>
                            <FaRegBell size={20} />
                        </button>

                        <button className='d-flex align-items-center gap-2 w-100 justify-content-center' onClick={handleClick} > <img src='./profile-pic.png'></img>
                        
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