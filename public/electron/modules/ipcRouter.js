import { webContents } from "electron";

class IpcRouter {
  constructor() {
    this.listenerMap = {};
  }

  addListener = (topic, webContentsId) => {
    if (!this.listenerMap.hasOwnProperty(topic)) {
      this.listenerMap[topic] = [];
    }

    if (!this.listenerMap[topic].includes(webContentsId)) {
      this.listenerMap[topic].push(webContentsId);
    }
  };

  addListenersByWebContentsId = (topics, webContentsId) => {
    for (let topic of topics) {
      this.addListener(topic, webContentsId);
    }
  };

  broadcast = (topic, reqId, data, ...extra) => {
    if (!this.listenerMap.hasOwnProperty(topic)) {
      console.warn(`You are trying to broadcast nowhere: '${topic}'`);
    } else {
      let webContentsIdList = this.listenerMap[topic];
      if (webContentsIdList.length === 0) {
        console.warn(`You are trying to broadcast empty topic listeners which is meaningless.'`);
      }

      for (let webContentsId of webContentsIdList) {
        let webContent = webContents.fromId(webContentsId);

        if (webContent) {
          webContent.send(topic, reqId, data, ...extra);
        } else {
          console.warn(`WebContents$${webContentsId} doesn't exists.`);
        }
      }

      return webContentsIdList.length;
    }

    return 0;
  };
}

export default IpcRouter;
