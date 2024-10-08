const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const postRouter = require("./routes/post.route");
const commentRouter = require("./routes/comment.route");
const searchRouter = require("./routes/search.route");

mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connect(process.env.MONGO_URL);

const app = express();
const PORT = process.env.PORT;

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(morgan("common"));
app.use(cors({ origin: process.env.BASE_URL }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/search", searchRouter);

app.listen(PORT, () => {
  console.log("your api is running at http://localhost:" + 8080);
});
