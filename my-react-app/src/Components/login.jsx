import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

export default function login(){
    
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
                <ReCAPTCHA sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_SITE_KEY}/>
                <a href="/forgotPassword">Forgot Password?</a>
                <hr></hr>
                <a href="/signUp" className="button">Create New Account</a>
            </form>
        </div>
    );
}