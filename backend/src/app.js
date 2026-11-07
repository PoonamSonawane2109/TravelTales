require("dotenv").config();
const db = require("./config/db");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);


app.get("/", (req, res) => {
    res.send("User Authentication API is running");
});

const PORT = process.env.PORT || 5000;
db.raw("SELECT 1")
    .then(() => {
        console.log("MySQL connected successfully");
    })
    .catch((error) => {
        console.log("Database connection failed:", error.message);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});