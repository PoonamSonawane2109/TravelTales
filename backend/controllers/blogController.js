const db = require("../database/db");

// Get all published blogs
const getPublishedBlogs = (req, res) => {

const sql = `
    SELECT
        blogs.*,
        users.full_name,
        destinations.destination_name,
        categories.category_name
    FROM blogs
    JOIN users
        ON blogs.user_id = users.user_id
    JOIN destinations
        ON blogs.destination_id = destinations.destination_id
    JOIN categories
        ON blogs.category_id = categories.category_id
    WHERE blogs.status = 'PUBLISHED'
    ORDER BY blogs.published_at DESC
`;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error fetching blogs",
                error: err
            });
        }

        res.status(200).json(results);

    });
};

// Get all blogs created by a particular user
const getMyBlogs = (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            blogs.*,
            destinations.destination_name,
            categories.category_name
        FROM blogs
        JOIN destinations
            ON blogs.destination_id = destinations.destination_id
        JOIN categories
            ON blogs.category_id = categories.category_id
        WHERE blogs.user_id = ?
        ORDER BY blogs.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.log("Error fetching user's blogs:", err);

            return res.status(500).json({
                message: "Failed to fetch your blogs."
            });
        }

        res.status(200).json({
            blogs: results
        });

    });

};

// Get one blog with its additional images
const getBlogById = (req, res) => {

    // Get blog ID from the URL
    const blogId = req.params.id;

    // SQL query to get blog details
    const sql = `
        SELECT
            blogs.*,
            users.full_name,
            destinations.destination_name,
            categories.category_name
        FROM blogs
        JOIN users
            ON blogs.user_id = users.user_id
        JOIN destinations
            ON blogs.destination_id = destinations.destination_id
        JOIN categories
            ON blogs.category_id = categories.category_id
        WHERE blogs.blog_id = ?
        AND blogs.status = 'PUBLISHED'
    `;

    db.query(sql, [blogId], (err, results) => {

        if (err) {
            console.log("Error fetching blog:", err);

            return res.status(500).json({
                message: "Failed to fetch blog."
            });
        }

        // Check whether the blog exists
        if (results.length === 0) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        // Get additional images of this blog
        const imageSql = `
            SELECT *
            FROM blog_images
            WHERE blog_id = ?
            ORDER BY display_order ASC
        `;

        db.query(imageSql, [blogId], (imageErr, images) => {

            if (imageErr) {
                console.log("Error fetching images:", imageErr);

                return res.status(500).json({
                    message: "Failed to fetch blog images."
                });
            }

            // Send blog details and images
            res.status(200).json({
                blog: results[0],
                images: images
            });

        });

    });

};

// Create a new blog
const createBlog = (req, res) => {

    const {
        title,
        destination_id,
        category_id,
        travel_date,
        story,
        travel_tips
    } = req.body;

    // Get uploaded cover image
    const coverFile = req.files?.coverImage?.[0];

    if (!coverFile) {
        return res.status(400).json({
            message: "Cover image is required."
        });
    }

    // Store image path
    const coverImagePath = `/uploads/${coverFile.filename}`;

    // SQL query to insert blog
    const sql = `
        INSERT INTO blogs (
            user_id,
            destination_id,
            category_id,
            title,
            story,
            travel_date,
            travel_tips,
            cover_image,
            status,
            published_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED', NOW())
    `;

    // Temporary user ID = 1
    const values = [
        1,
        destination_id,
        category_id,
        title,
        story,
        travel_date,
        travel_tips,
        coverImagePath
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log("Error inserting blog:", err);

            return res.status(500).json({
                message: "Failed to save blog."
            });
        }

        // Get the newly created blog ID
const blogId = result.insertId;

// Get additional uploaded images
const additionalFiles = req.files?.additionalImages || [];

// If there are no additional images
if (additionalFiles.length === 0) {
    return res.status(201).json({
        message: "Blog saved successfully!",
        blog_id: blogId
    });
}

// Prepare additional image records
const imageValues = additionalFiles.map((file, index) => [
    blogId,
    `/uploads/${file.filename}`,
    `Additional image ${index + 1}`,
    index + 1
]);

// Insert additional images into blog_images
const imageSql = `
    INSERT INTO blog_images (
        blog_id,
        image_path,
        image_caption,
        display_order
    )
    VALUES ?
`;

db.query(imageSql, [imageValues], (imageErr) => {

    if (imageErr) {
        console.log("Error saving additional images:", imageErr);

        return res.status(500).json({
            message: "Blog saved, but additional images could not be saved."
        });
    }

    res.status(201).json({
        message: "Blog and images saved successfully!",
        blog_id: blogId
    });

});

    });

};


