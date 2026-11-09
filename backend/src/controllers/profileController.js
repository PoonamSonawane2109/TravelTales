const db = require("../config/db");

const getProfile = async (req, res) => {
    try {
        const user = await db("users")
            .select(
                "user_id",
                "full_name",
                "email",
                "bio",
                "profile_image",
                "created_at"
            )
            .where({ user_id: req.user.user_id })
            .first();

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({ message: "Unable to load profile." });
    }
};

const updateProfile = async (req, res) => {
    const allowedFields = ["full_name", "email", "bio", "profile_image"];
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
        ? req.body
        : {};
    const fields = Object.keys(body);

    if (fields.length === 0 || fields.some((field) => !allowedFields.includes(field))) {
        return res.status(400).json({ message: "Provide valid profile fields to update." });
    }

    const updates = {};

    if (Object.hasOwn(body, "full_name")) {
        if (typeof body.full_name !== "string") {
            return res.status(400).json({ message: "Name must be text." });
        }
        const fullName = body.full_name.trim();
        if (!fullName || fullName.length > 100) {
            return res.status(400).json({ message: "Name must be between 1 and 100 characters." });
        }
        updates.full_name = fullName;
    }

    if (Object.hasOwn(body, "email")) {
        if (typeof body.email !== "string") {
            return res.status(400).json({ message: "Email must be text." });
        }
        const email = body.email.trim().toLowerCase();
        if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Enter a valid email address." });
        }
        updates.email = email;
    }

    for (const field of ["bio", "profile_image"]) {
        if (Object.hasOwn(body, field)) {
            if (typeof body[field] !== "string") {
                return res.status(400).json({ message: `${field} must be text.` });
            }
            const value = body[field].trim();
            if (value.length > 500) {
                return res.status(400).json({
                    message: `${field === "bio" ? "Profile information" : "Profile image"} must be 500 characters or fewer.`
                });
            }
            updates[field] = value || null;
        }
    }

    updates.updated_at = db.fn.now();

    try {
        await db("users")
            .where({ user_id: req.user.user_id })
            .update(updates);

        return getProfile(req, res);
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "That email is already in use." });
        }
        console.error("Update profile error:", error);
        return res.status(500).json({ message: "Unable to update profile." });
    }
};

module.exports = { getProfile, updateProfile };
