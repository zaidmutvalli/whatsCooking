import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp(){

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch("http://localhost:8888/signup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.status === "success") {
                setSuccessMessage("Account created! Redirecting to login...");
                setTimeout(() => navigate("/logIn"), 1500);
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {errorMessage && (
                    <div className="error-banner">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="success-banner">{successMessage}</div>
                )}
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
                    name="confirm"
                    type="password"
                    required
                    placeholder="Re-enter Password"
                    value={formData.confirm}
                    onChange={handleChange}
                />
                <p>Already a member? <a href="/logIn">Log in here</a></p>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};
