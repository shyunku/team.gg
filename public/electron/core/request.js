import AXIOS from "axios";
import https from "https";
import fs from "fs";
// import http2 from "http2";
// import { createHTTP2Adapter } from "axios-http2-adapter";

const SERVER_WRAPPED = console.wrap("[SERVER]", console.BLUE);

// const axios = AXIOS.create();

// download .pem from https://static.developer.riotgames.com/docs/lol/riotgames.pem
// const http2AdapterConfig = {
//   agent:  new http2.Agent({
//     ca: fs.readFileSync("public/resources/certificates/riotgames.pem"),
//     keepAlive: true,
//   }),
// }
// const axios = AXIOS.create({
//   adapter: createHTTP2Adapter(http2AdapterConfig),
// });
const axios = AXIOS.create({
  httpsAgent: new https.Agent({
    ca: fs.readFileSync("public/resources/certificates/riotgames.pem"),
    keepAlive: true,
  }),
});

const Request = {
  ok: 200,
  post: function (host, urlPostfix, data, options) {
    return new Promise((resolve, reject) => {
      const url = `${host}${urlPostfix ?? ""}`;
      console.info(
        `Axios/post ${console.wrap("-->", console.CYAN)} ${SERVER_WRAPPED} ${console.wrap(
          urlPostfix,
          console.MAGENTA
        )}`,
        data
      );

      axios
        .post(url, data, options)
        .then((res) => {
          console.info(
            `Axios/post ${console.wrap("<--", console.GREEN)} ${SERVER_WRAPPED} ${console.wrap(
              urlPostfix,
              console.MAGENTA
            )}`,
            res.data
          );
          resolve(res.data);
        })
        .catch((err) => {
          console.error(
            `Axios/post ${console.wrap("<-X-", console.RED)} ${SERVER_WRAPPED} ${console.wrap(
              urlPostfix,
              console.MAGENTA
            )}`,
            err.message
          );
          reject(err);
        });
    });
  },
  get: function (host, urlPostfix, options) {
    return new Promise((resolve, reject) => {
      const url = `${host}${urlPostfix ?? ""}`;
      console.info(
        `Axios/get ${console.wrap("-->", console.CYAN)} ${SERVER_WRAPPED} ${console.wrap(url, console.MAGENTA)}`
      );

      axios
        .get(url, options)
        .then((res) => {
          console.info(
            `Axios/get ${console.wrap("<--", console.GREEN)} ${SERVER_WRAPPED} ${console.wrap(
              urlPostfix,
              console.MAGENTA
            )}`,
            res.data
          );
          resolve(res.data);
        })
        .catch((err) => {
          console.error(
            `Axios/get ${console.wrap("<-X-", console.RED)} ${SERVER_WRAPPED} ${console.wrap(
              urlPostfix,
              console.MAGENTA
            )}`,
            err.message
          );
          reject(err);
        });
    });
  },
};

export default Request;
