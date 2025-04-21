import React ,{useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./ResetPassword.css"


const ResetPassword = () => {

const [username, setUsername] = useState("");
   
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

        useEffect(() => {
            axios
            .get("http://localhost:5000/auth/user", { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
        }, []);

        const handleLoginSuccess = (response) => {
            console.log("Login Success:", response);
            window.location.href = "http://localhost:5000/auth/google";
        };

        const handleLogout = () => {
            axios.get("http://localhost:5000/auth/logout", { withCredentials: true });
            setUser(null);
        };

    return (
    <div className="Reset-wrapper d-flex align-items-center justify-content-center px-3">
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
    <div className="Reset-card bg-opacity-40 border border-3 border-white p-4 p-sm-4 rounded-5 text-white position-relative z-2">
    <button
        className="btn btn-link text-white fw-normal text-decoration-none p-0 mb-3"
        onClick={() => navigate("/login")}
      >
        &larr; Back to Login
      </button>

     
      <h3 className="text-start fw-bold mb-2">Set a password</h3>
      

      <p className="text-start fs-6 fw-light text-white small mb-5">
      Your previous password has been reset. Please set a new password for your account.
      </p>

      <form>
        <label className="fs-6 fw-normal text-white form-label">New password</label>
        <input
          type="text"
          placeholder="Create a strong password"
          className="fs-6 fw-light form-control mb-4 rounded-pill px-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

<label className="fs-6 fw-normal text-white form-label">Confirm password</label>
        <input
          type="text"
          placeholder="Re-enter the password"
          className="fs-6 fw-light form-control mb-4 rounded-pill px-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button type="submit" className="btn btn-purple w-100 rounded-pill fw-medium"
        onClick={() => navigate("/login")}
        >
          Save
        </button>

        <div className="text-center small fs-6 fw-normal text-white-50 my-3">Or login with</div>

        <div className="d-flex justify-content-center gap-2 gap-lg-3">
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
        </div>
      </form>
    </div>
    </div>

);
};

export default ResetPassword;