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
const firstVisit_form = document.querySelector('.first-visit-form');
const navbarBrand = document.querySelector('.navbar-brand');
const contentArea = document.querySelector('.content');
const addBreweryForm = document.querySelector('#new-brewery-form');
const show_add_brewery_form_btn = document.querySelector('.show-add-brewery-form-btn');
const addBrewery_btn = document.querySelector('.submit-brewery-btn');
const cancelBrewerySubmit = document.querySelector('.cancel-brewery-submit');
const username_input = document.querySelector('[data-submit-input]');
const username_submit = document.querySelector('[data-submit-btn]');
const username_display = document.querySelector('.username');
const logout_btn = document.querySelector('.logout');
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
const breweryTypeDropdown = document.querySelector('#form-brewery-type');
//#endregion DOM NODES

const loadValues = (select, values) => {
  // values.forEach(value => {
  for (let i = 0; i < values.length; i++) {
    const option =
      `<option value="${values[i]}" class="filter__option">${values[i]}</option>`;

    select.insertAdjacentHTML('beforeend', option);
  };
};

const optionChangeHandler = (array, property, value) => {

  const filterMe = [...array];
  // const properties = Object.keys(obj);
  filtered_breweries = filterMe.filter(item => item[property] === value);
  // cards_div.innerText = '';
  totalPages = Math.ceil(filtered_breweries.length / CARDS_PER_PAGE);
  console.log(filtered_breweries);
  loadBreweries(filtered_breweries, true);
  // updatePagination(filtered_breweries);
  // goToPage(1);
};

const filter_dropdowns = document.querySelectorAll('.filter');
filter_dropdowns.forEach(filter => {

  filter.addEventListener('change', (e) => {

    const selectedIndex = filter.selectedIndex;
    const selectedValue = filter[selectedIndex].value;
    console.log(e);
    // filtered_breweries = optionChangeHandler(breweries_arr)
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
      // getBreweries()
      //   .then(data => {
      //     breweries_arr = [...data];
      //     totalPages = Math.ceil(data.length / CARDS_PER_PAGE);
      //     loadBreweries(breweries_arr);
      //     updatePagination(breweries_arr);
      //   })
      //   .catch(err => {
      //     console.log('Rejected:', err.message);
      //   });
      goToPage(1);
    }

  });

});

navbarBrand.addEventListener('click', () => {
  // currentPage = 1;
  // loadBreweries(breweries_arr);
  // updatePagination(breweries_arr);
  // cancelBrewerySubmit.dispatchEvent(new MouseEvent('click'));
  goToPage(1);
});

popupWrapper.addEventListener('click', (e) => {
  // console.log(e.target);
  if (e.target.className.includes('close-details') || !popup.contains(e.target))
    popupWrapper.style.display = "none";
});

