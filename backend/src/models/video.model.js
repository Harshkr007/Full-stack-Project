import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = mongoose.Schema({
    videoFile : {
        type : String,
        required : true,
        unique : true,
    },
    thumbnail : {
        type : String,
        required: true,
    },
    owner : {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true,"Owner Needed"],
    },
    title: {
        type: String,
        required : true,
    },
    description: {
        type : String,
    },
    duration : {
        type : Number,
        required: true,
    },
    views: {
        types : Number,
        default: 0,
        required: true,
    },
    isPublished : {
        type : Boolean,
        required: true 
    }
},{timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video",videoSchema);