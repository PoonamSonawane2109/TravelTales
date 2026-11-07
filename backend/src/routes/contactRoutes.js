const express = require("express");
const {
    getContactMessages,
    submitContactMessage
} = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getContactMessages);
router.post("/", submitContactMessage);

module.exports = router;
