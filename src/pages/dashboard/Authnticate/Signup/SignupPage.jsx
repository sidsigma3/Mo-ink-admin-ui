import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { addUser } from '../../../../services/UserService';
import emailjs from 'emailjs-com';
import ToggleBtn from '../../../../components/Buttons/ToggleButton/ToggleBtn';
import './SignupPage.css';
import Toast from '../../../../components/Toast/Toast';

const SignupPage = ({ togglePage, isLogin }) => {
  const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");
     const [showPassword, setShowPassword] = useState(false);
     const [error, setError] = useState("");
     const navigate = useNavigate();
     const [toasts, setToasts] = useState([]);

  

  const sendEmail = (email, name) => {
    emailjs
      .send(
        'service_g6l5hk7',
        'template_zy33see',
        { name, email },
        'LcIAnvNjmXt6o9EiS'
      )
      .then((response) => {
        console.log('Email sent successfully', response.status, response.text);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  const handleSignup = async (e) => {
     const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };
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
      userAddress: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      userStatus: 'ACTIVE',
      role: 'SALES',
    };

    try {
      const response = await addUser(signupData);
      if (response) {
        showToast('Signup successful!', 'success');
        e.target.reset();
        togglePage()
        // sendEmail(signupData.email, signupData.firstName);
      }
    } catch (error) {
      console.error('Signup Error:', error);
      showToast('An error occurred during signup. Please try again.', 'error');
    }
  };

  return (
    <div className="Signup-wrapper d-flex align-items-center justify-content-center px-3">
    <div className="background-blur"
       style={{
       backgroundImage: "url('/bg-texture.png')",
      }}
      >
      </div>


    {/* Logo */}
    <div className="position-absolute top-0 start-0 p-4 p-lg-5">
      <img src="logo.png" alt="Logo" className="logo-img mx-auto" />
    </div>

    {/* Auth Box */}
    <div className="signup-card bg-opacity-40 border border-3 border-white p-4 p-sm-4 rounded-5 text-white position-relative z-2">
      {/* <button
        className="btn btn-link text-white fw-normal text-decoration-none mb-3"
        onClick={() => navigate("/")}
      >
        &larr; Back to Login
      </button> */}

      <h3 className="text-center fw-bold mb-4">Welcome Team!</h3>

      <div className="toggle d-flex justify-content-center mb-4 bg-white rounded-pill overflow-hidden mx-auto toggle-btns">
        <button className="btn text-purple fw-medium w-50 rounded-pill"
         onClick={togglePage}
         >
          Login
        </button>
        <button
          className="btn btn-purple text-white fw-medium w-50 rounded-pill">
          Register
        </button>
      </div>

        <p className="text-center fs-6 fw-light text-white small mb-4 px-2">
          Become a part of Mo Ink and Dyes. Register now to manage your dashboard and lead every step from cone to customer.
        </p>

        <form onSubmit={handleSignup}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fs-6 fw-normal text-white form-label">First Name</label>
              <input
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                className="fs-6 fw-light form-control rounded-pill px-4"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="fs-6 fw-normal text-white form-label">Last Name</label>
              <input
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                className="fs-6 fw-light form-control rounded-pill px-4"
                required
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fs-6 fw-normal text-white form-label">Phone No.</label>
              <input
                name="phoneNumber"
                type="tel"
                placeholder="Enter your Phone No."
                className="fs-6 fw-light form-control rounded-pill px-4"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="fs-6 fw-normal text-white form-label">WhatsApp No.</label>
              <input
                name="whatsappNumber"
                type="tel"
                placeholder="Enter your WhatsApp No."
                className="fs-6 fw-light form-control rounded-pill px-4"
                required
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
            <label className="fs-6 fw-normal text-white form-label">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="fs-6 fw-light form-control rounded-pill px-4"
              required
            />
            </div>
            <div className="col-md">
            <label className="fs-6 fw-normal text-white form-label">Password</label>
                      <div className="position-relative mb-2">
                        <input
                          name='password'
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="fs-6 fw-light form-control rounded-pill px-4 pe-5"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md">
              <label className="fs-6 fw-normal text-white form-label">Company</label>
              <input
                name="company"
                type="text"
                placeholder="Enter your Company"
                className="fs-6 fw-light form-control rounded-pill px-4"
                required
              />
            </div>
            <div className="col-md">
              <label className="fs-6 fw-normal text-white form-label">Aadhar No.</label>
              <input
                name="adharNumber"
                type="text"
                placeholder="Enter valid Aadhar No."
                className="fs-6 fw-light form-control rounded-pill px-4"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-purple w-100 rounded-pill fw-medium mt-3"
          onClick={() => handleSignup}
          >
            Register
          </button>

        </form>
      </div>
      {/* Toast Notification */}
     <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() =>
                            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                        }
                    />
                ))}
            </div>
    </div>
  );
};

export default SignupPage;
