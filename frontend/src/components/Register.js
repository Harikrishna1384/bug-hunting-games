import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Reuse the Login.css styles

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`User ${data.name} registered successfully!`);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Network error");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h1>Bug Hunting Game</h1>
        <p className="subtitle">Start your debugging journey</p>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
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
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">Register</button>
        </form>
        <p className="register-link">
          Already have an account?{" "}
          <span
            className="link"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", color: "#19797A", fontWeight: "bold" }}
          >
            Login here
          </span>
        </p>
        {message && <p className="error-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Register;