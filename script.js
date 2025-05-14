const API_KEY = "faa032b4a28313e3a26b58fbd509d82c"; // Remplace avec ta vraie clé API
const cardsContainer = document.getElementById('cardsContainer');
let cities = JSON.parse(localStorage.getItem('cities')) || [];

function saveCities() {
  localStorage.setItem('cities', JSON.stringify(cities));
}

function createCard(city, weather) {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = city;

  card.innerHTML = `
    <h3>${weather.name}</h3>
    <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.weather[0].description}" />
    <p>${weather.main.temp}°C</p>
    <p>${weather.weather[0].description}</p>
    <button onclick="refreshCity('${city}')">🔄 Rafraîchir</button>
    <button onclick="removeCity('${city}')">❌ Supprimer</button>
  `;

  return card;
}

function fetchWeather(city) {
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`)
    .then(res => {
      if (!res.ok) throw new Error("Ville non trouvée");
      return res.json();
    });
}

function ajout_ville() {
  const input = document.getElementById('cityInput');
  const city = input.value.trim();

  if (!city || cities.includes(city)) return;

  fetchWeather(city)
    .then(data => {
      cities.push(city);
      saveCities();
      cardsContainer.appendChild(createCard(city, data));
      input.value = '';
    })
    .catch(() => alert('Erreur : ville introuvable.'));
}

function removeCity(city) {
  cities = cities.filter(c => c !== city);
  saveCities();
  document.getElementById(city).remove();
}

function refreshCity(city) {
  fetchWeather(city)
    .then(data => {
      const oldCard = document.getElementById(city);
      const newCard = createCard(city, data);
      cardsContainer.replaceChild(newCard, oldCard);
    });
}

function loadCities() {
  cities.forEach(city => {
    fetchWeather(city).then(data => {
      cardsContainer.appendChild(createCard(city, data));
    });
  });
}

window.onload = loadCities;
