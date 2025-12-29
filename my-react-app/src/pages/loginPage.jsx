import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LogInPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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
            const response = await fetch("http://localhost/whatscooking/backend/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("Log In Successful!");
            navigate("/");  
        } else {
            alert(result.message); 
        }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
    }

  return (
    <div className="log-in"> 
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
            <label className="form-label">Username: </label>
            <input 
                className="form-input" 
                type="text" 
                name="username" 
                required 
                placeholder="Username..." 
                value={formData.username}
                onChange={handleChange}
            />

            <label className="form-label">Password: </label>
            <input 
                className="form-input" 
                type="password" 
                name="password" 
                required 
                placeholder="Enter Password..." 
                value={formData.password}
                onChange={handleChange}
            />

            <button type="submit">Log In</button>
        
            <p><Link className="website-link" to="/forgotPassword">Forgot Password?</Link></p>
            <p>Are you new here? <Link className="website-link" to="/SignUpPage">Register here</Link></p>
        </form>
    </div>
  );
}