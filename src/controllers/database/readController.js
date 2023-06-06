import { Users } from "../models/users.js";
import { Messages } from "../models/messages.js";
import { Groups } from "../models/groups.js";

// USERS
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

// MESSAGES
export const findOneMessage = async (query) => {
  const message = await Messages.findOne({ _id: query }).lean();
  return message;
};

export const findAllMessages = async (req, res) => {
  const myGroups = req.session.user.groups;
  const allMessages = await Messages.find({}).lean();
  const myMessages = allMessages.filter((message) =>
    myGroups.includes(message.group)
  );
  return myMessages;
};

// GROUPS
export const findOneGroup = async (query) => {
  const group = await Groups.findOne({ id: query }).lean();
  return group;
};

export const findMyInterestGroups = async (user) => {
  const userGroups = user.groups;
  const myGroups = await Groups.find({ id: userGroups }).lean();
  return myGroups;
};

export const findAllGroups = async () => {
  const allGroups = await Groups.find({}).lean();
  return allGroups;
};
