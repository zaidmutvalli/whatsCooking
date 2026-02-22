import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

export default function resetPassword(){

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
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
        const response = await fetch("http://localhost/whatscooking/backend/reset_password.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password: formData.password, confirm: formData.confirm })

        });

        const result = await response.json();

        if (result.status === "success") {
            alert("Registration Successful!");
            navigate("/Login"); 
        } else {
            alert(result.message); 
        }
        } catch (error) {
            console.error("error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    name="password"
                    type="password"
                    required 
                    placeholder="New password" 
                    value={formData.password}
                    onChange={handleChange}
                />

                <input 
                    name="confirm"
                    type="password" 
                    required 
                    placeholder="Re-enter new password" 
                    value={formData.confirm}
                    onChange={handleChange}
                />

                <button type="submit">Reset password</button>
            </form>
        </div>
    );

}