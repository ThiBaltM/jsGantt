function initCanvas(largeur, hauteur, couleur){

    // Je créé un pointeur vers le canvas de la page HTML
    let canvas = document.getElementById('canvas');
    // Je précise la largeur du canvas
    canvas.setAttribute('width', largeur); 
    // Je précise la longueur du canvas
    canvas.setAttribute('height', hauteur);
    // Je récupère le contexte du canvas
    ctx = canvas.getContext('2d');
    // Je définis une couleur (passée en paramètre) pour le dessin
    ctx.fillStyle = 'lightgrey';
    // Je remplis la surface avec cette couleur
    ctx.fillRect(0,0, largeur, hauteur);

    return canvas;
}
