import { Avatar } from '@mui/material'
import React from 'react'
import { LuHome } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import "./ProfilePage.css"

const ProfilePage = () => {
  return (
    <div className='profile-page'>
        <div>
            <h5>Welocme , Johny Larsen</h5>
            <h6 className='text-primary'>Thrusday , 06 Dec 2024</h6>
        </div>


        <div className='position-relative bg-white mt-3'>
            <div>
                <img className='profile-cover' style={{width:'100%'}} src='/profile-cover-pic.png'></img>
            </div>

            <div className='position-absolute avatar' >
                <img  src='/Avatar.png'></img>
            </div>

            <div className='d-flex justify-content-between profile-info'>
                <div>
                <h5> Johny Larsen</h5>
                <p className='text-secondary-subtle'>johnylarsen@gmail.com</p>
                <p className='text-primary'>Admin</p>
                </div>

                <div className='go-home'>
                <button className='btn btn-primary d-flex gap-2 align-items-center'>
                    Go to home
                    <span><LuHome size={20} /></span>
                </button>
                </div>

            </div>

            <div className='row p-3'>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>User Name</label>
                    <input type='text' className='rounded mt-2'></input>
                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Password</label>
                    <input type='password' className='rounded mt-2'></input>
                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Gender</label>
                    <input type='text' className='rounded mt-2'></input>
                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Country</label>
                    <input type='text' className='rounded mt-2'></input>
                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Calling Number</label>
                    <input type='text' className='rounded mt-2'></input>
                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Whatsapp Number</label>
                    <input type='text' className='rounded mt-2'></input>
                </div>



            </div>

            <div className='p-3 w-75'>
                <h5>My Email Address</h5>

                <div className='d-flex gap-3'>
                    <div style={{width:'3rem', height:'3rem'}} className='bg-secondary-subtle rounded-circle d-flex align-items-center text-primary justify-content-center'>
                    <MdEmail  size={25}/>
                    </div>

                    <div>
                    <p className='fw-semibold m-0'>johnylarsen@gmail.com</p>
                    <p className='text-secondary-subtle'>1 month ago</p>
                    </div>
                    
                </div>

                <div className='flex-grow-1'>
                    <button className='btn bg-secondary-subtle'>Add Email Address</button>
                </div>
            </div>




        </div>


    </div>
  )
}

export default ProfilePage