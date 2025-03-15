// Fonction pour charger le header et le footer
function loadHeaderFooter() {
    // Charger le header
    fetch('../pages/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
        });
}

// Appeler la fonction au chargement de la page
window.onload = loadHeaderFooter;
