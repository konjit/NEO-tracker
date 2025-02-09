import { initPage, setUp } from "./uiPage.js";

const loadApp = () => {
  initPage();
  setUp();
};

window.addEventListener("load", loadApp);
