import express from "express";
import {
     register, getUsers, deleteUser, getSingleUser, login,
     updateUser, resetPassword, forgotPassword,
     refresh,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";
const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.get("/users", auth, getUsers);
// routes.get("/check-users", auth, checkQue);
routes.get("/user/", auth, getSingleUser);
routes.put("/update-password", auth, updateUser);
routes.post("/reset-password", resetPassword);
routes.post("/forgot-password", forgotPassword);
routes.delete("/delete/:id",auth, deleteUser);
routes.post("/refresh", refresh);
routes.get("/refresh", (req,res) => {
     res.json({name:"jalal", age : 21});
});
// routes.get("/check", checkQue);

export default routes;
