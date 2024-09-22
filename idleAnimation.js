const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensions du canvas
canvas.width = 200;
canvas.height = 200;

// Charger le spritesheet d'Arthax
const sprite = new Image();
sprite.src = 'assets/Arthax.png'; // Assurez-vous que le fichier est dans le dossier "assets"

// Paramètres du spritesheet
const spriteWidth = 16;   // Largeur de chaque frame dans le spritesheet
const spriteHeight = 16;  // Hauteur de chaque frame dans le spritesheet
const totalFrames = 5;    // Nombre de frames dans la ligne "idle"
let frameX = 0;           // Index de la frame actuelle (défilement horizontal dans les colonnes)
let frameY = 0;           // Index de la ligne pour l'animation idle (ligne 1, indexée à 0)
const fps = 10;           // Images par seconde
let frameCount = 0;       // Compteur de frames pour ralentir l'animation

// Fonction d'animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas avant de redessiner

    // Dessiner Arthax à une position fixe (centré) avec la frame actuelle
    ctx.drawImage(
        sprite,                           // Image source (spritesheet)
        frameX * spriteWidth,             // Position X de la frame dans le spritesheet
        frameY * spriteHeight,            // Position Y de la frame dans le spritesheet (ligne 1)
        spriteWidth, spriteHeight,        // Taille de la frame
        (canvas.width - spriteWidth) / 2, // Position X dans le canvas (centrée)
        (canvas.height - spriteHeight) / 2, // Position Y dans le canvas (centrée)
        spriteWidth, spriteHeight         // Taille dans le canvas
    );

    // Augmenter le compteur de frames pour ralentir l'animation
    frameCount++;
    if (frameCount > (60 / fps)) {  // Contrôler le taux de rafraîchissement (fps)
        frameX = (frameX + 1) % totalFrames; // Passer à la frame suivante dans la ligne
        frameCount = 0; // Réinitialiser le compteur
    }

    // Demande une nouvelle frame d'animation
    requestAnimationFrame(animate);
}

// Lancer l'animation une fois le spritesheet chargé
sprite.onload = function () {
    animate();
};
