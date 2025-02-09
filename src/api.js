import { API_KEY } from "../config.js";
import { TODAY_DATE_ID } from "./constants.js";
const fetchData = async (URL) => {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.statusText}`);
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
  } catch (err) {
    return {
      error: true,
      message: `Network error has occurred ${err.message}.`,
    };
  }
};
// For a list of NEOs (no orbital data):
export const fetchNEOs = async () => {
  const END_POINT = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${API_KEY}`;
  const data = await fetchData(END_POINT);
  if (data.error) {
    return { error: true, message: data.message };
  }
  return data;
};

// For detailed info about a specific NEO (with orbital data):
export const fetchDetailedNEOData = async (neoReferenceID) => {
  const END_POINT = `https://api.nasa.gov/neo/rest/v1/neo/${neoReferenceID}?api_key=${API_KEY}`;
  const data = await fetchData(END_POINT);
  if (data.error) {
    return { error: true, message: data.message };
  }
  return data;
};

export const fetchImageOfTheDay = async () => {
  const END_POINT = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  const imgData = await fetchData(END_POINT);
  if (imgData.error) {
    return { error: true, message: imgData.message };
  }
  return imgData;
};

export const filterNEOs = async () => {
  const date = document.getElementById(TODAY_DATE_ID).value;
  const noes = await fetchNEOs();

  if(noes.error){
    return {error: true, message: noes.message};
  }
  let neosByDate = [];
  for (const [key, values] of Object.entries(noes.near_earth_objects)) {
    if (key === date) {
      neosByDate.push(...values);
    }
  }

  return neosByDate;
};
