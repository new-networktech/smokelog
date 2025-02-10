// Path: Frontend/src/pages/Register.js
// Updated Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth(); // Get register function from auth context
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred during registration");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-welcome">
          <h1>Welcome to SmokingLog</h1>
          <p>
            Track your journey to a healthier lifestyle with our comprehensive
            smoking tracking tools.
          </p>
        </div>

        <div className="register-form-container">
          <div className="register-header">
            <h2>Create Account</h2>
            <p>Please fill in your details to register</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="register-button">
              Create Account
            </button>

            <p className="login-prompt">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
