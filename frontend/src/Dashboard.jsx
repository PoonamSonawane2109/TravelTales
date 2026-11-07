import { useEffect, useState } from "react";
import "./Dashboard.css";
import { authenticatedFetch } from "./api";

function Dashboard({ onNavigate }) {
    const [error, setError] = useState("");

    useEffect(() => {
        let isCurrent = true;

        const verifySession = async () => {
            if (!localStorage.getItem("token")) {
                onNavigate("/login");
                return;
            }

            try {
                const response = await authenticatedFetch("/profile");
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    onNavigate("/login");
                } else if (!response.ok && isCurrent) {
                    const data = await response.json();
                    setError(data.message || "Unable to verify your session.");
                }
            } catch (requestError) {
                console.error("Session verification failed:", requestError);
                if (isCurrent) setError("Unable to connect to the server.");
            }
        };

        verifySession();
        return () => {
            isCurrent = false;
        };
    }, [onNavigate]);

    const handleLogout = () => {
        setError("");
        localStorage.removeItem("token");
        onNavigate("/login");
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1 className="dashboard-title">TravelTales</h1>
                <nav className="dashboard-actions" aria-label="Dashboard actions">
                    <button
                        className="dashboard-contact"
                        type="button"
                        onClick={() => onNavigate("/contact-us")}
                    >
                        Contact Us
                    </button>
                    <button
                        className="dashboard-profile"
                        type="button"
                        aria-label="Open profile"
                        onClick={() => onNavigate("/profile")}
                    >
                        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                            <circle cx="12" cy="8" r="3.5" />
                            <path d="M5 20c0-3.9 2.8-6 7-6s7 2.1 7 6" />
                        </svg>
                    </button>
                    <button
                        className="dashboard-logout"
                        type="button"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </nav>
            </header>
            {error && <p className="dashboard-error" role="alert">{error}</p>}
            <main className="dashboard-content" />
        </div>
    );
}

export default Dashboard;
