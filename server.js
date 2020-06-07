const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const { getData } = require("./scraper");
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 1000;
app.listen(port, console.log(`App is running on ${port}`));
// app.get("/", getData);
app.post("/", getData);
