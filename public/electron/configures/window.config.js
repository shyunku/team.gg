import { ipcMain, webContents, app, BrowserWindow, screen, Menu, Tray } from "electron";
import packageJson from "../../../package.json" assert { type: "json" };
import path from "path";
import { getAppTrayImagePath } from "../modules/filesystem.js";

const __dirname = path.resolve();

/**
 * @param s {WindowService}
 */
export default function (s) {
  s.mainWindow = s.createMainWindow({
    webPreferences: {
      preload: path.join(__dirname, "../", "modules", "preload.js"),
    },
  });
  s.mainWindow.once("ready-to-show", () => {
    s.mainWindow.show();
    s.mainWindow.focus();
  });

  const isDebugMode = process.env.NODE_ENV !== "production";

  // const trayImagePath = getAppTrayImagePath();
  // s.tray = new Tray(trayImagePath);
  // s.tray.on("click", () => {
  //   s.mainWindow.show();
  // });
  // s.tray.setContextMenu(
  //   Menu.buildFromTemplate([
  //     {
  //       label: `Memorial - ${packageJson.version}${isDebugMode ? " [Debug]" : ""}`,
  //       enabled: false,
  //     },
  //     {
  //       label: "종료",
  //       click: function () {
  //         s.mainWindow.close();
  //         app.quit();
  //         app.exit();
  //       },
  //     },
  //   ])
  // );

  s.setWindowStateChangeListener(s.mainWindow);
  // s.mainWindow.webContents.session.clearCache(() => {});
}
