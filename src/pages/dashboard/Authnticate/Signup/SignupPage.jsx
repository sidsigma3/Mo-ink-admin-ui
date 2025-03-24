import React ,{useState} from 'react'
import "./SignupPage.css"
import ToggleBtn from '../../../../components/Buttons/ToggleButton/ToggleBtn'
import { addUser } from '../../../../services/UserService'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import emailjs from 'emailjs-com';


const SignupPage = ({ togglePage ,isLogin}) => {

     const [showPassword, setShowPassword] = useState(false);


     const sendEmail = (email, name ) => {
        emailjs.send(
            "service_g6l5hk7",  
            "template_zy33see", 
            {
                name: name,
                email:email
            },
            "LcIAnvNjmXt6o9EiS" 
        ).then((response) => {
            console.log("Email sent successfully", response.status, response.text);
        }).catch((error) => {
            console.error("Error sending email:", error);
        });
    };

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
            adharNumber: formData.get('adharNumber'),
            userAddress: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
            userStatus: "ACTIVE",
            role: "SALES"
        };
    
        try {
            const response = await addUser(signupData);
    
            if (response) {
                alert('Signup successful!');
                e.target.reset();  // Clear form on success
    
                
                sendEmail(signupData.email, signupData.firstName);
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
                
                <form onSubmit={handleSignup} className='signup-form'>

                    {/* Name Fields */}
                    <div className='row g-3 mt-2'>
                    <div className='d-flex flex-column gap-2 mt-3 flex-grow-1 col-6'>
                        <label>First Name</label>
                        <input
                        name='firstName'
                        className='login-input rounded-pill'
                       
                        required
                        />
                    </div>

                    <div className='d-flex flex-column gap-2 mt-3 flex-grow-1 col-6'>
                        <label>Last Name</label>
                        <input
                        name='lastName'
                        className='login-input rounded-pill'
                       
                        required
                        />
                    </div>
                    </div>

                    <div className='row g-3 mt-2'>
                    <div className='d-flex flex-column gap-2 mt-3 flex-grow-1 col-6'>
                    <label>Phone No.</label>
                    <input
                        name='phoneNumber'
                        type='tel'
                        className='login-input'
                      
                        required
                    />
                    </div>

                    <div className='d-flex flex-column gap-2 mt-3 flex-grow-1 col-6'>
                    <label>WhatsApp No.</label>
                    <input
                        name='whatsappNumber'
                        type='tel'
                        className='login-input'
                      
                        required
                    />
                    </div>
                    </div>

                    {/* Email */}
                    <div className='d-flex flex-column gap-2 mt-3'>
                    <label>Email</label>
                    <input
                        name='email'
                        type='email'
                        className='login-input'
                       
                        required
                    />
                    </div>

                    {/* Password */}
                    <div className='d-flex flex-column gap-2 mt-3  position-relative'>
                    <label>Password</label>
                    <input
                        name='password'
                        type={showPassword ? "text" : "password"}
                        className='login-input'
                      
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

                    

                  
                    {/* <div className='d-flex flex-column gap-2 mt-3'>
                    <label>Address</label>
                    <input
                        name='userAddress'
                        className='login-input'
                        placeholder='Enter your Address'
                        required
                    />
                    </div>

                    
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
                    </div> */}


                    <div className='d-flex flex-column gap-2 mt-3'>
                    <label>Adhaar No.</label>
                    <input
                        name='adharNumber'
                        className='login-input'
                      
                        required
                    />
                    </div>

                    {/* Submit Button */}
                    <button type='submit' className='btn btn-primary rounded-pill w-100 mt-5'>Register</button>
                    </form>

              


                <div>
                    
                </div>
            </div>

            <div className='right-cover-pic'>
                <img src='signup-cover-pic.png'></img>
                {/* <h4>Lorem ipsum dolor sit.</h4>
                <h5>Lorem ipsum dolor sit.</h5> */}
            </div>


        </div>

    </div>
  )
}

export default SignupPage