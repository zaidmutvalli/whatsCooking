import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: ''
  });

  const navigate = useNavigate();
  const [resetLink, setResetLink] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/whatscooking/backend/forgot_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Token Granted Successfully!");
        setResetLink(result.resetLink); 
      } else {
        alert(result.message); 
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="forgot-password">
      <h2>Forgot Password?</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Email: </label>
        <input 
          className="form-input" 
          type="email" 
          required 
          name="email" 
          placeholder="Email..." 
          value={formData.email}
          onChange={handleChange} 
        />
        <button type="submit">Enter</button>

        <p>Remember Password? <Link className="website-link" to="/LogInPage">Log In here</Link></p><br />

        <p>Reset Password link: </p>
        <Link className="website-link" to={resetLink}>{resetLink}</Link>
      </form>
    </div>
  );
}

