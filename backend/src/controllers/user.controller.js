import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const RegisterUser = asyncHandler(
    async (req, res) => {
        //user input value
        //check for non empty values
        //check if the user already exist using username and emailId
        //check avatar exist
        //If YES then store image at cloudnariy
        //storethe value in Data base
        //remove the password and refesh Token from  the response 
        //check for user creation
        //return the response

        const { userName, email, fullName, password } = req.body;

        if ([userName, email, fullName, password].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All feilds are required")
        }

        const existUser = await User.findOne({
            $or: [{ userName }, { email }]
        })

        if (existUser) {
            throw new ApiError(400, "User with email or username already exists");
        }

        const avatarLocalPath = req.files?.avatar[0]?.path;

        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
        }

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if (!avatar) {
            throw new ApiError(400, "Avatar file is required1")
        }

        const user = User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: userName.toLowerCase()
        })

        const createdUser = await user.findById(user._id).select(
            "-password -refreshToken"
        )

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User sucessfully created")
        )
    }
)

export { RegisterUser } 