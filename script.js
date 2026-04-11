// ================= DONNÉES DES FILMS =================
const films = [
    {
        id: 1,
        titre: "The Last Mission",
        categorie: "Action",
        description: "Un agent secret doit accomplir sa dernière mission avant de prendre sa retraite. Plein d'action et de rebondissements!",
        image: "image/the last miss.jpg"
    },
    {
        id: 2,
        titre: "Urban Fighter",
        categorie: "Action",
        description: "Un combattant de rue doit se relever après avoir tout perdu. Un film intense rempli de combats spectaculaires.",
        image: "image/urban.jpg"
    },
    {
        id: 3,
        titre: "Johnny English",
        categorie: "Comédie",
        description: "Les aventures hilarantes d'un espion maladroit qui doit sauver le monde. Du rire garanti!",
        image: "image/jhonnt.jpg"
    },
    {
        id: 4,
        titre: "Best Friends",
        categorie: "Comédie",
        description: "Deux amis se retrouvent après 10 ans d'absence et revivent leurs meilleures aventures. Une comédie touchante et amusante.",
        image: "image/bf.avif"
    },
    {
        id: 5,
        titre: "The Silence",
        categorie: "Drame",
        description: "Une femme doit faire face aux secrets de sa famille. Un drame émotionnel et profond.",
        image: "image/the-silence.jpg"
    },
    {
        id: 6,
        titre: "Memory Lane",
        categorie: "Drame",
        description: "Un homme retrace les moments clés de sa vie. Un voyage nostalgique et émouvant à travers les souvenirs.",
        image: "image/memory.jpg"
    }
];

// ================= VARIABLES GLOBALES =================
let filmsFavoris = JSON.parse(localStorage.getItem('favoris')) || [];
let filmSelectionnéModale = null;

