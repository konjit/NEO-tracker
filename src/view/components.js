import { SEARCH_INPUT_ID } from "../constants.js";

export const createDateInput = () => {
  const element = document.createElement("input");
  element.type = "date";
  element.autocomplete = "on";
  element.classList.add("input-element");
  return element;
};

export const createCardElement = () => {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  return card;
};

export const createHeadingElement = () => {
  const element = document.createElement("h3");
  element.classList.add("neo-general-info");
  return element;
};
export const createInputElement = () => {
  const input = document.createElement("input");
  input.classList.add("input-element");
  input.id = SEARCH_INPUT_ID;
  input.type = "text";
  input.placeholder = "Search...";
  input.classList.add("input-element");

  return input;
};

export const createButtonElement = () => {
  const element = document.createElement("button");
  element.classList.add("btn");
  return element;
};
