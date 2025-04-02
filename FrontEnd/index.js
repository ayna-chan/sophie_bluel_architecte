//appel à l'API, récupérer les données
const response = await fetch("http://localhost:5678/api/works");
const data = await response.json();

console.log (data) //pour vérifier dans inspecter --> console

genererArticles(data); //pour afficher les projets

function genererArticles(data) {
    // Sélectionner le conteneur où les articles vont être insérés
    const gallery = document.querySelector(".gallery");
  
    // Vider le conteneur avant de rajouter les nouveaux éléments
    gallery.innerHTML = "";
  
    // Parcourir les données et générer les éléments
    for (let i = 0; i < data.length; i++) {
      const figureElement = document.createElement("figure");
      const imgElement = document.createElement("img");
      const figcaptionElement = document.createElement("figcaption");
  
      // Ajouter l'URL de l'image et le titre au contenu
      imgElement.src = data[i].imageUrl;
      figcaptionElement.innerText = data[i].title;
  
      // Ajouter les éléments à leur parent respectif
      figureElement.appendChild(imgElement);
      figureElement.appendChild(figcaptionElement);
  
      // Ajouter l'élément "figure" au conteneur .gallery
      gallery.appendChild(figureElement);
    }
  }
  
// --- MENU DE CATEGORIES ---

const categories = new Set(data.map(item => item.category.name)); 

const menu = document.getElementById("menu-categories");


// pour que le bouton "active" prennent le bon style, inversement pour les autres (fonction pour activer un bouton et désactiver les autres) 
function setActiveButton(selectedButton) {
  document.querySelectorAll(".category-button").forEach(button => {
      button.classList.remove("active"); // Enlève "active" de tous les boutons
  });
  selectedButton.classList.add("active"); // Ajoute "active" au bouton cliqué
}

// bouton Tous (comme sur la maquette)
const allButton = document.createElement("button");
allButton.textContent = "Tous";
allButton.classList.add("category-button", "active"); // actif par défaut
allButton.addEventListener("click", () => {
    afficherTravaux(data); // pour tout afficher
    setActiveButton(allButton);
});
menu.appendChild(allButton);

// bouton pour chaques catégories 
categories.forEach(category => {
  const button = document.createElement("button");
  button.textContent = category;
  button.classList.add("category-button"); 
  button.addEventListener("click", () => {
      const travauxFiltres = data.filter(item => item.category.name === category);
      afficherTravaux(travauxFiltres);
      setActiveButton(button);
  });
  menu.appendChild(button);
});

function afficherTravaux(travaux) {
  const gallery = document.querySelector(".gallery");

    // travaux filtrés
    genererArticles(travaux);
}

