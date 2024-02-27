import { app } from "electron";
import fs from "fs";
import url from "url";
import path from "path";
import { getBuildLevel } from "../util/SystemUtil.js";

const __dirname = path.resolve();

export function getUserDataPath() {
  const userDataPath = app.getPath("userData");
  const buildLevel = getBuildLevel();

  switch (buildLevel) {
    case 0:
      return url.format({
        pathname: path.join(__dirname, "../../../"),
        slashes: false,
      });
    case 1:
      return userDataPath;
    case 2:
      return userDataPath;
    default:
      throw new Error("Invalid build level");
  }
}

export function getAppTrayImagePath() {
  const buildLevel = getBuildLevel();
  const appDataPath = app.getAppPath();
  const resourceParentKeys = ["public", "build", "../"];
  const resourceParent = resourceParentKeys[buildLevel];

  return url.format({
    pathname: path.join(appDataPath, resourceParent, "tray", "tray.png"),
    slashes: false,
  });
}

export function getAppResourcesPath() {
  const buildLevel = getBuildLevel();
  const appDataPath = app.getAppPath();
  const resourceParentKeys = ["public", "build", "../"];
  const resourceParent = resourceParentKeys[buildLevel];

  return url.format({
    pathname: path.join(appDataPath, resourceParent, "resources"),
    slashes: false,
  });
}

export function isDir(path) {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}

export function isSymbolicLink(path) {
  return fs.existsSync(path) && fs.lstatSync(path).isSymbolicLink();
}

export function isAsar(path) {
  return path.includes(".asar");
}

export async function rmdirRecursivelySync(path) {
  return new Promise((resolve, reject) => {
    fs.rm(path, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function copyFile(source, dest) {
  let destPath = dest;
  if (isDir(destPath)) destPath = path.join(dest, path.basename(source));
  if (isDir(destPath)) fs.copyFileSync(source, destPath);
}

export function symlink(source, dest) {
  const link = fs.readlinkSync(source);
  const destLink = fs.lstatSync(dest);

  if (!destLink) {
    fs.symlinkSync(link, dest);
  }
}

// delete dest & copy source -> dest
export async function copydirRecursivelySync(source, dest) {
  if (fs.existsSync(source) === false) {
    throw new Error(`Can't copy from non-exist folder ${source}`);
  }

  if (fs.lstatSync(source).isDirectory() === false) {
    throw new Error(`Source path doesn't indicate directoy: ${source}`);
  }

  const targetRootFolder = path.join(dest, path.basename(source));
  if (!fs.existsSync(targetRootFolder) || isDir(targetRootFolder) === false) {
    fs.mkdirSync(targetRootFolder);
  }

  const filesToCopy = fs.readdirSync(source);
  for (const file of filesToCopy) {
    const currentSource = path.join(source, file);

    if (isAsar(currentSource)) {
      if (fs.existsSync(targetRootFolder) === false) fs.mkdirSync(targetRootFolder);
      fs.copyFileSync(currentSource, targetRootFolder);
    } else if (isSymbolicLink(currentSource) === true) {
      symlink(currentSource, targetRootFolder);
    } else if (isDir(currentSource) === true) {
      await copydirRecursivelySync(currentSource, targetRootFolder);
    } else {
      copyFile(currentSource, targetRootFolder);
    }
  }
}

export default {
  getUserDataPath,
  getAppTrayImagePath,
  getAppResourcesPath,
  isDir,
  isSymbolicLink,
  isAsar,
  rmdirRecursivelySync,
  copyFile,
  symlink,
  copydirRecursivelySync,
};
