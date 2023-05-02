import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  user: String,
  avatar: String,
  title: String,
  message: String,
  file: String,
  group: String,
});

export const Messages = mongoose.model("messages", messageSchema);
