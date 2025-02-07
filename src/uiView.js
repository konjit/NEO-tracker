import { fetchImageOfTheDay } from "./api.js";
import { FOOTER_ID, HEADER_ID, MAIN_ID, SELECTOR_ID } from "./constants.js";
export const createDateInput = () => {
  const element = document.createElement("input");
  element.type = "date";
  element.autocomplete = "on";
  return element;
};

export const createFormElement = () => {
  const element = document.createElement("button");
  element.innerText = "Submit";
  return element;
};
export const createDivElement = () => {
    const element = document.createElement("div");
    element.classList.add('container');
    return element;
}

export const createHeader = () => {
    const element = document.createElement("header");
    element.id = HEADER_ID;
  
    const navContainer = document.createElement("nav");
    navContainer.classList.add("navbar");
  
    const brand = document.createElement("a");
    brand.href = "#";
    brand.classList.add("navbar-brand");
    brand.innerText = "NEO Tracker";
  
    const link1 = document.createElement("a");
    link1.href = "#";
    link1.classList.add("navbar-link");
    link1.innerText = "Asteroids";
  
    const link2 = document.createElement("a");
    link2.href = "#";
    link2.classList.add("navbar-link");
    link2.innerText = "Image of the Day";
  
    const linkContainer = document.createElement("div");
    linkContainer.classList.add("navbar-links");
    linkContainer.appendChild(link1);
    linkContainer.appendChild(link2);
  
    navContainer.appendChild(brand);
    navContainer.appendChild(linkContainer);
  
    element.appendChild(navContainer);
  
    return element;
  };
  
  
export const createFooter = () => {
  const element = document.createElement("footer");
  element.id = FOOTER_ID;
  return element;
};

export const createMain = () => {
  const element = document.createElement("main");
  element.id = MAIN_ID;

  return element;
};

export const createButtonElement = () => {
  const element = document.createElement("button");
  element.classList.add("btn");
  return element;
};

export const createComboboxView = () => {
  const selectEl = document.createElement("select");
  selectEl.id = SELECTOR_ID;

  const options = [
    { value: "size", text: "Sort By Size" },
    { value: "Magnitude", text: "Sort By Magnitude" },
    { value: "Velocity", text: "Sort By Velocity" },
  ];
  options.forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.value;
    optionEl.innerText = option.text;
    selectEl.appendChild(optionEl);
  });

  return selectEl;
};


export const imageOfTheDay = () => {
    const data = fetchImageOfTheDay();
    console.log(data);
    const img = document.createElement('img');
    img.src = data.hdurl;
    return img;
}