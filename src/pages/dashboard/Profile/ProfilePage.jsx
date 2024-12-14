import { Avatar } from '@mui/material'
import React , {useState} from 'react'
import { LuHome } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import "./ProfilePage.css"
import { MdEdit } from "react-icons/md";
import SubmitBtn from '../../../components/Buttons/Submit/SubmitBtn';

const ProfilePage = ({setIsAuthenticated}) => {

  const [imageSrc, setImageSrc] = useState("/Avatar.png");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <div className='profile-page'>
        <div className='d-flex justify-content-between'>
            <div>
                <h5>Welocme , Johny Larsen</h5>
                <h6 className='text-primary'>Thrusday , 06 Dec 2024</h6>
            </div>
           
            <button className='btn btn-outline-danger h-50' onClick={handleLogout}>Log out</button>

        </div>


        <div className='position-relative bg-white mt-3'>
            <div>
                <img className='profile-cover' style={{width:'100%'}} src='/profile-cover-pic.png'></img>
            </div>

            <div className="position-absolute avatar-container avatar">
            <label htmlFor="file-input" className="avatar">
                <img src={imageSrc} alt="Avatar" />
                <div className="edit-overlay">
                <MdEdit />
                <text style={{fontSize:'0.7rem'}}>Change Profile pic</text>
                <i className="fas fa-edit"></i>
                </div>
            </label>
            <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
            />
            </div>

            {/* <div className='position-absolute avatar' >
                <img  src='/Avatar.png'></img>
            </div> */}

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

                <div className='d-flex justify-content-end mt-3'>
                    <SubmitBtn text={'Save'}></SubmitBtn>
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