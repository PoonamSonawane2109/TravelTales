import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-about">
                    <h2>✧ TravelTales</h2>
                    <p>
                        Discover the world through stories.
                        Share your journeys and inspire others
                        to explore beautiful destinations.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <a href="/">Home</a>
                    <a href="/explore">Explore</a>
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact Us</a>
                </div>

                <div className="footer-links">
                    <h3>Explore</h3>
                    <a href="/explore">Travel Blogs</a>
                    <a href="/destinations">Destinations</a>
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2026 TravelTales. All rights reserved.</p>
            </div>

        </footer>
    );
}

export default Footer;