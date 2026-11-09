
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const router = express.Router();
const { login } = require("../controllers/authController");
const {
    getProfile,
    updateProfile
} = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/test", (req, res) => {
    res.send("Authentication routes are working!");
});
router.post("/login", login);
// Define routes here
router.post("/register", async (req, res) => {

    try {

        // Receive user data
        const { name, email, password } = req.body;

        // Check empty fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const existingUser = await db("users")
            .where({ email: email })
            .first();

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert user into MySQL
        await db("users").insert({
            full_name: name,
            email: email,
            password_hash: hashedPassword
        });
        return res.status(201).json({
            message: "Registration successful"
        });
    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});
router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, updateProfile);

module.exports = router;
