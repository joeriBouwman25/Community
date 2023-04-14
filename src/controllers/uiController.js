import { Messages } from "../models/messages.js";

export const renderIndex = async (req, res) => {
  const allMessages = await Messages.find({}).lean();
  await res.render("prikbord", {
    allMessages,
  });
};

export const renderCreateAPost = async (req, res) => {
  const post = {
    title: req.body.title,
    message: req.body.message,
  };

  res.render("post", post);
};
