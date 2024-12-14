import React, { useState } from "react";
import LoginPage from "./Login/LoginPage";
import SignupPage from "./Signup/SignupPage";
import "./AuthPage.css"

const AuthPage = ({ setAuthStatus }) => {
    const [isLogin, setIsLogin] = useState(true);
  
    const togglePage = () => {
      setIsLogin(!isLogin);
    };
  
    return (
      <div className="auth-page">
        <div className={`d-flex form-container ${isLogin ? "login" : "signup"}`}>
         
            <LoginPage togglePage={togglePage} isLogin={isLogin} setAuthStatus={setAuthStatus}/>

            <SignupPage togglePage={togglePage} isLogin={isLogin}/>
      
        </div>
      </div>
    );
  };
  
  export default AuthPage;