import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // We'll add styles next

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Welcome back, ${data.name}!`);
        onLogin(data.token);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Network error");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h1>Bug Hunting Game</h1>
        <p className="subtitle">Master the art of debugging</p>
        <form onSubmit={handleSubmit}>
          <label>Email or Username</label>
          <input
            name="email"
            type="text"
            placeholder="Email or Username"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="register-link">
          Don't have an account?{" "}
          <span
            className="link"
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "#19797A", fontWeight: "bold" }}
          >
            Register here
          </span>
        </p>
        {message && <p className="error-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Login;