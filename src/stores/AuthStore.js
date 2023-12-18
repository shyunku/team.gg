import PersistStore from "../utils/PersistStore";

export const authStore = PersistStore("auth", {
  uid: null,
  userId: null,
  authorized: false,
});
