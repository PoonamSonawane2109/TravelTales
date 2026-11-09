
const db = require("../database/db");

// Get all destinations
const getAllDestinations = (req, res) => {

    const sql = "SELECT * FROM destinations";

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Error fetching destinations:", err);

            return res.status(500).json({
                message: "Error fetching destinations"
            });
        }

        res.status(200).json(results);
    });
};

module.exports = { getAllDestinations };
