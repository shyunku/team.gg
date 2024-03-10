import { app, BrowserWindow, powerMonitor } from "electron";
import IpcService from "../service/ipc.service.js";
import IpcRouter from "../modules/ipcRouter.js";
import { getServerFinalEndpoint } from "../modules/util.js";

/**
 * @param s {IpcService}
 */
export default function (s) {
  const appServerFinalEndpoint = getServerFinalEndpoint();
  /* ---------------------------------------- System ---------------------------------------- */
  s.register("system/terminate_signal", (event, reqId, param) => {
    app.quit();
  });

  s.register("system/relaunch", (event, reqId, param) => {
    app.relaunch();
    app.exit();
  });

  s.register("system/close_window", (event, reqId, param) => {
    let currentWindow = BrowserWindow.fromId(param);
    let mainWindow = s.windowService.mainWindow;
    if (currentWindow) {
      if (currentWindow.id === mainWindow.id) {
        mainWindow.hide();
        return;
      }
      currentWindow.close();
    }
  });

  s.register("system/maximize_window", (event, reqId, param) => {
    let currentWindow = BrowserWindow.fromId(param);
    if (currentWindow) currentWindow.maximize();
  });

  s.register("system/minimize_window", (event, reqId, param) => {
    let currentWindow = BrowserWindow.fromId(param);
    if (currentWindow) currentWindow.minimize();
  });

  s.register("system/restore_window", (event, reqId, param) => {
    let currentWindow = BrowserWindow.fromId(param);
    if (currentWindow) currentWindow.restore();
  });

  s.register("system/isMaximizable", (event, reqId, param) => {
    let currentWindow = BrowserWindow.fromId(param);
    if (currentWindow) s.sender("system/isMaximizable", reqId, true, !currentWindow.isMaximized());
  });

  s.register("system/modal", (event, reqId, ...arg) => {
    Window.createModalWindow(...arg);
  });

  s.register("system/modeless", (event, reqId, ...arg) => {
    Window.createModelessWindow(...arg);
  });

  s.register("system/inner-modal", (event, reqId, route, data) => {
    s.sender("inner-modal", reqId, true, { route, data });
  });

  s.register("system/close-inner-modal", (event, reqId, ...arg) => {
    s.sender("close-inner-modal", reqId, true, ...arg);
  });

  s.register("system/subscribe", (event, reqId, webContentsId, topics) => {
    if (!Array.isArray(topics)) topics = [topics];
    s.addListenersByWebContentsId(topics, webContentsId);
  });

  s.register("system/computer_idle_time", (event, reqId) => {
    const idleTime = powerMonitor.getSystemIdleTime();
    s.emiter("system/computer_idle_time", reqId, idleTime);
  });

  s.register("__callback__", (event, reqId, topic, data) => {
    s.broadcast(topic, data);
  });

  /* ---------------------------------------- Custom ---------------------------------------- */
  s.register("platform/riot_client_status", (event, reqId) => {
    const status = s.platformService.getRiotClientStatus();
    s.sender("platform/riot_client_status", reqId, true, status);
  });

  s.register("platform/current_summoner_info", async (event, reqId) => {
    try {
      const data = await s.platformService.getCurrentSummonerInfo();
      s.sender("platform/current_summoner_info", reqId, true, data);
    } catch (err) {
      s.sender("platform/current_summoner_info", reqId, false, err.message);
    }
  });

  s.register("platform/current_game_flow_session", async (event, reqId) => {
    try {
      const data = await s.platformService.getCurrentGameFlowSession();
      s.sender("platform/current_game_flow_session", reqId, true, data);
    } catch (err) {
      s.sender("platform/current_game_flow_session", reqId, false, err.message);
    }
  });

  s.register("platform/current_champ_select_session", async (event, reqId) => {
    try {
      const data = await s.platformService.getCurrentChampSelectSession();
      s.sender("platform/current_champ_select_session", reqId, true, data);
    } catch (err) {
      s.sender("platform/current_champ_select_session", reqId, false, err.message);
    }
  });

  /* ---------------------------------------- Test ---------------------------------------- */
  s.register("test_signal", (event, param) => {});
}
