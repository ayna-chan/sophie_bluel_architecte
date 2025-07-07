//appel à l'API, récupérer les données
const response = await fetch("http://localhost:5678/api/works");

let data = await response.json();

let token = window.localStorage.getItem("token");

function cacherInfosUpload() {
  const iconPhoto = document.getElementById("iconPhoto");
  const sizeInfo = document.getElementById("sizeInfo");
  const fileLabel = document.getElementById("fileLabel");

  if (iconPhoto) iconPhoto.style.display = "none";
  if (sizeInfo) sizeInfo.style.display = "none";
  if (fileLabel) fileLabel.style.display = "none";
}


// modifier l'appercu de la photo lors de l'ajout au formulaire
const fileInput = document.getElementById("uploadPhoto");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const imgPreview = document.getElementById("imgPreview");
      const container = document.getElementById("imgPreviewContainer");
      imgPreview.src = reader.result;
      container.style.display = "block";
      cacherInfosUpload();
    };
    reader.readAsDataURL(file);
  }
});

console.log (data) //pour vérifier

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
 
  
// --- LOGIN / LOGOUT ---

const editionBanner = document.querySelector(".edition");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const menuCategories = document.getElementById("menu-categories");

function majInterfaceConnexion() {
  const token = localStorage.getItem("token");

  if (token) {
    // --- CONNECTÉ ---
    editionBanner.style.display = "block";
    btnLogin.style.display = "none";
    btnLogout.style.display = "list-item";
    menuCategories.style.display = "none";

  } else {
    // --- NON CONNECTÉ ---
    editionBanner.style.display = "none";
    btnLogin.style.display = "list-item";
    btnLogout.style.display = "none";
    openModal.style.display = "none"; 
    menuCategories.style.display = ""; 
  }
}

// LOGOUT -- TOKEN EFFACÉ
btnLogout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  majInterfaceConnexion();
});

majInterfaceConnexion();


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

// bouton Tous
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

    backBtn.addEventListener('click', () => {
    galleryView.style.display = 'flex';
    addPhoto.style.display = 'none';
  });

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


    
form.onsubmit = async (e) => {
  const fileInput = document.getElementById("uploadPhoto");

  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté");
    return;
  }


  const title = document.getElementById("photoTitleRequired").value;
  const category = document.getElementById("photoCategory").value;

  const file = fileInput.files[0];
  

  if (!file || !title || !category) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    alert("Seuls les formats JPG ou PNG sont autorisés");
    return;
  }

  if (file.size > 4 * 1024 * 1024) {
    alert("L’image ne doit pas dépasser 4 Mo");
    return;
  }

  // Envoi du formulaire à l'API et mis à jour de la galerie
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
      data.push(newWork); // mettre à jour la liste globale
      genererArticles(data); // mettre à jour la galerie principale
      afficherGalerieModale(data); // mettre à jour la galerie de la modale
      form.reset();
      const imgPreview = document.getElementById("imgPreview");
      const imgPreviewContainer = document.getElementById("imgPreviewContainer");
      imgPreview.src = "";
      imgPreviewContainer.style.display = "none";
      const fileLabel = document.getElementById("fileLabel");
      fileLabel.style.display = ""; 
      const iconPhoto = document.getElementById("iconPhoto");
      iconPhoto.style.display = ""; 
      const sizeInfo = document.getElementById("sizeInfo");
      sizeInfo.style.display = "block";  

      alert("Photo ajoutée !");
    } else {
      alert("Erreur lors de l'ajout.");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau.");
  }
};

// remplir la liste pour id photography

async function chargerCategories() {
  const select = document.getElementById("photoCategory");
  if (!select) return;

  try {
    const res = await fetch("http://localhost:5678/api/categories");
    const categories = await res.json();

    select.innerHTML = '<option value="">--Choisir une catégorie--</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur chargement catégories :", error);
  }
}

chargerCategories();