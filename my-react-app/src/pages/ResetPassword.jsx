import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useSearchParams } from "react-router-dom";



export default function ResetPassword() {

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: '',
    confirm: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/whatscooking/backend/reset_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: formData.password, confirm: formData.confirm })

      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Registration Successful!");
        navigate("/LoginPage"); 
      } else {
        alert(result.message); 
      }
    } catch (error) {
      console.error("error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="reset-password">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>

        <label className="form-label">Password: </label>
        <input 
          className="form-input" 
          type="password" 
          required 
          name="password" 
          placeholder="Enter Password..." 
          value={formData.password}
          onChange={handleChange}
        />

        <label className="form-label">Password: </label>
        <input 
          className="form-input" 
          type="password" 
          required 
          name="confirm" 
          placeholder="ReEnter Password..." 
          value={formData.confirm}
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
