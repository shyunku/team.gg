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
import LolSummonerV1CurrentSummoner from "../platform/types/LolSummonerV1CurrentSummoner.js";
import LolChampSelectV1Session from "../platform/types/LolChampSelectV1Session.js";

const ClientStatus = {
  CONNECTING: 0,
  CONNECTED: 1,
  DISCONNECTED: 2,
  ERROR: 3,
};

class PlatformService {
  constructor(ipcService) {
    /** @type {IpcService} */
    this.ipcService = null;

    this.clientConnectThread = null;
    this.credentials = null;
    this.session = null;
    this.client = null;
    this.ws = null;
    this.status = ClientStatus.CONNECTING;
  }

  inject(serviceGroup) {
    this.ipcService = serviceGroup.ipcService;
  }

  async initialize() {
    // execute command line
    try {
      await this.authenticate();
      await this.connectClient();
      await this.onConnect();
    } catch (e) {
      console.error(e);
      console.log(e?.response);
      // TODO :: handle error
    }
  }

  /**
   * @returns {number}
   */
  getRiotClientStatus() {
    return this.status;
  }

  /**
   *
   * @returns {LolSummonerV1CurrentSummoner}
   */
  async getCurrentSummonerInfo() {
    const raw = await this.lcuRequest("GET", "/lol-summoner/v1/current-summoner");
    let data = new LolSummonerV1CurrentSummoner(raw);
    return data;
  }

  /**
   *
   * @returns {LolGameFlowV1Session}
   */
  async getCurrentGameFlowSession() {
    const raw = await this.lcuRequest("GET", "/lol-gameflow/v1/session");
    let data = new LolGameFlowV1Session(raw);
    return data;
  }

  /**
   *
   * @returns {LolChampSelectV1Session}
   */
  async getCurrentChampSelectSession() {
    const raw = await this.lcuRequest("GET", "/lol-champ-select/v1/session");
    let data = new LolChampSelectV1Session(raw);
    return data;
  }

  async onConnect(credentials = null) {
    try {
      console.debug("[PlatformService] Connected to League Client");
      if (credentials) this.credentials = credentials;
      await this.startWebSocket();
      await this.startSession();
      this.onStatusChange(ClientStatus.CONNECTED);
    } catch (err) {
      console.error(err);
      this.onStatusChange(ClientStatus.ERROR);
    }
  }

  onDisconnect() {
    console.debug("[PlatformService] Disconnected from League Client");
    this.credentials = null;
    this.session.close();
    this.ws.close();
    this.onStatusChange(ClientStatus.DISCONNECTED);
  }

  onStatusChange(status) {
    this.status = status;
    this.ipcService.sender("platform/riot_client_status", null, true, this.status);
  }

  /**
   * @param {Error} err
   */
  onError(err) {
    this.ipcService.sender("platform/riot_client_error", null, true, err.message);
  }

  async authenticate() {
    // // const caFile = fs.readFileSync("public/resources/certificates/riotgames.pem");
    // this.credentials = await authenticate({
    //   awaitConnection: true,
    //   // pollInterval: 3000,
    //   // certificate: caFile,
    // });
    // console.info(`[PlatformService] authenticated to League Client.`);
    return new Promise((resolve, reject) => {
      this.clientConnectThread = async () => {
        try {
          this.credentials = await authenticate({
            // awaitConnection: true,
            // pollInterval: 3000,
            // certificate: caFile,
          });
          // console.log(this.credentials);
          console.info(`[PlatformService] authenticated to League Client.`);
          resolve(this.credentials);
        } catch (e) {
          // console.error(e);
          this.onStatusChange(ClientStatus.DISCONNECTED);
          setTimeout(this.clientConnectThread, 1000);
        }
      };
      this.clientConnectThread();
    });
  }

  async connectClient() {
    this.client = new LeagueClient(this.credentials, {
      pollInterval: 1000,
    });
    this.client.on("connect", (newCredentials) => {
      this.onConnect(newCredentials);
    });
    this.client.on("disconnect", () => {
      this.onDisconnect();
    });
    this.client.start();
    console.info(`[PlatformService] started connection with League Client.`);
  }

  async startSession() {
    this.session = await createHttpSession(this.credentials);
    console.info(`[PlatformService] created HTTP/2 session to League Client.`);
  }

  async startWebSocket() {
    this.ws = await createWebSocketConnection();
    console.info(`[PlatformService] created WebSocket connection to League Client.`);
    this.ws.on("open", () => {
      console.debug("leauge client socket connected");
    });
    this.ws.on("message", (raw) => {
      try {
        const buf = Buffer.from(raw);
        const json = buf.toString();
        let parsed = null;
        try {
          parsed = JSON.parse(json);
          const [eventCode, eventName, event] = parsed;
          const { uri, eventType, data } = event;

          console.debug(
            `[WS] ${eventCode} (${eventName}) --- ${uri} [${eventType}] ${JSON.stringify(data)?.substring(0, 60)}...`
          );
        } catch (e) {}
      } catch (err) {
        console.error(err);
      }
    });
    this.ws.on("error", (err) => {
      console.error(err);
      ws.close();
    });

    // 소환사 감지 이벤트
    this.subscribeWS("/lol-summoner/v1/current-summoner", ({ uri, raw }) => {
      try {
        const data = new LolSummonerV1CurrentSummoner(raw);
        this.ipcService.sender("platform/current_summoner_info", null, true, data);
      } catch (err) {
        console.error(err);
        this.ipcService.sender("platform/current_summoner_info", null, false, err.message);
      }
    });
    // 게임 세션 이벤트
    this.subscribeWS("/lol-gameflow/v1/session", ({ uri, raw }) => {
      try {
        const data = new LolGameFlowV1Session(raw);
        this.ipcService.sender("platform/current_game_flow_session", null, true, data);
      } catch (err) {
        console.error(err);
        this.ipcService.sender("platform/current_game_flow_session", null, false, err.message);
      }
    });
    // 챔피언 선택 이벤트
    this.subscribeWS("/lol-champ-select/v1/session", ({ uri, raw }) => {
      try {
        const data = new LolChampSelectV1Session(raw);
        this.ipcService.sender("platform/current_champ_select_session", null, true, data);
      } catch (err) {
        console.error(err);
      }
    });
    this.subscribeWS("/lol-lobby/v1/lobby/availability", (uri, raw) => {});
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
    const resp = await createHttp2Request(
      {
        method,
        url,
        data,
      },
      this.session,
      this.credentials
    );
    let { _raw: raw, ...rest } = resp;
    const buf = Buffer.from(raw);
    const json = buf.toString();
    let parsed = JSON.parse(json);
    return parsed;
  }
}

export default PlatformService;
