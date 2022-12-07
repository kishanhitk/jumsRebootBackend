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

// Use the CORS middleware to allow cross-origin requests
app.use(cors());

// Use the Morgan middleware to log requests to the console
// Set the log level to "combined" to include useful information like the request method, URL, response status code, and response time
app.use(morgan("combined"));

// Use the body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Set the port number for the app to the value of the PORT environment variable or 3000 if the variable is not set
// Use the timeout method of the Server object to set the timeout for the app to 0
const port = process.env.PORT || 3000;
const server = app.listen(port, console.log(`App is running on ${port}`));
server.timeout = 0;

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
