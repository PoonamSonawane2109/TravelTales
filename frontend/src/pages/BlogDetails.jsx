
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BlogDetails.css";

function BlogDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch blog details from backend
    useEffect(() => {

        const fetchBlog = async () => {

            try {
                const response = await fetch(
                    `http://localhost:5000/api/blogs/${id}`
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message);
                }

                setBlog(result.blog);
                setImages(result.images);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }

        };

        fetchBlog();

    }, [id]);

    // Show loading message
    if (loading) {
        return <h2>Loading blog details...</h2>;
    }

    // Show error message
    if (error) {
        return (
            <div className="blog-details">
                <button
                    className="back-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back to Explore
                </button>

                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="blog-details-page">

            <div className="details-navbar">
                <button
                    className="back-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back to Explore
                </button>

                <span className="details-logo">✧ TravelTales</span>
            </div>

            <article className="blog-article">

                <div className="article-heading">

                    <div className="article-meta">
                        <span className="article-category">
                            {blog.category_name}
                        </span>

                        <span>{blog.destination_name}</span>
                    </div>

                    <h1>{blog.title}</h1>

                    <div className="article-author">

                        <div className="author-avatar">
                            {blog.full_name.charAt(0)}
                        </div>

                        <div>
                            <p className="author-name">
                                By {blog.full_name}
                            </p>

                            <p className="article-date">
                                {new Date(blog.published_at).toLocaleDateString()}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="article-cover">
                    <img
                        src={`http://localhost:5000${blog.cover_image}`}
                        alt={blog.destination_name}
                    />
                </div>

                <div className="article-content">

                    <h2>About This Journey</h2>

                    <p>{blog.story}</p>

                    <h2>Travel Tips</h2>

                    <p>{blog.travel_tips || "No travel tips added."}</p>

                </div>

                {/* Additional Images */}
                {images.length > 0 && (
                    <div className="additional-images">

                        <h2>More Memories</h2>

                        <div className="image-gallery">

                            {images.map((image) => (
                                <img
                                    key={image.image_id}
                                    src={`http://localhost:5000${image.image_path}`}
                                    alt={image.image_caption}
                                />
                            ))}

                        </div>

                    </div>
                )}

            </article>

        </div>
    );
}

export default BlogDetails;
