const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Pasword are required"
            });
        }
        const user = await db("users").where({ email }).first();

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email and password"
            });
        }
        if (user.account_status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active"

            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token: token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                profile_image: user.profile_image
            }

        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { login };
