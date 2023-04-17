import { Messages } from "../models/messages.js";
import { Users } from "../models/users.js";

export const renderIndex = (req, res) => {
  res.render("index");
};

export const renderPrikbord = async (req, res) => {
  const input = req.body.name;

  const query = input.charAt(0).toUpperCase() + input.slice(1);

  const allMessages = await Messages.find({}).lean();
  const currentUser = await Users.findOne({ name: query });

  !currentUser
    ? res.redirect("/")
    : await res.render("prikbord", {
        allMessages,
        avatar: currentUser.avatar,
      });
};

export const startOnboarding = (req, res) => {
  res.render("onboarding");
};

export const renderCreateAPost = async (req, res) => {
  res.render("post");
};
