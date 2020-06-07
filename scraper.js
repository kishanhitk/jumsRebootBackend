const puppeteer = require("puppeteer");
const cors = require("cors")({ origin: true });

exports.getData = async (req, res) => {
  cors(req, res, async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto("http://juadmission.jdvu.ac.in/jums_exam/");
    uname = req.body.uname;

    // console.log(await page.content());
    await page.screenshot({ path: "screenshot.png" });
    //ID 001811601047
    await page.type("[name=uname]", req.body.uname);

    //PASSWORD 158261ed
    await page.type("[name=pass]", req.body.pass);

    await page.click("[type=submit]");
    await page.waitFor(5000);
    await page.screenshot({ path: "screenshot.png" });
    const data = await page.evaluate(() => {
      const name = document
        .querySelector(
          "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)"
        )
        .textContent.trim();
      const course = document
        .querySelector(
          "body > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center > div.panel-body.layout-body > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td:nth-child(2)"
        )
        .textContent.trim();
      return {
        name: name,
        course: course,
      };
    });
    str = JSON.stringify(data);
    res.json(data);
    console.log(data.name);
    await page.waitFor(5000);

    await page.goto(
      "http://juadmission.jdvu.ac.in/jums_exam/student_odd_2019/index.jsp"
    );

    await page.waitFor(5000);
    await page.screenshot({ path: "screenshot.png", fullPage: true });
    await browser.close();
  });
};

//PASSWORD 158261ed
