
import { useNavigate } from "react-router-dom";
import "./StoryCTA.css";

function StoryCTA() {

    const navigate = useNavigate();

    return (
        <section className="story-cta">
            <h2>Have a Story to Tell?</h2>

            <p>
                Share your travel experiences and inspire
                other travellers to explore the world.
            </p>

            <button
                className="story-btn"
                onClick={() => navigate("/create-blog")}
            >
                Share Your Story
            </button>
        </section>
    );
}

export default StoryCTA;
