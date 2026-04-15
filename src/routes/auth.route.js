import express from "express" 
import { register, getUsers, deleteUser, getSingleUser, login } from "../controllers/auth.controller.js";

const routes = express.Router() ;

routes.post("/register", register);
routes.get("/users", getUsers)
routes.get("/user/:id", getSingleUser)
routes.get("/login", login)
routes.put("/delete/:id", deleteUser)

export default routes ;
