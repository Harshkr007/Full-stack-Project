import mongoose from "mongoose";
import  {DB_NAME} from "../constants.js"

/*

const connectDB = async () => {
    try {
      const connectionInstance =   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      console.log(`\n MongoDB  connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error",error);
        process.exit(1);
    }
}

*/
const connectDB = async () => {
    try {
        // Connect to MongoDB using the connection string and database name
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        
        console.log(`\nMongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);  // Exit the process on MongoDB connection failure
    }
};


export default connectDB;