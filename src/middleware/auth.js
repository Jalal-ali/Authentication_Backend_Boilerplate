import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
    try {
        console.log("Authorization Header:", req.headers.authorization);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Token not Found !"
            });
        }
        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token);
        if (!token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("JWT Error:", error);
        return res.status(401).json({
            message: "Unauthorized",
            error: error.message
        });
    }
}

export default auth ;