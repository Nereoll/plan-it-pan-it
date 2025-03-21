import { getListIngredients } from '/scripts/ingredient.js';

document.addEventListener('DOMContentLoaded', () => {
  const buttonGenerate = document.getElementById('btnGenerateInMyFridge');
  const container = document.getElementById('recipe_container');

	function createRecipeCard(meal) {
		const card = document.createElement('div');
		card.className = 'flex items-center gap-2 m-4';

		const img = document.createElement('img');
		img.src = meal.strMealThumb;
		img.alt = meal.strMeal;
		img.className = 'w-32 h-32';
		card.appendChild(img);

		const content = document.createElement('div');
		content.className = 'pl-10 flex flex-col self-center gap-4';

		const bookmarkButton = document.createElement('button');
		bookmarkButton.className = 'text-black self-end';
		bookmarkButton.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
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
		const meals = await getMealFromIngredients(ingredients);
		container.innerHTML = '';
		meals.forEach(meal => {
			const recipeCard = createRecipeCard(meal);
			container.appendChild(recipeCard);
		});
	}


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
        console.log(`Aucun plat trouvé pour les ingrédients : ${ingredients.join(", ")}`);
        return [];
      }

      const mealsCount = meals.reduce((acc, meal) => {
        acc[meal.idMeal] = acc[meal.idMeal] ? acc[meal.idMeal] + 1 : 1;
        return acc;
      }, {});

      const filteredMeals = meals.filter(meal => mealsCount[meal.idMeal] === ingredients.length);

	  if (filteredMeals.length === 0) {
        console.log(`Aucun plat trouvé pour les ingrédients : ${ingredients.join(", ")}`);
        return [];
      }

      console.log(`Plats contenant ${ingredients.join(", ")} :`, filteredMeals);
      return filteredMeals;
    } catch (error) {
      console.error("Erreur lors de la récupération des plats :", error);
      return [];
    }
  }

  buttonGenerate.addEventListener('click', () => {
    const listIngredients = getListIngredients(); // 🔄 Récupérer la liste mise à jour
    console.log("Ingrédients sélectionnés :", listIngredients);
    getMealFromIngredients(listIngredients);
	displayMeals(listIngredients);
  });
});
