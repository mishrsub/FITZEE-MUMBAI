import dotenv from "dotenv";
dotenv.config();
import express from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import router from "./routers/route.js";
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.set("view engine","ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json({limit:"30mb"}));
//cookie parser
app.use(cookieParser()); 
app.use(cors({
    // origin: process.env.ORIGIN // Assuming process.env.ORIGIN is an array of allowed origins
    // origin:process.env.SINGLE_ORIGIN
    origin:"*"
}));

// Log the path before serving images (Image path: D:\Fitjee LMS\uploads)
const imagePath = join(__dirname, '../uploads');
console.log('Image path:', imagePath);

// Serve images
app.use('/uploads', express.static(join(__dirname, '../uploads')));
app.use("/api",router);

app.all("*",(req,res,next) =>{
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
});

// npm config set strict-ssl false