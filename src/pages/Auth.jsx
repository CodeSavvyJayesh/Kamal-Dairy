import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearSession } from "../api/client";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: { email, password },
        });

        clearSession();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        navigate("/");

      } else {
        await api("/api/auth/signup", {
          method: "POST",
          body: { name, email, password },
        });

        navigate("/verify-otp", { state: { email } });
      }

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        <h2 className="auth-title">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              type="text"
              className="auth-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            className="auth-input"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            className="auth-input"
            placeholder={isLogin ? "Password" : "Password (min 8 characters)"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={isLogin ? undefined : 8}
            required
          />

          {error && (
            <p style={{ color: "#c0392b", fontSize: "0.9rem", margin: "8px 0" }}>
              {error}
            </p>
          )}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>

        </form>

        <p className="auth-switch">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <span onClick={() => { setIsLogin(false); setError(null); }}>
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => { setIsLogin(true); setError(null); }}>
                Login
              </span>
            </>
          )}
        </p>

      </div>

    </div>
  );
}

export default Auth;
