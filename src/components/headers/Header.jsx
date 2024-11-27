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


const Header = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        console.log('hello')
      setAnchorEl(null);
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

                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            slotProps={{
                            paper: {
                                elevation: 0,
                                sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                                },
                            },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleClose}>
                            <Avatar /> Profile
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                            <Avatar /> My account
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <PersonAdd fontSize="small" />
                            </ListItemIcon>
                            Add another account
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                            </MenuItem>
                        </Menu>

                        </button>
                       
                        
                    </div>

                </div>


            </div>
        </header>
   
   </>
  )
}

export default Header