cards_div.addEventListener('click', (e) => {
  if (e.target.className.includes("btn-details")) {
    let breweryId = e.target.parentElement.parentElement.querySelector('.brewery-id').innerText;
    // getBreweryDetails(breweryId)
    //   .then(data => {
    //     detailsName.innerText = data.name;
    //     detailsStreetAddress.innerHTML = `<i class="bi bi-building"></i> ${data.street}`;
    //     detailsCityState.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${data.city} ${data.state_province}`;
    //     detailsPhone.innerHTML = `<i class="bi bi-telephone-fill"></i> ${data.phone}`;
    //     detailsType.innerHTML = `<i class="bi bi-bookmark-fill"></i> ${data.brewery_type}`
    //     if (data.website_url) {
    //       detailsURL.innerHTML = `<i class="bi bi-box-arrow-up-right"></i> ${data.website_url}`;
    //       detailsURL.setAttribute('href', `${data.website_url}`);
    //       detailsURL.setAttribute('target', '_blank');
    //     } else detailsURL.innerHTML = '';
    //   })
    //   .catch(err => {
    //     console.log('Error when attempting to fetch brewery.', err);
    //   });
    getBreweryDetailsFromArray(breweryId);

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

const getBreweryDetailsFromArray = (breweryId) => {

  let data;

  for (const brewery of breweries_arr) {
    if (brewery.id === breweryId) {
      data = {...brewery};
    }
  }
  detailsName.innerText = data.name;
  detailsStreetAddress.innerHTML = `<i class="bi bi-building"></i> ${data.street}`;
  detailsCityState.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${data.city}, ${data.state_province}`;
  detailsPhone.innerHTML = `<i class="bi bi-telephone-fill"></i> ${data.phone}`;
  detailsType.innerHTML = `<i class="bi bi-bookmark-fill"></i> ${data.brewery_type}`
  if (data.website_url) {
    detailsURL.innerHTML = `<i class="bi bi-box-arrow-up-right"></i> ${data.website_url}`;
    detailsURL.setAttribute('href', `${data.website_url}`);
    detailsURL.setAttribute('target', '_blank');
  } else detailsURL.innerHTML = '';
}

const buildBreweryCard = (brewery) => {
  const breweryCard =
    `<div class="card" style="width: 18rem;">
    <span class="brewery-id" style="display: none;">${brewery.id}</span>
    <div class="card-body">
      <img src="https://placehold.co/400x200" class="card-img-top" alt="...">
      <h5 class="card-title">${brewery.name}</h5>
      <p class="card-text"><i class="bi bi-geo-alt-fill"></i> ${brewery.city}, ${brewery.state_province}</p>
      <p class="card-text"><i class="bi bi-bookmark-fill"></i> ${brewery.brewery_type}</p>
      <a href="#" class="btn btn-primary btn-details">Details</a>
    </div>
  </div>`;
  cards_div.insertAdjacentHTML('afterbegin', breweryCard);
}

const loadBreweries = (array, optionChange) => {

  cards_div.textContent = '';
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = currentPage * CARDS_PER_PAGE;
  let dif = endIndex - startIndex;
  if (optionChange) {
    // startIndex = 0;
    for (let i = 0; i < dif && i < array.length; i++) {
      let brewery = array[i];
      buildBreweryCard(brewery);
    }
  } else {
    for (let i = startIndex; i < endIndex && i < array.length; i++) {
      let brewery = array[i];
      buildBreweryCard(brewery);
    }
  }
  // currentPage = 1;
  updatePagination(array, optionChange);

};

function updatePagination(array, optionChange) {
  pagination.innerHTML = '';
  if (optionChange) {
    currentPage = 1;
  }
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
      loadBreweries(array, false);
      updatePagination(array, false);
    });

    pageItem.append(pageLink);
    pagination.append(pageItem);
  }
}

const loadContent = () => {

  username_input.value = '';
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
      updatePagination(breweries_arr, false);
    })
    .catch(err => {
      console.log('Rejected:', err.message);
    });

};

const set_cookie = (key, value, daysToLive) => {
  const date = new Date();
  date.setTime(date.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
  let expires = "expires=" + date.toUTCString();
  document.cookie = `${key}=${value}; ${expires}; path=/`;
}

const delete_cookie = (key) => {
  set_cookie(key, null, null);
}

const get_cookie = (key) => {
  const decoded_cookie = decodeURIComponent(document.cookie);
  const cookie_array = decoded_cookie.split('; ');
  let value = null;
  cookie_array.forEach(element => {
    if (element.indexOf(key) == 0) {
      value = element.substring(key.length + 1);
    }
  });
  return value;
}

const logout = () => {
  delete_cookie('username');
  window.location.reload();
  username_input.value = '';
}

const toggleView = (show, ...hide) => {
  show.style.display = 'initial';
  hide.forEach(view => view.style.display = 'none');
  // hide.style.display = 'none';
}

const generateId = () => {
  let uuid = '';
  const characters = '0123456789abcdef';

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uuid += characters[randomIndex];
  }

  uuid =
  `${uuid.substring(0, 8)}-${uuid.substring(8, 4)}-${uuid.substring(12, 4)}-${uuid.substring(16, 4)}-${uuid.substring(20)}`;

  return uuid;
}

const clearFormInputs = (form) => {
  Array.from(form.elements).forEach(element => {
    if (element.tagName === 'INPUT') {
      element.value = '';
    }
  });
};

const isFirstVisit = () => {
  addBreweryForm.style.display = 'none';
  if (!get_cookie('username')) {
    toggleView(firstVisit_form, contentArea);
  } else {
    toggleView(contentArea, firstVisit_form);
    loadContent();
  }
};

logout_btn.addEventListener('click', e => {
  logout();
});

username_submit.addEventListener('click', (e) => {
  if (username_input.value !== '') {
    set_cookie('username', username_input.value, 365);
    isFirstVisit();
    username_display.innerText = get_cookie('username');
    username_input.value = '';
  }
});

show_add_brewery_form_btn.addEventListener('click', e => {
  // show add brewery form
  breweryTypeDropdown.selectedIndex = 0;
  toggleView(addBreweryForm, contentArea);
});
const goToPage = (page) => {
  clearFormInputs(addBreweryForm);
  filter_type.selectedIndex = 0;
  filter_state.selectedIndex = 0;
  filter_city.selectedIndex = 0;
  totalPages = Math.ceil(breweries_arr.length / CARDS_PER_PAGE);
  currentPage = page;
  loadBreweries(breweries_arr);
  updatePagination(breweries_arr, false);
  toggleView(contentArea, addBreweryForm, firstVisit_form);
};

addBreweryForm.addEventListener('submit', e => {
  e.preventDefault();
  const breweryNameInputText = document.querySelector('#brewery-name-text');
  // const breweryTypeInputText = document.querySelector('#brewery-type-text');
  const breweryCityInputText = document.querySelector('#brewery-city-text');
  const breweryStateInputText = document.querySelector('#brewery-state-text');
  const breweryAddressInputText = document.querySelector('#brewery-address-text');
  const breweryPhoneInputText = document.querySelector('#brewery-phone-text');
  const breweryWebsiteInputText = document.querySelector('#brewery-website-text');
  let selectedIndex = breweryTypeDropdown.selectedIndex;
  let selectedValue = breweryTypeDropdown[selectedIndex].value;
  breweryTypeDropdown.addEventListener('change', () => {
    selectedIndex = breweryTypeDropdown.selectedIndex;
    selectedValue = breweryTypeDropdown[selectedIndex].value;
  });

  const newBrewery = {
    id: generateId(),
    name: breweryNameInputText.value,
    brewery_type: selectedValue,
    city: breweryCityInputText.value,
    state_province: breweryStateInputText.value,
    street: breweryAddressInputText.value,
    phone: breweryPhoneInputText.value,
    website_url: breweryWebsiteInputText.value
  };
  breweries_arr.push(newBrewery);
  goToPage(pagination.querySelectorAll('li').length);

  clearFormInputs(addBreweryForm);
  toggleView(contentArea, addBreweryForm);
  console.log(newBrewery);
});

cancelBrewerySubmit.addEventListener('click', () => {
  clearFormInputs(addBreweryForm);
  
  currentPage = 1;
  loadBreweries(breweries_arr);
  updatePagination(breweries_arr, false);
  toggleView(contentArea, addBreweryForm);
});


isFirstVisit();
username_input.value = '';
username_display.innerText = get_cookie('username');
console.log(document.cookie);