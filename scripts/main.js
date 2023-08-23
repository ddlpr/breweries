const main = document.querySelector('#cards-area');
const CARDS_PER_PAGE = 12;
const popupWrapper = document.querySelector('.popup-wrapper');
const detailsCard = document.querySelector('.details-card');
const detailsName = document.querySelector('.details-name');
const detailsStreetAddress = document.querySelector('.details-streetAddress');
const detailsCityState = document.querySelector('.details-city-state');
const detailsPhone = document.querySelector('.details-phone');
const detailsURL = document.querySelector('.details-url');

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
// const breweryId = '5128df48-79fc-4f0f-8b52-d06be54d0cec';
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
    main.insertAdjacentHTML('beforeend', breweryCard);
  }
})
.catch(err => {
  console.log('Rejected:', err.message)
});