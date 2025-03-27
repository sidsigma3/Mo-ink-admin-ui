import React ,{useState , useEffect} from 'react'
import "./LoginPage.css"
import ToggleBtn from '../../../../components/Buttons/ToggleButton/ToggleBtn'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from '../../../../services/LoginService'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const LoginPage = ({ togglePage ,isLogin, setAuthStatus }) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async () => {
        const response = await loginUser(username, password);
    
        if (response.success) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userData", JSON.stringify(response.data));
          setAuthStatus(true);
          navigate("/dashboard");
        } else {
          setError(response.message);
        }
      };


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
    <div className='login-page'>
    <div className='login-page-ctn'>

        <div className='logo-ctn'>
            <img src='logo.png'></img>
        </div>
        
        <div className='left-cover-pic'>
            <img src='login-cover-pic-2.png'></img>
            {/* <h4>Lorem ipsum dolor sit.</h4>
            <h5>Lorem ipsum dolor sit.</h5> */}
        </div>

        <div className='right-ctn'>
            <h6 className='welcome'>Welcome to Moink & dyes </h6>
               <ToggleBtn click={togglePage} status={isLogin}></ToggleBtn>
                

                {/* <h6 className='mt-3'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae minus optio voluptates!</h6> */}


                <div className="d-flex flex-column gap-2 mt-4">
                    <label>Username</label>
                    <input
                    className="login-input rounded-pill"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="d-flex flex-column gap-2 mt-4 position-relative">
                    <label>Password</label>
                    <input
                            type={showPassword ? "text" : "password"}
                            className="login-input w-100"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="position-absolute end-0 translate-middle-y me-3"
                            style={{ cursor: "pointer", top:'3rem' }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                </div>


                <div className='d-flex justify-content-between mt-3'>
                    <div className='d-flex gap-2'>
                        <input type='checkbox'></input>
                        <label> Remember me</label>
                    </div>
                
                    <a href="/forgotPassword">Forgot password?</a>
                
                </div>


                <button  className='btn btn-primary rounded-pill w-100 mt-5'  onClick={handleLogin}>Login</button>

                <h6 className='mt-3 text-center text-body-tertiary'>Or login with</h6>

                
                <div className='mt-4'>
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
                </div>
                
        </div>

    </div>
    </div>
  )
}

export default LoginPage