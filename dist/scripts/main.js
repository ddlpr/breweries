/* === <CONSTANTS> === */
const API_BASE_DOMAIN = 'https://api.openbrewerydb.org/v1/breweries';
const CARDS_PER_PAGE = 12;
/* === </CONSTANTS> === */
//#region GLOBAL VARIABLES
let typeValue;
let filtered_breweries = [];
let totalPages;
let currentPage = 1;
let breweries_arr = [];
let states, cities, types;
//#endregion

//#region DOM NODES
const cards_div = document.querySelector('#cards-area');
const popupWrapper = document.querySelector('.popup-wrapper');
const popup = document.querySelector('.popup');
const detailsCard = document.querySelector('.details-card');
const detailsName = document.querySelector('.details-name');
const detailsStreetAddress = document.querySelector('.details-streetAddress');
const detailsCityState = document.querySelector('.details-city-state');
const detailsPhone = document.querySelector('.details-phone');
const detailsType = document.querySelector('.details-type');
const detailsURL = document.querySelector('.details-url');
const pagination = document.querySelector("#pagination");
const filter_type = document.querySelector('select[data-filter-type');
const filter_state = document.querySelector('select[data-filter-state');
const filter_city = document.querySelector('select[data-filter-city]');
const filters_section = document.querySelector('.filters');
const dropdownMenu = document.querySelector(".dropDown__menu");
//#endregion DOM NODES

const loadValues = (select, values) => {
  // values.forEach(value => {
  for (let i = 0; i < values.length; i++) {
    const option =
      `<option value="${values[i]}" class="filter__option">${values[i]}</option>`;

    select.insertAdjacentHTML('beforeend', option);
  };
};
// const button = document.querySelector('.clickity');

// const event_handler = (event, arg) => {
// 	console.log(event, arg);
// }
// button.addEventListener('click', (e) => {
// 	event_handler(e, 'Job well done.');
// });



const optionChangeHandler = (array, property, value) => {
  const filterMe = [...array];
  // const properties = Object.keys(obj);
  filtered_breweries = filterMe.filter(item => item[property] === value);
  cards_div.innerText = '';
  totalPages = Math.ceil(filtered_breweries.length / CARDS_PER_PAGE);
  console.log(filtered_breweries);
  loadBreweries(filtered_breweries);
  updatePagination(filtered_breweries);
};

const filter_dropdowns = document.querySelectorAll('.filter');
filter_dropdowns.forEach(filter => {

  filter.addEventListener('change', (e) => {

    const selectedIndex = filter.selectedIndex;
    const selectedValue = filter[selectedIndex].value;
    console.log(e);
    filtered_breweries = optionChangeHandler(breweries_arr)
    if (selectedValue !== '') {
      if (e.target.matches('[data-filter-type]')) {
        optionChangeHandler(breweries_arr, 'brewery_type', selectedValue);
      } else if (e.target.matches('[data-filter-state]')) {
        filter_city.disabled = false;
        optionChangeHandler(breweries_arr, 'state_province', selectedValue);
      } else if (e.target.matches('[data-filter-city]')) {
        optionChangeHandler(breweries_arr, 'city', selectedValue);
      }
    } else {
      getBreweries()
        .then(data => {
          breweries_arr = [...data];
          totalPages = Math.ceil(data.length / CARDS_PER_PAGE);
          loadBreweries(breweries_arr);
          updatePagination(breweries_arr);
        })
        .catch(err => {
          console.log('Rejected:', err.message);
        });
    }

  });

});


popupWrapper.addEventListener('click', (e) => {
  console.log(e.target);
  if (e.target.className.includes('close-details') || !popup.contains(e.target))
    popupWrapper.style.display = "none";
});

cards_div.addEventListener('click', (e) => {
  if (e.target.className.includes("btn-details")) {
    let breweryId = e.target.parentElement.parentElement.querySelector('.brewery-id').innerText;
    getBreweryDetails(breweryId)
      .then(data => {
        detailsName.innerText = data.name;
        detailsStreetAddress.innerHTML = `<i class="bi bi-building"></i> ${data.street}`;
        detailsCityState.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${data.city} ${data.state_province}`;
        detailsPhone.innerHTML = `<i class="bi bi-telephone-fill"></i> ${data.phone}`;
        detailsType.innerHTML = `<i class="bi bi-bookmark-fill"></i> ${data.brewery_type}`
        if (data.website_url) {
          detailsURL.innerHTML = `<i class="bi bi-box-arrow-up-right"></i> ${data.website_url}`;
          detailsURL.setAttribute('href', `${data.website_url}`);
          detailsURL.setAttribute('target', '_blank');
        } else detailsURL.innerHTML = '';
      })
      .catch(err => {
        console.log('Error when attempting to fetch brewery.', err);
      });

    popupWrapper.style.display = 'block';
  }
});

const getBreweries = async (filterType = '', filterValue = '') => {
  const response = await fetch(`${API_BASE_DOMAIN}?${filterType}${filterValue}&per_page=200`);
  if (response.status !== 200) {
    throw new Error(`Cannot fetch data. ${response.status}`);
  }
  const data = await response.json();
  return data;
};

const getBreweryDetails = async (breweryId) => {
  const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${breweryId}`);
  if (!response.ok) {
    throw new Error(`Cannot fetch data. ${response.status}`)
  }
  const data = await response.json();
  return data;
};

const buildBreweryCard = (brewery) => {
  const breweryCard =
    `<div class="card" style="width: 18rem;">
    <span class="brewery-id" style="display: none;">${brewery.id}</span>
    <div class="card-body">
      <h5 class="card-title">${brewery.name}</h5>
      <p class="card-text"><i class="bi bi-geo-alt-fill"></i> ${brewery.city}, ${brewery.state_province}</p>
      <p class="card-text"><i class="bi bi-bookmark-fill"></i> ${brewery.brewery_type}</p>
      <a href="#" class="btn btn-primary btn-details">Details</a>
    </div>
  </div>`;
  cards_div.insertAdjacentHTML('afterbegin', breweryCard);
}

const loadBreweries = (array) => {

  cards_div.textContent = '';
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = currentPage * CARDS_PER_PAGE;
  for (let i = startIndex; i < endIndex && i < array.length; i++) {
    let brewery = array[i];
    buildBreweryCard(brewery);
  }

}

function updatePagination(array) {
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.classList.add('page-item');

    const pageLink = document.createElement('a');
    pageLink.classList.add('page-link');
    pageLink.textContent = i;

    if (i === currentPage) {
      pageItem.classList.add("active");
    }

    pageLink.addEventListener('click', () => {
      currentPage = i;
      loadBreweries(array);
      updatePagination(array);
    });

    pageItem.append(pageLink);
    pagination.append(pageItem);
  }
}

getBreweries()
  .then(data => {
    breweries_arr = [...data];
    totalPages = Math.ceil(breweries_arr.length / CARDS_PER_PAGE);
    //states = breweries_arr.map(brewery => brewery.state_province.toLowerCase().replace(/ /g, '_'));
    types = Array.from(new Set(breweries_arr.map(brewery => brewery.brewery_type))).sort();
    states = Array.from(new Set(breweries_arr.map(brewery => brewery.state_province))).sort();
    cities = Array.from(new Set(breweries_arr.map(brewery => brewery.city))).sort();
    loadValues(filter_type, types);
    loadValues(filter_state, states);
    loadValues(filter_city, cities);
    loadBreweries(breweries_arr);
    updatePagination(breweries_arr);
  })
  .catch(err => {
    console.log('Rejected:', err.message);
  });


