const main = document.querySelector('main');
const CARDS_PER_PAGE = 8;

const getBreweries =  (endpoint) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
      if (request.readyState === 4 && request.status === 200) {
        let response = JSON.parse(request.responseText);
        resolve(response);
      } else if (request.readyState === 4) {
        reject('Could not fetch the data');
      }
    });
    request.open('GET', endpoint, true);
    request.send();
  });
}

getBreweries('https://api.openbrewerydb.org/v1/breweries').then((data) => {
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
}).catch((err) => {
  console.log(err);
});