import { useEffect, useState } from "react";
import { authenticatedFetch, API_ROOT_URL } from "./api";
import "./ProfilePage.css";

function ProfilePage({ onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    bio: "",
    profile_image: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadProfile = async () => {
      if (!localStorage.getItem("token")) {
        onNavigate("/login");
        return;
      }

      try {
        const profileResponse = await authenticatedFetch("/profile");

        if (profileResponse.status === 401) {
          localStorage.removeItem("token");
          onNavigate("/login");
          return;
        }

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profileData.message || "Unable to load profile.");
        }
        if (!isCurrent) return;

        setProfile(profileData.user);
        setFormData({
          full_name: profileData.user.full_name || "",
          email: profileData.user.email || "",
          bio: profileData.user.bio || "",
          profile_image: profileData.user.profile_image || "",
        });
      } catch (loadError) {
        console.error("Profile load failed:", loadError);
        if (isCurrent) setError(loadError.message);
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      isCurrent = false;
    };
  }, [onNavigate]);

  useEffect(() => {
    let isCurrent = true;

    const loadBlogs = async () => {
      try {
        const response = await authenticatedFetch(
          "/blogs/user",
          {},
          API_ROOT_URL,
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          onNavigate("/login");
          return;
        }

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load blogs.");
        }

        if (isCurrent) {
          setBlogs(result.blogs || []);
        }
      } catch (error) {
        console.error("Blogs loading failed:", error);
      } finally {
        if (isCurrent) {
          setBlogsLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      isCurrent = false;
    };
  }, [onNavigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await authenticatedFetch("/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        onNavigate("/login");
        return;
      }
      if (!response.ok) {
        setError(data.message || "Unable to save profile.");
        return;
      }

      setProfile(data.user);
      setFormData({
        full_name: data.user.full_name || "",
        email: data.user.email || "",
        bio: data.user.bio || "",
        profile_image: data.user.profile_image || "",
      });
      setEditing(false);
      setMessage("Profile updated.");
    } catch (saveError) {
      console.error("Profile update failed:", saveError);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button type="button" onClick={() => onNavigate("/")}>
          Back to dashboard
        </button>
        <h1>My Profile</h1>
      </header>

      <main className="profile-content">
        {loading && <p>Loading profile...</p>}
        {error && (
          <p className="profile-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="profile-message" role="status">
            {message}
          </p>
        )}

        {!loading && profile && (
          <>
            <section
              className="profile-card"
              aria-labelledby="profile-details-title"
            >
              <div className="profile-card-heading">
                <h2 id="profile-details-title">Profile information</h2>
                {!editing && (
                  <button
                    className="profile-edit-button"
                    type="button"
                    onClick={() => {
                      setMessage("");
                      setEditing(true);
                    }}
                  >
                    Edit profile
                  </button>
                )}
              </div>

              {editing ? (
                <form className="profile-form" onSubmit={handleSave}>
                  <label htmlFor="full_name">Name</label>
                  <input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    maxLength="100"
                    required
                  />

                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength="150"
                    required
                  />

                  <label htmlFor="bio">Profile information</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength="500"
                    rows="4"
                    placeholder="Tell us a little about yourself"
                  />

                  <label htmlFor="profile_image">Profile image URL</label>
                  <input
                    id="profile_image"
                    name="profile_image"
                    type="url"
                    value={formData.profile_image}
                    onChange={handleChange}
                    maxLength="500"
                  />

                  <div className="profile-form-actions">
                    <button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      type="button"
                      className="profile-cancel-button"
                      disabled={saving}
                      onClick={() => {
                        setFormData({
                          full_name: profile.full_name || "",
                          email: profile.email || "",
                          bio: profile.bio || "",
                          profile_image: profile.profile_image || "",
                        });
                        setEditing(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="profile-details">
                  <dt>Name</dt>
                  <dd>{profile.full_name}</dd>
                  <dt>Email</dt>
                  <dd>{profile.email}</dd>
                  <dt>Profile information</dt>
                  <dd>{profile.bio || "No profile information added yet."}</dd>
                  {profile.profile_image && (
                    <>
                      <dt>Profile image</dt>
                      <dd>
                        <a href={profile.profile_image}>View profile image</a>
                      </dd>
                    </>
                  )}
                </dl>
              )}
            </section>

            <section
              className="profile-card"
              aria-labelledby="published-blogs-title"
            >
              <h2 id="published-blogs-title">My Published Blogs</h2>

              <div className="profile-blog-list">
                {blogsLoading ? (
                  <p>Loading your blogs...</p>
                ) : blogs.length === 0 ? (
                  <p>You haven't created any blogs yet.</p>
                ) : (
                  blogs.map((blog) => (
                    <article className="profile-blog" key={blog.blog_id}>
                      <h3>{blog.title}</h3>

                      <p>Destination: {blog.destination_name}</p>

                      <p>Category: {blog.category_name}</p>

                      <p>Status: {blog.status}</p>

                      <p className="profile-blog-date">
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleDateString()
                          : "Not published yet"}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
