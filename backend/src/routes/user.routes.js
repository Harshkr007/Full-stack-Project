import { Router } from "express";
import { loginUser, logoutUser, RegisterUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const routes = Router();

// Route for registering a user with file uploads
routes.route("/register").post(
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), 
    RegisterUser
);

routes.route("/login").post(loginUser);

//secured routes
routes.route("/logout").post(verifyJWT,logoutUser);

export default routes;

