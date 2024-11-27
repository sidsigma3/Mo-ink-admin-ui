import React from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import StatusFilter from '../../../components/Filter/DayFilter/StatusFilter/StatusFilter';
import "./AddCustomerPage.css"
import AddBtn from '../../../components/Buttons/Add/AddBtn';
import { RiFilePaper2Line } from "react-icons/ri";


const AddCustomerPage = () => {

  const navigate =useNavigate()



  return (
    <div className='add-customer'>
      <div className="top d-flex gap-3" style={{ cursor: "pointer" }}>
        <span onClick={() => navigate("/customers")}>
          <IoArrowBackOutline size={25} />
        </span>
        <h5>New Customer</h5>
      </div>

        <div className='main d-flex gap-4'>

            <div className='left'>

                <div className='customer-overview row bg-white p-3 gy-2'>
                    <div className='col-md-6 d-flex flex-column'>
                        <label>First Name</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-6 d-flex flex-column'>
                        <label>Last Name</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-6 d-flex flex-column'>
                        <label>Language</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-6 d-flex flex-column'>
                        <label>Phone No.</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-12 d-flex flex-column'>
                        <label>Email</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-6 d-flex flex-column'>
                        <label>Company</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-6 d-flex flex-column'>
                        <label>GSTIN No.</label>
                        <input className='fs-6 ps-2' type='text' placeholder='Add GSTIN No. to authonticate '></input>
                    </div>

                    <div className="media-input-ctn mt-5 p-2 col-md-12">
                    
                    <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
                    <input type="file" ></input>
                    <h4>Add photo of cancelled cheque </h4>
                    </div>
                    </div>

                    <div className='col-md-12 d-flex flex-column'>
                        <label>Address</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-12 d-flex flex-column'>
                        <label>Apartment,suite,etc</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-6 d-flex flex-column'>
                        <label>Country/Region</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-6 d-flex flex-column'>
                        <label>State</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-6 d-flex flex-column'>
                        <label>City</label>
                        <input type='text'></input>
                    </div>

                    <div className='col-md-6 d-flex flex-column'>
                        <label>PIN code</label>
                        <input type='text'></input>
                    </div>





                </div>


                <div className='bg-white mt-2 p-3 w-100'>
                    <div className='d-flex justify-content-between'>
                    <h5>Manage Wallet</h5>
                    <AddBtn></AddBtn>
                    </div>


                    <div className='py-5 text-body-tertiary d-flex flex-column justify-content-center align-items-center'>
                    <RiFilePaper2Line  size={50}/>
                    <h5 className='fs-6'>There's no transaction till now!</h5>
                    </div>
                </div>




            </div>


            <div className='right'>
            <div className='bg-white p-2 rounded'>
                <h5>Status</h5>
                <StatusFilter status={"Active"} ></StatusFilter>
            </div>
            </div>

        </div>




    </div>
  )
}

export default AddCustomerPage