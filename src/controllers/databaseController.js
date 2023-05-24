import { Groups } from "../models/groups.js";
import { Users } from "../models/users.js";
import { Messages } from "../models/messages.js";
import { renderReactionPage } from "./uiController.js";
import { io } from "../../server.js";

export const findUserforPrikBord = async (req, res) => {
  const input = req.body.name;
  const query = input.charAt(0).toUpperCase() + input.slice(1);
  const currentUser = await Users.findOne({ name: query });

  req.session.user = currentUser;
  if (!currentUser) {
    res.redirect("/");
  } else if (currentUser.groups.length > 0) {
    res.redirect("/prikbord");
  } else {
    res.redirect("/onboarding");
  }
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
    reactions: [],
  };

  if (req.file) {
    post.file = req.file.filename;
  }

  const response = Messages.create(post);
  if (response) {
    io.emit("new post", post);
    res.redirect("/prikbord");
  }
};

export const postReaction = async (req, res) => {
  const reaction = {
    user: req.session.user.name,
    avatar: req.session.user.avatar,
    reaction: req.body.reaction,
  };

  await Messages.updateOne(
    { _id: req.params[0] },
    { $push: { reactions: reaction } }
  );

  renderReactionPage(req, res);
};

export const uploadGroups = async (req, res) => {
  const groups = Object.keys(req.body);
  req.session.user.groups = groups;

  await Users.updateOne(
    { name: req.session.user.name },
    { $set: { groups: groups } }
  );

  await res.redirect("/prikbord");
};

export const handlePostsettings = async (req, res) => {
  await Messages.deleteOne({
    _id: req.body.delete,
  });
  res.redirect("/prikbord");
};
