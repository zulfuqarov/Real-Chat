import mongoose from "mongoose";

const room = mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  roomBio: {
    type: String,
    required: true,
  },
  roomAdmin: {
    type: String,
    required: true,
    ref: "User",
  },
  roomUsers: {
    type: Array,
    required: true,
  },
  roomImage: {
    type: String,
  },
});

export default mongoose.model("Room", room);
