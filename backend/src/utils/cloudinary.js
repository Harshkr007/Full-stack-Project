import { v2 as cloudinary } from 'cloudinary'
import fs from "fs" // node file system manegement
import 'dotenv/config';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath)return null;
            //upload the file
           const Response = await cloudinary.uploader.upload(
                localFilePath,
                {
                    resource_type:'auto'
                }
            )
            console.log("File has been saved SuccessFully\n",Response);
            return Response;
        } catch (error) {
            //removes the locally saved temporary file as the upload operation got failed
            fs.unlinkSync(localFilePath);
            return null;
        }
  }
  export default uploadOnCloudinary;
