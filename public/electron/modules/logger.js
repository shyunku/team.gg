import ElectronLogger from "electron-log";
import moment from "moment";
import path from "path";
import fse from "fs-extra";
import FileSystem from "./filesystem.js";

export function initialize(isBuildMode, appDataPath) {
  const loggerDirPath = isBuildMode ? path.resolve(appDataPath, "..") : path.resolve(appDataPath, "logs");

  console.log(`Logger Directory Path: ${loggerDirPath}`);

  const currentTime = moment(Date.now()).format("YYYY-MM-DD_HHmmss");
  const logFilename = `${currentTime}.log`;
  const loggerFilePath = path.resolve(loggerDirPath, logFilename);

  if (!FileSystem.isDir(loggerDirPath)) {
    try {
      fse.mkdirSync(loggerDirPath);
      console.log(`Make directory for logger`);
    } catch (err) {
      console.error(err);
      process.exit(-3);
    }
  }

  if (!fse.existsSync(loggerFilePath)) {
    // logger file does not exist
    try {
      fse.writeFileSync(loggerFilePath, "");
      console.log(`Make file for logger`);
    } catch (err) {
      console.error(err);
      process.exit(-4);
    }
  }

  console.log(`Final Logger Path: ${loggerFilePath}`);
  ElectronLogger.transports.console.level = false;
  ElectronLogger.transports.file.level = "debug";
  ElectronLogger.transports.file.resolvePathFn = () => loggerFilePath;
}

export default {};
