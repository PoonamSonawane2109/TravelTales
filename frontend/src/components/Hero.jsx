import "./Hero.css";

function Hero() {
    return (
        <section className="hero">

            <div className="hero-container">

                {/* Left side: Text */}
                <div className="hero-content">

                    <span className="hero-subtitle">
                        THE WORLD THROUGH YOUR EYES
                    </span>

                    <h1>Explore Travel Stories.</h1>

                    <p>
                        A new perspective is just a story away.
                        Find real experiences, local discoveries,
                        and inspiration for your next journey.
                    </p>

                </div>

                {/* Right side: Travel Image */}
                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1533105079780-92b9be482077"
                        alt="Beautiful coastal travel destination"
                    />
                </div>

            </div>

        </section>
    );
}

export default Hero;