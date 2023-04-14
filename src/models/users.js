import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: String,
  name: String,
  age: Number,
  email: String,
  picture: String,
});

const Users = mongoose.model("users", userSchema);

module.exports = Users;
