import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 

export default function SignUp(){

    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
            const response = await fetch("http://localhost/whatscooking/backend/signup.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.status === "success") {
            alert("Registration Successful!");
            navigate("/LoginPage"); 
        } else {
            alert(result.message); 
        }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please Try again.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    name="username"
                    type="text" 
                    required
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />

                <input 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleChange} 
                />

                <input 
                    name="password"
                    type="password"
                    required 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleChange}
                />

                <input 
                    name="confirm_password"
                    type="password" 
                    required 
                    placeholder="Confirm Password" 
                    value={formData.confirm}
                    onChange={handleChange}
                />

                <p>Already a member? <a href="/login">Log In here</a></p>
                
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};