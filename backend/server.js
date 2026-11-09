const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./database/db");
const blogRoutes = require("./routes/blogRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const authRoutes = require("./src/routes/authRoutes")
const contactRoutes = require("./src/routes/contactRoutes");;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


//Blog Routes
app.use("/api/blogs", blogRoutes);

// Destination Routes
app.use("/api/destinations", destinationRoutes);

// Authentication Routes
app.use("/api/auth", authRoutes);

app.use("/api/contact", contactRoutes);

// Test API
app.get("/", (req, res) => {
    res.send("Welcome to TravelTales Backend!");
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});