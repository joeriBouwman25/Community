import * as database from "./databaseController.js";

export const renderIndex = (req, res) => {
  res.render("index", { layout: "detail" });
};

export const renderOnboarding = (req, res) => {
  res.render(`${req.path.slice(1)}`, { layout: "detail" });
};

export const renderCreateAPost = async (req, res) => {
  const groups = req.session.user.groups;
  res.render("post", {
    groups,
    layout: "detail",
  });
};

export const renderChat = async (req, res) => {
  res.render("chat");
};

export const renderPrikbord = async (req, res) => {
  const allMessages = await database.findAllMessages(req, res);
  const user = req.session.user;

  await res.render("prikbord", {
    allMessages,
    user,
  });
};

export const renderGroups = async (req, res) => {
  const user = req.session.user;
  const allGroups = await database.findAllGroups();
  const myGroups = await database.findMyInterestGroups(user);
  res.render("groups", {
    allGroups,
    myGroups,
  });
};

export const renderGroupDetail = async (req, res) => {
  const query = req.params[0];
  const user = req.session.user;
  const group = await database.findOneGroup(query);
  const submitted = user.groups.find((groups) => groups === group.name);
  res.render("groupDetail", {
    group,
    submitted,
    layout: "detail",
  });
};

export const renderProfile = async (req, res) => {
  const user = req.session.user;
  const groups = await database.findMyInterestGroups(user);
  res.render("profile", {
    user,
    groups,
  });
};
