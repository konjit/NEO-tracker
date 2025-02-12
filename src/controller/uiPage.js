import {
  APP_ID,
  START_DATE_ID,
  END_DATE_ID,
  CARD_CONTAINER_ID,
  CARDS_PER_PAGE,
  BTN_CONTAINER_ID,
  IMG_DAY_ID,
  INFO_CONTAINER,
} from "../constants.js";

import {
  createNeoSectionView,
  createHeaderView,
  createFooterView,
  createImgSectionView,
  topBtnView,
  createWelcomeMessage,
} from "../view/templates.js";

import { createButtonElement } from "../view/components.js";

import {
  fetchImageOfTheDay,
  fetchDetailedNEOData,
  fetchNEOs,
  filterDateRangeNEOs,
} from "../model/api.js";

import { getDateAfterDays, convertDateFormat } from "../utils.js";

import { countPotentiallyHazardousAsteroids } from "../helpers/helper.js";

import {
  getAsteroids,
  setupEventListener,
  dateEventHandler,
  selectEventHandler,
} from "../eventHandlers.js";

import { createAsteroidCard, getDetailedComponent } from "../view/uiView.js";

export const initPage = () => {
  const appInterface = document.getElementById(APP_ID);

  // Header-> navbar
  const header = createHeaderView();
  document.body.prepend(header);

  initWelcomeSection();

  /* Neo section */
  const neoSection = createNeoSectionView();
  appInterface.appendChild(neoSection);

  /* Image of the day section */
  const imgSection = createImgSectionView();
  appInterface.appendChild(imgSection);

  /* Footer */
  const footer = createFooterView();
  document.body.appendChild(footer);

  /* To the top buttton */
  const topBtn = topBtnView();
  appInterface.appendChild(topBtn);

  /* Event listeners */
  setupEventListener();
  dateEventHandler();
  getAsteroids();
  selectEventHandler();
};

/* Intro section of the page  
** A hero section could have been used, but time was limited  
*/  

export const initWelcomeSection = async () => {
  const welcomeContainer = document.createElement("div");

  welcomeContainer.classList.add("intro-container");
  const heading = document.createElement("h1");
  heading.innerText = "Welcome to NEO Tracker";
  heading.classList.add("welcome-heading");

  const h3 = document.createElement("h3");
  h3.classList.add("neos-info");

  const neos = await fetchNEOs();

  if (neos.error) {
    welcomeContainer.innerHTML = `<h2 class='error-heading'>${neos.message}</h2>`;
  }
  const countHazardousAsteroids = countPotentiallyHazardousAsteroids(neos);
  const keys = Object.keys(neos.near_earth_objects);
  const startDate = convertDateFormat(keys[0]);
  const endDate = convertDateFormat(keys[keys.length - 1]);

  selectEventHandler(neos);

  h3.innerHTML = createWelcomeMessage(
    startDate,
    endDate,
    neos.element_count,
    countHazardousAsteroids
  );

  welcomeContainer.prepend(h3);
  welcomeContainer.prepend(heading);
  document.getElementById(APP_ID).prepend(welcomeContainer);
};

export const initDateRange = () => {
  document.getElementById(START_DATE_ID).value = getDateAfterDays(0);
  document.getElementById(END_DATE_ID).value = getDateAfterDays(7);
};

/* Initialize the page with NEOs (asteroids) within a date range
 ** from today to 6 days ahead.
 ** Example: If today is 11-02-2025, it shows asteroids up to 18-02-2025.
 */

export const initAsteroidViews = async () => {
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);
  const startDate = document.getElementById(START_DATE_ID);
  const endDate = document.getElementById(END_DATE_ID);
  const todayNEOs = await filterDateRangeNEOs(startDate.value, endDate.value);

  if (todayNEOs.error) {
    cardContainer.innerHTML = `<h1 class='error-heading'>${todayNEOs.message}</h1>`;
  }

  selectEventHandler(todayNEOs);

  const existingH3 = document.querySelector(".neo-general-info");
  if (existingH3) {
    existingH3.remove();
  }

  displayNEOs(todayNEOs.reverse());
  displayDetailedInfo(todayNEOs[0].id);

  cardContainer.children[0].classList.add("selected");
};

