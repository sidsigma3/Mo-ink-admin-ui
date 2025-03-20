import React ,{useState} from 'react'
import "./SignupPage.css"
import ToggleBtn from '../../../../components/Buttons/ToggleButton/ToggleBtn'
import { addUser } from '../../../../services/UserService'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignupPage = ({ togglePage ,isLogin}) => {

     const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
        const signupData = {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          phoneNumber: formData.get('phoneNumber'),
          whatsappNumber: formData.get('whatsappNumber'),
          email: formData.get('email'),
          password: formData.get('password'),
          company: formData.get('company'),
          userAddress: formData.get('userAddress'),
          city: formData.get('city'),
          state: formData.get('state'),
          country: formData.get('country'),
          zipcode: formData.get('zipcode'),
          userStatus: "ACTIVE",
          role:"SALES"
        };
      
        try {
          const response = await addUser(signupData);
      
          if (response) {
            alert('Signup successful!');
            e.target.reset();  // Clear form on success
          }
        } catch (error) {
          console.error('Signup Error:', error);
          alert('An error occurred during signup. Please try again.');
        }
      };

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

                <form onSubmit={handleSignup} className='signup-form'>

                    {/* Name Fields */}
                    <div className='row g-3 mt-2'>
                    <div className='d-flex flex-column gap-2 mt-4 flex-grow-1 col-6'>
                        <label>First Name</label>
                        <input
                        name='firstName'
                        className='login-input rounded-pill'
                        placeholder='Enter your First Name'
                        required
                        />
                    </div>

                    <div className='d-flex flex-column gap-2 mt-4 flex-grow-1 col-6'>
                        <label>Last Name</label>
                        <input
                        name='lastName'
                        className='login-input rounded-pill'
                        placeholder='Enter your Last Name'
                        required
                        />
                    </div>
                    </div>

                    <div className='row g-3 mt-2'>
                    <div className='d-flex flex-column gap-2 mt-4 flex-grow-1 col-6'>
                    <label>Phone Number</label>
                    <input
                        name='phoneNumber'
                        type='tel'
                        className='login-input'
                        placeholder='Enter your Phone Number'
                        required
                    />
                    </div>

                    <div className='d-flex flex-column gap-2 mt-4 flex-grow-1 col-6'>
                    <label>WhatsApp Number</label>
                    <input
                        name='whatsappNumber'
                        type='tel'
                        className='login-input'
                        placeholder='Enter your WhatsApp Number'
                        required
                    />
                    </div>
                    </div>

                    {/* Email */}
                    <div className='d-flex flex-column gap-2 mt-4'>
                    <label>Email</label>
                    <input
                        name='email'
                        type='email'
                        className='login-input'
                        placeholder='Enter your Email'
                        required
                    />
                    </div>

                    {/* Password */}
                    <div className='d-flex flex-column gap-2 mt-4  position-relative'>
                    <label>Password</label>
                    <input
                        name='password'
                        type={showPassword ? "text" : "password"}
                        className='login-input'
                        placeholder='Enter your Password'
                        minLength={6}
                        required
                    />
                    <span
                        className="position-absolute end-0 translate-middle-y me-3"
                        style={{ cursor: "pointer", top:'3.5rem' }}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    </div>

                    {/* Address */}
                    <div className='d-flex flex-column gap-2 mt-4'>
                    <label>Address</label>
                    <input
                        name='userAddress'
                        className='login-input'
                        placeholder='Enter your Address'
                        required
                    />
                    </div>

                    {/* Location */}
                    <div className='row g-3 mt-2'>
                    <div className='d-flex flex-column gap-2 flex-grow-1 col-6'>
                        <label>City</label>
                        <input name='city' className='login-input' placeholder='Enter your City' required />
                    </div>

                    <div className='d-flex flex-column gap-2 flex-grow-1 col-6'>
                        <label>State</label>
                        <input name='state' className='login-input' placeholder='Enter your State' required />
                    </div>
                    </div>

                    <div className='row g-3 mt-2'>
                    <div className='d-flex flex-column gap-2 flex-grow-1 col-6'>
                        <label>Country</label>
                        <input name='country' className='login-input' placeholder='Enter your Country' required />
                    </div>

                    <div className='d-flex flex-column gap-2 flex-grow-1 col-6'>
                        <label>Zipcode</label>
                        <input
                        name='zipcode'
                        type='text'
                        className='login-input'
                        placeholder='Enter your Zipcode'
                        required
                        />
                    </div>
                    </div>

                    {/* Company */}
                    <div className='d-flex flex-column gap-2 mt-4'>
                    <label>Company</label>
                    <input
                        name='company'
                        className='login-input'
                        placeholder='Enter your Company'
                        required
                    />
                    </div>

                    {/* Submit Button */}
                    <button type='submit' className='btn btn-primary rounded-pill w-100 mt-4'>Register</button>
                    </form>

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