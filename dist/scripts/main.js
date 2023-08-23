const main = document.querySelector('#cards-area');
const CARDS_PER_PAGE = 12;
const popupWrapper = document.querySelector('.popup-wrapper');
const detailsCard = document.querySelector('.details-card');
const detailsName = document.querySelector('.details-name');
const detailsStreetAddress = document.querySelector('.details-streetAddress');
const detailsCityState = document.querySelector('.details-city-state');
const detailsPhone = document.querySelector('.details-phone');
const detailsURL = document.querySelector('.details-url');
const pagination = document.querySelector("#pagination");
let totalPages;
totalPages = Math.ceil(49 / CARDS_PER_PAGE);

updatePagination(1);

function displayTasks (page) {
  const startIndex = (page - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;

  for (let i = startIndex; i < endIndex && i < tasks.length; i++) {
    addTask(tasks[i].title, tasks[i].completed);
  }
}

function updatePagination(currentPage) {
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = `<li class='page-item'></li>`;
    const pageLink = $(`<a class='page-link' href='#'>${i}</a>`)

    if (i === currentPage) {
      pageItem.addClass("active");
    }

    pageLink.click(() => {
      displayTasks(i);
      updatePagination(i);
    });

    pageItem.append(pageLink);
    pagination.append(pageItem);
  }
}

popupWrapper.addEventListener('click', () => {
  popupWrapper.style.display = "none";
});

main.addEventListener('click', (e) => {
  if (e.target.className.includes("btn-details")) {
    let breweryId = e.target.parentElement.parentElement.querySelector('.brewery-id').innerText;
    getBreweryDetails(breweryId)
      .then(data => {
        console.log(data);
        detailsName.innerText = data.name;
        detailsStreetAddress.innerText = data.street;
        detailsCityState.innerText = `${data.city} ${data.state_province}`;
        detailsPhone.innerText = data.phone;
        detailsURL.innerText = data.website_url;
      })
      .catch(err => {
        console.log('Error when attempting to fetch brewery.', err);
      });

    popupWrapper.style.display = 'block';
  }
});

const getBreweries = async () => {
  const response = await fetch('https://api.openbrewerydb.org/v1/breweries');
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

getBreweries()
.then(data => {
  for (let i = 0; i < CARDS_PER_PAGE; i++) {
    let element = data[i];
    const breweryCard =
    `<div class="card" style="width: 18rem;">
      <span class="brewery-id" style="display: none;">${element.id}</span>
      <div class="card-body">
        <h5 class="card-title">${element.name}</h5>
        <p class="card-text">${element.city}, ${element.state_province}</p>
        <a href="#" class="btn btn-primary btn-details">Details</a>
      </div>
    </div>`;
    main.insertAdjacentHTML('afterbegin', breweryCard);

  }
})
.catch(err => {
  console.log('Rejected:', err.message)
});