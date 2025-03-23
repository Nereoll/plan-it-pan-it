import { getListIngredients } from '../../modules/ingredients.js';
import { addFavori, removeFavori, isFavoris } from '../../modules/favoris.js';


document.addEventListener('DOMContentLoaded', () => {
  const buttonGenerate = document.getElementById('btnGenerateInMyFridge');
  const container = document.getElementById('recipe_container');
  const ingredientInput = document.getElementById('ingredientInput');

	function createRecipeCard(meal) {
		const card = document.createElement('div');
		card.className = 'flex items-center gap-2 m-4';

		const img = document.createElement('img');
		img.src = meal.strMealThumb;
		img.alt = meal.strMeal;
		img.className = 'w-32 h-32';
		card.appendChild(img);

		const content = document.createElement('div');
		content.className = 'w-full pl-10 flex flex-col self-center gap-4';

		const bookmarkButton = document.createElement('button');
		bookmarkButton.className = 'text-black self-end';
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


		content.appendChild(bookmarkButton);

		const description = document.createElement('p');
		description.className = 'w-3/4 text-lg font-bold';
		description.textContent = meal.strMeal;
		content.appendChild(description);

		const buttonsContainer = document.createElement('div');
		buttonsContainer.className = 'flex gap-2';
    content.appendChild(buttonsContainer);

    card.appendChild(content);
		return card;
	}


  async function displayMeals(ingredients) {
    container.innerHTML = ''; // Vider le conteneur avant d'afficher les résultats

    if (ingredients.length === 0) {
        const message = document.createElement('p');
        message.className = 'text-center text-xl font-bold text-gray-700';
        message.textContent = "Please add at least one ingredient to find meals!";
        container.appendChild(message);
        return;
    }

    const meals = await getMealFromIngredients(ingredients);

    if (meals.length === 0) {
        const message = document.createElement('p');
        message.className = 'text-center text-xl font-bold text-gray-700';
        message.textContent = "No meals found for the selected ingredients. Try adding less!";
        container.appendChild(message);
        return;
    }

    meals.forEach(meal => {
        const recipeCard = createRecipeCard(meal);
        container.appendChild(recipeCard);
    });
}

  async function getIngredient(){
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
        const data = await response.json();

        // Vérifier si les données existent
        if (data.meals) {
            data.meals.forEach(meal => {
                const option = document.createElement("option");
                option.value = meal.strIngredient; 
                option.textContent = meal.strIngredient;
                ingredientInput.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des ingredients :", error);
    }
}
getIngredient(); // appel api au chargement de la page

  async function getMealFromIngredients(ingredients) {
    try {
      let meals = [];
      for (const ingredient of ingredients) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        if (data.meals) {
          meals.push(...data.meals);
        }
      }

      if (meals.length === 0) {
        return [];
      }

      const mealsCount = meals.reduce((acc, meal) => {
        acc[meal.idMeal] = acc[meal.idMeal] ? acc[meal.idMeal] + 1 : 1;
        return acc;
      }, {});

      const filteredMeals = meals.filter(meal => mealsCount[meal.idMeal] === ingredients.length);

	  if (filteredMeals.length === 0) {
        return [];
      }

      return filteredMeals;
    } catch (error) {
      console.error("Erreur lors de la récupération des plats :", error);
      return [];
    }
  }

  buttonGenerate.addEventListener('click', () => {
    const listIngredients = getListIngredients(); // 🔄 Récupérer la liste mise à jour
    getMealFromIngredients(listIngredients);
	displayMeals(listIngredients);
  });
});

