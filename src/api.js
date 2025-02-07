import { API_KEY } from "../config.js";

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

export const fetchNEOs = async () => {
  const END_POINT = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${API_KEY}`;
  const data = await fetchData(END_POINT);
  return data;
};

export const fetchImageOfTheDay = async () => {
  const END_POINT = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  const img = await fetchData();
  return img;
};
export const filterNEOs = (date, data) => {
  let neos = [];
  for (const [key, values] of Object.entries(data)) {
    if (key === date) {
      neos.push(...values);
    }
  }

  return neos;
};
