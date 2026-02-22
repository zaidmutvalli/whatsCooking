import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function forgotPassword() {

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
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleChange} 
                />
                <button type="submit">Request Reset Link</button>

                <a href="/logIn">Back to login</a>

                <p>Reset Password link: </p>
                <a href={resetLink}>{resetLink}</a>
            </form>
        </div>
    );

}