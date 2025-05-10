import { Avatar } from 'react'
import React , {useState , useEffect } from 'react'
import { LuHome } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import "./ProfilePage.css"
import { BsCheckCircleFill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import SubmitBtn from '../../../components/Buttons/Submit/SubmitBtn';
import { useNavigate } from 'react-router-dom';
import { addUser, getUserById, updateUser } from '../../../services/UserService';
import {Modal, Button, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';


const ProfilePage = ({setIsAuthenticated}) => {

  const navigate = useNavigate()

  const [imageSrc, setImageSrc] = useState("/Avatar.png");

  const [modalShow,setModalShow] = useState('')

  const  [password,setPassword] = useState('')


  const [showToast, setShowToast] = useState(false);


  const userDetails =  JSON.parse(localStorage.getItem('userData'));


  const [formData,setFormData] = useState({
     firstName:  userDetails.firstName || '',
     lastName: userDetails.lastName || '',
     company:  userDetails.company || '',
     country:  userDetails.country || '',
     whatsappNumber:  userDetails.whatsappNumber || '',
     phoneNumber:  userDetails.phoneNumber || '',
     email:  userDetails.email || '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

//   const [user,setUser] = useState('')

//    useEffect(() => {
//         const fetchData = async () => {
//         try {
//             const data = await getUserById(userDetails.userId);
//             setUser(data.data)
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         }
//         };
    
//         fetchData(); 
//     }, []); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData")
    setIsAuthenticated(false);
    navigate("/")
  };


  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata", 
  });


  const handleClose = () =>{
    setModalShow(!modalShow)
  }

  const handlePasswordChange = async() =>{
    const body = 
        {
            "firstName": userDetails.firstName,
            "lastName": userDetails.lastName,
            "phoneNumber": userDetails.phoneNumber,
            "password":password,
            "whatsappNumber": userDetails.whatsappNumber,
            "adharNumber" : userDetails.adharNumber,
            "adharDocumentUploadLink" :userDetails.adharDocumentUploadLink,
            "email": userDetails.email,
            "company": userDetails.company,
            "userAddress": userDetails.userAddress,
            "street": userDetails.street,
            "city": userDetails.city,
            "state": userDetails.state,
            "country": userDetails.country,
            "zipcode": userDetails.zipcode,
            "userStatus": userDetails.userStatus,
            "role": userDetails.role,
        }

         try {
            await updateUser(userDetails.userId, body);
            navigate('/users');
        } catch (error) {
            console.error("Error submitting user:", error);
        } 
  }


  const handleSubmit = async() => {
    const body = 
    {
        "firstName": formData.firstName,
        "lastName": formData.lastName,
        "phoneNumber": formData.phoneNumber,
        "whatsappNumber": formData.whatsappNumber,
        "adharNumber" : userDetails.adharNumber,
        "adharDocumentUploadLink" :userDetails.adharDocumentUploadLink,
        "email": formData.email,
        "company": formData.company,
        "userAddress": userDetails.userAddress,
        "street": userDetails.street,
        "city": userDetails.city,
        "state": userDetails.state,
        "country": formData.country,
        "zipcode": userDetails.zipcode,
        "userStatus": userDetails.userStatus,
        "role": userDetails.role,
    }

     try {
        await updateUser(userDetails.userId,body);

        const response = await getUserById(userDetails.userId)

        localStorage.setItem("userData", JSON.stringify(response.data));

        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);

        
    } catch (error) {
        console.error("Error submitting user:", error);
    } 
  }

  console.log(formData)

  
  return (
    <div className='profile-page'>
        <div className='d-flex justify-content-between'>
            <div>
                <h5>Welcome , {userDetails.firstName} {" "} {userDetails.lastName}</h5>
                <h6 className='text-primary'>{today}</h6>
            </div>
           
            <button className='btn btn-sm btn-outline-danger h-50' onClick={handleLogout}>Log out</button>

        </div>


        <div className='position-relative bg-white mt-3 main-sec'>
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
                <h5> {userDetails.firstName+" "+userDetails.lastName}</h5>
                <p className='text-secondary-subtle'>{userDetails.email}</p>
                <p className='text-primary'>{userDetails.role}</p>
                </div>

                <div className='go-home'>
                {/* <button style={{width:'8rem'}} className='btn btn-sm btn-primary d-flex gap-2 align-items-center d-flex align-items-center' onClick={()=>navigate("/dashboard")}>
                    Go to home
                    <span><LuHome size={20} /></span>
                </button> */}


                <button className='btn btn-sm btn-primary mt-3' onClick={handleClose}>Change Password</button>
                </div>

            </div>


            <Modal show={modalShow} onHide={handleClose}>
                <ModalHeader closeButton>
                    <ModalTitle>Password Change</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='d-flex align-items-center gap-2'>
                        <label>New Password</label>
                        <input className='w-75 rounded-1 p-1' onChange={(e)=>setPassword(e.target.value)}></input>
                    </div>
                </ModalBody>
                <ModalFooter className='d-flex justify-content-between'>
                    <Button size='sm' variant='secondary' onClick={handleClose}>Cancel</Button>
                    <Button size='sm' onClick={handlePasswordChange}>Submit</Button>
                </ModalFooter>
            </Modal>

            <div className='row p-3'>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>First Name</label>
                    <input type='text' name='firstName' className='rounded mt-2' value={formData.firstName} onChange={handleInputChange}></input>
                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Last Name</label>
                    <input type='text' name='lastName' className='rounded mt-2' value={formData.lastName} onChange={handleInputChange}></input>
                </div>

                {/* <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Password</label>
                    <input type='password' className='rounded mt-2' ></input>
                </div> */}

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Company</label>
                    <input type='text' name='company' className='rounded mt-2' value={formData.company} onChange={handleInputChange}></input>
                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Country</label>
                    <input type='text' name='country' className='rounded mt-2' value={formData.country} onChange={handleInputChange}></input>
                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Calling Number</label>
                    <input type='text' name='phoneNumber' className='rounded mt-2' value={formData.phoneNumber} onChange={handleInputChange}></input>
                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Whatsapp Number</label>
                    <input type='text' name='whatsappNumber' className='rounded mt-2' value={formData.whatsappNumber} onChange={handleInputChange}></input>

                </div>

                <div className='col-lg-6 d-flex flex-column mt-2'>
                    <label>Email</label>
                    <input type='text' name='email' className='rounded mt-2' value={formData.email} onChange={handleInputChange}></input>

                </div>

                {/* Save Button */}
      <div className='d-flex justify-content-end mt-3'>
        <button className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>
      </div>

      {/* Toast */}
      {showToast && (
  <div
    className="position-fixed top-0 end-0 toast show custom-toast"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    style={{ zIndex: 9999 }}
  >
    <div className="d-flex align-items-center h-100 px-3">
    <BsCheckCircleFill className="me-2 toast-icon" />
    <span className="fs-6 fw-medium text-center">Profile updated successfully!</span>
    </div>
  </div>
)}

            </div>

            {/* <div className='p-3 w-75'>
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
            </div> */}




        </div>


    </div>
  )
}

export default ProfilePage