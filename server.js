const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const fs = require("fs");
const {
  getData,
  getGradeCard,
  getAdmitCard,
  forgotPassword,
  getNotices,
} = require("./scraper");
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 1000;
app.listen(port, console.log(`App is running on ${port}`)).setTimeout(0);

//Test Route
app.get("/test", (req, res) => {
  res.send("Hello");
});

//Get all data of the student when logging in. Data includes - Name, ImageURL, semester name and semester page url they have registered for.
app.post("/", getData);

//Route for resetting password.
app.post("/forgotPassword", forgotPassword);

//Route to get admit card of a particluar semester.
app.post("/admitCard", getAdmitCard);

//Route to get grade card of a particular semester.
app.post("/gradeCard", getGradeCard);

//Route to get notices.
app.get("/notices", getNotices);
