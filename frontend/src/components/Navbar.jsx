
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">

            {/* Website Logo */}
            <div className="logo">
                <span className="logo-icon">✧</span>
                <span>TravelTales</span>
            </div>

            {/* Navigation Links */}
            <div className="nav-links">
                <a href="/">Home</a>
                <a href="/explore">Explore</a>
                <a href="/my-blogs">My Blogs</a>
                <a href="/about">About Us</a>
                <a href="/contact">Contact Us</a>
            </div>

            {/* Login and Register */}
            <div className="nav-buttons">
                <button className="login-btn">Login</button>
                <button className="register-btn">Register</button>
            </div>

        </nav>
    );
}

export default Navbar;
