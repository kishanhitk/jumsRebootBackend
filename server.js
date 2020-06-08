const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const { getData, getSemesterData } = require("./scraper");
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 1000;
app.listen(port, console.log(`App is running on ${port}`)).setTimeout(0);
// app.get("/", getData);
app.post("/", getData);
app.get("/test", (req, res) => {
  res.send("Hello");
});
app.post("/semester", getSemesterData);