// Get one blog for editing
const getBlogForEdit = (req, res) => {

    const blogId = req.params.id;

    const sql = `
        SELECT *
        FROM blogs
        WHERE blog_id = ?
        AND user_id = 1
    `;

    db.query(sql, [blogId], (err, results) => {

        if (err) {
            console.log("Error fetching blog for editing:", err);

            return res.status(500).json({
                message: "Failed to fetch blog for editing."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        const imageSql = `
            SELECT *
            FROM blog_images
            WHERE blog_id = ?
            ORDER BY display_order ASC
        `;

        db.query(imageSql, [blogId], (imageErr, images) => {

            if (imageErr) {
                return res.status(500).json({
                    message: "Failed to fetch blog images."
                });
            }

            res.status(200).json({
                blog: results[0],
                images: images
            });

        });

    });

};


// Update an existing blog
const updateBlog = (req, res) => {

    const blogId = req.params.id;

    const {
        title,
        destination_id,
        category_id,
        travel_date,
        story,
        travel_tips
    } = req.body;

    // Get new cover image, if selected
    const coverFile = req.files?.coverImage?.[0];

    const coverImagePath = coverFile
        ? `/uploads/${coverFile.filename}`
        : null;

    // Check whether this blog belongs to the test user
    const checkSql = `
        SELECT blog_id
        FROM blogs
        WHERE blog_id = ?
        AND user_id = 1
    `;

    db.query(checkSql, [blogId], (checkErr, results) => {

        if (checkErr) {
            console.log("Error checking blog:", checkErr);

            return res.status(500).json({
                message: "Failed to check blog."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        // Update blog details
        const updateSql = `
            UPDATE blogs
            SET
                title = ?,
                destination_id = ?,
                category_id = ?,
                travel_date = ?,
                story = ?,
                travel_tips = ?,
                cover_image = COALESCE(?, cover_image),
                updated_at = NOW()
            WHERE blog_id = ?
            AND user_id = 1
        `;

        const values = [
            title,
            destination_id,
            category_id,
            travel_date,
            story,
            travel_tips,
            coverImagePath,
            blogId
        ];

        db.query(updateSql, values, (err) => {

            if (err) {
                console.log("Error updating blog:", err);

                return res.status(500).json({
                    message: "Failed to update blog."
                });
            }

            // Get newly uploaded additional images
            const additionalFiles = req.files?.additionalImages || [];

            // If no new images were selected
            if (additionalFiles.length === 0) {
                return res.status(200).json({
                    message: "Blog updated successfully!"
                });
            }

            // Prepare additional image records
            const imageValues = additionalFiles.map((file, index) => [
                blogId,
                `/uploads/${file.filename}`,
                `Additional image ${index + 1}`,
                index + 1
            ]);

            const imageSql = `
                INSERT INTO blog_images (
                    blog_id,
                    image_path,
                    image_caption,
                    display_order
                )
                VALUES ?
            `;

            db.query(imageSql, [imageValues], (imageErr) => {

                if (imageErr) {
                    console.log("Error saving new images:", imageErr);

                    return res.status(500).json({
                        message: "Blog updated, but new images could not be saved."
                    });
                }

                res.status(200).json({
                    message: "Blog and new images updated successfully!"
                });

            });

        });

    });

};

// Delete an existing blog
const deleteBlog = (req, res) => {

    const blogId = req.params.id;

    // Check whether this blog belongs to the test user
    const checkSql = `
        SELECT blog_id
        FROM blogs
        WHERE blog_id = ?
        AND user_id = 1
    `;

    db.query(checkSql, [blogId], (checkErr, results) => {

        if (checkErr) {
            console.log("Error checking blog:", checkErr);

            return res.status(500).json({
                message: "Failed to check blog."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        // Delete additional image records first
        const deleteImagesSql = `
            DELETE FROM blog_images
            WHERE blog_id = ?
        `;

        db.query(deleteImagesSql, [blogId], (imageErr) => {

            if (imageErr) {
                console.log("Error deleting blog images:", imageErr);

                return res.status(500).json({
                    message: "Failed to delete blog images."
                });
            }

            // Delete the blog
            const deleteBlogSql = `
                DELETE FROM blogs
                WHERE blog_id = ?
                AND user_id = 1
            `;

            db.query(deleteBlogSql, [blogId], (blogErr) => {

                if (blogErr) {
                    console.log("Error deleting blog:", blogErr);

                    return res.status(500).json({
                        message: "Failed to delete blog."
                    });
                }

                res.status(200).json({
                    message: "Blog deleted successfully!"
                });

            });

        });

    });

};

module.exports = {
    getPublishedBlogs,
    getBlogById,
    createBlog,
    getMyBlogs,
    getBlogForEdit,
    updateBlog,
    deleteBlog
};