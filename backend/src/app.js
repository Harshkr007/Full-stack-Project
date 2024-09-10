import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();

// Enable CORS with specific options
app.use(cors({
    origin: process.env.CORS_ORIGIN,  
    optionsSuccessStatus: 200,
    credentials: true,
}));

// Parse JSON and URL-encoded data
app.use(express.json({ limit: "128kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Use cookie parser middleware
app.use(cookieParser());

// Use the userRouter for user-related routes
app.use("/api/v1/user", userRouter);

export default app;


/*
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"




const app = express();

app.use(cors({
    origin: process.env.CORS_ORGIN,
    optionsSuccessStatus: 200 ,
    credentials: true,
}))

app.use(express.json({limit: "128kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser);


//Routes imports
import userRouter from "./routes/user.routes.js"


//routes declaration
app.use("/api/v1/user" , userRouter);



export default app;
*/