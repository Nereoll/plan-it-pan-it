import { addFavori, removeFavori, isFavoris} from '../../modules/favoris.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('discover_container');
    const image = container.querySelector('img');
    const desc = container.querySelector('p');
    const ingredientContainer = document.getElementById('ingredient_container');
    const button = document.getElementById('generator');
    const bookmarkButton = document.getElementById('fav_button')
    const title = document.getElementById('title');
	let meal;

    async function fetchRandomMeal() {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        desc.innerHTML = data.meals[0].strInstructions.replace(/\./g, ".<br>");
        image.src = data.meals[0].strMealThumb;
        title.textContent = data.meals[0].strMeal;
		    meal=data.meals[0]
        if (isFavoris(meal.idMeal)) {
          bookmarkButton.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
        } else{
          bookmarkButton.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
        }
    
        // Ajout de l'événement pour gérer le favori
      bookmarkButton.addEventListener('click', () => {
          if (isFavoris(meal.idMeal)) {
              removeFavori(meal.idMeal);
              bookmarkButton.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
          } else {
              addFavori(meal);
              bookmarkButton.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
          }
      });

        const ingredients = [];
        for (let i = 1; i <= 10; i++) {
            const ingredient = data.meals[0][`strIngredient${i}`];
            if (ingredient) {
            ingredients.push(`${ingredient}`);
            }
        }
        ingredientContainer.innerHTML = ingredients.map(ing => `<button class="bg-[#E8E25B] text-black font-bold rounded self-center w-40 h-16 px-2">${ing}</button>`).join('');

    }

    button.addEventListener('click', fetchRandomMeal);
    // Optional: Add ingredient when pressing Enter
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        fetchRandomMeal();
      }
    });
    fetchRandomMeal();
  });