document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('discover_container');
    const image = container.querySelector('img');
    const desc = container.querySelector('p');
    const ingredientContainer = document.getElementById('ingredient_container');
    const button = document.getElementById('generator');
    const title = document.getElementById('title');

    async function fetchRandomMeal() {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        desc.innerHTML = data.meals[0].strInstructions.replace(/\./g, ".<br>");
        image.src = data.meals[0].strMealThumb;
        title.textContent = data.meals[0].strMeal;
        const ingredients = [];
        for (let i = 1; i <= 10; i++) {
            const ingredient = data.meals[0][`strIngredient${i}`];
            if (ingredient) {
            ingredients.push(`${ingredient}`);
            }
        }
        ingredientContainer.innerHTML = ingredients.map(ing => `<button class="bg-[#AFF099] text-black font-bold rounded self-center w-40 h-16 px-2">${ing}</button>`).join('');

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