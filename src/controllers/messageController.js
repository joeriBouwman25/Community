import { Messages } from "../models/messages.js";

export const createMessageInDB = async (req, res) => {
  const post = {
    title: req.body.title,
    message: req.body.message,
    file: req.file.filename,
  };

  Messages.create(post);
  res.redirect("/");
};
