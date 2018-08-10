const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// DB config
const db = require("./config/keys").mongoURI;

// Connect to Mongodb
mongoose
  .connect(db)
  .then(() => console.log("Connected to mongodb"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello world from the index page!"));

// User routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 8081;

app.listen(port, () => console.log(`Server is running on port ${port}`));
