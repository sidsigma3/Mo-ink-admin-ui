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
      {isLogin ? (
        <LoginPage togglePage={togglePage} setAuthStatus={setAuthStatus} />
      ) : (
        <SignupPage togglePage={togglePage} />
      )}
    </div>
    );
  };
  
  export default AuthPage;