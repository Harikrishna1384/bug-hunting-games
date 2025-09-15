import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
