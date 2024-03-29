import Constants from "./constants.js";
import ArchCategory from "../constants/ArchCategory.constants.js";
import Request from "../core/request.js";
import PackageJson from "../../../package.json" assert { type: "json" };

const isBuildMode = !process.env.ELECTRON_START_URL;

/**
 * @returns {string}
 */
export function getServerFinalEndpoint() {
  const debugMode = process.env.NODE_ENV !== "production";
  const appServerEndpoint = debugMode
    ? PackageJson.config.local_app_server_endpoint
    : PackageJson?.config?.app_server_endpoint;
  if (!appServerEndpoint) throw new Error("App server endpoint is not defined in package.json");
  const appServerApiVersion = PackageJson?.config?.app_server_api_version;
  if (!appServerApiVersion) throw new Error("App server API version is not defined in package.json");
  return `${appServerEndpoint}/${appServerApiVersion}`;
}

/**
 * @returns {string}
 */
export function getWebsocketFinalEndpoint() {
  const appServerFinalEndpoint = getServerFinalEndpoint();
  return `${appServerFinalEndpoint.replace(/http/g, "ws")}/websocket/connect`;
}

export async function sleep(milli) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, milli);
  });
}

export function shorten(obj, maxLength = 100) {
  let str = JSON.stringify(obj);
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
}

export function registerSocketLogger(socket, color = console.RESET) {
  let originalSocketListener = socket.on;
  socket.on = function (topic, callback, ...socketArguments) {
    let originalCallback = callback;
    callback = (data_, ...arg) => {
      if (!Constants.SocketSilentTopics.includes(topic)) {
        let mergedArguments = arg.map((param) => console.shorten(param)).join(" ");

        if (data_) {
          if (data_.code) {
            let { code, data } = data_;
            let arrow = code === Request.ok ? console.wrap("<--", console.GREEN) : console.wrap("<-X-", console.RED);
            console.system(
              `${console.wrap("Socket", color)} ${arrow} ${console.wrap(topic, console.MAGENTA)} ${console.shorten(
                data
              )} ${mergedArguments}`
            );
          } else {
            console.system(
              `${console.wrap("Socket", color)} ${console.wrap("<--", console.GREEN)} ${console.wrap(
                topic,
                console.MAGENTA
              )} ${console.shorten(data_)} ${mergedArguments}`
            );
          }
        } else {
          let arrow = console.wrap("<--", console.GREEN);
          console.system(`${console.wrap("Socket", color)} ${arrow} ${console.wrap(topic, console.MAGENTA)}`);
        }
      }

      originalCallback(data_, ...arg);
    };

    originalSocketListener.apply(socket, [topic, callback, ...socketArguments]);
  };

  let originalSocketEventEmitter = socket.emit;
  socket.emit = function (topic, ...socketArguments) {
    if (!Constants.SocketSilentTopics.includes(topic)) {
      let mergedArguments = socketArguments.map((param) => console.shorten(param)).join(" ");
      console.system(
        `${console.wrap("Socket", color)} ${console.wrap("-->", console.CYAN)} ${console.wrap(
          topic,
          console.MAGENTA
        )} ${mergedArguments}`
      );
    }
    originalSocketEventEmitter.apply(socket, [topic, ...socketArguments]);
  };
}

export function getSystemArchCategory() {
  switch (process.platform) {
    case "win32":
      return ArchCategory.Windows;
    case "darwin":
      return ArchCategory.MacOS;
    default:
      return ArchCategory.Unknown;
  }
}

export function getSystemArchitectureLabel() {
  switch (process.platform) {
    case "win32":
      return "Windows";
    case "darwin":
      return "MacOS";
    default:
      return "Unknown";
  }
}

export function formatFileSize(rawByte, precision = 0) {
  const units = ["B", "kB", "MB", "GB"];
  let unitIndex = 0;

  while (true) {
    if (rawByte < 1024 || unitIndex >= units.length - 1) break;
    rawByte /= 1024;
    unitIndex++;
  }

  const multiFactor = Math.pow(10, precision);
  const factored = Math.round((rawByte * multiFactor).toFixed(precision + 1)) / multiFactor;

  return `${Math.floor(factored)}${units[unitIndex]}`;
}

export const isProductionMode = () => {
  return isBuildMode;
};

export const reqIdTag = (reqId) => {
  if (reqId == null) reqId = "NUL";
  return reqId ? `[${reqId.substr(0, 3)}]` : "";
};

export default {
  getServerFinalEndpoint,
  getWebsocketFinalEndpoint,
  sleep,
  shorten,
  registerSocketLogger,
  getSystemArchCategory,
  getSystemArchitectureLabel,
  formatFileSize,
  isProductionMode,
  reqIdTag,
};
