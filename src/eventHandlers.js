import { fetchNEOs, filterDateRangeNEOs } from "./model/api.js";
import {
  SEARCH_INPUT_ID,
  CARD_CONTAINER_ID,
  CARDS_PER_PAGE,
  IMG_CONTAINER,
  START_DATE_ID,
  END_DATE_ID,
  TO_TOP_BTN_ID,
  SELECTOR_ID,
  SCROLL_TH,
} from "./constants.js";

import {
  displayNEOs,
  initAsteroidViews,
  getImageOfTheDay,
  displayDetailedInfo,
} from "./controller/uiPage.js";
import { convertDateFormat } from "./utils.js";

import {
  filterAsteroids,
  sortNEOByBrightness,
  sortNEOBySize,
  firstHazardous,
} from "./helpers/helper.js";

export const setupEventListener = () => {
  const imgContainer = document.getElementById(IMG_CONTAINER);
  getImageOfTheDay(imgContainer);

  dateEventHandler();
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);

  // I used event delegation
  cardContainer.addEventListener("click", (e) => {
    const clickedCard = e.target.closest(".card");
    if (!clickedCard) return;
    const neoReferenceID = clickedCard.dataset.neoReferenceId;

    Array.from(cardContainer.children).forEach((c) => {
      c.classList.remove("selected");
    });

    clickedCard.classList.add("selected");
    displayDetailedInfo(neoReferenceID);
  });

  const links = document.querySelectorAll(".navbar-link");

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  document.getElementById(TO_TOP_BTN_ID).addEventListener("click", () => {
    toTheTop();
  });
};

// Can be refactored
export const dateEventHandler = () => {
  const startDate = document.getElementById(START_DATE_ID);
  const endDate = document.getElementById(END_DATE_ID);
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);

  let startSet,
    endSet = false;

  const handleDateInput = async () => {
    const start = startDate.value;
    const end = endDate.value;

    const neoes = await filterDateRangeNEOs(start, end);
    if (neoes.error) {
      cardContainer.innerHTML = `<h1 class='error-heading'>${neoes.message}</h1>`;
      return;
    }

    const existingH3 = document.querySelector(".neo-general-info");
    if (existingH3) {
      existingH3.remove();
    }
    const h3 = document.createElement("h3");
    h3.classList.add("neo-general-info");
    h3.innerHTML = `
       Between <strong>${convertDateFormat(
         start
       )}</strong> and <strong>${convertDateFormat(end)}</strong>, there are 
      <span class="count">${
        neoes.length
      }</span> near-Earth objects (NEOs) flying by. 
       `;

    displayNEOs(neoes);
  };

  const checkAndHandleDates = () => {
    if (startSet || endSet) handleDateInput();
  };

  startDate.addEventListener("change", () => {
    cardContainer.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    `;
    startSet = true;
    checkAndHandleDates();
  });

  endDate.addEventListener("change", () => {
    cardContainer.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    `;
    endSet = true;
    checkAndHandleDates();
  });
};

export const selectEventHandler = (neos) => {
  const selectEl = document.getElementById(SELECTOR_ID);

  if (!Array.isArray(neos)) {
    return;
  }

  selectEl.addEventListener("change", (e) => {
    if (e.target.value === "size") {
      displayNEOs(sortNEOBySize(neos));
    } else if (e.target.value === "brightness") {
      displayNEOs(sortNEOByBrightness(neos));
    } else if (e.target.value === "hazardous") {
      displayNEOs(firstHazardous(neos));
    }
  });
};

export const scrollFunction = () => {
  const topButton = document.getElementById("top");
  const scrollThreshold = SCROLL_TH;
  if (
    document.body.scrollTop > scrollThreshold ||
    document.documentElement.scrollTop > scrollThreshold
  ) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
};

export const toTheTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

export const getAsteroids = () => {
  const searchElement = document.getElementById(SEARCH_INPUT_ID);
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);

  searchElement.addEventListener("keyup", async () => {
    cardContainer.innerHTML = "";

    if (searchElement.value.trim() === "") {
      initAsteroidViews();
      return;
    }
    const data = await fetchNEOs(); // there should be error handling I will add it latter
    const results = filterAsteroids(data, searchElement.value.trim().toLowerCase());

    if (results.length > 0) {
      displayNEOs(results.slice(0, CARDS_PER_PAGE));
    } else {
      const message = `There is no asteroid with the name ${searchElement.value}`;
      cardContainer.innerHTML = `<div class="no-results-message">${message}</div>`;
    }
  });
};
