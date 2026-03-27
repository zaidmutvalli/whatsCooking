import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function forgotPassword() {

    const [formData, setFormData] = useState({ email: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [resetLink, setResetLink] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch("http://localhost/whatscooking/backend/forgot_password.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.status === "success") {
                setSuccessMessage("Reset link sent! Check your email.");
                setResetLink(result.resetLink);
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
                    name="email"
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                />
                <button type="submit">Request Reset Link</button>
                <a href="/logIn" className="back-link">Back to login</a>
                {resetLink && <a href={resetLink}>{resetLink}</a>}
            </form>
        </div>
    );
}
