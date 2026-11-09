const db = require("../config/db");

const getContactMessages = async (req, res) => {
    try {
        const messages = await db("contact_messages as messages")
            .join("users", "messages.user_id", "users.user_id")
            .select(
                "messages.message_id",
                "users.full_name as name",
                "users.email",
                "messages.subject",
                "messages.message",
                "messages.status",
                "messages.created_at",
                "messages.updated_at"
            )
            .where("messages.user_id", req.user.user_id)
            .orderBy("messages.created_at", "desc");

        return res.status(200).json({ messages });
    } catch (error) {
        console.error("Contact message retrieval failed:", error);
        return res.status(500).json({ message: "Unable to retrieve your messages right now." });
    }
};

const submitContactMessage = async (req, res) => {
    const { subject, message } = req.body || {};
    const fields = { subject, message };

    if (Object.values(fields).some((value) => typeof value !== "string" || !value.trim())) {
        return res.status(400).json({ message: "Subject and message are required." });
    }

    const trimmedFields = Object.fromEntries(
        Object.entries(fields).map(([field, value]) => [field, value.trim()])
    );

    if (trimmedFields.subject.length > 200 || trimmedFields.message.length > 5000) {
        return res.status(400).json({ message: "One or more fields exceed the allowed length." });
    }

    try {
        await db("contact_messages").insert({
            user_id: req.user.user_id,
            subject: trimmedFields.subject,
            message: trimmedFields.message
        });

        return res.status(201).json({ message: "Thanks for reaching out. Your message has been received." });
    } catch (error) {
        console.error("Contact message submission failed:", error);
        return res.status(500).json({ message: "Unable to submit your message right now." });
    }
};

module.exports = { getContactMessages, submitContactMessage };
