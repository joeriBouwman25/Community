import { v4 as uuidv4 } from "uuid";
import { Groups } from "../models/groups.js";
import { Users } from "../models/users.js";
import { Messages } from "../models/messages.js";

export const findUserforPrikBord = async (req, res) => {
  const input = req.body.name;
  const query = input.charAt(0).toUpperCase() + input.slice(1);
  const currentUser = await Users.findOne({ name: query });

  req.session.user = currentUser;

  !currentUser ? res.redirect("/") : res.redirect("/onboarding");
};

export const findAllMessages = async (req, res) => {
  const myGroups = req.session.user.groups;
  const allMessages = await Messages.find({}).lean();
  const myMessages = allMessages.filter((message) =>
    myGroups.includes(message.group)
  );
  return myMessages;
};

export const findAllGroups = async () => {
  const allGroups = await Groups.find({}).lean();
  return allGroups;
};

export const findMyInterestGroups = async (user) => {
  const userGroups = user.groups;
  const myGroups = await Groups.find({ id: userGroups }).lean();
  return myGroups;
};

export const findOneGroup = async (query) => {
  const group = await Groups.findOne({ name: query }).lean();
  return group;
};

export const createMessageInDB = async (req, res) => {
  const post = {
    user: req.session.user.name,
    avatar: req.session.user.avatar,
    title: req.body.title,
    message: req.body.message,
    group: req.body.group,
  };

  if (req.file) {
    post.file = req.file.filename;
  }

  const test = Messages.create(post);
  if (test) {
    res.redirect("/prikbord");
  }
};

export const uploadGroups = async (req, res) => {
  const groups = Object.keys(req.body);
  await Users.updateOne(
    { name: req.session.user.name },
    { $set: { groups: groups } }
  );

  res.redirect("/prikbord");
};
