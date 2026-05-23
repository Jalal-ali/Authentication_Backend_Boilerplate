import express from "express";
import { register, getUsers, deleteUser, getSingleUser, login, updateUser} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";
const routes = express.Router() ;

routes.post("/register", register);
routes.get("/users", auth, getUsers);
routes.get("/user/:id", getSingleUser);
routes.post("/login", login);
routes.put("/update", updateUser);
routes.delete("/delete/:id", deleteUser);

export default routes ;
