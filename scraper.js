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

    await page.type("[name=uname]", req.body.uname);

    await page.type("[name=pass]", req.body.pass);

    await page.click("[type=submit]");
    console.log("Filled Credentials");
    await page.waitFor(1000);
    console.log("Loaded Profile Page");

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
        });

        console.log("Got Buttons");
        return {
          name: name,
          course: course,
          buttons: buttons,
          imgUrl: imgUrl.src,
        };
      });
    });
    console.log("Got Data from Profile Page");
    str = JSON.stringify(data);
    data.notices = notice;
    res.json(data);
    console.log("Sent Response");

    await browser.close();
    console.log("Closed Browser");
  });
};

//PASSWORD 158261ed

exports.getGradeCard = async (req, res) => {
  console.log("Started Process");
  cors(req, res, async () => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    console.log("Launched Browser");
    const page = await browser.newPage();
    await page.goto("http://juadmission.jdvu.ac.in/jums_exam/");

    await page.type("[name=uname]", req.body.uname);

    await page.type("[name=pass]", req.body.pass);

    await page.click("[type=submit]");
    console.log("Filled Credentials");
    await page.waitFor(1000);
    await page.goto(req.body.url);

    await page.waitFor(1000);
    console.log("Go to Semester Page");
    var gradeCardUrl;
    await page
      .waitForSelector("table")
      .then(async () => {
        console.log("Populating data");
        gradeCardUrl = await page.evaluate(() => {
          var aTags = document.getElementsByTagName("a");

          for (var i = 0; i < aTags.length; i++) {
            console.log(aTags[i]);
            if (aTags[i].textContent.includes("Grade")) {
              return aTags[i].href;
              break;
            }
          }
        });
      })
      .catch(() => {
        res.status(400).send("Send not found.");
      });

    if (!gradeCardUrl) {
      res.status(400).send(`Result Not Available .${gradeCardUrl}`);
    }
    await page.goto(gradeCardUrl);
    console.log("Goto Grade Card Card URL");

    await page.emulateMediaType("screen");
    await page.pdf({ path: `${req.body.uname}.pdf` });
    console.log("Coverted to PDF");
    res.download(`./${req.body.uname}.pdf`);
    console.log("Converted to PDF");

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
exports.getAdmitCard = async (req, res) => {
  console.log("Started Process");
  cors(req, res, async () => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    console.log("Launched Browser");
    const page = await browser.newPage();
    await page.goto("http://juadmission.jdvu.ac.in/jums_exam/");

    await page.type("[name=uname]", req.body.uname);

    await page.type("[name=pass]", req.body.pass);

    await page.click("[type=submit]");
    console.log("Filled Credentials");
    // await page.waitFor(1000);
    await page.goto(req.body.url);

    // await page.waitFor(1000);
    console.log("Go to Semester Page");
    var admitCardurl;
    await page
      .waitForSelector("table")
      .then(async () => {
        console.log("Populating data");
        admitCardurl = await page.evaluate(() => {
          var link = document.querySelector(
            "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > div > table > tbody > tr > td:nth-child(4) > a"
          ).href;
          return link;
        });
      })
      .catch(() => {
        res.status(400).send("Admit Card not found.");
      });

    if (!admitCardurl) {
      res.status(400).send(`Admit Card Not Available .${admitCardurl}`);
    }
    await page.goto(admitCardurl);
    console.log("Goto Admit Card Card URL");

    await page.emulateMediaType("screen");
    await page.pdf({ path: `${req.body.uname}.pdf` });
    console.log("Coverted to PDF");
    res.download(`./${req.body.uname}.pdf`);
    console.log("Converted to PDF");

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

exports.forgotPassword = async (req, res) => {
  console.log("Started Process");
  cors(req, res, async () => {
    const browser = await puppeteer.launch({ args: ["--no=sandbox"] });
    console.log("Launched Browser");
    const page = await browser.newPage();
    await page.goto(
      "http://juadmission.jdvu.ac.in/jums_exam/reset_password/index.jsp"
    );
    await page.type("[name=roll_no]", req.body.uname);
    await page.type("[name=mobile_no]", req.body.mobile);
    await page.click("[type=submit]");
    console.log("Filled Credentials");
    var newPassword;
    await page
      .waitForSelector("b")
      .then(async () => {
        console.log("Populating data");
        newPassword = await page.evaluate(() => {
          var text = document
            .querySelector("#content > b")
            .textContent.trim()
            .slice(0, 40);
          return text;
        });
      })
      .then(() => {
        console.log(newPassword);
        res.send(newPassword);
      })
      .catch(() => {
        res.status(400).send("Can not reset Password.");
      });
    await browser.close();
    console.log("Browser Closed");
  });
};
