import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id, email) => {
    return jwt.sign({id,email},process.env.ACCESS_JWT_SECRET, {expiresIn : "7d"} )
} 
export default generateToken;