import express from "express";
import * as uiController from "../controllers/uiController.js";
import * as messageController from "../controllers/messageController.js";
import { upload } from "../controllers/multerController.js";

const router = express.Router();

router
  .get("/", uiController.renderIndex)
  .post("/", uiController.renderPrikbord)

  .get("/prikbord", uiController.renderPrikbord)

  .get("/post", uiController.renderCreateAPost)
  .post("/post", upload.single("file"), messageController.createMessageInDB);
// .get("/onboarding", uiController.startOnboarding);

export default router;
