/*                        API limitation:
 ** The NEO Feed API is set up to fetch data starting from the current date plus
 ** next 6 days.  That means it only gives access to users of the API for a week.
 ** For example if today is: 10-02-2025 then data is avail to 17-02-2025.
 **
 ** If we want large data set of any date ranges we have to use browse API.
 ** https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`
 */

import { API_KEY } from "../../config.js";
import { START_DATE_ID, TIMEOUT } from "../constants.js";
import { isWithinRange } from "../utils.js";

// The main function the fetch data from the specified END_POINT and returns JSON or BLOB objects
// It handles network error  if for example the server is not reachable for the set timeout
// And handles http error in case the END_POINT is not properly set.

// By default a fetch() request timeouts at the time indicated by the browser.
// In Chrome a network request timeouts at 300 seconds, while in Firefox at 90 seconds.
// I add a time out in case the server did not respond or is unreachable before the default of 
// Chrome or Firefox

const fetchData = async (END_POINT, timeout) => {

  const promise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timed out")), timeout);
  });

  try {
    const response = await Promise.race([fetch(END_POINT), promise]);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType.includes("application/json")) {
      const dataJSON = await response.json();
      return dataJSON;
    } else if (contentType.includes("image")) {
      const dataBLOB = await response.blob();
      return dataBLOB;
    } else {
      return {
        error: true,
        message: `Unsupported content type ${contentType}.`,
      };
    }
  } catch (error) {
    return {
      error: true,
      message: `Network error occurred: ${error.message}.`,
    };
  }
};

// For a list of NEOs with no orbital data
export const fetchNEOs = async () => {
  const END_POINT = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${API_KEY}`;

  // For testing purpose
  const WRONG_END_POINT = `https://api.nasa.gov/neo/redfdfst/v1/fed?api_key=${API_KEY}`;
  const data = await fetchData(END_POINT, TIMEOUT);
  if (data.error) {
    return { error: true, message: data.message };
  }
  return data;
};

// For fetching detailed info about a specific NEO(Asteroid) with orbital data
// After we receive info like the NEO's id from the fetchNEOs function.
export const fetchDetailedNEOData = async (neoReferenceID) => {
  const END_POINT = `https://api.nasa.gov/neo/rest/v1/neo/${neoReferenceID}?api_key=${API_KEY}`;
  const data = await fetchData(END_POINT, TIMEOUT);

  if (data.error) {
    return { error: true, message: data.message };
  }
  return data;
};

export const browseNEOs = async (startDate, endDate) => {
  const response = await fetch(
    `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`
  );
  
};

// Fetch image of data from NASA img of the day
export const fetchImageOfTheDay = async () => {
  const END_POINT = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  const imgData = await fetchData(END_POINT, TIMEOUT);
  if (imgData.error) {
    return { error: true, message: imgData.message };
  }
  return imgData;
};

export const filterDateRangeNEOs = async (startDate, endDate) => {
  const noes = await fetchNEOs();
  if (noes.error) {
    return { error: true, message: noes.message };
  }
  let results = [];

  for (const [date, values] of Object.entries(noes.near_earth_objects)) {
    if (isWithinRange(date, startDate, endDate)) {
      results.push(...values);
    }
  }
  return results;
};

export const filterNEOs = async () => {
  const date = document.getElementById(START_DATE_ID).value;
  const noes = await fetchNEOs();
  if (noes.error) {
    return { error: true, message: noes.message };
  }
  let neosByDate = [];
  for (const [key, values] of Object.entries(noes.near_earth_objects)) {
    if (key === date) {
      neosByDate.push(...values);
    }
  }

  return neosByDate;
};

export const filteredBy = async (input) => {
  const noes = await fetchNEOs();
  let neosByInput = [];

  for (const [key, values] of Object.entries(noes.near_earth_objects)) {
    const matchingNEOs = values.filter((neo) =>
      Object.values(neo).some((val) => val.toString().includes(input.trim()))
    );
    neosByInput.push(...matchingNEOs);
  }
  return neosByInput;
};
