import {
  APP_ID,
  TODAY_DATE_ID,
  CARD_CONTAINER_ID,
  CARDS_PER_PAGE,
  DATE_CONTAINER_ID,
  BTN_CONTAINER_ID,
  IMG_CONTAINER,
  SELECTOR_ID,
  INFO_CONTAINER,
} from "./constants.js";
import { API_KEY } from "../config.js";
import {
  createDivElement,
  createButtonElement,
  createInputElement,
} from "./componentView.js";

import { filterNEOs, fetchImageOfTheDay, fetchDetailedNEOData } from "./api.js";
import { getTodayDate } from "./utils.js";
import {
  createIntroView,
  createNeoSectionView,
  createHeaderView,
  createFooterView,
  createVisualizationSectionView,
  createImgSectionView,
} from "./templateView.js";

export const initPage = () => {
  const appInterface = document.getElementById(APP_ID);

  const header = createHeaderView();
  document.body.prepend(header);

  // Intro section
  const introView = createIntroView();
  appInterface.appendChild(introView);

  const searchInput = createInputElement();
  appInterface.appendChild(searchInput);

  // Neo section
  const neoSection = createNeoSectionView();
  appInterface.appendChild(neoSection);

  // Image of the day section
  const imgSection = createImgSectionView();
  appInterface.appendChild(imgSection);

  // Visualization  section
  const visSection = createVisualizationSectionView();
  appInterface.appendChild(visSection);

  const footer = createFooterView();
  document.body.appendChild(footer);

  setupEventListener();
};

const sortNEOByBrightness = (asteroids) => {
  asteroids.sort((asteroid1, asteroid2) => {
    return asteroid1.absolute_magnitude_h - asteroid2.absolute_magnitude_h;
  });
  console.log(asteroids);
  return asteroids;
};

const sortNEOBySize = (asteroids) => {
  asteroids.sort((asteroid1, asteroid2) => {
    const size1 = Math.floor(
      (asteroid1.estimated_diameter.meters.estimated_diameter_max +
        asteroid1.estimated_diameter.meters.estimated_diameter_min) /
        2
    ).toFixed(2);
    const size2 = Math.floor(
      (asteroid2.estimated_diameter.meters.estimated_diameter_max +
        asteroid2.estimated_diameter.meters.estimated_diameter_min) /
        2
    ).toFixed(2);
    return size1 - size2;
  });
  console.log(asteroids);
  return asteroids;
};

export const displayNEOs = (todayNEOs) => {
  window.currentPage = 1;
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);
  const btnContainer = document.getElementById(BTN_CONTAINER_ID);
  cardContainer.innerHTML = "";

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
    card.setAttribute("data-neo-reference-id", neo.neo_reference_id);

    const isHazardous = neo.is_potentially_hazardous_asteroid;

    card.innerHTML = `
      <div class="card-container ${isHazardous ? "hazardous" : ""}">
        <h3 class="card-heading">${neo.name}</h3>
        <div class="card-body">
          <p><strong>Approach Date:</strong> ${
            neo.close_approach_data[0].close_approach_date
          }</p>
          <p><strong>Brightness:</strong> ${neo.absolute_magnitude_h}</p>
          <p><strong>Hazardous:</strong> <span class="hazardous-text">${
            isHazardous ? "Yes" : "No"
          }</span></p>
        </div>
      </div>
    `;

    cardContainer.appendChild(card);
  });
};

const createInfoView = async (neoReferenceID) => {
  const detailedNEOInfoCard = document.getElementById(INFO_CONTAINER);
  detailedNEOInfoCard.innerHTML = "";
  const neo = await fetchDetailedNEOData(neoReferenceID);

  if (neo.error) {
    detailedNEOInfoCard.innerHTML = `<div class="error-message">${neo.message}</div>`;
    return;
  }

  const approachDate = neo.close_approach_data[0].close_approach_date;
  const brightness = neo.absolute_magnitude_h;
  const diameter = Math.floor(
    (neo.estimated_diameter.meters.estimated_diameter_max +
      neo.estimated_diameter.meters.estimated_diameter_min) /
      2
  ).toFixed(2);

  const isHazardous = neo.is_potentially_hazardous_asteroid ? "Yes" : "No";
  const orbitalData = neo.orbital_data
    ? `
    <div class="orbital-data">
      <h3>Orbital Data</h3>
      <p><strong>Orbit Determination Date:</strong> ${neo.orbital_data.orbit_determination_date}</p>
      <p><strong>Perihelion Distance:</strong> ${neo.orbital_data.perihelion_distance} AU</p>
      <p><strong>Apohelion Distance:</strong> ${neo.orbital_data.aphelion_distance} AU</p>
      <p><strong>Orbital Period:</strong> ${neo.orbital_data.orbital_period} days</p>
    </div>
  `
    : "";

  detailedNEOInfoCard.innerHTML = `
    <div class="neo-info-card">
      <h2>NEO Details</h2>
      <div class="neo-info">
        <p><strong>ID:</strong> ${neo.id}</p>
        <p><strong>Approach Date:</strong> ${approachDate}</p>
        <p><strong>Brightness:</strong> ${brightness}</p>
        <p><strong>Diameter:</strong> ${diameter} meters</p>
        <p><strong>Hazardous:</strong> ${isHazardous}</p>
        ${orbitalData}
        <p><a href="${neo.nasa_jpl_url}" target="_blank" class="view-more btn">View More</a></p>
      </div>
    </div>
  `;
};

