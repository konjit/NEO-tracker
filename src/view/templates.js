import {
  HEADER_ID,
  CARD_CONTAINER_ID,
  BTN_CONTAINER_ID,
  NEO_SECTION_ID,
  INFO_CONTAINER,
  TO_TOP_BTN_ID,
  IMG_CONTAINER,
  IMG_SECTION_ID,
  END_DATE_ID,
  START_DATE_ID,
  SELECTOR_ID,
} from "../constants.js";

import {
  createDateInput,
  createButtonElement,
  createInputElement,
} from "./components.js";

export const createFooterView = () => {
  const element = document.createElement("footer");

  const copyrightText = document.createElement("p");
  copyrightText.textContent = "© 2025 All Rights Reserved.";
  copyrightText.style.textAlign = "center";

  element.appendChild(copyrightText);

  return element;
};

export const createNeoSectionView = () => {
  const neoSection = document.createElement("section");
  neoSection.id = NEO_SECTION_ID;

  const dateContainer = document.createElement("div");
  dateContainer.classList.add("date-container");
  const dateEl = createDateInput();
  dateEl.id = START_DATE_ID;

  const dateEndEl = createDateInput();
  dateEndEl.id = END_DATE_ID;

  const comboBox = createComboboxView();
  const searchBar = createInputElement();
  //searchBar.classList.add("neo-general-info");

  dateContainer.appendChild(dateEl);
  dateContainer.appendChild(dateEndEl);
  dateContainer.appendChild(comboBox);
  dateContainer.appendChild(searchBar);

  neoSection.appendChild(dateContainer);

  // NEO Cards
  const cardContainer = document.createElement("div");
  cardContainer.id = CARD_CONTAINER_ID;

  const infoContainer = document.createElement("div");
  infoContainer.id = INFO_CONTAINER;

  const mainContainer = document.createElement("div");
  mainContainer.classList.add("neo-main-parent-container");

  mainContainer.appendChild(cardContainer);
  mainContainer.appendChild(infoContainer);
  neoSection.appendChild(mainContainer);

  const btnContainer = document.createElement("div");
  btnContainer.id = BTN_CONTAINER_ID;
  neoSection.appendChild(btnContainer);

  return neoSection;
};

export const createInputView = () => {
  const container = document.createElement("div");
  container.classList.add("intro-container");
  const dateInput = createDateInput();
  const combobox = createComboboxView();

  container.appendChild(heading);
  container.appendChild(dateInput);
  container.appendChild(combobox);

  return container;
};

export const createComboboxView = () => {
  const selectEl = document.createElement("select");
  selectEl.id = SELECTOR_ID;
  selectEl.classList.add("input-element");

  const options = [
    { value: "size", text: "Sort By Size" },
    { value: "brightness", text: "Sort By Intensity" },
    { value: "hazardous", text: "First Hazardous" },
  ];
  options.forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.value;
    optionEl.innerText = option.text;
    selectEl.appendChild(optionEl);
  });

  return selectEl;
};

export const createHeaderView = () => {
  const element = document.createElement("header");
  element.id = HEADER_ID;

  const navContainer = document.createElement("nav");
  navContainer.classList.add("navbar");

  const brand = document.createElement("a");
  brand.href = "#";
  brand.classList.add("navbar-brand");
  brand.innerText = "NEO Tracker";

  const menuButton = document.createElement("button");
  menuButton.classList.add("navbar-menu-button");
  menuButton.innerHTML = "☰";

  const link1 = document.createElement("a");
  link1.href = NEO_SECTION_ID;
  link1.classList.add("navbar-link");
  link1.innerText = "Asteroids";

  const link2 = document.createElement("a");
  link2.href = IMG_SECTION_ID;
  link2.classList.add("navbar-link");
  link2.innerText = "Image of the Day";

  const linkContainer = document.createElement("div");
  linkContainer.classList.add("navbar-links");

  linkContainer.appendChild(link1);
  linkContainer.appendChild(link2);

  navContainer.appendChild(brand);
  navContainer.appendChild(menuButton);
  navContainer.appendChild(linkContainer);

  element.appendChild(navContainer);

  menuButton.addEventListener("click", () => {
    linkContainer.classList.toggle("show-links");
  });

  return element;
};

export const createWelcomeMessage = (start, end, count, hazardous) => {
  return `
      Between <strong>${end}</strong> and <strong>${start}</strong>, there are 
      <span class="count">${count}</span> asteroids flying by. 
      There could be in total <span class="count">${hazardous}</span> potentially hazardous asteroid(s).
      Use the search bar, the date picker and the options below to find specific asteroids 
      by name or filter by their potential danger. Additionally, you can view image of the day 
      provided by NASA.
    `;
}

export const createImgSectionView = () => {
  const imgSection = document.createElement("section");
  imgSection.id = IMG_SECTION_ID;
  const imgContainer = document.createElement("div");
  imgContainer.id = IMG_CONTAINER;

  imgSection.appendChild(imgContainer);

  return imgSection;
};
export const topBtnView = () => {
  const topBtn = createButtonElement();
  topBtn.id = TO_TOP_BTN_ID;
  topBtn.classList.add("btn");
  topBtn.innerHTML = ' <i class="fas fa-arrow-up"></i>';

  return topBtn;
};
