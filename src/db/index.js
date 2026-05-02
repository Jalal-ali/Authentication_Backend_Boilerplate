import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const uri ="mongodb://Jalal:ultrasound4052@ac-sby5hsk-shard-00-00.bza3tin.mongodb.net:27017,ac-sby5hsk-shard-00-01.bza3tin.mongodb.net:27017,ac-sby5hsk-shard-00-02.bza3tin.mongodb.net:27017/?ssl=true&replicaSet=atlas-br6o6k-shard-0&authSource=admin&appName=Cluster0";
const connectDB = async() => {
    await mongoose.connect(`${uri}/test`)
    .then(() => console.log("Connected to MongoDB Atlas with Mongoose !"))
    .catch(err => console.error("Connection error:", err));
}

export default connectDB;