import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

// Login form component — handles user authentication via the backend API
export default function login(){

    // Form state for controlled inputs
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    // Updates form state when any input field changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Submits credentials to the login endpoint and redirects on success
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8888/whatscooking/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("Log In Successful!");
            
            navigate("/");  // Redirect to home on successful login
        } else {
            alert(result.message); // Show server-provided error message
        }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
    }


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
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                >
                    Log In
                </button>
                {/* reCAPTCHA widget — site key loaded from environment variable */}
                <ReCAPTCHA sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_SITE_KEY}/>
                <a href="/forgotPassword">Forgot Password?</a>
                <hr></hr>
                <a href="/signUp" className="button">Create New Account</a>
            </form>
        </div>
    );
}