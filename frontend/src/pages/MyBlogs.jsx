import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBlogs.css";
import { authenticatedFetch, API_ROOT_URL } from "../api";

function MyBlogs() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch blogs created by the user
  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const response = await authenticatedFetch(
          "/blogs/user",
          {},
          API_ROOT_URL,
        );

        if (response.status === 401) {
    localStorage.removeItem("token");
    navigate("/login");
    return;
}

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        setBlogs(result.blogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  // Delete a blog
  const handleDelete = async (blogId) => {
    // Ask for confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await authenticatedFetch(
        `/blogs/${blogId}`,
        {
          method: "DELETE",
        },
        API_ROOT_URL,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert(result.message);

      // Remove deleted blog from the page
      setBlogs((previousBlogs) =>
        previousBlogs.filter((blog) => blog.blog_id !== blogId),
      );
    } catch (err) {
      alert("Error deleting blog: " + err.message);
    }
  };

  // Loading message
  if (loading) {
    return <h2>Loading your blogs...</h2>;
  }

  // Error message
  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="my-blogs-page">
      {/* Page Header */}
      <div className="my-blogs-header">
        <h1>My Travel Blogs</h1>

        <p>Manage all the travel stories you have shared.</p>

        <button onClick={() => navigate("/create-blog")}>
          + Create New Blog
        </button>
      </div>

      {/* Blog Cards */}
      <div className="my-blogs-container">
        {blogs.length === 0 ? (
          <h2>You haven't created any blogs yet.</h2>
        ) : (
          blogs.map((blog) => (
            <div className="my-blog-card" key={blog.blog_id}>
              {/* Blog Cover Image */}
              <img
                src={
                  blog.cover_image
                    ? `http://localhost:5000${blog.cover_image}`
                    : "https://placehold.co/600x400?text=TravelTales"
                }
                alt={blog.title}
              />

              {/* Blog Information */}
              <div className="my-blog-content">
                <span>{blog.category_name}</span>

                <h2>{blog.title}</h2>

                <p>{blog.destination_name}</p>

                <p className="my-blog-status">Status: {blog.status}</p>

                {/* Action Buttons */}
                <div className="blog-card-buttons">
                  <button
                    className="view-blog-btn"
                    onClick={() => navigate(`/blog/${blog.blog_id}`)}
                  >
                    View Blog
                  </button>

                  <button
                    className="edit-blog-btn"
                    onClick={() => navigate(`/edit-blog/${blog.blog_id}`)}
                  >
                    Edit Blog
                  </button>

                  <button
                    className="delete-blog-btn"
                    onClick={() => handleDelete(blog.blog_id)}
                  >
                    Delete Blog
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBlogs;
