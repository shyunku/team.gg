import { app } from "electron";
import Request from "../core/request.js";
import IpcService from "./ipc.service.js";
import ChildProcess from "child_process";
import http2 from "http2";
import fs from "fs";
import {
  authenticate,
  createHttp2Request,
  createHttpSession,
  createWebSocketConnection,
  LeagueClient,
} from "league-connect";
import LolGameFlowV1Session from "../platform/types/LolGameFlowV1Session.js";

// const http2Transport = {
//   request: function request(options, handleResponse) {
//     const req = http2.request(options, handleResponse);
//     setImmediate(() => {
//       // Remove the axios action `socket.setKeepAlive` because the HTTP/2 sockets should not be directly manipulated
//       const listeners = req.listeners("socket");
//       if (listeners.length) req.removeListener("socket", listeners[0]);
//     });
//     return req;
//   },
// };

class PlatformService {
  constructor(ipcService) {
    /** @type {IpcService} */
    this.ipcService = null;

    this.credentials = null;
    this.session = null;
    this.client = null;
    this.ws = null;
  }

  inject(serviceGroup) {
    this.ipcService = serviceGroup.ipcService;
  }

  async initialize() {
    // execute command line
    try {
      // const caFile = fs.readFileSync("public/resources/certificates/riotgames.pem");
      this.credentials = await authenticate({
        awaitConnection: true,
        // pollInterval: 3000,
        // certificate: caFile,
      });
      this.session = await createHttpSession(this.credentials);

      this.ws = await createWebSocketConnection();
      // ws.on("open", () => {
      //   console.debug("leauge client socket connected");
      // });
      // ws.on("message", (raw) => {
      //   try {
      //     const buf = Buffer.from(raw);
      //     const json = buf.toString();
      //     let parsed = null;
      //     try {
      //       parsed = JSON.parse(json);
      //     } catch (e) {}
      //     const [eventCode, eventName, event] = parsed;
      //     const { uri, eventType, data } = event;

      //     console.debug(
      //       `[WS] ${eventCode} (${eventName}) --- ${uri} [${eventType}] ${JSON.stringify(data)?.substring(0, 60)}...`
      //     );
      //     // console.debug("message", json);
      //   } catch (err) {
      //     console.error(err);
      //   }
      // });
      // ws.on("error", (err) => {
      //   console.error(err);
      //   ws.close();
      // });
      this.subscribeWS("/lol-gameflow/v1/session", ({ uri, raw }) => {
        // 게임 세션 발생 이벤트?
        try {
          const data = new LolGameFlowV1Session(raw);
          console.debug(
            `${uri} queueCategory: ${data.gameData.queue.category} gameMode:${data.gameData.queue.gameMode} queueType: ${data.gameData.queue.type} phase: ${data.phase}`
          );
        } catch (err) {
          console.error(err);
        }
      });
      this.subscribeWS("/lol-lobby/v1/lobby/availability", (uri, raw) => {});

      this.client = new LeagueClient(this.credentials);
      this.client.on("connect", (newCredentials) => {
        // client started
        console.log("Connected to League Client", newCredentials);
      });
      this.client.on("disconnect", (newCredentials) => {
        // client stopped
        console.log("Disconnected from League Client", newCredentials);
      });

      const resp = await this.lcuRequest("GET", "/lol-chat/v1/conversations/active");
    } catch (e) {
      console.error(e);
      console.log(e?.response);
      // TODO :: handle error
    }
  }

  async subscribeWS(uri, callback) {
    this.ws.subscribe(uri, (data, event) => {
      const pad = 60 - uri.length;
      console.debug(
        `${console.wrap(`[WS]`, console.MAGENTA)} ${uri}${" ".repeat(pad)} ${JSON.stringify(data)?.substring(
          0,
          120
        )}...`
      );
      callback({ uri, raw: data, event });
    });
  }

  async lcuRequest(method, url, data) {
    return await createHttp2Request(
      {
        method,
        url,
        data,
      },
      this.session,
      this.credentials
    );
  }
}

export default PlatformService;
