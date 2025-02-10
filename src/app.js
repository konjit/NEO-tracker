import { initPage, setUp, scrollFunction, initDateRange } from "./uiPage.js";

const loadApp = () => {
  initPage();
  initDateRange();
  setUp();
};

window.addEventListener("load", loadApp);

window.onscroll = () => scrollFunction();
