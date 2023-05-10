import * as database from "./databaseController.js";

export const renderIndex = (req, res) => {
  res.render("index", { layout: "detail" });
};

export const renderOnboarding = async (req, res) => {
  if (req.path === "/onboarding/chooseGroups") {
    const allGroups = await database.findAllGroups();
    res.render(`${req.path.slice(1)}`, { allGroups, layout: "detail" });
  } else {
    res.render(`${req.path.slice(1)}`, { layout: "detail" });
  }
};

export const renderCreateAPost = async (req, res) => {
  const groups = req.session.user.groups;
  res.render("post", {
    groups,
    layout: "detail",
  });
};

export const renderChat = async (req, res) => {
  const user = req.session.user;
  res.render("chat", {
    user,
  });
};

export const renderPrikbord = async (req, res) => {
  const user = req.session.user;
  const allMessages = await database.findAllMessages(req, res);
  const myGroups = await database.findMyInterestGroups(user);

  allMessages.forEach((message) => {
    const group = myGroups.find((group) => group.id === message.group);
    if (group) {
      message.color = group.color;
      message.name = group.name;
    }
  });
  console.log(allMessages);

  await res.render("prikbord", {
    allMessages,
    user,
  });
};

export const renderGroups = async (req, res) => {
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
