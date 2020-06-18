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
} = require("./scraper");
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
// app.get("/testImage", (req, res) => {
//   // var data = fs.readFileSync("./screenshot.png");
//   // res.contentType("application/pdf");
//   res.download("./test.pdf");
// });
app.post("/admitCard", getAdmitCard);
app.post("/gradeCard", getGradeCard);
app.post("/forgotPassword", forgotPassword);
