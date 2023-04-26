import * as database from "./databaseController.js";

export const renderIndex = (req, res) => {
  res.render("index", { layout: "detail" });
};

export const startOnboarding = (req, res) => {
  res.render("onboarding");
};

export const renderCreateAPost = async (req, res) => {
  res.render("post", { layout: "detail" });
};

export const renderChat = async (req, res) => {
  res.render("chat", {
    user: req.session.user.name,
  });
};

export const renderPrikbord = async (req, res) => {
  const allMessages = await database.findAllMessages();
  const user = req.session.user;

  await res.render("prikbord", {
    allMessages,
    user,
  });
};

export const renderGroups = async (req, res) => {
  const groups = await database.findMyInterestGroups();
  res.render("groups", {
    groups,
  });
};

export const renderProfile = async (req, res) => {
  const user = req.session.user;
  const groups = await database.findMyInterestGroups();
  res.render("profile", {
    user,
    groups,
  });
};
