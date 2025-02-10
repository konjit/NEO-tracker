import {
  APP_ID, START_DATE_ID, END_DATE_ID, CARD_CONTAINER_ID,
  CARDS_PER_PAGE, SCROLL_TH, BTN_CONTAINER_ID,
  IMG_CONTAINER, SELECTOR_ID, INFO_CONTAINER,
  TO_TOP_BTN_ID,
} from "./constants.js";

import { 
  createNeoSectionView, createHeaderView, createFooterView,
  createVisualizationSectionView, createImgSectionView,
  topBtnView, createCardElement,
} from "./templateView.js";

import { createButtonElement, createInputElement } from "./componentView.js";

import {
  filterNEOs, fetchImageOfTheDay, fetchDetailedNEOData,
  fetchNEOs, filterDateRangeNEOs,
} from "./api.js";

import { getTodayDate, convertDateFormat } from "./utils.js";

import { 
  countPotentiallyHazardousAsteroids, sortNEOBySize,
  potentiallyHazardousAsteroids, sortNEOByBrightness, getDiameter
 } from "./helper.js";

export const initPage = () => {
  const appInterface = document.getElementById(APP_ID);

  const header = createHeaderView();
  document.body.prepend(header);

  const searchInput = createInputElement();
  appInterface.appendChild(searchInput);

  initSearchView();

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

  const topBtn = topBtnView();
  appInterface.appendChild(topBtn);

  setupEventListener();

  dateEventHandler();
};

export const initSearchView = async () => {
  const searchContainer = document.querySelector(".input-container");

  const heading = document.createElement("h1");
  heading.innerText = "Welcome to NEO Tracker";
  heading.classList.add("welcome-heading");

  const h3 = document.createElement("h3");
  h3.classList.add("neos-info");

  const neos = await fetchNEOs();
  if (neos.error) {
    searchContainer.innerHTML = `<h2 class='error-heading'>${neos.message}</h2>`;
  }
  const countHazardousAsteroids = countPotentiallyHazardousAsteroids(neos);
  const keys = Object.keys(neos.near_earth_objects);
  const startDate = convertDateFormat(keys[0]);
  const endDate = convertDateFormat(keys[keys.length - 1]);

  h3.innerHTML = `
    Between <strong>${endDate}</strong> and <strong>${startDate}</strong>, there are 
    <span class="count">${neos.element_count}</span> near-Earth objects (NEOs) flying by. 
    There are in total <span class="count">${countHazardousAsteroids}</span> potentially hazardous asteroids.
    Use the search bar, the date picker and the options below to find specific asteroids 
    by name or filter by their potential danger. 
  `;

  searchContainer.prepend(h3);
  searchContainer.prepend(heading);
};

