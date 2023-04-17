import { Users } from "../models/users.js";

export const findUserforPrikBord = async (req, res) => {
  const input = req.body.name;
  const query = input.charAt(0).toUpperCase() + input.slice(1);
  const currentUser = await Users.findOne({ name: query });

  req.session.user = currentUser;

  !currentUser ? res.redirect("/") : res.redirect("/prikbord");
};
