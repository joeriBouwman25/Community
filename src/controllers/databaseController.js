import { Groups } from "../models/groups.js";
import { Users } from "../models/users.js";
import { Messages } from "../models/messages.js";
import { renderGroups, renderReactionPage } from "./uiController.js";
import { io } from "../../server.js";
import { v4 as uuidv4 } from "uuid";

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

export const findAllUsers = async (req, res) => {
  const users = await Users.find({}).lean();
  return users;
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
  const group = await Groups.findOne({ id: query }).lean();
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
    reactionID: uuidv4(),
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
  await Groups.updateMany(
    { id: groups },
    { $push: { members: req.session.user } }
  );

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

export const deleteReaction = async (req, res) => {
  const postID = req.body.delete.split("/").shift();
  const reactionID = req.body.delete.split("/").pop();

  await Messages.findOneAndUpdate(
    { _id: postID },
    {
      $pull: {
        reactions: { reactionID: reactionID },
      },
    }
  );
  res.redirect(`reactions/${postID}`);
};

export const addGroupForUser = async (req, res) => {
  await Users.findOneAndUpdate(
    { _id: req.session.user._id },
    { $push: { groups: req.body.aanmelden } }
  );
  req.session.user.groups.push(req.body.aanmelden);
  await renderGroups(req, res);
};

export const removeGroupForUser = async (req, res) => {
  await Users.findOneAndUpdate(
    { _id: req.session.user._id },
    { $pull: { groups: req.body.afmelden } }
  );
  req.session.user.groups.pop(req.body.afmelden);
  await renderGroups(req, res);
};
