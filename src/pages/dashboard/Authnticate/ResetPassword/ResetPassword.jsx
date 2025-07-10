import React ,{useState, useEffect} from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./ResetPassword.css"
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from '../../../../services/LoginService';
import Toast from '../../../../components/Toast/Toast';


const ResetPassword = () => {
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [toasts, setToasts] = useState([]);
  const [showNewPassword, setShowNewPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 


  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const accountType = "USER"; 



  const handleSubmit = async (e) => {
    
 const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };

    e.preventDefault(); 
    console.log("hello")


    if (!newPassword || !confirmPassword) {
      showToast("Please fill out both fields.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    if (!token || !accountType) {
      showToast("Invalid or expired reset link.", "error");
      return;
    }

   try {
  const payload = { token, newPassword, accountType };
  const response = await resetPassword(payload);
  const data = response.data;

  console.log("Response from resetPassword:", data);
  showToast(data?.message || "Password successfully reset!", "success");
  setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to reset password. Please try again.",
        "error"
      );
      console.error("Error in resetPassword:", error);
    }

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
        onClick={() => navigate("/")}
      >
        &larr; Back to Login
      </button>

     
      <h3 className="text-start fw-bold mb-2">Set a password</h3>
      

      <p className="text-start fs-6 fw-light text-white small mb-5">
      Your previous password has been reset. Please set a new password for your account.
      </p>

      <form onSubmit={handleSubmit}>
        {/* <label className="fs-6 fw-normal text-white form-label">New password</label> */}
        <div className="position-relative mb-2">
        <input
          type={showNewPassword ? "text" : "password"}
          placeholder="Create a strong password"
          className="fs-6 fw-light form-control mb-3 rounded-pill px-4 py-1"
          value={newPassword}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
            type="button"
            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>



      {/* <label className="fs-6 fw-normal text-white form-label">Confirm password</label> */}
        <div className="position-relative mb-2">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Re-enter the password"
          className="fs-6 fw-light form-control mb-4 rounded-pill px-4 py-1"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
         <button
            type="button"
            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" className="btn btn-purple w-100 rounded-pill fw-medium"
        >
          Save
        </button>

        {/* <div className="text-center small fs-6 fw-normal text-white-50 my-3">Or login with</div>

        <div className="d-flex justify-content-center gap-2 gap-lg-3">
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
        </div> */}
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

export default ResetPassword;