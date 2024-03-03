import { writable } from "svelte/store";

const getStore = (name) => {
  const json = localStorage.getItem(name);
  try {
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};

const setStore = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

const PersistStore = (name, defaultValue) => {
  if (name === "") throw new Error("store name is empty");
  const persistedValue = getStore(name);
  const store = writable(persistedValue ?? defaultValue);
  store.subscribe((value) => {
    setStore(name, value);
  });
  // set store.initialize
  store.initialize = () => {
    console.log(`store ${name} initialized`);
    store.set(defaultValue);
  };
  return store;
};

export default PersistStore;
