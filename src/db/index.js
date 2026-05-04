import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const uri = process.env.URI ;
const connectDB = async() => {
    await mongoose.connect(uri)
    
    .then(() => console.log("Connected to MongoDB Atlas with Mongoose !"))
    .catch(err => console.error("Connection error:", err));
}

export default connectDB;