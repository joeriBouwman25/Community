import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: String,
  message: String,
  file: String,
});

export const Messages = mongoose.model("messages", messageSchema);
