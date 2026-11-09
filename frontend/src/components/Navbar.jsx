
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="logo">
                <span className="logo-icon">✧</span>
                <span>TravelTales</span>
            </div>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/explore">Explore</Link>
                <Link to="/my-blogs">My Blogs</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Us</Link>
            </div>

            <div className="nav-buttons">
                {token ? (
                    <>
                        <button onClick={() => navigate("/profile")}>
                            Profile
                        </button>
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="login-btn"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>

                        <button
                            className="register-btn"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </>
                )}
            </div>

        </nav>
    );
}

export default Navbar;
