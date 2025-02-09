import { FOOTER_ID, SELECTOR_ID } from "./constants.js";

export const createDateInput = () => {
  const element = document.createElement("input");
  element.type = "date";
  element.autocomplete = "on";
  element.classList.add('input-element');
  return element;
};

export const createComboboxView = () => {
  const selectEl = document.createElement("select");
  selectEl.id = SELECTOR_ID;
  selectEl.classList.add('input-element'); 

  const options = [
    { value: "size", text: "Sort By Size" },
    { value: "brightness", text: "Sort By Magnitude" },
    { value: "velocity", text: "Sort By Velocity" },
  ];
  options.forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.value;
    optionEl.innerText = option.text;
    selectEl.appendChild(optionEl);
  });

  return selectEl;
};

export const createInputContainer = () => {
  const container = document.createElement('div');
  container.classList.add('input-container');

  const dateInput = createDateInput();
  const combobox = createComboboxView();

  container.appendChild(dateInput);
  container.appendChild(combobox);

  return container;
};




export const createFormElement = () => {
  const element = document.createElement("button");
  element.innerText = "Submit";
  return element;
};
export const createDivElement = () => {
  const element = document.createElement("div");
  element.classList.add("container");
  return element;
};


export const createInputElement = () => {
  const container = document.createElement('div');
  container.classList.add('input-container');

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search...';
  input.classList.add('input-element');

  const icon = document.createElement('i');
  icon.classList.add('search-icon');  

  container.appendChild(input);
  container.appendChild(icon);

  return container;
};



export const createButtonElement = () => {
  const element = document.createElement("button");
  element.classList.add("btn");
  return element;
};

