import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jwt-encode"
import { User } from "../models/user.model";

const verifyJWT = asyncHandler (async  (req,res,next) => {
       try {
         const token = req.cookies?.accessToken || req.header("Authorization")?.repalce("Bearer ","");
         if(!token){
             throw new ApiError(401,"Unauthorized request");
         }
 
         const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 
         const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
 
         if(!user){
             throw new ApiError(401,"Invalid access token");
         }
 
         req.user = user;
         next();
       } catch (error) {
            throw new ApiError(401, error?.message || "Invalid access token")
       }
})
export {verifyJWT};