const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { getData } = require("./scraper");
app.use(bodyParser.urlencoded({ extended: true }));

const port = 1000;
app.listen(port, console.log(`App is running on ${port}`));
app.get("/", getData);
