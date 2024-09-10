import { Router } from "express";
import { RegisterUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const routes = Router();

// Route for registering a user with file uploads
routes.route("/register").post(
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), 
    RegisterUser
);

export default routes;

