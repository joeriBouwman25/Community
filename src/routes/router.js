import express from "express";
import * as uiController from "../controllers/uiController.js";
import * as messageController from "../controllers/messageController.js";
import * as databaseController from "../controllers/databaseController.js";
import { upload } from "../controllers/multerController.js";

const router = express.Router();

router
  .get("/", uiController.renderIndex)
  .get("/prikbord", uiController.renderPrikbord)
  .get("/post", uiController.renderCreateAPost)

  .post("/", databaseController.findUserforPrikBord)
  .post("/post", upload.single("file"), messageController.createMessageInDB);
// .get("/onboarding", uiController.startOnboarding);

export default router;
