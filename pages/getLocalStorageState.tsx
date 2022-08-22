import { State, defaults } from "./index";

export const getLocalStorageState = (): State => {
  try {
    const lsValue = window.localStorage.getItem("state") || "";
    const lsState = JSON.parse(lsValue);
    const state = { ...defaults, ...lsState };
    return state as State;
  } catch (e) {
    return defaults;
  }
};
