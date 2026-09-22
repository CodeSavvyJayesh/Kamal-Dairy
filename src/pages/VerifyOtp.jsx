import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { resendOtp } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { useCountdown } from "../utils/useCountdown";
import "./Auth.css";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resending, setResending] = useState(false);
  const [wait, startWait] = useCountdown(60); // the signup email just went out

  const email = location.state?.email || "";

  // Reached directly, without signing up first
  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleResend = async () => {
    setError(null);
    setResending(true);
    try {
      await resendOtp(email);
      setOtp("");
      toast.info("A new code is on its way. Check your inbox and spam folder.");
      startWait(60);
    } catch (err) {
      setError(err.message);
      if (err.retryAfter) startWait(err.retryAfter);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api("/api/auth/verify", {
        method: "POST",
        body: { email, otp },
      });

      toast.success("Account verified. You can sign in now.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__art" aria-hidden="true">
        <div className="auth__art-inner">
          <span className="auth__art-mark">
            Kamal <em>Dairy</em>
          </span>

          <h2>One last step.</h2>

          <p style={{ color: "rgba(255,255,255,0.8)" }}>
            We sent a six-digit code to your email. It expires in ten minutes,
            so it is worth checking now.
          </p>
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__box">
          <h1 className="auth__title">Verify your email</h1>

          <p className="otp__hint">
            Enter the 6-digit code we sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleVerify}>
            <label className="kd-field">
              <span className="kd-sr-only">Six digit verification code</span>
              <input
                className="kd-input otp__input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                autoFocus
                required
              />
            </label>

            {error && <p className="kd-alert">{error}</p>}

            <button
              className="kd-btn kd-btn--primary kd-btn--lg kd-btn--block"
              type="submit"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <span className="kd-spinner" aria-hidden="true" />
                  Verifying…
                </>
              ) : (
                "Verify and continue"
              )}
            </button>
          </form>

          <p className="auth__resend">
            Didn't get it?{" "}
            <button type="button" onClick={handleResend} disabled={wait > 0 || resending}>
              {resending ? "Sending…" : wait > 0 ? `Resend in ${wait}s` : "Resend code"}
            </button>
          </p>

          <Link to="/login" className="otp__back">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
