import React from 'react'
import "./VerifyCode.css"

const VerifyCode = () => {
  return (
    <div className='verify-page'>
        <div className='verify-page-ctn'>

            <div className='logo-ctn'>
                <img src='logo.png'></img>
            </div>


            <div className='left-ctn'>
            <div>
                    <span></span>
                    <h6>Back to login</h6>
                </div>

                <h4 className='mt-3'>Verify code</h4>
                <h5 className='mt-3'>An authentication code has been sent to your email. </h5>


                <div className='d-flex flex-column gap-2 mt-5'>
                    <label>Enter code</label>
                    <input className='login-input' placeholder='Enter valid verification code'></input>
                </div>

                <button className='btn btn-primary rounded-pill w-100 mt-4'>Verify</button>

                <h5 className='mt-3'>Didn't receive a code ? <a>resend</a></h5>

                <h6 className='mt-3 text-center text-body-tertiary'>Or login with</h6>

                <div>
                
                </div>
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

export default VerifyCode