export const countPotentiallyHazardousAsteroids = (neos) => {
  let hazardousAsteroid = [];
  let countHazardousAsteroids = 0;
  for (const [_, values] of Object.entries(neos.near_earth_objects)) {
    values.forEach((neo) => {
      if (neo.is_potentially_hazardous_asteroid) {
        countHazardousAsteroids++;
        hazardousAsteroid.push(neo);
      }
    });
  }
  return countHazardousAsteroids;
};

export const potentiallyHazardousAsteroids = (neos) => {
  let hazardousAsteroids = [];
  const [_, values] = Object.entries(neos);

  values.forEach((neo) => {
    if (neo.is_potentially_hazardous_asteroid) {
      hazardousAsteroids.push(neo);
    }
  });

  return hazardousAsteroids;
};

export const firstHazardous = (asteroids) => {
  asteroids.sort((asteroid1, asteroid2) => {
    return (
      asteroid2.is_potentially_hazardous_asteroid -
      asteroid1.is_potentially_hazardous_asteroid
    );
  });
  return asteroids;
};
export const sortNEOByBrightness = (asteroids) => {
  asteroids.sort((asteroid1, asteroid2) => {
    return asteroid2.absolute_magnitude_h - asteroid1.absolute_magnitude_h;
  });
  return asteroids;
};

export const sortNEOBySize = (asteroids) => {
  return [...asteroids].sort((a, b) => getDiameter(b) - getDiameter(a));
};

export const getDiameter = (neo) => {
  return Math.floor(
    (neo.estimated_diameter.meters.estimated_diameter_max +
      neo.estimated_diameter.meters.estimated_diameter_min) /
      2
  ).toFixed(2);
};

export const filterAsteroids = (data, query) => {
  const results = [];

  const regex = new RegExp(query, "i");
  for (const [_, values] of Object.entries(data.near_earth_objects)) {
    values.forEach((value) => {
      if (regex.test(value.name)) results.push(value);
    });
  }

  return results;
};
