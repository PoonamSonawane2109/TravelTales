
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateBlog.css";

function CreateBlog() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        destination_id: "",
        category_id: "",
        travel_date: "",
        story: "",
        travel_tips: ""
    });

    const [coverImage, setCoverImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);

    // Handle text fields and dropdowns
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Submit blog data to backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        // Add text fields
        data.append("title", formData.title);
        data.append("destination_id", formData.destination_id);
        data.append("category_id", formData.category_id);
        data.append("travel_date", formData.travel_date);
        data.append("story", formData.story);
        data.append("travel_tips", formData.travel_tips);

        // Add cover image
        data.append("coverImage", coverImage);

        // Add additional images
        additionalImages.forEach((image) => {
            data.append("additionalImages", image);
        });

        try {
            const response = await fetch(
                "http://localhost:5000/api/blogs",
                {
                    method: "POST",
                    body: data
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to submit blog");
            }

            alert(result.message);

        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    // Validate cover image
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Cover image must be smaller than 5 MB.");
            e.target.value = "";
            return;
        }

        setCoverImage(file);
    };

    // Validate additional images
    const handleAdditionalImagesChange = (e) => {
        const newImages = Array.from(e.target.files);
        const remainingSlots = 5 - additionalImages.length;

        if (newImages.length > remainingSlots) {
            alert(`You can select only ${remainingSlots} more image(s).`);
        }

        const validImages = newImages
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

        setAdditionalImages((previousImages) => [
            ...previousImages,
            ...validImages
        ]);

        e.target.value = "";
    };

    return (
        <div className="create-blog-page">
            <div className="create-blog-container">

                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </button>

                <div className="create-blog-heading">
                    <h1>Share Your Travel Story</h1>
                    <p>
                        Share your experiences and inspire
                        others to explore the world.
                    </p>
                </div>

                <form
                    className="create-blog-form"
                    onSubmit={handleSubmit}
                >

                    {/* Blog Title */}
                    <div className="form-group">
                        <label>Blog Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter your travel story title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength={50}
                        />

                        <p className="character-count">
                            {formData.title.length}/50 characters
                            {formData.title.length === 50 &&
                                " - Maximum limit reached!"}
                        </p>
                    </div>

                    {/* Destination and Travel Date */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>Destination</label>

                            <select
                                name="destination_id"
                                value={formData.destination_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select destination</option>
                                <option value="1">Goa</option>
                                <option value="2">Manali</option>
                                <option value="3">Jaipur</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Travel Date</label>

                            <input
                                type="date"
                                name="travel_date"
                                value={formData.travel_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label>Category</label>

                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
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

                    {/* Travel Story */}
                    <div className="form-group">
                        <label>Travel Story</label>

                        <textarea
                            name="story"
                            rows="8"
                            placeholder="Write your complete travel experience..."
                            value={formData.story}
                            onChange={handleChange}
                            required
                            maxLength={5000}
                        ></textarea>

                        <p className="character-count">
                            {formData.story.length}/5000 characters
                            {formData.story.length === 5000 &&
                                " - Maximum limit reached!"}
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
                            onChange={handleChange}
                            maxLength={1000}
                        ></textarea>

                        <p className="character-count">
                            {formData.travel_tips.length}/1000 characters
                            {formData.travel_tips.length === 1000 &&
                                " - Maximum limit reached!"}
                        </p>
                    </div>

                    {/* Cover Image */}
                    <div className="form-group">
                        <label>Cover Image</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            required
                        />

                        {coverImage && (
                            <div className="image-preview">
                                <img
                                    src={URL.createObjectURL(coverImage)}
                                    alt="Cover preview"
                                />
                                <p>{coverImage.name}</p>
                            </div>
                        )}
                    </div>

                    {/* Additional Images */}
                    <div className="form-group">
                        <label>Additional Images</label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAdditionalImagesChange}
                        />

                        <div className="additional-images-preview">
                            {additionalImages.map((image, index) => (
                                <div className="image-preview" key={index}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Additional preview ${index + 1}`}
                                    />

                                    <p>{image.name}</p>

                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => {
                                            setAdditionalImages(
                                                (previousImages) =>
                                                    previousImages.filter(
                                                        (_, i) => i !== index
                                                    )
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
                    <div className="form-buttons">
                        <button
                            type="button"
                            className="draft-btn"
                        >
                            Save as Draft
                        </button>

                        <button
                            type="submit"
                            className="publish-btn"
                        >
                            Publish Blog
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default CreateBlog;
