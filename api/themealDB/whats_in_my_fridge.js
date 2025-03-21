document.addEventListener('DOMContentLoaded', () => {
  const buttonGenerate = document.getElementById('btnGenerateInMyFridge');
  const ingredientContainer = document.querySelector('#ingredient_container');
  const listIngredients = Array.from(ingredientContainer.querySelectorAll("p")).map(p => p.textContent.trim());
  console.log(listIngredients);

  async function getMealFromIngredients(ingredients) {
    try {
      let meals = [];
      console.log("la fonction est appelée");
    
      // Récupérer les plats pour chaque ingrédient
      for (const ingredient of ingredients) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        
    
        if (data.meals) {
          meals.push(...data.meals); // Ajouter les plats trouvés
        }
      }
    
      // Vérifier s'il y a des plats
      if (meals.length === 0) {
        console.log(`Aucun plat trouvé pour les ingrédients : ${ingredients.join(", ")}`);
        return [];
      }
    
      // Compter le nombre d'apparitions de chaque `idMeal`
      const mealsCount = meals.reduce((acc, meal) => {
        acc[meal.idMeal] = acc[meal.idMeal] ? acc[meal.idMeal] + 1 : 1;
        return acc;
      }, {});
    
      // Filtrer les plats qui contiennent TOUS les ingrédients
      const filteredMeals = meals.filter(meal => mealsCount[meal.idMeal] === ingredients.length);
    
      console.log(`Plats contenant ${ingredients.join(", ")} :`, filteredMeals);
      return filteredMeals;
    } catch (error) {
      console.error("Erreur lors de la récupération des plats :", error);
      return [];
    }
    }
    
  buttonGenerate.addEventListener('click', () => getMealFromIngredients(listIngredients));
});