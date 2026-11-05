
import React, { useState } from "react";
import "./Registration.css";

function Registration() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        if (formData.password.length < 8) {
            setMessage("Password must contain at least 8 characters.");
            return;
        }

        // Backend API integration will come next
        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    })
                }
            );

            const data = await response.json();

            setMessage(data.message);

        } catch (error) {
            console.log("Registration error:", error);
            setMessage("Unable to connect to server. Please try again.");
        }
    };

    return (
        <div className="registration-container">

            <form className="registration-form" onSubmit={handleSubmit}>

                <h2>Create Account</h2>
                <p>Please register to continue</p>

                <label>Full Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label>Email Address</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label>Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    placeholder="Enter 10 digit phone number"
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="8"
                    required
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Register</button>

                {message && <p className="message">{message}</p>}

                <p className="login-link">
                    Already have an account?
                    <a href="/login"> Login</a>
                </p>

            </form>

        </div>
    );
}

export default Registration;
