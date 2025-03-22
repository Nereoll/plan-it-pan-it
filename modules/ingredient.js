let listIngredients = []; // Declare the variable outside DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('button');
    const input = document.getElementById('ingredientInput');
    const listContainer = document.querySelector('#ingredient_container');

    function addIngredient() {
        const ingredientText = input.value.trim();
        if (ingredientText) {
            // Create a container div for the ingredient and delete icon
            const newDiv = document.createElement('div');
            newDiv.className = 'flex justify-between items-center';

            // Create the ingredient paragraph with an icon
            const newParagraph = document.createElement('p');
            newParagraph.className = 'text-xl bg-[#E8E25B] rounded-xl px-4 py-2';

            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-utensils';

            newParagraph.appendChild(icon);
            newParagraph.appendChild(document.createTextNode(` ${ingredientText}`));

            // Create the delete icon
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fa-solid fa-xmark text-red-500 pl-10 cursor-pointer';

            // Append the paragraph and delete icon to the container div
            newDiv.appendChild(newParagraph);
            newDiv.appendChild(deleteIcon);

            // Append the container div to the list container
            listContainer.appendChild(newDiv);
            input.value = ''; // Clear input after adding

            // Add the ingredient to the array
            listIngredients.push(ingredientText);

            // Add event listener to delete this ingredient on click
            deleteIcon.addEventListener('click', () => {
                // Remove the div from the DOM
                newDiv.remove();
                // Remove the ingredient from the listIngredients array
                const index = listIngredients.indexOf(ingredientText);
                if (index > -1) {
                    listIngredients.splice(index, 1);
                }
            });
        }
    }

    button.addEventListener('click', addIngredient);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addIngredient();
        }
    });
});

// Export the function to be accessible from other files
export function getListIngredients() {
    return listIngredients;
}
