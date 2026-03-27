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
    }
})
export default mongoose.model("users" , UserSchema);