import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  if (isLogin) {
    // LOGIN
    console.log("LOGIN :", { email, password });

    localStorage.setItem("token", "LOGGED_IN");

    
    navigate("/");         
  } else {
    // SIGNUP
    console.log("SIGNUP :", { name, email, password });

    setIsLogin(true);      // switch to login form
    navigate("/login");    // go to LOGIN page
  }
};

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name Only for Signup */}
          {!isLogin && (
            <input
              type="text"
              className="auth-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
            />
          )}

          <input
            type="email"
            className="auth-input"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        {/* Switch Login <-> Signup */}
        <p className="auth-switch">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setIsLogin(false)}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Auth;