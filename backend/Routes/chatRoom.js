import express from "express";
import room from "../model/room.js";
import message from "../model/message.js";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

const router = express.Router();

router.post("/createRoom", async (req, res) => {
  const { roomName, roomBio } = req.body;
  const token = req.cookies.jwtToken;

  const defaultImg =
    "https://www.clipartmax.com/png/full/103-1038438_computer-icons-symbol-home-home-icon.png";

  let roomProfilePicture =
    req.files && req.files.roomProfilePicture
      ? req.files.roomProfilePicture.tempFilePath
      : defaultImg;

  if (roomProfilePicture !== defaultImg) {
    roomProfilePicture = await cloudinary.uploader.upload(roomProfilePicture, {
      use_filename: true,
      folder: "Home",
    });
  }

  try {
    if (token) {
      const decodedToke = jwt.verify(token, process.env.TOKEN_SECRET_CODE);
      const roomNameChek = await room.findOne({
        roomName: roomName,
      });
      if (roomNameChek) {
        return res.status(400).json({ message: "Room name already exist" });
      } else {
        const newRoom = new room({
          roomName,
          roomBio,
          roomAdmin: decodedToke.sub,
          roomImage:
            roomProfilePicture !== defaultImg
              ? roomProfilePicture.url
              : roomProfilePicture,
        });

        await newRoom.save();

        return res.status(200).json({
          message: "room has been created",
        });
      }
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/roomAll", async (req, res) => {
  try {
    const allRooms = await room.find({});
    return res.status(200).json(allRooms);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/roomCheckUser/:roomName", async (req, res) => {
  const token = req.cookies.jwtToken;
  const { roomName } = req.params;
  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_CODE);
      const roomCheck = await room
        .findOne({
          roomName: roomName,
        })
        .populate("roomAdmin", "userName fullName profilePicture");
      if (roomCheck) {
        if (roomCheck.roomUsers.includes(decodedToken.sub)) {
          return res
            .status(200)
            .json({ message: "You are entered this room", room: roomCheck });
        } else {
          return res
            .status(400)
            .json({ message: "You are not entered this room" });
        }
      } else {
        return res.status(404).json({ message: "Room not found" });
      }
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/roomEnter/:roomName", async (req, res) => {
  const { roomName } = req.params;
  const token = req.cookies.jwtToken;
  try {
    if (token) {
      const decodedToke = jwt.verify(token, process.env.TOKEN_SECRET_CODE);
      const roomCheck = await room.findOne({
        roomName: roomName,
      });

      if (roomCheck) {
        if (!roomCheck.roomUsers.includes(decodedToke.sub)) {
          await roomCheck.updateOne({ $push: { roomUsers: decodedToke.sub } });
          return res.status(200).json({
            message: "You entered the room",
            roomName: roomName,
          });
        } else {
          return res
            .status(400)
            .json({ message: "You are already in the room" });
        }
      } else {
        return res.status(404).json({ message: "Room not found" });
      }
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/roomLeav/:roomName", async (req, res) => {
  const { roomName } = req.params;
  const token = req.cookies.jwtToken;
  try {
    if (token) {
      const decodedToke = jwt.verify(token, process.env.TOKEN_SECRET_CODE);
      const roomCheck = await room.findOne({
        roomName: roomName,
      });

      if (roomCheck) {
        if (roomCheck.roomUsers.includes(decodedToke.sub)) {
          await roomCheck.updateOne({ $pull: { roomUsers: decodedToke.sub } });
          return res.status(200).json({
            message: "You left the room",
            roomName: roomName,
          });
        } else {
          return res.status(400).json({ message: "You are not in the  room" });
        }
      } else {
        return res.status(404).json({ message: "Room not found" });
      }
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/roomMessage/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const { content } = req.body;
  const token = req.cookies.jwtToken;
  try {
    if (token) {
      const decodedToke = jwt.verify(token, process.env.TOKEN_SECRET_CODE);

      const newMessage = new message({
        content,
        senderId: decodedToke.sub,
        roomId,
      });

      await newMessage.save();

      res.status(200).json({
        message: "Message has been sent",
        newMessage,
      });
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/roomMessage/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const roomMessage = await message
      .find({
        roomId: roomId,
      })
      .populate("senderId", "userName fullName profilePicture");

    res.status(200).json({
      message: "roomMessage",
      roomMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/room/:roomName", async (req, res) => {
  const { roomName } = req.params;
  try {
    const FindRoom = await room.findOne({
      roomName: roomName,
    });
    if (FindRoom) {
      return res.status(200).json(FindRoom);
    } else {
      return res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/roomDelete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await room.findByIdAndDelete(id);
    return res.status(200).json({ message: "Room has been deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/adminsRoom", async (req, res) => {
  const token = req.cookies.jwtToken;
  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_CODE);
      const roomAdmin = await room.find({
        roomAdmin: decodedToken.sub,
      });
      return res.status(200).json(roomAdmin);
    }
  } catch (error) {
    console.log(error);
  }
});

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://cuddly-chainsaw-ggqrrjx6vpwcvpwv-5173.app.github.dev",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (SocketData) => {
    console.log("connecting succesfuly");

    SocketData.on("joinRoom", (roomName, userName) => {
      SocketData.join(roomName);
      console.log(`user ${userName} room ${roomName} join`);
    });

    SocketData.on("acceptMessage", async (roomName, data) => {
      io.to(roomName).emit("sendMessage", data);
      console.log(roomName, data.message);
    });
  });
};

export default router;
