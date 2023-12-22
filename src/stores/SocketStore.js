import { writable } from "svelte/store";
import io from "socket.io-client";
import { ServerHostBase } from "../thunks/GeneralThunk";

function createSocketStore() {
  const { subscribe, set, update } = writable(null);

  let socket;

  const initialize = () => {
    try {
      const targetUrl = `${ServerHostBase}`;
      console.log(`connecting to ${targetUrl}`);
      socket = io.connect(`${targetUrl}`, {
        path: "/socket.io",
        // autoConnect: false,
        transports: ["websocket"],
        upgrade: false,
        // withCredentials: true,
      });
      socket.on("connect", () => {
        console.log("socket connected!");
        update((state) => ({ ...state, connected: true }));
      });
      socket.on("disconnect", (reason) => {
        console.log("socket disconnected:", reason);
        update((state) => ({ ...state, connected: false }));
      });
      socket.on("error", (err) => {
        console.log("error", err);
      });
      socket.on("connect_error", (err) => {
        console.log("connect_error:", err.message);
      });
    } catch (err) {
      console.error(err);
    }

    set({ socket, connected: socket.connected });
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  const on = (event, cb) => {
    socket?.on(event, cb);
  };

  const off = (event, cb) => {
    socket?.off(event, cb);
  };

  const emit = (event, data) => {
    socket?.emit(event, data);
  };

  return {
    subscribe,
    initialize,
    disconnect,
    on,
    off,
    emit,
  };
}

export const socketStore = createSocketStore();
