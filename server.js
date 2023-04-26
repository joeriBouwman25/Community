import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import "dotenv/config";
import compression from "compression";
import session from "express-session";

import router from "./src/routes/router.js";

const port = process.env.PORT || 3000;
const url = process.env.DB_URL;

const app = express();
const server = createServer(app);
export const io = new Server(server);

app
  .engine(".hbs", engine({ extname: ".hbs" }))
  .set("view engine", ".hbs")
  .set("views", "views")
  .use(
    session({
      secret: "test",
      resave: false,
      saveUninitialized: true,
    })
  )

  .use(cors())
  .use(compression())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static("public"))
  .use("/static", express.static(path.join(__dirname, "public")))
  .use(router);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    server.listen(port, () => console.log(`Server launched on port ${port} 🚀`))
  )
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("connected van Iphone tot Blackberry📱");

  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
