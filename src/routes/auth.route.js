import express from "express";
import { register, getUsers, deleteUser, getSingleUser, login, updateUser, resetPassword} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";
const routes = express.Router() ;

routes.post("/register", register);
routes.get("/users", auth, getUsers);
routes.get("/user/", auth, getSingleUser);
routes.post("/login", login);
routes.put("/update", updateUser);
routes.get("/reset", resetPassword);
routes.delete("/delete/:id", deleteUser);

export default routes ;
