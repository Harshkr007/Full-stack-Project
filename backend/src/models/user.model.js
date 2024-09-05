import mongoose from 'mongoose';
import jwt from "jwt-encode";
import bcrypt from "bcrypt";
import 'dotenv/config';



const userSchema = mongoose.Schema({
    userName : {
        type: String,
        required : true,
        unique : true,
        lowercase: true,
        trim: true,
        index: true
    },
    email : {
        type: String,
        required : true,
        unique : true,
        lowercase: true,
        trim: true,
    },
    fullName : {
        type: String,
        required : true,
        lowercase: true,
        trim: true,
    },
    avatar : {
        type: String,
        required : true,
    },
    coverImage: {
        type: String,
        required : true,
    },
    passsword: {
        type: String,
        required : [true, "Password is required"],
        unique : true,
    },
    refreshToken: {
        type: String,
        required : true,
        unique : true,
    },
    watchHistory : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }]
},{timestamps: true});



userSchema.pre("save", async function(next){
    if(!this.isModified("password"))return next();

   this.passsword =  bcrypt.hash(this.passsword, 10);
     next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.passsword);
}
userSchema.methods.genrateAccessToken = function () {
   return  jwt.sing(
        {
            _id : this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env. ACCESS_TOKEN_EXPIRY
        }

    )
}
userSchema.methods.genrateRefreshToken = function () {
    return  jwt.sing(
        {
            _id : this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env. REFRESH_TOKEN_EXPIRY
        }

    )
}

export const User = mongoose.model("User",userSchema);