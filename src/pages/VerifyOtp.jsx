import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import "./Auth.css";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const email = location.state?.email || "";

  // Reached directly without signing up first
  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api("/api/auth/verify", {
        method: "POST",
        body: { email, otp },
      });

      navigate("/login", { replace: true });

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        <h2 className="auth-title">Verify OTP</h2>

        <p style={{ textAlign: "center", marginBottom: "10px" }}>
          OTP sent to: <b>{email}</b>
        </p>

        <form onSubmit={handleVerify}>

          <input
            type="text"
            className="auth-input"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            maxLength={6}
            required
          />

          {error && (
            <p style={{ color: "#c0392b", fontSize: "0.9rem", margin: "8px 0" }}>
              {error}
            </p>
          )}

          <button className="auth-btn" type="submit" disabled={loading || otp.length !== 6}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default VerifyOtp;
