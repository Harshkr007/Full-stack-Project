import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jwt-encode";
import uploadOnCloudinary from "../utils/cloudinary.js";
// import mongoose from "mongoose";

const genrateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.genrateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while genrating refreshing and access token")
    }
}

const options = {
    httpOnly: true,
    secure: true,
}

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

        // const avatarLocalPath = req.files?.avatar[0]?.path;
        let avatarLocalPath;
        if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
            avatarLocalPath = req.files.avatar[0].path
        }
        console.log(avatarLocalPath);


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

        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            userName: userName.toLowerCase()
        })
        console.log(user);

        /*
        const createdUser = await User.findById(new mongoose.Types.ObjectId(user._id)).select(
            "-password -refreshToken"
        )
        */
        const { password: _, refreshToken: __, ...createdUser } = user.toObject();

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User sucessfully created")
        )
    }
)

const loginUser = asyncHandler(async (req, res) => {
    //req body 
    //username or email
    //find the user
    //password check
    ///access and refresh token
    //send cookie
    const { email, username, password } = req.body;

    if ((!username || !email)) {
        throw new ApiError(400, "username or password is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect");
    }

    const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
                "User logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    //clear accessToken refreshToken
    //clear refreshToken from db
    const user = req.user;
    const userId = user._id;

    const Updateuser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined
            },
        }, {
        new: true
    }
    )

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshAccessToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized token");
    }

    try {
        const token = await jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(token?._id);

        if (!user) {
            throw new ApiError(401, "Invalid user token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired");
        }

        const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken, refreshToken
                }),
                "accessToken refreshed"
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export {
    RegisterUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} 