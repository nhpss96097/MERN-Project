const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.MONGOPORT;
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
const { course } = require("./models");
require("./confg/passport")(passport);
const cors = require("cors");
const path = require("path");
const mongodbUrl = "mongodb://127.0.0.1/mernDB";

// 連結MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);

// course route 要被 JWT 保護
// 只有登入系統的人才能新增或註冊課程 -驗證 JWT
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

// port 不使用3000(因為是 React 預設使用的 port )
app.listen(`0.0.0.0:${port}`, () => {
  // console.log(`後端伺服器運行在port ${port}`);
  console.log(`後端伺服器運行中`);
});