export const displayNEOs = (todayNEOs) => {
  window.currentPage = 1;
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);
  const btnContainer = document.getElementById(BTN_CONTAINER_ID);
  cardContainer.innerHTML = "Loading...";

  const totalPages = Math.ceil(todayNEOs.length / CARDS_PER_PAGE);

  const preButton = createButtonElement();
  preButton.innerText = "<< Previous";
  const nextButton = createButtonElement();
  nextButton.innerText = "Next >>";

  const displayPage = (page) => {
    cardContainer.innerHTML = "";
    const startIndex = (page - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    const currentNEOs = todayNEOs.slice(startIndex, endIndex);
    createCardView(currentNEOs, cardContainer);

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
  if (todayNEOs.length > CARDS_PER_PAGE) {
    btnContainer.innerHTML = "";
    btnContainer.appendChild(preButton);
    btnContainer.appendChild(nextButton);
  }
  displayPage(window.currentPage);
};

const createCardView = (currentNEOs, cardContainer) => {
  currentNEOs.forEach((neo) => {
    const card = createCardElement();
    card.setAttribute("data-neo-reference-id", neo.neo_reference_id);

    const isHazardous = neo.is_potentially_hazardous_asteroid;
    const diameter = Math.floor(
      (neo.estimated_diameter.meters.estimated_diameter_max +
        neo.estimated_diameter.meters.estimated_diameter_min) /
        2
    ).toFixed(2);
    card.innerHTML = `
      <div class="card-container ${isHazardous ? "hazardous" : ""}">
        <h3 class="card-heading">${neo.name}</h3>
        <div class="card-body">
          <p><strong>Diameter:</strong> ${diameter} m</p>
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
  detailedNEOInfoCard.innerHTML = "<div class='loading'>Loading...</div>";

  const neo = await fetchDetailedNEOData(neoReferenceID);

  if (neo.error) {
    detailedNEOInfoCard.innerHTML = `<div class="error-message">${neo.message}</div>`;
    return;
  }

  getDetailedView(neo, detailedNEOInfoCard)
};

export const getDetailedView = (neo, detailedNEOInfoCard)=>{
  const approachDate = neo.close_approach_data[0].close_approach_date;
  const brightness = neo.absolute_magnitude_h;
  const diameter = getDiameter(neo)

  const isHazardous = neo.is_potentially_hazardous_asteroid ? "Yes" : "No";
  const orbitalData = neo.orbital_data ? getOrbitalData(neo): "";

  detailedNEOInfoCard.innerHTML = `
    <div class="neo-info-card">
      <h2>NEO ${neo.name} </h2>
      <div class="neo-info">
        <p><strong>ID:</strong> ${neo.id}</p>
        <p class="tip"><strong>First Recorded Approach:</strong> ${convertDateFormat(
          approachDate
        )}
          <span class="tip-info">The date when the asteroid's closest approach to Earth occurs.</span>
        </p>
        <p class="tip"><strong>Brightness:</strong> ${brightness}
          <span class="tip-info">Asteroid's brightness if 1 AU from Earth and Sun. Lower values = brighter.</span>
        </p>
        <p class="tip"><strong>Diameter:</strong> ${diameter} meters    
        <span class="tip-info">The estimated size of the asteroid.</span>
        </p>
        <p class="tip"><strong>Hazardous:</strong> ${isHazardous}
        
          <span class="tip-info">Indicates whether the asteroid is considered a potential threat to Earth based on its size and proximity..</span>
        </p>
        ${orbitalData}
        <p><a href="${
          neo.nasa_jpl_url
        }" target="_blank" class="view-more">View More</a></p>
      </div>
    </div>
  `;
}
export const getOrbitalData = (neo) => {

  const orbitalDateDiscoverd = neo.orbital_data.orbit_determination_date;
  const orbitPerihelionDist = Number(
    neo.orbital_data.perihelion_distance
  ).toFixed(4);
  const orbitAphelionDist = Number(
    neo.orbital_data.perihelion_distance
  ).toFixed(4);
  const orbitPeriod = Number(neo.orbital_data.orbital_period).toFixed(4);

  const orbitalData = `
    <div class="orbital-data">
      <h3>Orbital Data</h3>
      <p class="tip"><strong>Orbit Discoverd on:</strong> ${orbitalDateDiscoverd}   
        <span class="tip-info">The date when the asteroid's orbit was last determined or updated.</span>
       </p>
      <p class="tip"><strong>Perihelion Distance:</strong> ${orbitPerihelionDist} AU 
            <span class="tip-info">The closest distance between an object and the Sun.</span>
      </p>
      <p class="tip"><strong>Apohelion Distance:</strong> ${orbitAphelionDist} AU    
           <span class="tip-info">The farthest distance between an object and the Sun.</span></p>
      <p class="tip"><strong>Orbital Period:</strong> ${orbitPeriod} days            
          <span class="tip-info">The time it takes for the asteroid to complete one full orbit around the Sun.</span>
      </p>
    </div>
  `
    return orbitalData;
}
export const setupEventListener = () => {
  const imgContainer = document.getElementById(IMG_CONTAINER);
  getImageOfTheDay(imgContainer);

  dateEventHandler();
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);

  const selectEl = document.getElementById(SELECTOR_ID);
  selectEl.addEventListener("change", async (e) => {
    const todayNEO = await filterNEOs();
    if (e.target.value === "size") {
      displayNEOs(sortNEOBySize(todayNEO));
    } else if (e.target.value === "brightness") {
      displayNEOs(sortNEOByBrightness(todayNEO));
    }
  });

  // Used event delegation
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

  document.getElementById(TO_TOP_BTN_ID).addEventListener("click", () => {
    toTheTop();
  });
};

// Init the page with only today's neo
export const setUp = async () => {
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);
  const todayNEOs = await filterNEOs();

  if (todayNEOs.error) {
    cardContainer.innerHTML = `<h1 class='error-heading'>${todayNEOs.message}</h1>`;
  }

  console.log('has', potentiallyHazardousAsteroids(todayNEOs).length)
  const existingH3 = document.querySelector(".neo-general-info");
  if (existingH3) {
    existingH3.remove();
  }
  const h3 = document.createElement("h3");
  h3.classList.add("neo-general-info");
  h3.innerHTML = `
   <strong>Today</strong> there are <span class="count">${todayNEOs.length}</span> near-Earth objects (NEOs) flying by. `;
  document.querySelector(".neo-main-parent-container").prepend(h3);
  createInfoView(todayNEOs[0].id);
  displayNEOs(todayNEOs);
  cardContainer.children[0].classList.add("selected");
};

// Init both the start and end date by the current date when the page loads or reloads
export const initDateRange = () => {
  document.getElementById(START_DATE_ID).value = getTodayDate();
  document.getElementById(END_DATE_ID).value = getTodayDate();
};


// Image of the day functions
const getImageOfTheDay = async (imgContainer) => {
  imgContainer.innerHTML = "";
  const imgData = await fetchImageOfTheDay();

  if (imgData.error) {
    imgContainer.innerHTML = `<h1 class='error-heading'>${todayNEOs.message}</h1>`;
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

  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("image-wrapper");

  const img = document.createElement("img");
  img.src = imgData.hdurl;
  img.alt = imgData.title;
  img.classList.add("image-of-the-day");
  imgWrapper.appendChild(img);

  imgContainer.appendChild(descriptionContainer);
  imgContainer.appendChild(imgWrapper);
};

// To the top button
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

const dateEventHandler = () => {
  const startDate = document.getElementById(START_DATE_ID);
  const endDate = document.getElementById(END_DATE_ID);
  const cardContainer = document.getElementById(CARD_CONTAINER_ID);

  let startSet = false;
  let endSet = false;

  const handleDateInput = async () => {
    const start = startDate.value;
    const end = endDate.value;

    try {
      const todayNEOs = await filterDateRangeNEOs(start, end);
      if (todayNEOs.error) {
        cardContainer.innerHTML = `<h1 class='error-heading'>${todayNEOs.message}</h1>`;
        return;
      }
      const existingH3 = document.querySelector(".neo-general-info");
      if (existingH3) {
        existingH3.remove();
      }
      const h3 = document.createElement("h3");
      h3.classList.add("neo-general-info");
      h3.innerHTML = `
     Between <strong>${start}</strong> and <strong>${end}</strong>, there are 
    <span class="count">${todayNEOs.length}</span> near-Earth objects (NEOs) flying by. 
     `;
      document.querySelector(".neo-main-parent-container").prepend(h3);
      displayNEOs(todayNEOs);
    } catch (error) {
      console.error("Error fetching NEOs:", error);
    }
  };

  const checkAndHandleDates = () => {
    if (startSet || endSet) handleDateInput();  
  };

  startDate.addEventListener("change", () => {
    startSet = true;
    checkAndHandleDates();
  });

  endDate.addEventListener("change", () => {
    endSet = true;
    checkAndHandleDates();
  });
};
