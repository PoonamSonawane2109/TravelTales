
import { useState } from "react";
import "./Login.css";
import { API_BASE_URL } from "./api";
function Login({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${API_BASE_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (response.ok) {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                onLoginSuccess();
            } else {
                setMessage(data.message || "Login failed");
            }

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to backend");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>TravelTales</h1>
                <h2>Welcome Back!</h2>
                <p>Login to continue your journey.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Login</button>
                </form>
                <p>{message}</p>
                <p>
                    Don't have an account?
                    <a href="/register"> Register</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
