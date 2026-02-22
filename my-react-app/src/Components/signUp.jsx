import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sign up form component — handles new user registration via the backend API
export default function SignUp(){

    // Form state for all registration fields including password confirmation
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm: ''
    });

    const navigate = useNavigate();

    // Updates form state when any input field changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Submits registration data to the signup endpoint and redirects to login on success
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8888/whatscooking/signup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.status === "success") {
                alert("Registration Successful!");
                navigate("/logIn"); // Redirect to login after successful registration
            } else {
                alert(result.message); // Show server-provided error message
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

                {/* Confirmation field to catch password typos before submission */}
                <input
                    name="confirm"
                    type="password"
                    required
                    placeholder="Re-enter Password"
                    value={formData.confirm}
                    onChange={handleChange}
                />

                <p>Already a member? <a href="/logIn">Log In here</a></p>

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};