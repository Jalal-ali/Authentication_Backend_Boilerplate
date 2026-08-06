import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateAccessToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.ACCESS_JWT_SECRET, { expiresIn: "15m" })
}
const generateRefreshToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.REFRESH_JWT_SECRET, { expiresIn: "20d" })
}
const verifyRefreshToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        return decoded;
    }
    catch (err) {
        throw err;
    }
}
export { generateAccessToken, generateRefreshToken, verifyRefreshToken }