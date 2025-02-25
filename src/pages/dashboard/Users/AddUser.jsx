import React ,{useState} from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import { useSpinnerDyers } from '../../../components/Context/SpinnersAndDyersContext';
import "./AddUser.css"
import { Dropdown } from 'react-bootstrap';
import { FiShoppingCart } from "react-icons/fi";
import { addUser, updateUser } from '../../../services/UserService';
import DeleteBtn from '../../../components/Buttons/Delete/DeleteBtn';
import SubmitBtn from '../../../components/Buttons/Submit/SubmitBtn';

const AddUser = () => {

    const {state} = useLocation()
    const { index, users} = state || {};
    const navigate = useNavigate()
    const {data,setData} = useSpinnerDyers ()

    const customer = state?.index !== undefined ? users[index] : null;
    
    const [formData, setFormData] = useState({
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        whatsapp: customer?.whatsappNumber || "",
        phone: customer?.phoneNumber || "",
        email: customer?.email || "",
        password: customer?.password || "",
        company: customer?.company || "",
        gstin: customer?.gstin || "",
        chequePhoto: null,
        address: customer?.userAddress || "",
        apartment: customer?.street || "",
        country: customer?.country || "",
        state: customer?.state || "",
        city: customer?.city || "",
        pinCode: customer?.zipcode || "",
        status:customer?.userStatus || "ACTIVE",
        role:customer?.role || 'SALES',
      });
    

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
          ...formData,
          [name]: files ? files[0] : value, // Handle file input separately
        });
      };
    

      const handleRole = (selectedRole) => {
        setFormData(prev => ({
            ...prev,
            role: selectedRole // Update role with selected value
        }));
    };
    

      const handleSubmit = async(e) => {
        e.preventDefault();
    
          if (state?.index !== undefined) {
    
            const newUser = {
                firstName: formData.firstName,
                lastName:formData.lastName,
                email: formData.email,
                whatsappNumber:formData.whatsapp,
                phoneNumber: formData.phone,
                userAddress:formData,
                userStatus:formData.status,
                zipcode:formData.pinCode,
                userAddress:formData.address,
                street:formData.apartment,
                ...formData,
              };
          
            await updateUser(customer?.id,newUser);

          } else {
    
            const newUser = {
                firstName: formData.firstName,
                lastName:formData.lastName,
                email: formData.email,
                whatsappNumber:formData.whatsapp,
                phoneNumber: formData.phone,
                userAddress:formData,
                userStatus:formData.status,
                zipcode:formData.pinCode,
                userAddress:formData.address,
                street:formData.apartment,
                ...formData,
              };

            console.log(newUser)
              
            await addUser(newUser);
            
          }
    
         
          navigate('/users')
    };
    

  return (
    <div className='add-user'>

        {state?.index !== undefined ? (
             <div className='d-flex gap-3 mb-3'> 
                 <span onClick={() => navigate("/users")}>
                 <IoArrowBackOutline size={25} />
                 </span>
             <h4>{formData.firstName + " "+formData.lastName}</h4>
             <div
                     style={{
                         width: '5rem',
                         padding: '0.2rem 0.4rem',
                         border: '1px solid',
                         borderRadius: '0.2rem',
                         textAlign: 'center',
                         backgroundColor:
                             formData.role.toLowerCase() === 'owner'
                             ? '#FEDBDC'
                             :  formData.role.toLowerCase() === 'admin'
                             ? '#DBEAFE'
                             :  formData.role.toLowerCase() === 'sales'
                             ? '#FFECFA'
                             : '#FFFFFF', // Default background color if none match
                         borderColor:
                             formData.role.toLowerCase() === 'owner'
                             ? '#FD9395'
                             :  formData.role.toLowerCase() === 'admin'
                             ? '#93C5FD'
                             :  formData.role.toLowerCase() === 'sales'
                             ? '#F75FFF'
                             : '#CCCCCC', // Default border color if none match
                         color:
                             formData.role.toLowerCase() === 'owner'
                             ? '#B91C1C' // Red text for Owner
                             :  formData.role.toLowerCase() === 'admin'
                             ? '#1E40AF' // Blue text for Admin
                             :  formData.role.toLowerCase() === 'sales'
                             ? '#7A1E7A' // Purple text for Sales
                             : '#000000', // Default text color if none match
                         }}
                 >
                     {
                         formData.role}
                         </div>
         </div>
        ):
        (
        <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
         <span onClick={() => navigate("/users")}>
          <IoArrowBackOutline size={25} />
            </span>
            <h5>New User</h5>
        </div>
        )}

    

      <div className='bottom d-flex gap-3'>
        <div className='left'>
        <div className='customer-overview rounded row bg-white p-3 gy-2'>
            <div className="col-md-6 d-flex flex-column">
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>WhatsApp No.</label>
                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Calling No.</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Password</label>
                <input type="text" name="password" value={formData.password} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Adhaar No.</label>
                <input
                className="fs-6 ps-2"
                type="text"
                name="gstin"
                value={formData.gstin}
                placeholder="Add GSTIN No. to authenticate"
                onChange={handleChange}
                />
            </div>

            <div className="media-input-ctn mt-5 p-2 col-md-12">
                <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
                <input type="file" name="chequePhoto" onChange={handleChange} />
                <h4>Add photo of a business PAN</h4>
                </div>
            </div>

            <div className="col-md-12 d-flex flex-column">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="col-md-12 d-flex flex-column">
                <label>Apartment, Suite, etc.</label>
                <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Country/Region</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>PIN code</label>
                <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} />
            </div>



            </div>

            <div className='d-flex justify-content-between mt-2'>
            <DeleteBtn></DeleteBtn>
            <SubmitBtn text={'Save'} clickFunction={handleSubmit}></SubmitBtn>
            </div>
    

        </div>

        <div className='right'>
            <div className='bg-white p-3 rounded'>
                <h5 className='mb-3'>Status</h5>
                <StatusFilter status={'Active'} ></StatusFilter>
            </div>

        <div className='bg-white p-3 rounded mt-2'>
            <h5>Role</h5>
            <Dropdown onSelect={handleRole}>
                <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2 w-100 mt-1">
                    {formData.role || "Select Role"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="SALES">Sales</Dropdown.Item>
                    <Dropdown.Item eventKey="ADMIN">Admin</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>

            {/* <div className='bg-white p-3 rounded mt-2 d-flex'>
               
                <div className="d-flex gap-3 position-relative" style={{ width: '100px', height: '100px' }}>
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle
                            cx="50"
                            cy="50"
                            r="35"
                            stroke="#B9C0CD"
                            stroke-width="5"
                            fill="none"
                            stroke-dasharray="240"
                            stroke-dashoffset="70"
                            />
                        </svg>

                       
                        <div
                            className="position-absolute d-flex justify-content-center align-items-center text-secondary"
                            style={{ top: 0, left: 0, width: '100%', height: '100%' }}
                        >
                            <FiShoppingCart size={23}/>
                        </div>
                        </div>


                        <h5>Total sales</h5>
            </div> */}
        </div>

      </div>

    </div>
  )
}

export default AddUser