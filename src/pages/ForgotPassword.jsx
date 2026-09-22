import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEye, FiEyeOff, FiMail } from "react-icons/fi";
import { forgotPassword, passwordOk, resetPassword } from "../api/auth";
import { clearSession } from "../api/client";
import PasswordHints from "../components/PasswordHints";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useCountdown } from "../utils/useCountdown";
import "./Auth.css";

/**
 * Two steps on one page:
 *  1. email -> we send a 6-digit code (the answer is the same whether or not
 *     the email has an account, so this page cannot be used to find accounts)
 *  2. code + new password -> signed in, every other device signed out
 */
function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { refresh } = useCart();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wait, startWait] = useCountdown(0);

  const sendCode = async (e) => {
    e?.preventDefault();
    setError(null);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setStep("code");
      setCode("");
      startWait(60);
      toast.info("If that email has an account, a code is on its way.");
    } catch (err) {
      setError(err.message);
      if (err.retryAfter) {
        startWait(err.retryAfter);
        // A code was already sent recently: let them use it.
        if (err.status === 429) setStep("code");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (!passwordOk(password)) {
      setError("Use at least 8 characters, with a letter and a number.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(email.trim(), code, password);

      clearSession();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      await refresh();
      toast.success("Password updated. You're signed in, and other devices were signed out.");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      if (/too many incorrect/i.test(err.message)) setCode("");
    } finally {
      setLoading(false);
    }
  };

  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <div className="auth">
      <div className="auth__art" aria-hidden="true">
        <div className="auth__art-inner">
          <span className="auth__art-mark">
            Kamal <em>Dairy</em>
          </span>

          <h2>{step === "email" ? "It happens to all of us." : "Check your inbox."}</h2>

          <ul className="auth__art-points">
            <li>✉️ A 6-digit code, valid for 10 minutes</li>
            <li>🔒 Other devices are signed out</li>
            <li>🥛 Your cart, wallet and orders stay as they are</li>
          </ul>
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__box">
          {step === "email" ? (
            <>
              <h1 className="auth__title">Reset your password</h1>
              <p className="auth__sub">
                Enter the email you signed up with and we will send you a code.
              </p>

              <form onSubmit={sendCode} noValidate>
                <label className="kd-field">
                  <span className="kd-label">Email</span>
                  <input
                    className="kd-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                    required
                  />
                </label>

                {error && (
                  <p className="kd-alert" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="kd-btn kd-btn--primary kd-btn--lg kd-btn--block"
                  type="submit"
                  disabled={loading || wait > 0}
                >
                  {loading ? (
                    <>
                      <span className="kd-spinner" aria-hidden="true" />
                      Sending…
                    </>
                  ) : wait > 0 ? (
                    `Try again in ${wait}s`
                  ) : (
                    <>
                      <FiMail aria-hidden="true" /> Send code
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth__title">Choose a new password</h1>
              <p className="otp__hint">
                Enter the 6-digit code sent to <strong>{email.trim()}</strong>
              </p>

              <form onSubmit={submitReset} noValidate>
                <label className="kd-field">
                  <span className="kd-sr-only">Six digit reset code</span>
                  <input
                    className="kd-input otp__input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="••••••"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    autoFocus
                    required
                  />
                </label>

                <label className="kd-field">
                  <span className="kd-label">New password</span>
                  <span className="auth__password">
                    <input
                      className="kd-input"
                      type={show ? "text" : "password"}
                      placeholder="8+ characters, a letter and a number"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="auth__peek"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </span>
                </label>

                <PasswordHints value={password} />

                <label className="kd-field">
                  <span className="kd-label">Confirm new password</span>
                  <input
                    className={`kd-input ${mismatch ? "is-invalid" : ""}`}
                    type={show ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    aria-invalid={mismatch}
                    required
                  />
                  {mismatch && <small className="auth__field-error">Passwords do not match yet.</small>}
                </label>

                {error && (
                  <p className="kd-alert" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="kd-btn kd-btn--primary kd-btn--lg kd-btn--block"
                  type="submit"
                  disabled={loading || code.length !== 6 || !passwordOk(password) || confirm !== password}
                >
                  {loading ? (
                    <>
                      <span className="kd-spinner" aria-hidden="true" />
                      Saving…
                    </>
                  ) : (
                    "Save password and sign in"
                  )}
                </button>
              </form>

              <p className="auth__resend">
                Didn't get it?{" "}
                <button type="button" onClick={() => sendCode()} disabled={wait > 0 || loading}>
                  {wait > 0 ? `Resend in ${wait}s` : "Resend code"}
                </button>
                {" · "}
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError(null);
                  }}
                >
                  Use a different email
                </button>
              </p>
            </>
          )}

          <Link to="/login" className="otp__back">
            <FiArrowLeft aria-hidden="true" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
