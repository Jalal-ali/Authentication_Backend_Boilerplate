import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateAccessToken = (id, email,role) => {
    return jwt.sign({id,email,role},process.env.ACCESS_JWT_SECRET, {expiresIn : "10s"} )
} 
const generateRefreshToken = (id) => {
    return jwt.sign({id},process.env.REFRESH_JWT_SECRET, {expiresIn : "20d"} )
} 

export {generateAccessToken, generateRefreshToken}