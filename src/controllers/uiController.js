import { Messages } from "../models/messages.js";
import * as database from "./databaseController.js";

// INLOG
// **************
export const renderIndex = (req, res) => {
  req.session = null;
  res.render("index", { layout: "detail" });
};

// ONBOARDING
// **************
export const renderOnboarding = (req, res) => {
  res.render("onboarding", { layout: "detail" });
};

export const renderChooseGroups = async (req, res) => {
  const allGroups = await database.findAllGroups();
  res.render("chooseGroups", {
    allGroups,
    layout: "detail",
  });
};

// PRIKBORD
// **************
export const renderPrikbord = async (req, res) => {
  const user = req.session.user;
  const myGroups = req.session.user.groups;
  const allMessages = await database.findAllMessages(myGroups);
  allMessages.forEach((message) => {
    const group = myGroups.find((group) => group.id === message.group);
    if (group) {
      message.color = group.color;
      message.name = group.name;
    }
    if (message.user === user.name) {
      message.editable = true;
    }
  });

  await res.render("prikbord", {
    allMessages,
    user,
  });
};

export const renderCreateAPost = async (req, res) => {
  const user = req.session.user;
  const myGroups = await database.findMyInterestGroups(user);
  res.render("post", {
    myGroups,
    layout: "detail",
  });
};

export const renderUpdatePost = async (req, res) => {
  const postId = req.params["0"];
  const user = req.session.user;
  const post = await database.findOneMessage(postId);
  const myGroups = await database.findMyInterestGroups(user);

  res.render("updatePost", {
    post,
    myGroups,
    layout: "detail",
  });
};

export const renderReactionPage = async (req, res) => {
  const user = req.session.user;
  const postID = req.path.split("/").pop();
  const message = await Messages.findOne({
    _id: postID,
  }).lean();

  message.reactions.forEach((reaction) => {
    if (reaction.user === user.name) {
      reaction.editable = true;
    }
  });

  res.render("reactions", {
    message,
    postID,
    layout: "detail",
  });
};

// CHAT
// **************
export const renderChat = async (req, res) => {
  const user = req.session.user;
  const allUsers = await database.findAllUsers();
  req.session.user.admin
    ? res.render("rooms", { allUsers })
    : res.render("chat", {
        user,
        layout: "detail",
      });
};

export const renderChatForAdmin = async (req, res) => {
  const user = req.session.user;
  const roomName = req.body.chat;
  res.render("chat", {
    user,
    roomName,
    layout: "detail",
  });
};

// GROUPS
// **************
export const renderGroups = async (req, res) => {
  let showToast;
  let toastId;
  if (req.body.aanmelden) {
    const toastText = await database.findOneGroup(req.body.aanmelden);
    showToast = `Aangemeld voor ${toastText.name}`;
    toastId = "signupToast";
  } else if (req.body.afmelden) {
    const toastText = await database.findOneGroup(req.body.afmelden);
    showToast = `Afgemeld van ${toastText.name}`;
    toastId = "signoffToast";
  }
  const user = req.session.user;
  const allGroups = await database.findAllGroups();
  const myGroups = await database.findMyInterestGroups(user);
  const names = myGroups.map((group) => group.name);
  const filteredGroups = allGroups.filter(
    (groups) => !names.includes(groups.name)
  );
  res.render("groups", {
    filteredGroups,
    myGroups,
    showToast,
    toastId,
  });
};

export const renderGroupDetail = async (req, res) => {
  const query = req.params[0];
  const user = req.session.user;
  const group = await database.findOneGroup(query);
  const submitted = user.groups.find((groups) => groups === group.id);
  res.render("groupDetail", {
    group,
    submitted,
    layout: "detail",
  });
};

// PROFILE
// **************
export const renderProfile = async (req, res) => {
  const user = req.session.user;
  const groups = await database.findMyInterestGroups(user);
  res.render("profile", {
    user,
    groups,
  });
};
