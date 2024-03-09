import WindowService from "../service/window.service.js";
// import UserService from "../service/user.service.js";
import IpcService from "../service/ipc.service.js";
// import SocketService from "../service/socket.service.js";
// import WebsocketService from "../service/websocket.service.js";
// import DatabaseService from "../service/database.service.js";
// import UpdaterService from "../service/updater.service.js";
import PlatformService from "../service/platform.service.js";

import WindowConfigure from "../configures/window.config.js";
import IpcConfigure from "../configures/ipc.config.js";
import PlatformConfigure from "../configures/platform.config.js";

class ServiceGroup {
  constructor() {
    this.windowService = new WindowService();
    // this.userService = new UserService();
    this.ipcService = new IpcService();
    // this.socketService = new SocketService();
    // this.websocketService = new WebsocketService();
    // this.databaseService = new DatabaseService();
    // this.updaterService = new UpdaterService();
    this.platformService = new PlatformService();
  }

  injectReferences() {
    this.windowService.inject(this);
    // this.userService.inject(this);
    this.ipcService.inject(this);
    // this.socketService.inject(this);
    // this.websocketService.inject(this);
    // this.databaseService.inject(this);
    // this.updaterService.inject(this);
    this.platformService.inject(this);
  }

  configureAndRun() {
    WindowConfigure(this.windowService);
    IpcConfigure(this.ipcService);
    PlatformConfigure(this.platformService);
  }
}

export default ServiceGroup;
