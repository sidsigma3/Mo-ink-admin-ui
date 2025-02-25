import React ,{useState} from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import {  useNavigate ,useLocation} from 'react-router-dom';
import { useCustomerContext } from '../../../components/Context/CustomerContext';
import AddBtn from '../../../components/Buttons/Add/AddBtn';
import DeleteBtn from '../../../components/Buttons/Delete/DeleteBtn';
import { Dropdown, Table } from 'react-bootstrap';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import "./AddSpinners.css"
import { useSpinnerDyers } from '../../../components/Context/SpinnersAndDyersContext';
import { RiFilePaper2Line } from "react-icons/ri";
import SubmitBtn from '../../../components/Buttons/Submit/SubmitBtn';
import { addVendor, updateVendor } from '../../../services/VendorsService';

const AddSpinners = () => {
  
  const navigate = useNavigate ()
  const { state } = useLocation();

  const {index,data} = state || {}

  const customer = state?.index !== undefined ? data[index] : null;

  const [manageWallet,setManageWallet] = useState(false)

  const [status,setStatus] = useState(customer?.status || 'Active')

  const [tag,setTag] = useState (customer?.tag || 'Spinner')  
                                                   
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    whatsapp: customer?.whatsappNumber || "",
    phone: customer?.phoneNumber || "",
    email: customer?.email || "",
    company: customer?.company || "",
    gstin: customer?.gstNumber || "",
    chequePhoto: null,
    address: customer?.address || "",
    apartment: customer?.street || "",
    country: customer?.country || "",
    state: customer?.state || "",
    city: customer?.city || "",
    pinCode: customer?.zipcode || "",
    
  });

  const handleAddWallet = () =>{
    setManageWallet(!manageWallet)
   }


  const handleStatusChange = (stat) =>{
     setStatus(stat)
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Handle file input separately
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

      if (state?.index !== undefined) {

        const newCustomer = {
            firstName: formData.firstName, 
            lastName:formData.lastName,
            email: formData.email,
            phoneNumber: formData.phone,
            whatsappNumber:formData.whatsapp,
            gstNumber:formData.gstin,
            status:status.toUpperCase(),
            vendorType:tag.toUpperCase(),
            zipcode:formData.pinCode,
            street:formData.apartment,
            ...formData,
          };
      

        await updateVendor(customer.vendorId,newCustomer);
        
      } else {
        
        const newCustomer = {
            firstName: formData.firstName, 
            lastName:formData.lastName,
            email: formData.email,
            phoneNumber: formData.phone,
            whatsappNumber:formData.whatsapp,
            gstNumber:formData.gstin,
            status:status.toUpperCase(),
            vendorType:tag.toUpperCase(),
            zipcode:formData.pinCode,
            street:formData.apartment,
            ...formData,
          };
        
          await addVendor(newCustomer)

      }

      navigate('/spinners-and-dyers')
};


const handleTag = (value) =>{
    setTag(value)
}
  
    return (
    <div className='add-spinners'>
        <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
        <span onClick={() => navigate("/spinners-and-dyers")}>
          <IoArrowBackOutline size={25} />
        </span>
        <h5>New Spinners & Dyers</h5>
      </div>

      <div className='main d-flex gap-3 mt-2'>

    <div className='left'>

    <div className='customer-overview row bg-white p-3 gy-2 rounded'>
    <div className="col-md-6 d-flex flex-column">
        <label>First Name</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>Last Name</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>Whatsapp No.</label>
        <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>Calling No.</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
    </div>

    <div className="col-md-12 d-flex flex-column">
        <label>Email</label>
        <input type="text" name="email" value={formData.email} onChange={handleChange} />
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>Company</label>
        <input type="text" name="company" value={formData.company} onChange={handleChange} />
    </div>

    <div className="col-md-6 d-flex flex-column">
        <label>GSTIN No.</label>
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


    <div className='bg-white mt-2 p-3 w-100 rounded'>
        <div className='d-flex justify-content-between'>
        <h5>Assign Order</h5>

        </div>

        <div className="py-5 text-body-tertiary d-flex flex-column justify-content-center align-items-center">
                <RiFilePaper2Line size={50} />
                <h5 className="fs-6">There's no transaction till now!</h5>
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
            <StatusFilter status={status} onStatusChange={handleStatusChange}></StatusFilter>
        </div>

        <div className='bg-white p-3 rounded mt-2'>
            <h5>Tag</h5>
            <Dropdown   onSelect={handleTag} className='mt-3'>
            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center justify-content-between gap-2 w-100 mt-1">
                <p className="m-0">{tag}</p>
            </Dropdown.Toggle>

            <Dropdown.Menu className='w-100'>
                <Dropdown.Item eventKey="Spinner">Spinner</Dropdown.Item>
                <Dropdown.Item eventKey="Dyer">Dyer</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </div>

    </div>

    </div>

        


    </div>
  )
}

export default AddSpinners