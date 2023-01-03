const puppeteer = require("puppeteer");
const fs = require("fs");
const cors = require("cors")({ origin: true });

//Get all data of the student when logging in. Data includes - Name, ImageURL, semester name and semester page url they have registered for.
exports.getData = async (req, res) => {
  try {
    cors(req, res, async () => {
      console.log("Starting Process");
      const browser = await puppeteer.launch({
        executablePath: "google-chrome-stable",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.goto("http://juadmission.jdvu.ac.in/jums_exam/");
      console.log("Loaded Login Page");

      await page.type("[name=uname]", req.body.uname);

      await page.type("[name=pass]", req.body.pass);

      await page.click("[type=submit]");
      console.log("Filled Credentials");
      // await page.waitFor(6000);
      await page.waitForNavigation("domcontentloaded");
      console.log("Loaded Profile Page");
      console.log("Populating data");
      data = await page
        .evaluate(() => {
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

          console.log("Got Buttons(Link for semester page)");
          return {
            name: name,
            course: course,
            buttons: buttons,
            imgUrl: imgUrl.src,
          };
        })
        .then(async (data) => {
          console.log("Got Data from Profile Page");
          str = JSON.stringify(data);

          res.json(data);
          console.log("Sent Response");

          await browser.close();
          console.log("Closed Browser");
        })
        .catch(async (e) => {
          console.log("Error occured" + e);
          await browser.close();
          console.log("Closed Browser");
          res.status(400).send("Error loggin in");
          console.log("Sent error response");
        });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error loggin in");
    console.log("Sent error response");
  }
};

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

    console.log("Go to Semester Page");

    console.log("Populating data");
    gradeCardUrl = await page
      .evaluate(() => {
        var aTags = document.getElementsByTagName("a");

        for (var i = 0; i < aTags.length; i++) {
          if (aTags[i].textContent.includes("Grade")) {
            return aTags[i].href;
            break;
          }
        }
      })
      .then(async (gradeCardUrl) => {
        await page.goto(gradeCardUrl);
        console.log("Goto Grade Card Card URL");

        await page.emulateMediaType("print");
        await page.pdf({ path: `${req.body.uname}.pdf` });
        console.log("Coverted to PDF");
        res.download(`./${req.body.uname}.pdf`);
        console.log("Sent download response PDF");

        await browser.close();
        console.log("Closed Browser");
        fs.unlink(`${req.body.uname}.pdf`, function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Successfully deleted the file.");
          }
        });
      })

      .catch(async (e) => {
        console.log("Error occured" + e);
        await browser.close();
        console.log("Closed Browser");
        res.status(400).send("Result not found.");
        console.log("Sent error response");
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
    await page.waitFor(1000);
    await page.goto(req.body.url);

    console.log("Go to Semester Page");

    console.log("Populating data");
    admitCardurl = await page
      .evaluate(() => {
        var link = document.querySelector(
          "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > div > table > tbody > tr > td:nth-child(4) > a"
        ).href;

        return link;
      })
      .then(async (admitCardurl) => {
        await page.goto(admitCardurl);
        console.log("Goto Admit Card Card URL");

        await page.emulateMediaType("print");
        await page.pdf({ path: `${req.body.uname}.pdf` });
        console.log("Coverted to PDF");
        res.download(`./${req.body.uname}.pdf`);
        console.log("Sent download PDF response");

        await browser.close();
        console.log("Closed Browser");
        fs.unlink(`${req.body.uname}.pdf`, function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Successfully deleted the file.");
          }
        });
      })

      .catch(async (e) => {
        console.log("Error occured" + e);
        await browser.close();
        console.log("Closed Browser");
        res.status(400).send("Admit Card not found.");
        console.log("Sent error response");
      });
  });
};

exports.forgotPassword = async (req, res) => {
  console.log("Started Process");
  cors(req, res, async () => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    console.log("Launched Browser");
    const page = await browser.newPage();
    await page.goto(
      "http://juadmission.jdvu.ac.in/jums_exam/reset_password/index.jsp"
    );
    await page.type("[name=roll_no]", req.body.uname);
    await page.type("[name=mobile_no]", req.body.mobile);
    await page.click("[type=submit]");
    console.log("Filled Credentials");
    await page.waitFor(1000);
    console.log("Populating data");
    await page
      .evaluate(() => {
        var newPass = document
          .querySelector("#content > b")
          .textContent.trim()
          .slice(0, 40);

        return newPass;
      })
      .then((newPass) => {
        res.send(newPass);
      })
      .catch(() => {
        res.status(400).send("Can not reset Password.");
      });
    await browser.close();
    console.log("Browser Closed");
  });
};

exports.getNotices = (req, res) => {
  console.log("Started Process");
  cors(req, res, async () => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    console.log("Launched Browser");
    const page = await browser.newPage();
    await page.goto("http://juadmission.jdvu.ac.in/jums_exam/");
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
    res.json({ notices: notice });
    await browser.close();
  });
};
