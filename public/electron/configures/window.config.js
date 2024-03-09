import { ipcMain, webContents, app, BrowserWindow, screen, Menu, Tray } from "electron";
import packageJson from "../../../package.json" assert { type: "json" };
import path from "path";
import { getAppTrayImagePath } from "../modules/filesystem.js";

/**
 * @param s {WindowService}
 */
export default function (s) {
  s.initialize();

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

  // s.mainWindow.webContents.session.clearCache(() => {});
}
