let listIngredients = []; // Déclarer la variable en dehors de DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('button');
    const input = document.getElementById('ingredientInput');
    const listContainer = document.querySelector('#ingredient_container');

    function addIngredient() {
        const ingredientText = input.value.trim();
        if (ingredientText) {
            const newParagraph = document.createElement('p');
            newParagraph.className = 'text-xl';

            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-utensils';

            newParagraph.appendChild(icon);
            newParagraph.appendChild(document.createTextNode(` ${ingredientText}`));

            listContainer.appendChild(newParagraph);
            input.value = ''; // Clear input after adding

            listIngredients.push(ingredientText);
        }
    }

    button.addEventListener('click', addIngredient);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addIngredient();
        }
    });
});

// ✅ Exporter la fonction pour qu'elle soit accessible dans d'autres fichiers
export function getListIngredients() {
    return listIngredients;
}
