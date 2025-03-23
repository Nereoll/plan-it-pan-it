// Importer les fonctions de gestion des favoris
import { getFavoris, removeFavori } from '../modules/favoris.js';

// Fonction pour afficher les favoris dans le conteneur
function displayFavorites(favorites) {
  const favoritesContainer = document.getElementById("favorites_list");
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritesContainer.innerHTML =
      '<p class="text-xl">Aucun favori pour le moment.</p>';
    return;
  }

  favorites.forEach(meal => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow-md p-4 w-64 flex flex-col items-center";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-32 h-32 rounded-lg mb-2">
      <p class="text-lg font-bold mb-2 text-center">${meal.strMeal}</p>
      <button class="bg-red-500 text-white px-3 py-1 rounded remove-fav" data-id="${meal.idMeal}">
        Delete
      </button>
    `;
    favoritesContainer.appendChild(card);
  });

  // Ajout des événements pour supprimer un favori
  document.querySelectorAll(".remove-fav").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const mealId = e.currentTarget.getAttribute("data-id");
      removeFavori(mealId);
      updateFavorites();
    });
  });
}

// Met à jour l'affichage en récupérant les favoris et en filtrant selon la recherche
function updateFavorites() {
  const favorites = getFavoris();
  const searchValue = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const filtered = favorites.filter(meal =>
    meal.strMeal.toLowerCase().includes(searchValue)
  );
  displayFavorites(filtered);
}

// Actualise l'affichage lorsque l'utilisateur saisit dans la barre de recherche
document.getElementById("searchInput").addEventListener("input", updateFavorites);

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", updateFavorites);