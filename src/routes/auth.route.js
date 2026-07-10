import express from "express";
import { register, getUsers, deleteUser, getSingleUser, login,
     updateUser, resetPassword, forgotPassword} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";
const routes = express.Router() ;

routes.post("/register", register);
routes.get("/users", auth, getUsers);
routes.get("/user/", auth, getSingleUser);
routes.post("/login", login);
routes.put("/update", updateUser);
routes.post("/reset-password", resetPassword);
routes.post("/forgot-password", forgotPassword);
routes.delete("/delete/:id", deleteUser);

export default routes ;
