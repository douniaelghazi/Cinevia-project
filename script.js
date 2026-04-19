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
        image: "image/bf.jpg"
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

function createCard(movie) {  
    let card = document.createElement("div");
    card.classList.add("movie-card"); 

    card.innerHTML = `
        <div class="card-img">
            <img src="${movie.image}" alt="${movie.titre}">
        </div>
        <div class="card-content">
            <h3>${movie.titre}</h3>
            <p class="category">${movie.categorie}</p>
            <button class="detail-btn">Voir détails</button>
        </div>`;

    let btn = card.querySelector(".detail-btn");
    btn.addEventListener("click", () => {
        openModal(movie);
    });

    return card;
}
let container = document.getElementById("movie-container");
   movies.forEach(movie => {
    let card = createCard(movie);
    container.appendChild(card)
   })
   function filterMovies(categorie){
    let container= document.getElementById("movie-container")
    container.innerHTML=""
    let filterfilm;
    if(categorie==="Tous"){
        filterfilm=movies
    } else{
        filterfilm= movies.filter(movie=> movie.categorie===categorie);
    }
        filterfilm.forEach(movie=>{
            let card= createCard(movie);
            container.appendChild(card)
        });
    }
   
   document.addEventListener("DOMContentLoaded", function(){
    filterMovies("Tous");
   
   });

   function openModal(movie){
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modal-img").src = movie.image;
    document.getElementById("modal-titre").innerText = movie.titre;
    document.getElementById("modal-categorie").innerText = movie.categorie;
    document.getElementById("modal-description").innerText = movie.description;

    document.getElementById("add-fav").onclick = () => {
        addToFavorites(movie)
    };
}
document.getElementById("close").onclick = () => {
    document.getElementById("modal").style.display = "none";
};

window.onclick = (e) => {
    let modal = document.getElementById("modal");
    if(e.target === modal){
        modal.style.display = "none";
    }
};

let favorites = [];

function addToFavorites(movie) {
    let exists = favorites.find(f => f.titre === movie.titre);
    if (exists) {
        alert("Ce film est déjà dans vos favoris !");
        return;
    }

    favorites.push(movie);
    displayFavorites();
    // Shed l-modal
    document.getElementById("modal").style.display = "none";
}

function displayFavorites() {
    let favContainer = document.getElementById("movie-grid-fav");
    favContainer.innerHTML = "";

    favorites.forEach(movie => {
        let card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <div class="card-img">
                <img src="${movie.image}" alt="${movie.titre}">
            </div>
            <div class="card-content">
                <h3>${movie.titre}</h3>
                <p class="category">${movie.categorie}</p>
                <button class="remove-fav-btn">Retirer des favoris❤️</button>
            </div>
        `;

        card.querySelector(".remove-fav-btn").addEventListener("click", () => {
            favorites = favorites.filter(f => f.titre !== movie.titre);
            displayFavorites();
        });

        favContainer.appendChild(card);
    });
}