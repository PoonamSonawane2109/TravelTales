const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token."
        });
    }

    if (!decoded.user_id) {
        return res.status(401).json({
            message: "Invalid token."
        });
    }

    req.user = decoded;
    return next();
};

module.exports = authMiddleware;
