import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AllRoute from "./AllRoute.js";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { initSocket } from "./Routes/chatRoom.js";

dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// Clodinary start
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});

// Port start
const Port = process.env.PORT;

const server = express();
server.use(cookieParser());
server.use(bodyParser.json());
server.use(cors(corsOptions));
server.use(fileUpload({ useTempFiles: true }));

// mongoDb start
const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTING_MONGO_DB);
    console.log("MongoDB Connecting :)");
  } catch (error) {
    console.log(error);
  }
};

// Server use start
server.use("/api", AllRoute);

const httpServer = createServer(server);
initSocket(httpServer);
httpServer.listen(Port, async () => {
  try {
    await connectMongoDb();
    console.log(`http://localhost:${Port}`);
  } catch (error) {
    console.log(error);
    console.log("baglantida problem bash verdi");
  }
});
