import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: { type: String },
    content: { type: String },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);
