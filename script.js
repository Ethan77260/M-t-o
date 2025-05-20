const API_KEY = "faa032b4a28313e3a26b58fbd509d82c"; // Remplace avec ta vraie clé API
const cartesContainer = document.getElementById('cartesContainer');
let villes = JSON.parse(localStorage.getItem('villes')) || [];

function savevilles() {
  localStorage.setItem('villes', JSON.stringify(villes));
}
 
function createcarte(ville, weather) {
  const carte = document.createElement('div');
  carte.className = 'carte';
  carte.id = ville;

  carte.innerHTML = `
    <h3>${weather.name}</h3>
    <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.weather[0].description}" />
    <p>${weather.main.temp}°C</p>
    <p>${weather.weather[0].description}</p>
    <button onclick="refreshville('${ville}')">🔄 Rafraîchir</button>
    <button onclick="removeville('${ville}')">❌ Supprimer</button>
  `;

  return carte;
}

function fetchWeather(ville) {
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`)
    .then(res => {
      if (!res.ok) throw new Error("Ville non trouvée");
      return res.json();
    });
}

function ajout_ville() {
  const input = document.getElementById('villeInput');
  const ville = input.value.trim();

  if (!ville || villes.includes(ville)) return;

  fetchWeather(ville)
    .then(data => {
      villes.push(ville);
      savevilles();
      cartesContainer.appendChild(createcarte(ville, data));
      input.value = '';
    })
    .catch(() => alert('Erreur : ville introuvable.'));
}

function removeville(ville) {
  villes = villes.filter(c => c !== ville);
  savevilles();
  document.getElementById(ville).remove();
}

function refreshville(ville) {
  fetchWeather(ville)
    .then(data => {
      const oldcarte = document.getElementById(ville);
      const newcarte = createcarte(ville, data);
      cartesContainer.replaceChild(newcarte, oldcarte);
    });
}

function loadvilles() {
  villes.forEach(ville => {
    fetchWeather(ville).then(data => {
      cartesContainer.appendChild(createcarte(ville, data));
    });
  });
}

window.onload = loadvilles;
