import mongoose from "mongoose";
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  id: String,
  avatar: String,
  name: String,
  description: String,
  members: Array,
});

export const Groups = mongoose.model("groups", groupSchema);

[user_id: String,]
