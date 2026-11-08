const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./database/db");
const blogRoutes = require("./routes/blogRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//Blog Routes
app.use("/api/blogs", blogRoutes);

// Test API
app.get("/", (req, res) => {
    res.send("Welcome to TravelTales Backend!");
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});