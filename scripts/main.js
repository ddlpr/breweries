const main = document.querySelector('#cards-area');
const CARDS_PER_PAGE = 12;

main.addEventListener('click', (e) => {
  if (e.target.className.includes("btn-details")) {
    console.log(e.target);
    main.remove();
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
getBreweries()
.then(data => {
  for (let i = 0; i < CARDS_PER_PAGE; i++) {
    let element = data[i];
    const breweryCard =
    `<div class="card" style="width: 18rem;">
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