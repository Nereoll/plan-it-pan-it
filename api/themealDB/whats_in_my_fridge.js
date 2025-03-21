import { getListIngredients } from '/scripts/ingredient.js';

document.addEventListener('DOMContentLoaded', () => {
  const buttonGenerate = document.getElementById('btnGenerateInMyFridge');

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
  });
});
