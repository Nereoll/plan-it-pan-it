const FAVORIS_KEY = "favoris"; // Clé pour stocker les favoris dans localStorage

// 🔹 Récupérer les favoris du localStorage
export function getFavoris() {
    const favoris = localStorage.getItem(FAVORIS_KEY);
    return favoris ? JSON.parse(favoris) : []; // Convertir en tableau ou renvoyer un tableau vide
}

// 🔹 Ajouter un favori (évite les doublons)
export function addFavori(meal) {
    let favoris = getFavoris();
    
    // Vérifier si le favori est déjà présent
    if (!favoris.some(fav => fav.idMeal === meal.idMeal)) {
        favoris.push(meal);
        localStorage.setItem(FAVORIS_KEY, JSON.stringify(favoris)); // Sauvegarde
        console.log(`Ajouté aux favoris : ${meal.strMeal}`);
    } else {
        console.log(`Déjà en favori : ${meal.strMeal}`);
    }
}

// 🔹 Supprimer un favori avec confirmation
export function removeFavori(mealId) {
    const confirmation = confirm("Are you sure you want to remove this meal from your favorites?");
    
    if (confirmation) {
        let favoris = getFavoris();
        favoris = favoris.filter(fav => fav.idMeal !== mealId); // Filtrer pour enlever l'élément
        localStorage.setItem(FAVORIS_KEY, JSON.stringify(favoris)); // Sauvegarde
        console.log(`Supprimé des favoris : ${mealId}`);
    } else {
        console.log("Suppression annulée.");
    }
}

// 🔹 Vérifier si un meal est dans les favoris
export function isFavoris(mealId) {
    const favoris = getFavoris();
    return favoris.some(fav => fav.idMeal === mealId);
}
