import * as uuid from "uuid";
import { colorize } from "./Common";

const electron = window?.require?.("electron");
const ipcRenderer = electron?.ipcRenderer;
const remote = window?.require?.("@electron/remote");

const subscribed = {
  "system/subscribe": {},
};

const currentWebContents = remote?.getCurrentWebContents();
const currentWindow = remote?.getCurrentWindow();

const topicHandlers = {};

const autoSubscribe = (topic) => {
  if (subscribed.hasOwnProperty(topic)) return;
  IpcSender.subscribe(topic);
  subscribed[topic] = true;
};

const senderSync = (topic, ...arg) => {
  autoSubscribe(topic);
  return ipcRenderer.sendSync(topic, null, ...arg);
};

const sender = (topic, callback, ...arg) => {
  autoSubscribe(topic);
  const sendId = uuid.v4();
  if (topic !== "system/subscribe") {
    console.debug(
      `IpcRenderer --> ${colorize.yellow(`[${sendId?.substring(0, 3) ?? "unknown"}]`)} ${colorize.magenta(topic)}`,
      ...arg
    );
  }
  let listener = IpcSender.on(topic, (reqId, ...result) => {
    if (reqId !== sendId) return;
    IpcSender.off(topic, listener);
    return callback?.(...result);
  });
  return ipcRenderer.send(topic, sendId, ...arg);
};

const silentSender = (topic, param, ...arg) => {
  autoSubscribe(topic);
  return ipcRenderer.send(topic, param, ...arg);
};

const IpcSender = {
  system: {
    terminateSignal: () => {
      sender("system/terminate_signal", null, currentWindow.id);
    },
    relaunch: () => {
      sender("system/relaunch", null);
    },
    maximizeWindow: () => {
      sender("system/maximize_window", null, currentWindow.id);
    },
    minimizeWindow: () => {
      sender("system/minimize_window", null, currentWindow.id);
    },
    restoreWindow: () => {
      sender("system/restore_window", null, currentWindow.id);
    },
    closeWindow: () => {
      sender("system/close_window", null, currentWindow.id);
    },
    isMaximizable: (callback) => {
      sender("system/isMaximizable", callback, currentWindow.id);
    },
    modal: (url, windowProperty = {}, parameter) => {
      sender("system/modal", null, currentWindow.id, url, windowProperty, parameter);
    },
    modeless: (url, windowProperty = {}, parameter) => {
      sender("system/modeless", null, currentWindow.id, url, windowProperty, parameter);
    },
    innerModal: (route, data) => {
      sender("system/inner-modal", null, route, data);
    },
    inputPromptModal: (title, placeholder, data, callback) => {
      IpcSender.system.innerModal("system/input-prompt", {
        title,
        placeholder,
        data,
        callback,
      });
    },
    closeInnerModal: (route, data) => {
      sender("system/close-inner-modal", null, route, data);
    },
    getComputerIdleTime: () => {
      sender("system/computer_idle_time");
    },
  },
  req: {
    platform: {
      getRiotClientStatus: (callback) => {
        sender("platform/riot_client_status", callback);
      },
      getCurrentSummonerInfo: (callback) => {
        sender("platform/current_summoner_info", callback);
      },
      getCurrentGameFlowSession: (callback) => {
        sender("platform/current_game_flow_session", callback);
      },
      getCurrentChampSelectSession: (callback) => {
        sender("platform/current_champ_select_session", callback);
      },
    },
    socket: {
      tryConnect: (userId, accessToken, refreshToken, callback) => {
        sender("socket/connect", callback, userId, accessToken, refreshToken);
      },
      tryDisconnect: (callback) => {
        sender("socket/disconnect", callback);
      },
    },
  },
  test: {
    signal: (param) => {
      sender("test_signal", null, param);
    },
  },
  subscribe: (topics) => {
    sender("system/subscribe", null, currentWebContents.id, topics);
  },
  // unsubscribe: (topics) => {
  //   sender("system/unsubscribe", null, currentWebContents.id, topics);
  // },
  off: (topic, callback) => {
    return ipcRenderer.removeListener(topic, callback);
  },
  offAll: (topic) => {
    let handlers = topicHandlers[topic] ?? [];
    handlers.forEach((handler) => {
      ipcRenderer.removeListener(topic, handler);
    });
  },
  removeAllListeners: () => {
    console.warn(`Do not use removeAllListeners() as possible. It interferes with the internal logic.`);
    ipcRenderer.removeAllListeners();
  },
  sendCallback: (topic, data) => {
    sender("__callback__", null, topic, data);
  },
  // listen only for designated request ID (request ID unknown)
  on: (topic, callback) => {
    autoSubscribe(topic);
    const originalCallback = callback;
    const newCallback = (e, reqId, ...data) => {
      if (reqId == null) return;
      console.debug(
        `IpcRenderer <-- ${colorize.cyan(`[${reqId?.substr(0, 3) ?? "unknown"}]`)} ${colorize.magenta(topic)}`,
        ...data
      );
      originalCallback(reqId, ...data);
    };
    ipcRenderer.on(topic, newCallback);
    return newCallback;
  },
  // listen for all request ID
  onAll: (topic, callback) => {
    autoSubscribe(topic);
    const newCallback = (e, reqId, ...data) => {
      console.debug(`IpcRenderer <-- ${colorize.yellow(`[ALL]`)} ${colorize.magenta(topic)}`, ...data);
      return callback(...data);
    };

    if (topicHandlers[topic] == null) topicHandlers[topic] = [];
    topicHandlers[topic].push(newCallback);
    ipcRenderer.on(topic, newCallback);
  },
  once: (topic, callback) => {
    const originalCallback = callback.bind({});
    callback = (e, data) => {
      originalCallback(data);
    };
    ipcRenderer.once(topic, callback);
  },
  onFromPrevPage: (callback) => {
    IpcSender.on("__window_param__", callback);
  },
  emit: (...arg) => {
    sender(...arg);
  },
  isCurrentElectron: !!ipcRenderer,
};

export default IpcSender;