// ================= RÉCUPÉRER LES ÉLÉMENTS DU DOM =================
const movieGrid = document.getElementById('movie-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.querySelector('.search-bar input');

// ================= 1. AFFICHER LES FILMS =================
function afficherFilms(listeFilms) {
    movieGrid.innerHTML = '';

    if (listeFilms.length === 0) {
        movieGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Aucun film trouvé</p>';
        return;
    }

    listeFilms.forEach(film => {
        // Créer une carte de film
        const card = document.createElement('article');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="card-img">
                <img src="${film.image}" alt="${film.titre}">
            </div>
            <div class="card-content">
                <h3>${film.titre}</h3>
                <p>${film.categorie}</p>
                <button class="btn-details">Voir détails</button>
            </div>
        `;

        // Ajouter l'événement pour ouvrir la modale
        card.querySelector('.btn-details').addEventListener('click', () => {
            ouvrirModale(film);
        });

        movieGrid.appendChild(card);
    });
}

// ================= 2. AFFICHER LES FAVORIS =================
function afficherFavoris() {
    favoritesGrid.innerHTML = '';

    if (filmsFavoris.length === 0) {
        favoritesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Aucun film en favoris</p>';
        return;
    }

    filmsFavoris.forEach(film => {
        const card = document.createElement('article');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="card-img">
                <img src="${film.image}" alt="${film.titre}">
            </div>
            <div class="card-content">
                <h3>${film.titre}</h3>
                <p>${film.categorie}</p>
                <button class="btn-retirer">Retirer des favoris</button>
            </div>
        `;

        // Retirer des favoris au clic
        card.querySelector('.btn-retirer').addEventListener('click', () => {
            retirerDesFavoris(film.id);
        });

        favoritesGrid.appendChild(card);
    });
}

// ================= 3. OUVRIR LA MODALE =================
function ouvrirModale(film) {
    filmSelectionnéModale = film;

    // Supprimer l'ancienne modale s'il en existe une
    const ancienneModale = document.getElementById('filmModal');
    if (ancienneModale) ancienneModale.remove();

    // Créer la modale
    const modale = document.createElement('div');
    modale.className = 'modal';
    modale.id = 'filmModal';
    modale.innerHTML = `
        <div class="modal-content">
            <button class="close-btn">✕</button>
            <div class="modal-body">
                <img src="${film.image}" alt="${film.titre}" class="modal-image">
                <div class="modal-info">
                    <h2>${film.titre}</h2>
                    <p class="modal-category"><strong>Catégorie:</strong> ${film.categorie}</p>
                    <p class="modal-description">${film.description}</p>
                    <button class="btn-favoris" id="btn-favoris-modal">Ajouter aux favoris ❤️</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modale);

    // Ajouter les styles de la modale
    ajouterStylesModale();

    // Récupérer les boutons
    const closeBtn = modale.querySelector('.close-btn');
    const btnFavoris = modale.querySelector('#btn-favoris-modal');

    // Mettre à jour le texte du bouton favoris
    mettreAJourBoutonFavoris(film, btnFavoris);

    // Ajouter/Retirer des favoris
    btnFavoris.addEventListener('click', () => {
        if (filmsFavoris.some(f => f.id === film.id)) {
            retirerDesFavoris(film.id);
        } else {
            ajouterAuxFavoris(film);
        }
        mettreAJourBoutonFavoris(film, btnFavoris);
    });

    // Fermer la modale
    closeBtn.addEventListener('click', fermerModale);

    // Fermer au clic sur le fond
    modale.addEventListener('click', (e) => {
        if (e.target === modale) fermerModale();
    });
}

// ================= 4. FERMER LA MODALE =================
function fermerModale() {
    const modale = document.getElementById('filmModal');
    if (modale) modale.remove();
    filmSelectionnéModale = null;
}

// ================= 5. AJOUTER AUX FAVORIS =================
function ajouterAuxFavoris(film) {
    if (!filmsFavoris.some(f => f.id === film.id)) {
        filmsFavoris.push(film);
        sauvegarderFavoris();
        afficherFavoris();
    }
}

// ================= 6. RETIRER DES FAVORIS =================
function retirerDesFavoris(filmId) {
    filmsFavoris = filmsFavoris.filter(f => f.id !== filmId);
    sauvegarderFavoris();
    afficherFavoris();

    // Mettre à jour le bouton si la modale est ouverte
    if (filmSelectionnéModale && filmSelectionnéModale.id === filmId) {
        const btnFavoris = document.getElementById('btn-favoris-modal');
        if (btnFavoris) {
            mettreAJourBoutonFavoris(filmSelectionnéModale, btnFavoris);
        }
    }
}

// ================= 7. METTRE À JOUR LE BOUTON FAVORIS =================
function mettreAJourBoutonFavoris(film, bouton) {
    if (filmsFavoris.some(f => f.id === film.id)) {
        bouton.textContent = 'Retirer des favoris ❤️';
        bouton.style.background = '#e11d48';
    } else {
        bouton.textContent = 'Ajouter aux favoris ❤️';
        bouton.style.background = '#e11d48';
    }
}

// ================= 8. SAUVEGARDER LES FAVORIS =================
function sauvegarderFavoris() {
    localStorage.setItem('favoris', JSON.stringify(filmsFavoris));
}

// ================= 9. FILTRER PAR CATÉGORIE =================
function filtrerParCategorie(categorie) {
    if (categorie === 'Tous') {
        afficherFilms(films);
    } else {
        const filmsFiltrés = films.filter(film => film.categorie === categorie);
        afficherFilms(filmsFiltrés);
    }
}

// ================= 10. RECHERCHER UN FILM =================
function rechercherFilm(motCle) {
    const motClé = motCle.toLowerCase();
    const filmsRecherche = films.filter(film =>
        film.titre.toLowerCase().includes(motClé) ||
        film.description.toLowerCase().includes(motClé)
    );
    afficherFilms(filmsRecherche);
}

// ================= 11. AJOUTER LES STYLES DE LA MODALE =================
function ajouterStylesModale() {
    if (document.getElementById('modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal {
            display: flex;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background: #111827;
            border-radius: 15px;
            padding: 30px;
            width: 90%;
            max-width: 700px;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid #1f2937;
        }

        .close-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            color: #ccc;
            font-size: 28px;
            cursor: pointer;
            transition: 0.3s;
        }

        .close-btn:hover {
            color: #fff;
        }

        .modal-body {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .modal-image {
            width: 100%;
            max-width: 250px;
            height: auto;
            border-radius: 10px;
            object-fit: cover;
        }

        .modal-info {
            flex: 1;
            min-width: 250px;
        }

        .modal-info h2 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            color: #fff;
        }

        .modal-category {
            font-size: 14px;
            color: #999;
            margin-bottom: 15px;
        }

        .modal-description {
            font-size: 14px;
            color: #ccc;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .btn-favoris {
            width: 100%;
            background: #e11d48;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
            font-size: 14px;
        }

        .btn-favoris:hover {
            background: #be123c;
        }

        @media (max-width: 600px) {
            .modal-content {
                width: 95%;
                padding: 20px;
            }

            .modal-body {
                flex-direction: column;
            }

            .modal-image {
                max-width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

// ================= 12. GÉRER LA NAVIGATION =================
function gererNavigation(section) {
    // Récupérer tous les conteneurs
    const header = document.querySelector('header');
    const filtersContainer = document.querySelector('.filters-container');
    const movieContainers = document.querySelectorAll('.movies-container');
    const footer = document.querySelector('footer');

    // Masquer tous les éléments par défaut
    header.style.display = 'none';
    filtersContainer.style.display = 'none';
    movieContainers.forEach(container => container.style.display = 'none');
    footer.style.display = 'none';

    // Afficher selon la section
    if (section === 'Accueil') {
        header.style.display = 'block';
        filtersContainer.style.display = 'flex';
        movieContainers[0].style.display = 'block'; // Films populaires
        movieContainers[1].style.display = 'block'; // Favoris
        footer.style.display = 'block';
        // Réinitialiser la recherche
        searchInput.value = '';
        afficherFilms(films);
    } else if (section === 'Films') {
        filtersContainer.style.display = 'flex';
        movieContainers[0].style.display = 'block';
        footer.style.display = 'block';
        searchInput.value = '';
        afficherFilms(films);
    } else if (section === 'Favoris') {
        movieContainers[1].style.display = 'block';
        footer.style.display = 'block';
    }
}

// ================= ÉVÉNEMENTS =================

// Événement: Navigation
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Retirer la classe active de tous les liens
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Ajouter la classe active au lien cliqué
        link.classList.add('active');

        // Récupérer la section
        const section = link.textContent.trim();
        gererNavigation(section);

        // Fermer la modale si elle est ouverte
        fermerModale();
    });
});

// Événement: Filtrer par catégorie
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Retirer la classe active de tous les boutons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Ajouter la classe active au bouton cliqué
        button.classList.add('active');

        // Filtrer les films
        const categorie = button.textContent.trim();
        filtrerParCategorie(categorie);
    });
});

// Événement: Rechercher en temps réel
searchInput.addEventListener('input', (e) => {
    rechercherFilm(e.target.value);
});

// Événement: Bouton "Explorer maintenant"
const btnExplorer = document.querySelector('.btn-main');
btnExplorer.addEventListener('click', () => {
    // Simuler un clic sur "Films"
    const filmsLink = document.querySelectorAll('.nav-links a')[1];
    filmsLink.click();
});

// ================= INITIALISATION =================
document.addEventListener('DOMContentLoaded', () => {
    afficherFilms(films);
    afficherFavoris();
    // Afficher les sections par défaut (Accueil)
    gererNavigation('Accueil');
});
