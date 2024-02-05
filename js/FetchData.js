const cards = document.querySelector('.cards');
const modeSwitch = document.getElementById('modeSwitch');
const search = document.querySelector('#search');
const body = document.body;
const store = localStorage.getItem('mode');
const select = document.querySelector('#regionSelect');
const loader = document.querySelector('.loader');
const darktext = document.querySelector('.nav_dark');
const card = document.getElementsByClassName('card');

window.addEventListener("scroll", function() {
  var topButton = document.getElementById("topButton");
  if (window.scrollY > 20) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
});

document.getElementById("topButton").addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (store === 'dark') {
  body.classList.add('change_color');
  modeSwitch.checked = true;
  darktext.textContent = 'light Mode'
}
else{
  body.classList.remove('change_color');
  modeSwitch.checked = false;
  darktext.textContent = 'dark Mode'
}

function formatPopulation(population) { if (population >= 1000000000) { return (population / 1000000000).toFixed(1) + 'B'; } else if (population >= 1000000) { return (population / 1000000).toFixed(1) + 'M'; } else if (population >= 1000) { return (population / 1000).toFixed(1) + 'K'; } else { return population; } }
modeSwitch.addEventListener('change', () => {
  if(modeSwitch.checked){
    body.classList.add('change_color');
    localStorage.setItem('mode','dark')
    modeSwitch.checked = true;
    darktext.textContent = 'light Mode'

  }
  else{
    body.classList.remove('change_color');
    modeSwitch.checked = false;
    localStorage.setItem('mode','light')
    darktext.textContent = 'dark Mode'
  }
});

search.addEventListener('keyup', (e) => {
  const searchValue = e.target.value.trim().toLowerCase();
  const region = select.value.toLowerCase();
  fetchData(searchValue, region);
});

select.addEventListener('change', (e) => {
  const searchValue = search.value.trim().toLowerCase();
  const region = e.target.value.toLowerCase();
  fetchData(searchValue, region);
});

async function fetchData(searchValue, region) {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    loader.classList.add('none')
    const filteredData = data.filter((country) => {
      const countryName = country.name.common.toLowerCase();
      const countryRegion = country.region.toLowerCase();
      const searchMatch = searchValue === '' || countryName.includes(searchValue);
      const regionMatch = region === '' || countryRegion === region;
      return searchMatch && regionMatch;
    });
    if(filteredData.length === 0){
      document.querySelector('.notFound').style.display = 'block'
    }
    else{
      document.querySelector('.notFound').style.display = 'none'
    }
    renderCards(filteredData);
  } catch (error) {
    console.log(error);
  }
}

function renderCards(data) {
  cards.innerHTML = '';

  data.forEach((country) => {
    let contain = document.createDocumentFragment('div')
    let card = document.createElement('div');
    card.classList.add('card');
    let image = document.createElement('img');
    image.classList.add('card_image');
    let name = document.createElement('h2');
    let population = document.createElement('h3');
    let region = document.createElement('h4');
    let capital = document.createElement('p');
    contain.append(image, name, population, region, capital)
    card.append(contain);
    population.textContent = 'Population: ' + formatPopulation(country.population);
    name.textContent = country.name.common;
    image.src = country.flags.png;
    capital.textContent = 'Capital: ' + (country.capital && country.capital[0]);
    region.textContent = 'Region: ' + country.region;
    cards.append(card);

    card.addEventListener('click', () => {
      navigateToCountry(country.name.common);
    });
  });
}

function navigateToCountry(countryName) {
  const url = 'country.html?country=' + encodeURIComponent(countryName);
  window.location.href = url;
}

body.addEventListener('click', function(){
  window.location.href = url
})

fetchData('', '');