export const setupEventListener = () => {
  document.getElementById(TODAY_DATE_ID).addEventListener("input", function () {
    localStorage.setItem("start", this.value);
  });
  document.getElementById(TODAY_DATE_ID).addEventListener("keyup", async () => {
    const todayNEOs = await filterNEOs();
    if (todayNEOs.error) {
      document.getElementById(
        CARD_CONTAINER_ID
      ).innerHTML = `<h1 class='error-heading'>${todayNEOs.message}</h1>`;
    }
    displayNEOs(todayNEOs);
    document
      .getElementById(CARD_CONTAINER_ID)
      .children[0].classList.add("selected");
    getImageOfTheDay(imgContainer);
  });

  const selectEl = document.getElementById(SELECTOR_ID);
  selectEl.addEventListener("change", async (e) => {
    const todayNEO = await filterNEOs();
    if (e.target.value === "size") {
      displayNEOs(sortNEOBySize(todayNEO));
    } else if (e.target.value === "brightness") {
      displayNEOs(sortNEOByBrightness(todayNEO));
    } else {
      console.log("sort by velocity");
    }
  });

  // Used event delegation
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);
  cardContainer.addEventListener("click", (e) => {
    const clickedCard = e.target.closest(".card");
    if (!clickedCard) return;
    const neoReferenceID = clickedCard.dataset.neoReferenceId;

    Array.from(cardContainer.children).forEach((c) => {
      c.classList.remove("selected");
    });

    clickedCard.classList.add("selected");

    createInfoView(neoReferenceID);
  });

  const links = document.querySelectorAll(".navbar-link");

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.getElementById(targetId);
      console.log(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  const menuButton = document.querySelector(".navbar-menu-button");
  const linkContainer = document.querySelector(".navbar-links");

  if (menuButton && linkContainer) {
    menuButton.addEventListener("click", () => {
      menuButton.classList.toggle("active");
      linkContainer.classList.toggle("show-links");
    });

    document.querySelectorAll(".navbar-link").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.classList.remove("active");
        linkContainer.classList.remove("show-links");
      });
    });
  }
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

export const setUp = async () => {
  document.getElementById(TODAY_DATE_ID).value = getTodayDate();
  const imgContainer = document.getElementById(IMG_CONTAINER);
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);
  const btnContainer = document.getElementById(BTN_CONTAINER_ID);
  const todayNEOs = await filterNEOs();

  if (todayNEOs.error) {
    cardContainer.innerHTML = `<h1 class='error-heading'>${todayNEOs.message}</h1>`;
  }
  createInfoView(todayNEOs[0].id);

  displayNEOs(todayNEOs, cardContainer, btnContainer);
  cardContainer.children[0].classList.add("selected");
  getImageOfTheDay(imgContainer);
};

const getImageOfTheDay = async (imgContainer) => {
  imgContainer.innerHTML = "";

  const data = await fetchImageOfTheDay();

  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("description-container");

  const heading = document.createElement("h1");
  heading.innerText = data.title;
  heading.classList.add("image-heading");

  const explanation = document.createElement("p");
  explanation.innerText = data.explanation;
  explanation.classList.add("image-explanation");

  descriptionContainer.appendChild(heading);
  descriptionContainer.appendChild(explanation);


  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("image-wrapper");

  const img = document.createElement("img");
  img.src = data.hdurl;
  img.alt = data.title;
  img.classList.add("image-of-the-day");
  imgWrapper.appendChild(img);

  
  const copyright = document.createElement("p");
  copyright.innerText = `© ${data.copyright || "Unknown"} - ${data.date}`;
  copyright.classList.add("copyright-text");


  imgContainer.appendChild(descriptionContainer);
  imgContainer.appendChild(imgWrapper);
   imgContainer.appendChild(copyright);
};

