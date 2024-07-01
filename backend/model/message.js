import mongoose from "mongoose";

const message = mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    ref: "Room",
  },
  senderId: {
    type: String,
    required: true,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("message",message)