/* This is the card the shows the detailed of each asteroid when the
 ** cards from this createAsteroidCard is clicked
 */

export const displayDetailedInfo = async (neoReferenceID) => {
  const detailedNEOInfoCard = document.getElementById(INFO_CONTAINER);
  detailedNEOInfoCard.innerHTML = `
                  <div class="loading-spinner">
                    <div class="spinner"></div>
                  </div>
                                  `;
  const neo = await fetchDetailedNEOData(neoReferenceID);
  if (neo.error) {
    detailedNEOInfoCard.innerHTML = `<div class="error-message">${neo.message}</div>`;
    return;
  }
  getDetailedComponent(neo, detailedNEOInfoCard);
};

/* Display asteroids in a card view  
** Shows up to 6 per page with pagination if there are more  
*/  

export const displayNEOs = (noes) => {
  window.currentPage = 1;
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);
  const btnContainer = document.getElementById(BTN_CONTAINER_ID);

  const totalPages = Math.ceil(noes.length / CARDS_PER_PAGE);

  const preButton = createButtonElement();
  preButton.innerText = "<< Previous";
  const nextButton = createButtonElement();
  nextButton.innerText = "Next >>";

  const displayPage = (page) => {
    cardContainer.innerHTML = "";
    const startIndex = (page - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    const currentNEOs = noes.slice(startIndex, endIndex);
    createAsteroidCard(currentNEOs, cardContainer);

    preButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;

    preButton.onclick = () => {
      window.currentPage--;
      displayPage(window.currentPage);
    };

    nextButton.onclick = () => {
      window.currentPage++;
      displayPage(window.currentPage);
    };
  };
  if (noes.length > CARDS_PER_PAGE) {
    btnContainer.innerHTML = "";
    btnContainer.appendChild(preButton);
    btnContainer.appendChild(nextButton);
  }
  displayPage(window.currentPage);
};

/*             Handles NASA's Image of the Day 
** The API response includes a 'media_type' property, which can be 'image' or 'video'.  
** This function ensures proper handling and display of both media types.  
*/  
export const getImageOfTheDay = async (imgVideoContainer) => {
  imgVideoContainer.innerHTML = "";
  const imgData = await fetchImageOfTheDay();
  console.log(imgData);
  if (imgData.error) {
    imgVideoContainer.innerHTML = `<h1 class='error-heading'>${imgData.message}</h1>`;
    console.log('image of the day')
  }

  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("description-container");

  const heading = document.createElement("h1");
  heading.innerText = imgData.title;
  heading.classList.add("image-heading");

  const explanation = document.createElement("p");
  explanation.innerText = imgData.explanation;
  explanation.classList.add("image-explanation");

  descriptionContainer.appendChild(heading);
  descriptionContainer.appendChild(explanation);

  const imgVideoWrapper = document.createElement("div");

  if(imgData.media_type === 'image'){
    imgVideoWrapper.classList.add("image-wrapper");

    const img = document.createElement("img");
    img.id = IMG_DAY_ID;
    img.src = imgData.hdurl;
    img.alt = imgData.title;
    img.classList.add("image-of-the-day");
    imgVideoWrapper.appendChild(img);
  
  }
  else if(imgData.media_type === "video"){
    imgVideoWrapper.classList.add("video-wrapper");

    const iframe = document.createElement("iframe");
    iframe.id = IMG_DAY_ID;
    iframe.src = imgData.url;
    iframe.alt = imgData.title;
  
    imgVideoWrapper.appendChild(iframe);
  }
  imgVideoContainer.appendChild(descriptionContainer);
  imgVideoContainer.appendChild(imgVideoWrapper);
};
