const Redis = require("ioredis");
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = new Redis(REDIS_PORT);

client.on("connect", () =>
  console.log(`Redis is connected on port ${REDIS_PORT}`)
);
client.on("error", (error) => console.error(error));

const redisCacheMiddleware = (req, res, next) => {
  if (req.body.uname == undefined || req.body.pass == undefined) {
    next(); //if no credentials are provided, then skip the middleware
    return;
  }

  const { uname, pass } = req.body;
  const key = `${uname}-${pass}`;
  //   console.log(key);
  //   const key = "tes";
  client.get(key, (err, data) => {
    if (err) throw err;
    if (data != null) {
      console.log("Data from cache");
      //set header to json
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.parse(data));
    } else {
      console.log("Data from server");
      res.sendResponse = res.send;
      res.send = (body) => {
        client.set(key, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    }
  });
};

module.exports = redisCacheMiddleware;
