
const express = require("express");

const router = express.Router();

const {
    getAllDestinations
} = require("../controllers/destinationController");

// Get all destinations
router.get("/", getAllDestinations);

module.exports = router;
