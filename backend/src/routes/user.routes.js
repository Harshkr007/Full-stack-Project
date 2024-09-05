import { Router } from "express";
import { RegisterUser } from "../controllers/user.controller.js";

const routes = Router();

routes.route("/register ").post(RegisterUser);


export default routes;


