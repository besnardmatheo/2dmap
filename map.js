const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paramètres de la carte
const tileSize = 16;          // Taille d'origine de chaque tuile
const zoomFactor = 2;         // Facteur de zoom (multiplier la taille par 2)
const displayTileSize = tileSize * zoomFactor; // Taille affichée de chaque tuile après zoom
const mapWidth = 26;          // Largeur de la carte en tuiles
const mapHeight = 26;         // Hauteur de la carte en tuiles
canvas.width = mapWidth * displayTileSize; // Largeur du canvas avec zoom
canvas.height = mapHeight * displayTileSize; // Hauteur du canvas avec zoom

// Charger le spritesheet des textures de sol
const grassTiles = new Image();
grassTiles.src = 'assets/Ground/Grass.png'; // Assurez-vous que le fichier est dans le bon répertoire

// Paramètres du spritesheet (5 textures de 16x16 pixels sur une seule ligne)
const textures = {
    water: 0,         // Index pour l'eau
    lightGrass: 1,    // Index pour l'herbe claire
    darkGrass: 2,     // Index pour l'herbe foncée
    path1: 3,         // Index pour le premier chemin
    path2: 4          // Index pour le second chemin
};

// Création d'une carte prédéfinie (tableau 2D de 26x26)
const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Ligne d'eau
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], // Bordure herbe claire
    [0, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 0], // Mélange herbe foncée
    [0, 1, 2, 3, 3, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 2, 2, 1, 0], // Chemin mélangé
    [0, 1, 2, 3, 4, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 2, 2, 1, 1, 0], // Chemins variés
    [0, 1, 2, 3, 4, 4, 4, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 2, 2, 1, 0], // Chemins en haut
    [0, 1, 1, 1, 4, 4, 1, 1, 2, 2, 2, 1, 1, 3, 3, 1, 1, 3, 1, 1, 2, 2, 1, 1, 1, 0], // Herbe mélangée
    [0, 1, 1, 1, 4, 1, 1, 1, 2, 2, 2, 2, 2, 1, 3, 3, 3, 1, 1, 1, 1, 2, 1, 1, 1, 0], // Zone d'herbe centrale
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], // Herbe claire
    [0, 2, 2, 2, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 2, 2, 2, 1, 1, 0], // Chemin central
    [0, 2, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0], // Bordure avec herbe foncée
    [0, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 3, 3, 1, 1, 1, 2, 3, 2, 1, 1, 0], // Chemins croisés
    [0, 2, 3, 1, 1, 3, 1, 1, 1, 1, 3, 3, 3, 1, 3, 1, 1, 3, 1, 1, 2, 3, 1, 1, 1, 0], // Herbe foncée
    [0, 2, 2, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 2, 2, 1, 1, 1, 0], // Ligne centrale
    [0, 2, 2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 2, 2, 1, 1, 1, 0], // Zone dégagée
    [0, 1, 2, 3, 3, 1, 1, 3, 3, 1, 1, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 2, 2, 1, 1, 0], // Autour des chemins
    [0, 1, 2, 2, 2, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 0], // Herbe mixée
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], // Herbe claire
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Ligne d'eau
];

// Fonction pour dessiner la carte une fois le spritesheet chargé
grassTiles.onload = function () {
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const tile = map[y][x];  // Obtenir la valeur de la tuile

            // Si la tuile est valide (éviter undefined)
            if (tile !== undefined) {
                ctx.drawImage(
                    grassTiles,                              // Image source (spritesheet)
                    tile * tileSize, 0,                      // Position de la texture dans le spritesheet
                    tileSize, tileSize,                      // Taille de la texture
                    x * displayTileSize, y * displayTileSize, // Position sur le canvas avec zoom
                    displayTileSize, displayTileSize          // Taille affichée après zoom
                );
            }
        }
    }
};
