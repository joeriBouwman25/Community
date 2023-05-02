import express from "express";
import * as uiController from "../controllers/uiController.js";
import * as databaseController from "../controllers/databaseController.js";
import { upload } from "../controllers/multerController.js";

const router = express.Router();

router
  .get("/", uiController.renderIndex)
  .get("/prikbord", uiController.renderPrikbord)
  .get("/post", uiController.renderCreateAPost)
  .get("/groups", uiController.renderGroups)
  .get("/groups/*", uiController.renderGroupDetail)
  .get("/chat", uiController.renderChat)
  .get("/profile", uiController.renderProfile)

  .get("/onboarding", uiController.renderOnboarding)
  .get("/onboarding/*", uiController.renderOnboarding)

  .post("/", databaseController.findUserforPrikBord)
  .post("/post", upload.single("file"), databaseController.createMessageInDB);

export default router;
