import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { passwordOk } from "../api/auth";
import { api, clearSession } from "../api/client";
import PasswordHints from "../components/PasswordHints";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "./Auth.css";

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { refresh } = useCart();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // What to offer next to the error: a reset link when locked, sign-in when the email exists.
  const [errorKind, setErrorKind] = useState(null);

  const from = location.state?.from || "/";

  const switchMode = (login) => {
    setIsLogin(login);
    setError(null);
    setErrorKind(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setErrorKind(null);

    if (!isLogin && !passwordOk(password)) {
      setError("Use at least 8 characters, with a letter and a number.");
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

        await refresh();
        toast.success("Welcome back!");
        navigate(from, { replace: true });
      } else {
        await api("/api/auth/signup", {
          method: "POST",
          body: { name, email, password },
        });

        toast.info("We sent a 6-digit code to your inbox.");
        navigate("/verify-otp", { state: { email } });
      }
    } catch (err) {
      setError(err.message);
      if (err.status === 429 && isLogin) setErrorKind("locked");
      else if (err.status === 409) setErrorKind("exists");
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

          <h2>Fresh from the farm, every single morning.</h2>

          <ul className="auth__art-points">
            <li>🥛 Sourced daily from trusted dairies</li>
            <li>🚚 Same-day delivery across Mumbai</li>
            <li>🔒 Payments secured by Razorpay</li>
          </ul>

          <p className="auth__art-note">Serving the city since 1980</p>
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__box">
          <div className="auth__tabs" role="tablist">
            <button
              role="tab"
              aria-selected={isLogin}
              className={isLogin ? "is-active" : ""}
              onClick={() => switchMode(true)}
              type="button"
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={!isLogin}
              className={!isLogin ? "is-active" : ""}
              onClick={() => switchMode(false)}
              type="button"
            >
              Create account
            </button>
          </div>

          <h1 className="auth__title">
            {isLogin ? "Welcome back" : "Let's get you set up"}
          </h1>

          <p className="auth__sub">
            {isLogin
              ? "Sign in to see your cart and order history."
              : "It takes a minute. We'll email you a code to verify."}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <label className="kd-field">
                <span className="kd-label">Full name</span>
                <input
                  className="kd-input"
                  type="text"
                  placeholder="Kavita Dhamal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label className="kd-field">
              <span className="kd-label">Email</span>
              <input
                className="kd-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="kd-field">
              <span className="kd-label">Password</span>

              <span className="auth__password">
                <input
                  className="kd-input"
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Your password" : "8+ characters, a letter and a number"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  minLength={isLogin ? undefined : 8}
                  required
                />

                <button
                  type="button"
                  className="auth__peek"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
            </label>

            {isLogin ? (
              <Link to="/forgot-password" state={{ email }} className="auth__forgot">
                Forgot password?
              </Link>
            ) : (
              password && <PasswordHints value={password} />
            )}

            {error && (
              <div className="kd-alert auth__error" role="alert">
                <span>{error}</span>
                {errorKind === "locked" && (
                  <Link to="/forgot-password" state={{ email }}>
                    Reset your password →
                  </Link>
                )}
                {errorKind === "exists" && (
                  <button type="button" onClick={() => switchMode(true)}>
                    Sign in instead →
                  </button>
                )}
              </div>
            )}

            <button
              className="kd-btn kd-btn--primary kd-btn--lg kd-btn--block"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="kd-spinner" aria-hidden="true" />
                  Please wait…
                </>
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="auth__switch">
            {isLogin ? "New to Kamal Dairy? " : "Already have an account? "}
            <button type="button" onClick={() => switchMode(!isLogin)}>
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
