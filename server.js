const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//use cors
app.use(cors());

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database configuration
const dbURI = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(dbURI)
  .then(result => console.log("Mongo DB connection successful"))
  .catch(error => console.log(error));

//Passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport.js")(passport);

app.get("/", (request, response) => {
  response.send("hello world");
});

//Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
