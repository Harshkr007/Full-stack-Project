import connectDB from "./db/index.js";
import app from './app.js';

import dotenv from 'dotenv'; // Import dotenv for environment variables
dotenv.config({ path: './.env' }); // Load environment variables from .env file


connectDB()
    .then(() => {

        app.on("error", (error) => {
            console.log(`error in server connection : ${error}`);
            throw error;
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at port : ${process.env.PORT}`)
        })
    })
    .catch(
        (error) => {
            console.log("Error: ", error);
            throw error;
        }
    );


/*
import express from "express";

const app = express();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        app.on("error", (error) => {
            console.log("Error: ",error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listning on port ${process.env.PORT}`);
        } )
    } catch (error) {
        console.log("Error : ",error)
        throw error;
    }

    connectDB();
}
    */