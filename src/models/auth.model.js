import mongoose from "mongoose";
const Schema = mongoose.Schema ;
const UserSchema = new Schema({
    email : {
        type : String ,
        required : [true , "Email is required !"],
        unique : true 
    },
    password : {
        type : String , 
        required : [true , "Password is required !"],
    },
    role : {
        type : String,
        enum : ["user" , "admin"],
        default : "user"
    }
})
export default mongoose.model("users" , UserSchema);