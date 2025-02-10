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
export const sortNEOByBrightness = (asteroids) => {
  asteroids.sort((asteroid1, asteroid2) => {
    return asteroid1.absolute_magnitude_h - asteroid2.absolute_magnitude_h;
  });
  return asteroids;
};

export const sortNEOBySize = (asteroids) => {
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

  return asteroids;
};

export const getDiameter = (neo) => {
  return Math.floor(
    (neo.estimated_diameter.meters.estimated_diameter_max +
      neo.estimated_diameter.meters.estimated_diameter_min) /
      2
  ).toFixed(2);
};
