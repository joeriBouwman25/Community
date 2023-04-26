import mongoose from "mongoose";
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: String,
  description: String,
  members: String,
});

export const Groups = mongoose.model("groups", groupSchema);
