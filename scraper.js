const puppeteer = require("puppeteer");
const fs = require("fs");
const cors = require("cors")({ origin: true });

exports.getData = async (req, res) => {
  cors(req, res, async () => {
    console.log("Starting Process");
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

    const page = await browser.newPage();
    await page.goto("http://juadmission.jdvu.ac.in/jums_exam/");
    console.log("Loaded Login Page");
    // uname = req.body.uname;
    var notice = "";
    await page.waitForSelector("table").then(async () => {
      notice = await page.evaluate(() => {
        const notice = document
          .querySelector("body > table > tbody > tr > td > font > div")
          .innerText.trim()
          .split("\n\n");
        return notice;
      });
    });
    console.log(notice);
    // console.log(await page.content());
    // await page.screenshot({ path: "screenshot.png" });
    //ID 001811601047
    await page.type("[name=uname]", req.body.uname);

    //PASSWORD 158261ed
    await page.type("[name=pass]", req.body.pass);

    await page.click("[type=submit]");
    console.log("Filled Credentials");
    await page.waitFor(1000);
    console.log("Loaded Profile Page");
    // await page.screenshot({ path: "screenshot.png" });
    var data = {};
    await page.waitForSelector("table").then(async () => {
      console.log("Populating data");
      data = await page.evaluate(() => {
        const name = document
          .querySelector(
            "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)"
          )
          .textContent.trim();
        console.log("Got name");
        const course = document
          .querySelector(
            "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td:nth-child(2)"
          )
          .textContent.trim();
        console.log("Got Courses");
        const imgUrl = document.querySelector(
          "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > table > tbody > tr > td:nth-child(2) > img"
        );
        console.log("Got imgUrl");
        const buttons = [];
        document.querySelectorAll("#submit_button").forEach((a) => {
          buttons.push({ text: a.textContent, link: a.href });
          // console.log({ text: a.textContent, link: a.href });
        });
        // console.log(buttons);

        console.log("Got Buttons");
        return {
          name: name,
          course: course,
          buttons: buttons,
          imgUrl: imgUrl.src,
        };
      });
      // console.log(await data);
    });
    console.log("Got Data from Profile Page");
    str = JSON.stringify(data);
    data.notices = notice;
    res.json(data);
    console.log("Sent Response");
    // console.log(data.name);
    // await page.waitFor(1000);

    // await page.goto(
    //   "http://juadmission.jdvu.ac.in/jums_exam/student_odd_2019/index.jsp"
    // );

    // await page.waitFor(3000);
    // await page.screenshot({ path: "screenshot.png", fullPage: true });
    await browser.close();
    console.log("Closed Browser");
  });
};

//PASSWORD 158261ed
exports.getAdmitCard = async (req, res) => {
  console.log("Started Process");
  cors(req, res, async () => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    console.log("Launched Browser");
    const page = await browser.newPage();
    await page.goto("http://juadmission.jdvu.ac.in/jums_exam/");
    // uname = req.body.uname;

    // console.log(await page.content());
    // await page.screenshot({ path: "screenshot.png" });
    //ID 001811601047
    await page.type("[name=uname]", req.body.uname);

    //PASSWORD 158261ed
    await page.type("[name=pass]", req.body.pass);

    await page.click("[type=submit]");
    console.log("Filled Credentials");
    await page.waitFor(1000);
    // await page.screenshot({ path: "screenshot.png" });
    await page.goto(req.body.url);

    await page.waitFor(1000);
    console.log("Go to Semester Page");
    // await page.screenshot({ path: "screenshot.png", fullPage: true });
    const data = await page.evaluate(() => {
      // const admitCard = document.querySelector(
      //   "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > div > table > tbody > tr > td:nth-child(4) > a"
      // ).href;
      const admitCard = document.querySelector(
        "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > div > table > tbody > tr > td:nth-child(4) > a"
      ).href;
      console.log("Got url of Admit Card");
      return {
        admitCard: admitCard,
      };
    });
    await page.goto(data.admitCard);
    console.log("Goto Admit Card URL");
    // await page.waitFor(3000);
    // str = JSON.stringify(data);
    // console.log(await page.content());
    await page.emulateMediaType("screen");
    await page.pdf({ path: `${req.body.uname}.pdf` });
    console.log("Coverted to PDF");
    res.download(`./${req.body.uname}.pdf`);
    console.log("Converted to PDF");
    // console.log(data.admitCard);
    // await page.waitFor(3000);

    await browser.close();
    console.log("Closed Browser");
    fs.unlink(`${req.body.uname}.pdf`, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Successfully deleted the file.");
      }
    });
  });
};
exports.getGradeCard = async (req, res) => {
  console.log("Started Process");
  cors(req, res, async () => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    console.log("Launched Browser");
    const page = await browser.newPage();
    await page.goto("http://juadmission.jdvu.ac.in/jums_exam/");
    // uname = req.body.uname;

    // console.log(await page.content());
    // await page.screenshot({ path: "screenshot.png" });
    //ID 001811601047
    await page.type("[name=uname]", req.body.uname);

    //PASSWORD 158261ed
    await page.type("[name=pass]", req.body.pass);

    await page.click("[type=submit]");
    console.log("Filled Credentials");
    await page.waitFor(1000);
    // await page.screenshot({ path: "screenshot.png" });
    await page.goto(req.body.url);

    await page.waitFor(1000);
    console.log("Go to Semester Page");
    // await page.screenshot({ path: "screenshot.png", fullPage: true });
    const data = await page.evaluate(() => {
      // const admitCard = document.querySelector(
      //   "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > div > table > tbody > tr > td:nth-child(4) > a"
      // ).href;
      const gradeCard = document.querySelector(
        "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > div > table > tbody > tr > td:nth-child(5) > a"
      ).href;
      console.log("Got url of Grade Card");
      return {
        gradeCard: gradeCard,
      };
    });
    await page.goto(data.gradeCard);
    console.log("Goto Grade Card Card URL");
    // await page.waitFor(3000);
    // str = JSON.stringify(data);
    // console.log(await page.content());
    await page.emulateMediaType("screen");
    await page.pdf({ path: `${req.body.uname}.pdf` });
    console.log("Coverted to PDF");
    res.download(`./${req.body.uname}.pdf`);
    console.log("Converted to PDF");
    // console.log(data.admitCard);
    // await page.waitFor(3000);

    await browser.close();
    console.log("Closed Browser");
    fs.unlink(`${req.body.uname}.pdf`, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Successfully deleted the file.");
      }
    });
  });
};
