import users from '../models/auth.model.js'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';
import crypto from "crypto";
import nodemailer from "nodemailer";
import { log } from 'console';
import auth from '../middleware/auth.js';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const register = async (req, res) => {
    const { email, password, role, fullName } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required !"
        });
    }
    if (!fullName) {
        return res.status(400).json({
            message: "Full Name is required !"
        })
    }
    if (!role) {
        return res.status(400).json({
            message: "Role is required !"
        })
    }
    const existingUser = await users.findOne({ email: email })
    if (existingUser) {
        return res.status(409).json({
            message: "User with this email already exist!"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await users.create({
        email,
        password: hashedPassword,
        role,
        fullName
    });
    res.status(201).json({
        message: "User registered successfully !",
        user
    });
}

const getUsers = async (req, res) => {

    // authenticated user 
    const authUser = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    };
    if (req.user.role != "admin") {
        return res.status(401).json({
            message: "Only admins can view all users.",
            role: authUser.role,
            email: authUser.email
        })
    }
    const user = await users.find()
    if (!user || user.length <= 0) {
        return res.status(400).json({
            message: "No users found!"
        })
    }

    res.status(200).json({
        users: user,
        AuthorizedUser: authUser

    })
}

const getSingleUser = async (req, res) => {
    // authenticated user 
    const authUser = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        fullName: req.user.fullName,
    };

    // from id 
    // const { id } = req.params;
    // if (!id) {
    //     return res.status(400).json({
    //         message: "Id is required !"
    //     })
    // }

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({ error: "Not a valid ID" });
    // }

    const user = await users.findById(authUser.id)
    if (!user) {
        return res.status(400).json({
            message: "No user found!"
        })
    }
    res.status(200).json({
        user: user
    })
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            message: "Id is required !"
        })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Not a valid ID" });
    }

    const isExist = await users.findById(id);
    if (!isExist) {
        return res.status(404).json({
            message: "User not Found!"
        })
    }

    const user = await users.findByIdAndDelete(id)
    res.status(200).json({
        message: "User has been removed successfully!",
        user
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    const user = await users.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: `User not found with ${email}`
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid credentials."
        });
    }
    const token = generateToken(user.id, user.email, user.role);

    return res.status(200).json({
        message: "Logged in successfully!",
        token, user
    });
};

const updateUser = async (req, res) => {
    const {newPassword, currentPass } = req.body;
    const authEmail = req.user.email ;
    console.log(authEmail);
    
    
    if (!newPassword || !currentPass) {
        return res.status(400).json({
            message: "Password is required."
        });
    }
    const isUser = await users.findOne({ email : authEmail });
    if (!isUser) {
        return res.status(404).json({
            message: "No user Found"
        });
    }
    console.log(isUser);
    const isMatch = await bcrypt.compare(currentPass, isUser.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid Password."
        });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await users.findOneAndUpdate({email : isUser.email} , { password: hashedPassword });

    res.status(200).json({
        message: `The Password for ${isUser.email} has been Updated Successfully!`,
    })
}

// forgot password 
const forgotPassword = async (req, res) => {
    const { email, clientURL } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "User not found!"
        })
    }
    // const allowedOrigins = [
    //     "http://localhost:5173",
    //     "https://myapp.com",
    // ];

    // if (!allowedOrigins.includes(clientURL)) {
    //     return res.status(400).json({
    //         message: "Invalid client URL",
    //     });
    // }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${clientURL}/reset-password/${resetToken}`;
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Your Password",
        html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <a href="${resetLink}">Click here to Reset your Password</a>
        <p>This link expires in 15 minutes.</p>`,
    });

    res.json({
        message: "Password reset link sent to your email!",
        resetToken
    })

}
// reset password 
const resetPassword = async (req, res) => {
    const { password, token } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await users.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })
    if (!user) {
        return res.status(400).json({
            message: "Invalid or expired reset token."
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({
        message: "Password updated Successfully!.",
        user
    })


}


export { register, getUsers, deleteUser, getSingleUser, login, updateUser, resetPassword, forgotPassword }