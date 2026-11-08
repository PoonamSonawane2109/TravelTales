
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditBlog.css";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    destination_id: "",
    category_id: "",
    travel_date: "",
    story: "",
    travel_tips: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [newAdditionalImages, setNewAdditionalImages] = useState([]);

  // Fetch existing blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/blogs/edit/${id}`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        setBlog(result.blog);
        setImages(result.images);

        // Fill form with existing blog details
        setFormData({
          title: result.blog.title,
          destination_id: result.blog.destination_id,
          category_id: result.blog.category_id,
          travel_date: result.blog.travel_date
            ? result.blog.travel_date.split("T")[0]
            : "",
          story: result.blog.story,
          travel_tips: result.blog.travel_tips || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);


  // ADD handleSubmit HERE
const handleSubmit = async (e) => {

    e.preventDefault();

    const data = new FormData();

    data.append("title", formData.title);
    data.append("destination_id", formData.destination_id);
    data.append("category_id", formData.category_id);
    data.append("travel_date", formData.travel_date);
    data.append("story", formData.story);
    data.append("travel_tips", formData.travel_tips);

    if (newCoverImage) {
        data.append("coverImage", newCoverImage);
    }

    newAdditionalImages.forEach((image) => {
        data.append("additionalImages", image);
    });

    try {
        const response = await fetch(
            `http://localhost:5000/api/blogs/${id}`,
            {
                method: "PUT",
                body: data
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(result.message);
        navigate("/my-blogs");

    } catch (err) {
        alert("Error updating blog: " + err.message);
    }
};

  if (loading) {
    return <h2>Loading blog details...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      

     <form className="edit-blog-form" onSubmit={handleSubmit}>

      <h1 className="edit-blog-title">
        Edit Your Travel Blog
    </h1>

    {/* Blog Title */}
    <div className="form-group">
        <label>Blog Title</label>

        <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    title: e.target.value
                })
            }
            required
            maxLength={50}
        />
    </div>

          
{/* Destination */}
<div className="form-group">

    <label>Destination</label>

    <select
        name="destination_id"
        value={formData.destination_id}
        onChange={(e) =>
            setFormData({
                ...formData,
                destination_id: e.target.value
            })
        }
        required
    >
        <option value="">Select destination</option>
        <option value="1">Goa</option>
        <option value="2">Manali</option>
        <option value="3">Jaipur</option>
    </select>

</div>
  
  
{/* Category */}
<div className="form-group">

    <label>Category</label>

    <select
        name="category_id"
        value={formData.category_id}
        onChange={(e) =>
            setFormData({
                ...formData,
                category_id: e.target.value
            })
        }
        required
    >
        <option value="">Select category</option>
        <option value="1">Beaches</option>
        <option value="2">Mountains</option>
        <option value="3">Historical Places</option>
        <option value="4">Adventure</option>
        <option value="5">Nature and Wildlife</option>
        <option value="6">Religious Places</option>
        <option value="7">Cities</option>
    </select>

</div>


{/* Travel Date */}
<div className="form-group">

    <label>Travel Date</label>

    <input
        type="date"
        name="travel_date"
        value={formData.travel_date}
        onChange={(e) =>
            setFormData({
                ...formData,
                travel_date: e.target.value
            })
        }
        required
    />

</div>



{/* Travel Story */}
<div className="form-group">

    <label>Travel Story</label>

    <textarea
        name="story"
        rows="8"
        placeholder="Write your complete travel experience..."
        value={formData.story}
        onChange={(e) =>
            setFormData({
                ...formData,
                story: e.target.value
            })
        }
        required
        maxLength={5000}
    />

    <p>
        {formData.story.length}/5000 characters
    </p>

</div>



{/* Travel Tips */}
<div className="form-group">

    <label>Travel Tips</label>

    <textarea
        name="travel_tips"
        rows="4"
        placeholder="Share useful tips for other travellers..."
        value={formData.travel_tips}
        onChange={(e) =>
            setFormData({
                ...formData,
                travel_tips: e.target.value
            })
        }
        maxLength={1000}
    />

    <p>
        {formData.travel_tips.length}/1000 characters
    </p>

</div>



{/* Existing Cover Image */}
<div className="form-group">

    <label>Current Cover Image</label>

    {blog.cover_image && (
        <div className="image-preview">
            <img
                src={`http://localhost:5000${blog.cover_image}`}
                alt="Current cover"
                style={{
                    width: "250px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px"
                }}
            />
        </div>
    )}

</div>


{/* Replace Cover Image */}
<div className="form-group">

    <label>Choose New Cover Image (Optional)</label>

    <input
        type="file"
        accept="image/*"
        onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image.");
                e.target.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image must be smaller than 5 MB.");
                e.target.value = "";
                return;
            }

            setNewCoverImage(file);
        }}
    />

    {newCoverImage && (
        <div className="image-preview">
            <img
                src={URL.createObjectURL(newCoverImage)}
                alt="New cover preview"
                style={{
                    width: "250px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px"
                }}
            />
            <p>{newCoverImage.name}</p>
        </div>
    )}

</div>


{/* Existing Additional Images */}
<div className="form-group">

    <label>Current Additional Images</label>

    <div className="additional-images-preview">

        {images.map((image) => (
            <div className="image-preview" key={image.image_id}>

                <img
                    src={`http://localhost:5000${image.image_path}`}
                    alt={image.image_caption}
                    style={{
                        width: "180px",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "10px"
                    }}
                />

                <p>{image.image_caption}</p>

            </div>
        ))}

    </div>

</div>


{/* Add More Images */}
<div className="form-group">

    <label>Add More Images (Maximum 5 new images)</label>

    <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {

            const selectedImages = Array.from(e.target.files);

            const remainingSlots = 5 - newAdditionalImages.length;

            if (selectedImages.length > remainingSlots) {
                alert(`You can select only ${remainingSlots} more image(s).`);
            }

            const validImages = selectedImages
                .slice(0, remainingSlots)
                .filter((image) => {

                    if (!image.type.startsWith("image/")) {
                        alert(`${image.name} is not a valid image.`);
                        return false;
                    }

                    if (image.size > 5 * 1024 * 1024) {
                        alert(`${image.name} is larger than 5 MB.`);
                        return false;
                    }

                    return true;
                });

            setNewAdditionalImages((previousImages) => [
                ...previousImages,
                ...validImages
            ]);

            e.target.value = "";
        }}
    />

    <div className="additional-images-preview">

        {newAdditionalImages.map((image, index) => (
            <div className="image-preview" key={index}>

                <img
                    src={URL.createObjectURL(image)}
                    alt={`New image ${index + 1}`}
                    style={{
                        width: "180px",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "10px"
                    }}
                />

                <p>{image.name}</p>

                <button
                    type="button"
                    onClick={() => {
                        setNewAdditionalImages((previousImages) =>
                            previousImages.filter((_, i) => i !== index)
                        );
                    }}
                >
                    Remove
                </button>

            </div>
        ))}

    </div>

</div>

{/* Form Buttons */}
<div className="edit-form-buttons">

    <button type="submit" className="save-changes-btn">
        Save Changes
    </button>

    <button
        type="button"
        className="cancel-edit-btn"
        onClick={() => navigate("/my-blogs")}
    >
        Cancel
    </button>

</div>

</form>

<button
    type="button"
    className="edit-back-btn"
    onClick={() => navigate("/my-blogs")}
>
    ← Back to My Blogs
</button>
    </div>
  );
}

export default EditBlog;
