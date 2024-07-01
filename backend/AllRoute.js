import express from "express";
import userAuth from "./Routes/userAuth.js";
import chatRoom from "./Routes/chatRoom.js";

const router = express.Router();

router.use("/userAuth", userAuth);
router.use("/room", chatRoom);
export default router;
