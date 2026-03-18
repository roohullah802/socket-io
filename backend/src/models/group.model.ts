import mongoose, { ObjectId } from "mongoose";

const groupSchema = new mongoose.Schema({
  name: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Group = mongoose.model("Group", groupSchema);
