import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Token not Found !"
            });
        }
        const token = authHeader.split(" ")[1];
        // console.log("Extracted Token:", token);
        if (!token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT Error:", err);
         if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            code: "TOKEN_EXPIRED",
            message: "Access token expired"
        });
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            code: "TOKEN_INVALID",
            message: "Invalid access token"
        });
    }

    return res.status(500).json({
        message: "Internal server error"
    });
    }
}

export default auth ;