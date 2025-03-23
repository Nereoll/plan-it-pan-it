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
            if (category || origin){
                let url = "https://www.themealdb.com/api/json/v1/1/filter.php?";
                if (origin) url += `a=${origin}`;
                if (category) url += `&c=${category}`;
                
                const response = await fetch(url);
                data = await response.json();
            }else{
                // Si aucun filtre, récupérer TOUS les repas
                const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
                data = await response.json();
            }

            if (!data.meals) {
                console.error("Aucun repas trouvé !");
                return [];
            }

            // Mélanger les repas aléatoirement et en prendre "count"
            const shuffledMeals = data.meals.sort(() => 0.5 - Math.random());
            const selectedMeals = shuffledMeals.slice(0, count);

            displayMeals(selectedMeals); // 📌 Affichage des repas

            return selectedMeals;
        } catch (error) {
            console.error("Erreur lors de la récupération des repas :", error);
            return [];
        }
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
        bookmarkButton.innerHTML = '<i class="fa-regular fa-bookmark"></i>';

        bookmarkButton.addEventListener('click', () => {
            bookmarkButton.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
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