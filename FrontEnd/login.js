const formulaireLogin = document.querySelector(".login-form");

formulaireLogin.addEventListener("submit", async function (event) {
    //désactivation du comportement par défaut du formulaire
    event.preventDefault();

    const email = event.target.querySelector("[name=email]").value;
    const password = event.target.querySelector("[name=password]").value;

    const utilisateur = { email, password };

    
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(utilisateur)
    });

    if (reponse.ok) {
        const data = await reponse.json();
        console.log("Connexion réussie:", data);
        localStorage.setItem("token", data.token);
        window.location.href = "index.html"; // redirection vers la page d'accueil

    } else {
        // affichage d'une alerte en cas d'erreur
        alert("Erreur dans l'identifiant ou le mot de passe");
    }
});

