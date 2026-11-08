import { useEffect, useState } from "react";
import "./BlogSection.css";
import { useNavigate } from "react-router-dom";

function BlogSection({ searchTerm, selectedCategory, sortOrder }) {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        return response.json();
      })

      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })

      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="no-blogs">Loading travel stories...</p>;
  }

  if (error) {
    return <p className="no-blogs">{error}</p>;
  }

  // Step 1: Filter blogs by category
  let filteredBlogs = blogs.filter((blog) => {
    if (selectedCategory === "All Stories") {
      return true;
    }

    return blog.category_name === selectedCategory;
  });

  // Step 2: Filter blogs by search text
  filteredBlogs = filteredBlogs.filter((blog) => {
    const search = searchTerm.toLowerCase();

    return (
      blog.title.toLowerCase().includes(search) ||
      blog.story.toLowerCase().includes(search) ||
      blog.destination_name.toLowerCase().includes(search) ||
      blog.category_name.toLowerCase().includes(search)
    );
  });

  // Step 3: Sort blogs by date
  filteredBlogs.sort((a, b) => {
    const dateA = new Date(a.published_at);
    const dateB = new Date(b.published_at);

    if (sortOrder === "newest") {
      return dateB - dateA;
    }

    return dateA - dateB;
  });

  return (
    <section className="blog-section">
      <div className="blog-heading">
        <h2>Latest Travel Stories</h2>
        <p>Get inspired by experiences shared by fellow travellers.</p>
      </div>

      <div className="blog-grid">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div className="blog-card" key={blog.blog_id}>
              <img
                className="blog-image"
                src={
                  blog.cover_image
                    ? `http://localhost:5000${blog.cover_image}`
                    : "https://placehold.co/600x400?text=TravelTales"
                }
                alt={blog.destination_name}
              />

              <div className="blog-info">
                <div className="blog-meta">
                  <span>{blog.category_name}</span>
                  <span>{blog.destination_name}</span>
                </div>

                <h3>{blog.title}</h3>

                <p>{blog.story}</p>

                <div className="blog-footer">
                  <span>By {blog.full_name}</span>
                  <span>
                    {new Date(blog.published_at).toLocaleDateString()}
                  </span>
                </div>

                <button
                  className="read-more-btn"
                  onClick={() =>
                    navigate(`/blog/${blog.blog_id}`, { state: { blog } })
                  }
                >
                  Read More →
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-blogs">No travel stories found.</p>
        )}
      </div>
    </section>
  );
}

export default BlogSection;
