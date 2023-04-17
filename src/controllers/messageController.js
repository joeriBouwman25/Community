import { Messages } from "../models/messages.js";

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

  Messages.create(post);
  res.redirect("/prikbord");
};
