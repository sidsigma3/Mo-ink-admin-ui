import React ,{useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./ForgotPassword.css"
import { forgotPassword } from '../../../../services/LoginService';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const accountType = "USER"; 
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await forgotPassword({ email, accountType });
            setMessage("Password reset instructions sent to your email.");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError("Something went wrong. Please check your email and try again.");
            console.error(err);
        }
    };


    return (
    <div className="forgot-wrapper d-flex align-items-center justify-content-center px-3">
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
    <div className="forgot-card bg-opacity-40 border border-3 border-white p-4 p-sm-4 rounded-5 text-white position-relative z-2">
    <button
        className="btn btn-link text-white fw-normal text-decoration-none p-0 mb-3"
        onClick={() => navigate("/")}
      >
        &larr; Back to Login
      </button>

     
      <h3 className="text-start fw-bold mb-2">Forgot your password?</h3>
      

      <p className="text-start fs-6 fw-light text-white small mb-5">
      Don't worry it happens to all of us, Enter your email below to recover your password.
      </p>

      <form onSubmit={handleSubmit}>
        <label className="fs-6 fw-normal text-white form-label">Email Address</label>
        <input
          type="text"
          placeholder="Enter your email address"
          className="fs-6 fw-light form-control mb-4 rounded-pill px-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}    
          required  
    

          />

        <button type="submit" className="btn btn-purple w-100 rounded-pill fw-medium"
        >
          Submit
        </button>
                    {message && <p className="text-green-400 text-sm mt-4">{message}</p>}
                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        

      </form>
    </div>
    </div>

);
};

export default ForgotPassword;