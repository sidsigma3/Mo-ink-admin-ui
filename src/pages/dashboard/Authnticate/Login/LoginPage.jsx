import React ,{useState , useEffect} from 'react'
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from '../../../../services/LoginService'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Toast from '../../../../components/Toast/Toast';

import "./LoginPage.css";

const LoginPage = ({ togglePage ,isLogin, setAuthStatus }) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);
  
    const handleLogin = async () => {
        const response = await loginUser(username, password);
        console.log(response)
    
        if (response.success) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userData", JSON.stringify(response.data));
          setAuthStatus(true);
          navigate("/dashboard");
        } else {
          console.log(response)
          showToast(response.message.data.message, "error");
          
        }
      };

      const showToast = (message, type = "error") => {
        setToasts([{ message, type }]);
        setTimeout(() => setToasts([]), 3000);
      };

      // const [user, setUser] = useState(null);

      //   useEffect(() => {
      //       axios
      //       .get("http://localhost:5000/auth/user", { withCredentials: true })
      //       .then((res) => setUser(res.data))
      //       .catch(() => setUser(null));
      //   }, []);

        const handleLoginSuccess = (response) => {
            console.log("Login Success:", response);
            window.location.href = "http://localhost:5000/auth/google";
        };

      //   const handleLogout = () => {
      //       axios.get("http://localhost:5000/auth/logout", { withCredentials: true });
      //       setUser(null);
      //   };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center px-3">
      <div className="background-blur"
       style={{
       backgroundImage: "url('/bg-texture.png')",
      }}
      >
      </div>

      {/* Logo */}
      <div className="position-absolute top-0 start-0 p-4 p-lg-5"
      >
        <img src="logo.png" alt="Logo" className="logo-img mx-auto" />
      </div>

      {/* Auth Box */}
      <div className="login-card bg-opacity-20 border border-3 p-4 p-sm-4 rounded-4  text-white position-relative z-2">
       
       
        <h3 className="text-center fw-bold mb-4">Welcome Team!</h3>

        <div className="toggle d-flex justify-content-center mb-5 bg-white rounded-pill overflow-hidden mx-auto toggle-btns">
          <button className="btn btn-purple text-white fw-medium w-50 rounded-pill">
            Login
          </button>
          <button
            className="btn text-purple fw-medium w-50 rounded-pill"
            onClick={togglePage}
          >
            Register
          </button>
        </div>

        {/* <p className="text-center fs-6 fw-light text-white small mb-4 px-2">
        Reconnect with the pulse of Mo Ink and Dyes. Your dashboard is ready log in and lead every step from cone to customer.
        </p> */}

        <form 
         onSubmit={(e) => {
          e.preventDefault(); 
          handleLogin();    
        }}
        >
          {/* <label className="fs-6 fw-normal text-white form-label">Email id or Phone no</label> */}
          <input
            type="text"
            placeholder="Email id or Phone no."
            className="fs-6 fw-light form-control mb-3 rounded-pill px-4 py-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* <label className="fs-6 fw-normal text-white form-label">Password</label> */}
          <div className="position-relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="fs-6 fw-light form-control rounded-pill mb-3 px-4 pe-5 py-1"
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

          {error && <p className="text-danger small">{error}</p>}

          <div className="d-flex justify-content-between align-items-center text-muted small mb-5">
            <label className=" fs-7 fw-normal text-white form-check-label">
              <input type="checkbox" className="form-check-input me-2" />
              Remember me
            </label>
            <a href="/forgotPassword" className="fs-7 fw-normal text-white text-decoration-none">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn btn-purple w-100 rounded-pill fw-medium"
          onClick={() => handleLogin}
          >
            Login
          </button>

          <div className="text-center small fs-7 fw-normal text-white-50 my-3">Or login with</div>

          <div className="d-flex justify-content-center gap-2 gap-lg-3">
          <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
          </div>
        </form>
      </div>
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

export default LoginPage;
