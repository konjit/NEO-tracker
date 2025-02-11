import {
  initPage,
  initAsteroidViews,
  initDateRange,
} from "./controller/uiPage.js";

import { scrollFunction} from "./eventHandlers.js"
const loadApp = () => {
  initPage();
  initDateRange();
  initAsteroidViews();
};

window.addEventListener("load", loadApp);
window.onscroll = () => scrollFunction();
