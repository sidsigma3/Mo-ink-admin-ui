import React from 'react'
import "./ResetPassword.css"

const ResetPassword = () => {
  return (
    <div className='resetPass-page'>
        <div className='resetPass-page-ctn'>

        <div className='logo-ctn'>
                <img src='logo.png'></img>
            </div>


            <div className='left-ctn'>
            <div>
                    <span></span>
                    <h6>Back to login</h6>
                </div>

                <h4 className='mt-3'>Set a password</h4>
                <h5 className='mt-3'>Your previous password has been reseted. Please set a new password for your account.</h5>


                <div className='d-flex flex-column gap-2 mt-5'>
                    <label>Create password</label>
                    <input className='login-input' placeholder='Enter valid verification code'></input>
                </div>

                <div className='d-flex flex-column gap-2 mt-5'>
                    <label>Re-enter password</label>
                    <input className='login-input' placeholder='Enter valid verification code'></input>
                </div>

                <button className='btn btn-primary rounded-pill w-100 mt-4'>Save</button>

              

              
            </div>

        <div className='right-cover-pic'>
                <img src='signup-cover-pic.png'></img>
                <h4>Lorem ipsum dolor sit.</h4>
                <h5>Lorem ipsum dolor sit.</h5>
            </div>
        </div>

    </div>
  )
}

export default ResetPassword