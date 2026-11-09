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
const authMiddleware = require("../src/middleware/authMiddleware");

// Get all published blogs
router.get("/", getPublishedBlogs);

// Get all blogs of a particular user
router.get("/user", authMiddleware, getMyBlogs);

router.get("/edit/:id", authMiddleware, getBlogForEdit);

// Get one blog by ID
router.get("/:id", getBlogById);

// Create a new blog
router.post(
    "/",
    authMiddleware,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "additionalImages", maxCount: 5 }
    ]),
    createBlog
);

router.put("/:id",
    authMiddleware,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "additionalImages", maxCount: 5 }
    ]),
    updateBlog
);

// Delete a blog
router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;