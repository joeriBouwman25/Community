import express from "express";
import * as uiController from "../controllers/uiController.js";
import * as messageController from "../controllers/messageController.js";

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const suffix = file.mimetype.split("/");
    cb(null, `${file.fieldname}-${Date.now()}.${suffix[1]}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router
  .get("/", uiController.renderIndex)
  .get("/post", uiController.renderCreateAPost)
  .post("/post", upload.single("file"), messageController.createMessageInDB)
  .get("/onboarding", uiController.startOnboarding);

export default router;
