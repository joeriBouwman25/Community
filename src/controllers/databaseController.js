import { Groups } from "../models/groups.js";
import { Users } from "../models/users.js";
import { Messages } from "../models/messages.js";

export const findUserforPrikBord = async (req, res) => {
  const input = req.body.name;
  const query = input.charAt(0).toUpperCase() + input.slice(1);
  const currentUser = await Users.findOne({ name: query });

  req.session.user = currentUser;

  !currentUser ? res.redirect("/") : res.redirect("/prikbord");
};

export const findAllMessages = async (req, res) => {
  const allMessages = await Messages.find({}).lean();
  return allMessages;
};

export const findMyInterestGroups = async (req, res) => {
  const myGroups = await Groups.find({}).lean();
  return myGroups;
};

export const createMessageInDB = async (req, res) => {
  const post = {
    user: req.session.user.name,
    avatar: req.session.user.avatar,
    title: req.body.title,
    message: req.body.message,
  };

  if (req.file) {
    post.file = req.file.filename;
  }

  const test = Messages.create(post);
  if (test) {
    res.redirect("/prikbord");
  }
};
