import { get } from "svelte/store";
import PersistStore from "../utils/PersistStore";

export const authStore = PersistStore("auth", {
  uid: null,
  userId: null,
  authorized: false,
});

export const getAuth = () => get(authStore);
