import __console__ from "./console.js";
import __array__ from "./array.js";
import remoteMain from "@electron/remote/main/index.js";
import dotenv from "dotenv";
import path from "path";
import { initialize } from "./logger.js";
// import logsh from "logsh";

const __dirname = path.resolve();

const initializer = {
  all: (isBuildMode, appDataPath) => {
    initialize(isBuildMode, appDataPath);

    // logsh.init();
    remoteMain.initialize();
    dotenv.config({ path: path.resolve(__dirname, "../.env") });

    console.log("initializer complete");
    return {};
  },
};

__console__();
__array__();

export default initializer;
