import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id, email,role) => {
    return jwt.sign({id,email,role},process.env.ACCESS_JWT_SECRET, {expiresIn : "7d"} )
} 
export default generateToken;