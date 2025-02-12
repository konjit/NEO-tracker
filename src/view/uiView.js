
import { createCardElement } from "../view/components.js";
import { getDiameter } from "../helpers/helper.js";
import { convertDateFormat } from "../utils.js"

/* Displays basic info for each asteroid  
** Clicking on an asteroid reveals detailed information in another card  
*/  

export const createAsteroidCard = (currentNEOs, cardContainer) => {
  currentNEOs.forEach((neo) => {
    const approachDate = neo.close_approach_data[0].close_approach_date;
    const card = createCardElement();
    card.setAttribute("data-neo-reference-id", neo.neo_reference_id);

    const isHazardous = neo.is_potentially_hazardous_asteroid;
    if (isHazardous) card.classList.add("hazardous-asteroid");
    const isHazardousText = neo.is_potentially_hazardous_asteroid ? "Yes" : "No";
    card.innerHTML = `
        <div class="card-container">
          <h3 class="card-heading">${neo.name}</h3>
          <div class="card-body">
          <p><strong>Approach Date:</strong> ${approachDate} </p></br>
          <p><strong>Size:</strong> ${getDiameter(neo)} m</p></br>
          <p><strong>Intensity:</strong> ${neo.absolute_magnitude_h} m</p></br>
           <p><strong>Is Hazardous?</strong> ${isHazardousText} m</p></br>
          </div>
        </div>
      `;

    cardContainer.appendChild(card);
  });
};

/* The next two function getDetailedComponent and getOrbitalData displays detailed 
** info for each asteroid  Since this includes detailed data, a tooltip is provided 
** for each property  
*/  
export const getDetailedComponent = (neo, detailedNEOInfoCard) => {

  const approachDate = neo.close_approach_data[0].close_approach_date;
  const brightness = neo.absolute_magnitude_h;
  const velocity = Number(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(4);
  const missDistance = Number(neo.close_approach_data[0].miss_distance.kilometers).toFixed(4);
  const diameter = getDiameter(neo);

  const isHazardous = neo.is_potentially_hazardous_asteroid ? "Yes" : "No";
  const orbitalData = neo.orbital_data ? getOrbitalData(neo) : "";

  detailedNEOInfoCard.innerHTML = `
      <div class="neo-info-card">
        <h2>NEO ${neo.name} </h2>
        <div class="neo-info">
          <p><strong>ID:</strong> ${neo.id}</p>
          <p class="tip"><strong>First Recorded Approach:</strong> ${convertDateFormat(
            approachDate
          )}
            <span class="tip-info">The date when the asteroid's closest approach to Earth occurs.</span>
          </p></br>
          <p class="tip"><strong>Brightness:</strong> ${brightness}
            <span class="tip-info">Asteroid's brightness if 1 AU from Earth and Sun. Lower values = brighter.</span>
          </p></br>
             <p class="tip"><strong>Velocity:</strong> ${velocity} km/hr
            <span class="tip-info">The relative velocity of the asteroid as it approaches Earth, measured in km/h.</span>
          </p></br>
           <p class="tip"><strong>Miss Distance:</strong> ${missDistance} km
            <span class="tip-info">Closest distance between the asteroid and Earth, measured in kilometers..</span>
          </p></br>
          <p class="tip"><strong>Diameter:</strong> ${diameter} meters    
          <span class="tip-info">The estimated size of the asteroid.</span>
          </p></br>
          <p class="tip"><strong>Hazardous:</strong> ${isHazardous}
          
            <span class="tip-info">Indicates whether the asteroid is considered a potential threat to Earth based on its size and proximity..</span>
          </p></br>
          ${orbitalData}
          <p><a href="${
            neo.nasa_jpl_url
          }&view=VOP" target="_blank" class="view-more">View More</a></p>
        </div>
      </div>
    `;
};

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
         </p></br>
        <p class="tip"><strong>Perihelion Distance:</strong> ${orbitPerihelionDist} AU 
              <span class="tip-info">The closest distance between an object and the Sun.</span>
        </p></br>
        <p class="tip"><strong>Apohelion Distance:</strong> ${orbitAphelionDist} AU    
             <span class="tip-info">The farthest distance between an object and the Sun.</span>
        </p></br>
        <p class="tip"><strong>Orbital Period:</strong> ${orbitPeriod} days            
            <span class="tip-info">The time it takes for the asteroid to complete one full orbit around the Sun.</span>
        </p></br>
      </div>
    `;
  return orbitalData;
};
