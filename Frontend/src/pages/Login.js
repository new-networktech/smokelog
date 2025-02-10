// Path: Frontend/src/pages/Login.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-welcome">
          <h1>Welcome Back!</h1>
          <p>Continue your journey to a healthier lifestyle with SmokingLog.</p>
        </div>

        <div className="login-form-container">
          <div className="login-header">
            <h2>Sign In</h2>
            <p>Please enter your details to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button">
              Sign In
            </button>

            <p className="signup-prompt">
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
