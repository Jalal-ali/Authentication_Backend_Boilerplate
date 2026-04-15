import users from '../models/auth.model.js'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required !"
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
        password: hashedPassword
    });
    res.status(201).json({
        message: "User registered successfully !",
        user
    });
}

const getUsers = async (req, res) => {
    const user = await users.find()
    if (!user || user.length <= 0) {
        return res.status(400).json({
            message: "No users found!"
        })
    }
    res.status(200).json({
        users: user
    })
}

const getSingleUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            message: "Id is required !"
        })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Not a valid ID" });
    }

    const user = await users.findById(id)
    if (!user) {
        return res.status(400).json({
            message: "No user found!"
        })
    }
    res.status(200).json({
        users: user
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

    return res.status(200).json({
        message: "Logged in successfully!"
    });
};


export { register, getUsers, deleteUser, getSingleUser, login }