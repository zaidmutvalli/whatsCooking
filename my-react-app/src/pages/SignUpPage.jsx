import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Assuming you use react-router-dom

export default function SignUpPage() {
  // 1. Create state to hold form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  });

  const navigate = useNavigate();

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading

    try {
      const response = await fetch("http://localhost/whatscooking/backend/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send data as JSON string
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Registration Successful!");
        navigate("/login"); // Use React Router to move to login page
      } else {
        alert(result.message); // Shows "Passwords do not match" or "User exists"
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Is your PHP server running?");
    }
  };

  return (
    <div className="sign-up"> {/* Changed 'class' to 'className' */}
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}> {/* Use onSubmit instead of action/method */}
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

        <label className="form-label">Username: </label>
        <input 
          className="form-input" 
          type="text" 
          required 
          name="username" 
          placeholder="Username..." 
          value={formData.username}
          onChange={handleChange}
        />

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

        <label className="form-label">Confirm Password: </label>
        <input 
          className="form-input" 
          type="password" 
          required 
          name="confirm" 
          placeholder="Renter Password..." 
          value={formData.confirm}
          onChange={handleChange}
        />

        <p>Already a member? <Link className="website-link" to="/login">Log In here</Link></p>
        
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
