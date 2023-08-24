const API_BASE_DOMAIN = 'https://api.openbrewerydb.org/v1/breweries';
const cards_div = document.querySelector('#cards-area');
const CARDS_PER_PAGE = 12;
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
const filters_section = document.querySelector('.filters');
let typeValue;
const dropdownMenu = document.querySelector(".dropDown__menu");
let filtered_breweries = [];
let totalPages;
let currentPage = 1;
let breweries_arr = [];


filter_type.addEventListener('change', () => {
  
  const selectedOption = filter_type.selectedOptions[0];
  const selectedValue = selectedOption.value;
  if (selectedValue !== '') {
    filtered_breweries = breweries_arr.filter(brewery => brewery.brewery_type === selectedValue);
    cards_div.innerText = '';
    totalPages = Math.ceil(filtered_breweries.length / CARDS_PER_PAGE);
    console.log(filtered_breweries);
    loadBreweries(filtered_breweries);
    updatePagination(filtered_breweries);
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

// document.addEventListener('click', (e) => {
//   const isDropdownButton = e.target.matches('[data-dropdown-button]');
//   let closestDropdown = e.target.closest('[data-dropdown]');
//   if (!isDropdownButton && closestDropdown != null) return;

//   let currentDropdown;
//   if (isDropdownButton) {
//     currentDropdown = e.target.closest('[data-dropdown]');
//     currentDropdown.classList.toggle('active');
//   }

//   document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
//     if (dropdown === currentDropdown) return;
//     dropdown.classList.remove('active');
//   });
// });


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

function updatePagination (array) {
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
  totalPages = Math.ceil(data.length / CARDS_PER_PAGE);
  loadBreweries(breweries_arr);
  updatePagination(breweries_arr);
})
.catch(err => {
  console.log('Rejected:', err.message);
});