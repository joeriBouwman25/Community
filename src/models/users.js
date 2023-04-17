import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: String,
  name: String,
  avatar: String,
  admin: Boolean,
});

export const Users = mongoose.model("users", userSchema);
