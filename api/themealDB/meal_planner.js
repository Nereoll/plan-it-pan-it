import { addFavori, removeFavori, isFavoris } from '/modules/favoris.js';

document.addEventListener('DOMContentLoaded', () => {

    const categorySelect = document.getElementById('categorySelect'); // Sélecteur des catégories
    const daysSelect = document.getElementById('daysSelect'); // Selecteur du nombre de jours
    const originSelect = document.getElementById('originSelect'); // Sélecteur des origines
    const container = document.getElementById('recipe_container'); // Conteneur des repas

    const buttonGenerate = document.getElementById('buttonGenerate'); // Bouton générate


    async function getCategoryFood(){
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
            const data = await response.json();

            // Vérifier si les données existent
            if (data.meals) {
                data.meals.forEach(meal => {
                    const option = document.createElement("option");
                    option.value = meal.strCategory; 
                    option.textContent = meal.strCategory;
                    categorySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    }
    async function getOrigin() {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
            const data = await response.json();

            // Vérifier si les données existent
            if (data.meals) {
                data.meals.forEach(meal => {
                    const option = document.createElement("option");
                    option.value = meal.strArea;
                    option.textContent = meal.strArea;
                    originSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des origines :", error);
        }
    }

    // Lancer les requêtes API au chargement de la page
    getCategoryFood();
    getOrigin();

    async function getMealPlaning(category, origin, count){
        try {
            let data
            // Vérifier les filtres (catégorie et origine)
            if (category && origin) {
                // Si les deux sont définis, faire deux requêtes et fusionner les résultats
                const categoryResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
                const categoryData = await categoryResponse.json();
                const originResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${origin}`);
                const originData = await originResponse.json();

                // Fusionner les résultats des deux filtres
                const mergedMeals = categoryData.meals.filter(meal => originData.meals.some(m => m.idMeal === meal.idMeal));
                data = { meals: mergedMeals };
            } else if (category) {
                // Si seulement la catégorie est définie
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
                data = await response.json();
            } else if (origin) {
                // Si seulement l'origine est définie
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${origin}`);
                data = await response.json();
            }else{
                let meals = [];
                for (let i = 0; i < count; i++) {
                    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
                    const randomMealData = await response.json();
                    if (randomMealData.meals) {
                        meals.push(randomMealData.meals[0]);
                    }
                }
                data = { meals }; // Stocker les repas obtenus
            }
            if (!data.meals) {
                console.error("Aucun repas trouvé !");
                container.innerHTML = '';
                return [];
            }

            if (data.meals.length === 0){
                container.innerHTML = '';
                const emptyCard = createEmptyRecipeCard();
                container.appendChild(emptyCard);
            }
            else{
            // Mélanger les repas aléatoirement et en prendre "count"
            const shuffledMeals = data.meals.sort(() => 0.5 - Math.random());
            const selectedMeals = shuffledMeals.slice(0, count);

            displayMeals(selectedMeals); // 📌 Affichage des repas
            }
            return selectedMeals;
        } catch (error) {
            return [];
        }
    }

    function createEmptyRecipeCard() {
        const card = document.createElement('div');
        card.className = 'flex items-center gap-2 m-4';

        const message = document.createElement('p');
        message.className = 'text-lg font-bold';
        message.textContent = 'No meals found for the selected criteria.';
        card.appendChild(message);

        return card;
    }

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

    function displayMeals(meals) {
        container.innerHTML = ''; // 📌 Vide le container avant d'afficher de nouveaux repas
        meals.forEach(meal => {
            const recipeCard = createRecipeCard(meal);
            container.appendChild(recipeCard);
        });
    }
    buttonGenerate.addEventListener('click', () => {
        const categoryValue = categorySelect.value;
        const originValue = originSelect.value;
        const daysValue = parseInt(daysSelect.value) || 2; // Nombre de repas à générer

        getMealPlaning(categoryValue, originValue, daysValue);
    })
    
});