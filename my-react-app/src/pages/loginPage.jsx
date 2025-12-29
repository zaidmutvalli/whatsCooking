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
        <div className="wrapper">
            <h2>Welcome Back!</h2>
            <Login />
        </div>
    );

}