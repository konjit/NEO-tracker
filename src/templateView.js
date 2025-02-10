import {
  FOOTER_ID,
  HEADER_ID,
  CARD_CONTAINER_ID,
  DATE_CONTAINER_ID,
  BTN_CONTAINER_ID,
  NEO_SECTION_ID,
  INFO_CONTAINER,
  VIS_SECTION_ID,
  TO_TOP_BTN_ID,
  IMG_CONTAINER,
  IMG_SECTION_ID,
  END_DATE_ID,
  START_DATE_ID,
} from "./constants.js";

import {
  createDateInput,
  createComboboxView,
  createDivElement,
  createButtonElement,
} from "./componentView.js";

export const createNeoSectionView = () => {
  const neoSection = document.createElement("section");
  neoSection.id = NEO_SECTION_ID;

  const dateContainer = createDivElement();
  dateContainer.id = DATE_CONTAINER_ID;
  const dateEl = createDateInput();
  dateEl.id = START_DATE_ID;

  const dateEndEl = createDateInput();
  dateEndEl.id = END_DATE_ID;

  const comboBox = createComboboxView();

  dateContainer.appendChild(dateEl);
  dateContainer.appendChild(dateEndEl);
  dateContainer.appendChild(comboBox);

  neoSection.appendChild(dateContainer);

  // NEO Cards
  const cardContainer = createDivElement();
  cardContainer.id = CARD_CONTAINER_ID;

  const infoContainer = createDivElement();
  infoContainer.id = INFO_CONTAINER;

  const mainContainer = createDivElement();
  mainContainer.classList.add("neo-main-parent-container");

  mainContainer.appendChild(cardContainer);
  mainContainer.appendChild(infoContainer);
  neoSection.appendChild(mainContainer);
  const btnContainer = createDivElement();
  btnContainer.id = BTN_CONTAINER_ID;
  neoSection.appendChild(btnContainer);
  return neoSection;
};

export const createCardElement = () => {
  const card = createDivElement();
  card.classList.add("card");
  const cardHeader = createDivElement();
  cardHeader.classList.add("card-header");
  const cardBody = createDivElement();
  cardBody.classList.add("card-body");

  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  return card;
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

  const link3 = document.createElement("a");
  link3.href = VIS_SECTION_ID;
  link3.classList.add("navbar-link");
  link3.innerText = "Visualization";

  const link2 = document.createElement("a");
  link2.href = IMG_SECTION_ID;
  link2.classList.add("navbar-link");
  link2.innerText = "Image of the Day";

  const linkContainer = document.createElement("div");
  linkContainer.classList.add("navbar-links");
  linkContainer.appendChild(link1);
  linkContainer.appendChild(link3);
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

export const createImgSectionView = () => {
  const imgSection = document.createElement("section");
  imgSection.id = IMG_SECTION_ID;
  const imgContainer = createDivElement();
  imgContainer.id = IMG_CONTAINER;

  imgSection.appendChild(imgContainer);

  return imgSection;
};

export const createVisualizationSectionView = () => {
  const visSection = document.createElement("section");
  visSection.id = VIS_SECTION_ID;
  const visContainer = createDivElement();

  visContainer.style.width = "1000px";
  visContainer.style.height = "700px";
  visSection.appendChild(visContainer);
  return visSection;
};

export const topBtnView = () => {
  const topBtn = createButtonElement();
  topBtn.id = TO_TOP_BTN_ID;
  topBtn.classList.add("btn");
  topBtn.innerHTML = ' <i class="fas fa-arrow-up"></i>';

  return topBtn;
};

export const createFooterView = () => {
  const element = document.createElement("footer");
  element.id = FOOTER_ID;

  const copyrightText = document.createElement("p");
  copyrightText.textContent = "© 2025 All Rights Reserved.";
  copyrightText.style.textAlign = "center";

  element.appendChild(copyrightText);
  return element;
};
