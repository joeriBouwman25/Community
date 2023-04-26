import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: String,
  name: String,
  avatar: String,
  admin: Boolean,
  groups: Array,
});

export const Users = mongoose.model("users", userSchema);
