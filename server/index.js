const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.js");
const quizRoute = require("./routes/quizzes.js");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//midlleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
app.use(bodyParser.json({ limit: "20mb" }));

//db connection....
try {
  mongoose.connect(process.env.DB_URI, {}).then(() => {
    console.log("Database connected");
  });
} catch (err) {
  console.log(err);
}

app.use("/api/users", userRoute);
app.use("/api/quizzes", quizRoute);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
