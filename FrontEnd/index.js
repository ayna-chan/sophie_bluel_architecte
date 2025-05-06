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

// ----------- MODALE -----------

const modal = document.getElementById('modal');
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');
    const galleryView = document.querySelector('.gallery-view');
    const addPhoto = document.getElementById('addPhoto');
    const toAddBtn = document.getElementById('toAddPhoto');
    const backBtn = document.getElementById('backToGallery');
    const gallery = document.getElementById('gallery');
    const form = document.getElementById('photoForm');
    const input = document.getElementById('photoInput');

    function afficherGalerieModale(works) {
      gallery.innerHTML = "";
      works.forEach(work => {
        const container = document.createElement('div');
        container.classList.add('photo-container');
    
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
    
        const delBtn = document.createElement('button');
        delBtn.classList.add('delete-btn');

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can');
        delBtn.appendChild(trashIcon);

        delBtn.onclick = async () => {
          try {
            const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`,
              }
            });

          if (response.ok) {
            container.remove(); // Supprimer visuellement l'image
            data = data.filter(item => item.id !== work.id); // Mettre à jour les données
            genererArticles(data); // Mettre à jour la galerie principale
          } else {
            alert("La suppression a échoué.");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      };
 
        container.appendChild(img);
        container.appendChild(delBtn);
        gallery.appendChild(container);
      });
    }

    // Ouvrir modale
    openBtn.onclick = () => {
      modal.style.display = 'flex';
      galleryView.style.display = 'flex';
      addPhoto.style.display = 'none';
      afficherGalerieModale(data); // ici !
    };
    

    // Fermer modale
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };

    // --Fermer modale en cliquant hors de la fenêtre--
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Aller à vue ajout photo
    toAddBtn.onclick = () => {
      galleryView.style.display = 'none';
      addPhoto.style.display = 'flex';
    };

    // Retour à galerie
    backBtn.onclick = () => {
      galleryView.style.display = 'flex';
      addPhoto.style.display = 'none';
    };

    // Ajouter photo à la galerie
    form.onsubmit = (e) => {
      e.preventDefault();
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const container = document.createElement('div');
        container.classList.add('photo-container');

        const img = document.createElement('img');
        img.src = reader.result;

        const delBtn = document.createElement('button');
        delBtn.classList.add('delete-btn');

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can');
        delBtn.appendChild(trashIcon);

        delBtn.onclick = () => container.remove();

        container.appendChild(img);
        container.appendChild(delBtn);
        gallery.appendChild(container);
      };

      reader.readAsDataURL(file);
      form.reset();
      backBtn.click();
    };






// const photoForm = document.getElementById("photoForm");

// photoForm.onsubmit = async function (event) {
//   event.preventDefault();  

//   const token = window.localStorage.getItem("token");
//   if (!token) {
//     alert("Vous devez être connecté pour ajouter une photo.");
//     return;
//   }
//   const fileInput = document.getElementById("uploadPhoto");
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Veuillez sélectionner une image");
//     photoForm.reset();
//     return;
//   }

//   const allowedTypes = ["image/jpeg", "image/png"];
//   if (!allowedTypes.includes(file.type)) {
//     alert("Veuillez sélectionner une image au format JPEG ou PNG");
//     photoForm.reset();
//     return;
//   }

//   const maxSize = 4 * 1024 * 1024; // 4 Mo
//   if (file.size > maxSize) {
//     alert("La taille de l'image ne doit pas dépasser 4 Mo");
//     photoForm.reset();
//     return;
//   }

//   const confirmation = confirm("Voulez-vous ajouter cette photo?");
//   if (!confirmation) return;
//   }

//   const formData = new FormData(photoForm);
//   formData.append("image", document.getElementById("uploadPhoto").files[0]);
//   formData.append("title", document.getElementById("photoTitleRequired").value);
//   formData.append("category", document.getElementById("photoCategory").value);
  
//   try {
//     let response = await fetch("http://localhost:5678/api/works", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//       },
//       body: formData,
//     });
//     if (response.ok) {
//       let errorResponse = await response.json();
//       console.log("Erreur serveur:", errorResponse);
//       alert("Erreur lors de l'ajout de la photo");
//       return
//     }

//     alert("Photo ajoutée avec succès");
//   } catch (error) {
//     console.error("Erreur:", error);
//     alert("Une erreur est survenue.")
//   }