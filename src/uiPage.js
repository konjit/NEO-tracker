import {
  APP_ID,
  TODAY_DATE_ID,
  CARD_CONTAINER_ID,
  CARDS_PER_PAGE,
  DATE_CONTAINER_ID,
  BTN_CONTAINER_ID,
} from "./constants.js";
import {
  createDateInput,
  createDivElement,
  createButtonElement,
  createHeader,
  createComboboxView,
  imageOfTheDay,
} from "./uiView.js";
import { fetchNEOs, filterNEOs } from "./api.js";
import { getTodayDate } from "./utils.js";

export const initPage = () => {
  const appInterface = document.getElementById(APP_ID);

  // Header or Navigation bar
  const header = createHeader();
  appInterface.appendChild(header);

  // Date and Combobox
  const dateContainer = createDivElement();
  dateContainer.id = DATE_CONTAINER_ID;
  const dateEl = createDateInput();
  dateEl.id = TODAY_DATE_ID;
  const comboBox = createComboboxView();

  dateContainer.appendChild(dateEl);
  dateContainer.appendChild(comboBox);

  appInterface.appendChild(dateContainer);

  // NEO Cards
  const cardContainer = createDivElement();
  cardContainer.id = CARD_CONTAINER_ID;

  appInterface.appendChild(cardContainer);

  const  btnContainer = createDivElement();
  btnContainer.id = BTN_CONTAINER_ID;

  appInterface.appendChild(btnContainer);
  
  dateEl.addEventListener("keyup", async () => {
    displayNEOs(cardContainer, btnContainer);
  });

  appInterface.appendChild(imageOfTheDay());
};

export const displayNEOs = async (cardContainer, btnContainer) => {
  console.log(btnContainer)
  window.currentPage = 1;
  cardContainer.innerHTML = "";
  const date = document.getElementById(TODAY_DATE_ID).value;

  const asteroids = await fetchNEOs();
  const todayNEOs = filterNEOs(date, asteroids.near_earth_objects);
  console.log(todayNEOs);
  const totalPages = Math.ceil(todayNEOs.length / CARDS_PER_PAGE);

  const preButton = createButtonElement();
  preButton.innerText = "<< Previous";
  const nextButton = createButtonElement();
  nextButton.innerText = "Next >>";
  const renderPage = (page) => {
    cardContainer.innerHTML = "";
    const startIndex = (page - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    const currentNEOs = todayNEOs.slice(startIndex, endIndex);
    createCardView(currentNEOs, cardContainer);

    preButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;

    preButton.onclick = () => {
      window.currentPage--;
      renderPage(window.currentPage);
    };

    nextButton.onclick = () => {
      window.currentPage++;
      renderPage(window.currentPage);
    };
  };
  if (todayNEOs.length > CARDS_PER_PAGE) {
    btnContainer.innerHTML = ""; 
    btnContainer.appendChild(preButton);
    btnContainer.appendChild(nextButton);
  }

  renderPage(window.currentPage);
};

const createCardView = (currentNEOs, cardContainer) => {
  currentNEOs.forEach((neo) => {
    const card = createCardElement();
    const cardHeader = card.querySelector(".card-header");
    const cardBody = card.querySelector(".card-body");

    const link = document.createElement("a");
    link.target = "_blank";
    link.href = neo.nasa_jpl_url;
    cardBody.innerHTML = `
        ID: ${neo.id}<br>
        Approach Date: ${neo.close_approach_data[0].close_approach_date}<br>
        Magnitude: ${neo.absolute_magnitude_h}<br>
        Diameter: ${Math.floor(
          (neo.estimated_diameter.meters.estimated_diameter_max +
            neo.estimated_diameter.meters.estimated_diameter_min) /
            2
        ).toFixed(2)} m<br>
        Hazardous: ${neo.is_potentially_hazardous_asteroid}<br>
        <a href="${neo.nasa_jpl_url}" target="_blank">View</a>
    `;
    cardBody.appendChild(link);
    cardHeader.innerText = neo.name;
    cardContainer.appendChild(card);
  });
};

export const setupEventListener = () => {
  document.getElementById(TODAY_DATE_ID).addEventListener("input", function () {
    localStorage.setItem("start", this.value);
  });
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
export const setUp = () => {
  document.getElementById(TODAY_DATE_ID).value = getTodayDate();
  const  cardContainer = document.getElementById(CARD_CONTAINER_ID);
  const  btnContainer = document.getElementById(BTN_CONTAINER_ID);
  displayNEOs(cardContainer, btnContainer);
};