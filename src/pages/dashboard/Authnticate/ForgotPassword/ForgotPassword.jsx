import React from 'react'
import "./ForgotPassword.css"


const ForgotPassword = () => {
  return (
    <div className='forgot-page'>

           


        <div className='forgot-page-ctn'>

        <div className='logo-ctn'>
                <img src='logo.png'></img>
            </div>
            <div className='left-cover-pic'>
                <img src='login-cover-pic.png'></img>
                <h4>Lorem ipsum dolor sit.</h4>
                <h5>Lorem ipsum dolor sit.</h5>
            </div>


            <div className='right-ctn'>
                <div>
                    <span></span>
                    <h6>Back to login</h6>
                </div>

                <h4 className='mt-3'>Forgot your password ?</h4>
                <h5 className='mt-3'>Don't worry it happens to all of us, Enter your email below to recover your password. </h5>


                <div className='d-flex flex-column gap-2 mt-5'>
                    <label>Email address</label>
                    <input className='login-input' placeholder='Enter your Email adress'></input>
                </div>

                <button className='btn btn-primary rounded-pill w-100 mt-4'>Submit</button>

                <h6 className='mt-3 text-center text-body-tertiary'>Or login with</h6>

                <div>
                
                </div>

            </div>  

          


        

        </div>
    </div>
  )
}

export default ForgotPassword