import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  username: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model<IUser>("User", userSchema);
