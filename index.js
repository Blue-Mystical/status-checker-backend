import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";
dotenv.config();
const app = express();

// Backend PORT
const PORT = process.env.PORT || 3001;

app.use(cors({ 
    origin: true, 
    credentials: true,
    origin: [
        // Frontend PORT
        'http://localhost:3000',
    ] }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
 
app.listen(PORT, ()=> console.log('Backend running at port 3001'));