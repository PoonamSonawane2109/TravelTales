const express = require("express");

const router = express.Router();

const {
    getPublishedBlogs,
    getBlogById,
    createBlog,
    getMyBlogs,
    getBlogForEdit,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

const upload = require("../middleware/upload");

// Get all published blogs
router.get("/", getPublishedBlogs);

// Get all blogs of a particular user
router.get("/user/:userId", getMyBlogs);

router.get("/edit/:id", getBlogForEdit);

// Get one blog by ID
router.get("/:id", getBlogById);

// Create a new blog
router.post(
    "/",
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "additionalImages", maxCount: 5 }
    ]),
    createBlog
);
router.put("/:id", upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 }
]), updateBlog);

// Delete a blog
router.delete("/:id", deleteBlog);

module.exports = router;