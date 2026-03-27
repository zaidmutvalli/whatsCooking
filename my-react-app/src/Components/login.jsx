import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

export default function login(){

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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

        try {
            const response = await fetch("http://localhost:8888/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.status === "success") {
                navigate("/");
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                {errorMessage && (
                    <div className="error-banner">{errorMessage}</div>
                )}
                <input
                    name="username"
                    type="text"
                    required
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <div className="password-wrapper">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                <button type="submit">Log In</button>
                <ReCAPTCHA sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_SITE_KEY}/>
                <a href="/forgotPassword">Forgot Password?</a>
                <hr></hr>
                <a href="/signUp" className="button secondary-button">New here? Sign up</a>
            </form>
        </div>
    );
}
