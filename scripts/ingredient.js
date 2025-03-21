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
      }
    }

    button.addEventListener('click', addIngredient);
    // Optional: Add ingredient when pressing Enter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addIngredient();
      }
    });
  });