// ================= MOVIES =================
const movies = [
    {
        id: 1,
        titre: "The Last Mission",
        categorie: "Action",
        description: "Un agent secret doit accomplir sa dernière mission.",
        image: "image/the last miss.jpg"
    },
    {
        id: 2,
        titre: "Urban Fighter",
        categorie: "Action",
        description: "Un combattant de rue doit se relever.",
        image: "image/urban.jpg"
    },
    {
        id: 3,
        titre: "Johnny English",
        categorie: "Comédie",
        description: "Un espion maladroit.",
        image: "image/jhonnt.jpg"
    },
    {
        id: 4,
        titre: "Best Friends",
        categorie: "Comédie",
        description: "Deux amis se retrouvent.",
        image: "image/bf.avif"
    },
    {
        id: 5,
        titre: "The Silence",
        categorie: "Drame",
        description: "Une femme face à ses secrets.",
        image: "image/the-silence.jpg"
    },
    {
        id: 6,
        titre: "Memory Lane",
        categorie: "Drame",
        description: "Un voyage dans les souvenirs.",
        image: "image/memory.jpg"
    }
];

// ================= CONTAINER =================
const container = document.getElementById("movie-container");

// ================= CREATE CARDS =================
movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
        <div class="card-img">
            <img src="${movie.image}" alt="${movie.titre}">
        </div>
        <div class="card-content">
            <h3>${movie.titre}</h3>
            <p>${movie.categorie}</p>
            <button class="voir-details-btn">Voir détails</button>
        </div>
    `;

    // 1. Logic dyal "Voir détails" (Bach i-tlea l-description f l-modal)
    const detailBtn = card.querySelector(".voir-details-btn");
    detailBtn.addEventListener("click", (e) => {
        // e.stopPropagation() bach dima l-click i-bqa ghir f l-button
        e.stopPropagation(); 
        
        // Kan-3emrou l-modal o kan-baynouh
        const modal = document.getElementById("modal");
        document.getElementById("modal-img").src = movie.image;
        document.getElementById("modal-title").textContent = movie.titre;
        document.getElementById("modal-category").textContent = movie.categorie;
        document.getElementById("modal-description").textContent = movie.description;
        
        // Hna khassna n-réglou l-button li west l-modal (Add Favori)
        const addFavBtn = document.getElementById("add-fav");
        
        // Khass n-hiedou ay event listener qdim bach may-bqach i-zid nfs l-film bzaf d l-merrat
        const newAddFavBtn = addFavBtn.cloneNode(true);
        addFavBtn.parentNode.replaceChild(newAddFavBtn, addFavBtn);
        
        newAddFavBtn.addEventListener("click", () => {
            ajouterAuxFavoris(movie);
            modal.style.display = "none"; // n-seddou l-modal melli i-zidou f favoris
        });

        modal.style.display = "flex";
    });

    container.appendChild(card);
});

function ajouterAuxFavoris(movie) {
    const favGrid = document.getElementById("movie-grid-fav");
    
    // Vérifier si le film est déjà présent
    const exists = Array.from(favGrid.children).some(child => child.dataset.id == movie.id);
    
    if (!exists) {
        const favCard = document.createElement("div");
        favCard.classList.add("movie-card");
        favCard.dataset.id = movie.id; // On garde l'ID pour pouvoir le retrouver
        
        favCard.innerHTML = `
            <div class="card-img">
                <img src="${movie.image}" alt="${movie.titre}">
            </div>
            <div class="card-content">
                <h3>${movie.titre}</h3>
                <p>🎬 ${movie.categorie}</p>
                <button class="remove-fav-btn">Retirer des favoris</button>
            </div>
        `;

        // Ajouter l'événement pour supprimer la carte
        const removeBtn = favCard.querySelector(".remove-fav-btn");
        removeBtn.addEventListener("click", () => {
            favCard.remove();
            
            // Si la grille est vide, on peut réafficher le message "Aucun film"
            if (favGrid.children.length === 0) {
                const noFavMessage = document.querySelector(".favorites p");
                if (noFavMessage) noFavMessage.style.display = "block";
            }
        });

        favGrid.appendChild(favCard);
        
        // Cacher le message "Aucun film en favoris"
        const noFavMessage = document.querySelector(".favorites p");
        if (noFavMessage) noFavMessage.style.display = "none";
        
    } else {
        alert("Ce film est déjà dans vos favoris !");
    }
}