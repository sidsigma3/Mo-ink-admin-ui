import React ,{useState} from 'react'
import "./SignupPage.css"
import ToggleBtn from '../../../../components/Buttons/ToggleButton/ToggleBtn'

const SignupPage = ({ togglePage ,isLogin}) => {



  return (
    <div className='signup-page'>
        <div className='signup-page-ctn'>

            <div className='logo-ctn'>
                <img src='logo.png'></img>
            </div>

            <div className='left-ctn'>
                
            <h6 className='welcome'>Welocme to Moink & dyes </h6>
                <ToggleBtn click={togglePage} status={!isLogin}></ToggleBtn>
                

                <h6 className='mt-3'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae minus optio voluptates!</h6>


                <div className='d-flex flex-column gap-2 mt-5'>
                    <label>User name</label>
                    <input className='login-input rounded-pill' placeholder='Enter your User name'></input>
                </div>

                <div  className='d-flex flex-column gap-2 mt-4'>
                    <label>Password</label>
                    <input type='password' className='login-input' placeholder='Enter your Password'></input>
                </div>


                <div className='d-flex justify-content-between mt-3'>
                    <div className='d-flex gap-2'>
                        <input type='checkbox'></input>
                        <label> Remember me</label>
                    </div>
                
                    <a>Forgot password ?</a>
                
                
                </div>


                <button  className='btn btn-primary rounded-pill w-100 mt-4'>Login</button>

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

export default SignupPage