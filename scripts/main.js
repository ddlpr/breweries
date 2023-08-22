const main = document.querySelector('main');
const CARDS_PER_PAGE = 8;

const getBreweries = () => {
  fetch('https://api.openbrewerydb.org/v1/breweries')
  .then((response) => {
    if (response.status !== 200) {
      throw new Error(response.status);
    }
    return response.json();
  })
  .then(data => {
    for (let i = 0; i < CARDS_PER_PAGE; i++) {
      let element = data[i];
      const breweryCard = 
      `<div class="card" style="width: 18rem;">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${element.name}</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${element.address_1}</li>
          <li class="list-group-item">${element.city}, ${element.state_province}</li>
          <li class="list-group-item">${element.phone}</li>
        </ul>
        <div class="card-body">
          <a href="#" class="card-link">Card link</a>
          <a href="#" class="card-link">Another link</a>
        </div>
      </div>`
      main.insertAdjacentHTML('beforeend', breweryCard);
    }
  })
  .catch(err => {
    console.log('Error when attempting to fetch breweries.', err)
  });
};

getBreweries();