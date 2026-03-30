import users from '../models/auth.model.js'

const register = async (req , res) => {
    const {email , password} = req.body ;
    if(!email || !password){
       return res.status(400),json({
            message : "Email and Password are required !"
        })
    }
    const user = await users.findOne({email : email})
    if(user){
        return res.json({
            message : "User with this email already exist!"
        })
    }
    const createUser = await users.create({
        email, password
    });
    res.status(200).json({
        message : "User registered successfully !",
        createUser
    })


}
export {register}