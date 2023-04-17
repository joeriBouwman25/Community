import { Messages } from "../models/messages.js";

export const renderIndex = (req, res) => {
  res.render("index");
};

export const renderPrikbord = async (req, res) => {
  const allMessages = await Messages.find({}).lean();
  const user = req.session.user;

  await res.render("prikbord", {
    allMessages,
    user,
  });
};

export const startOnboarding = (req, res) => {
  res.render("onboarding");
};

export const renderCreateAPost = async (req, res) => {
  res.render("post");
};
