import { app, BrowserWindow, powerMonitor } from "electron";
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
    if (currentWindow) s.sender("isMaximizable", reqId, true, currentWindow.isMaximizable());
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

  /* ---------------------------------------- Test ---------------------------------------- */
  s.register("test_signal", (event, param) => {});
}
