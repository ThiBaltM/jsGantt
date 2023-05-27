//largeur du canvas
let largeur = 800;
// hauteur du canvas
let hauteur = 600;
let couleur="#FFFFFF";
var canvas = initCanvas(largeur, hauteur, couleur);
var diagramme = new Diagramme(canvas, largeur, hauteur);

let addTaskBtn = document.getElementById("addTaskBtn");
let showCriticBtn = document.getElementById("showCriticBtn");
let projectBar = document.getElementById("projectBar");
let supprBtn = document.getElementById("supprBtn");
supprBtn.addEventListener("click", function f(){diagramme.supprCurrent()})
showCriticBtn.addEventListener("click", function f0(){diagramme.showCritic = !diagramme.showCritic; diagramme.updateDisplay()})
projectBar.addEventListener("change", function f1(){diagramme.updateDisplay()})
addTaskBtn.addEventListener( "click", function f2(){diagramme.addTask()});
canvas.addEventListener( "mousedown", e =>diagramme.tryDragTask(e));
canvas.addEventListener( "mousemove", e =>diagramme.dragTask(e));
canvas.addEventListener( "mouseup", e =>diagramme.releaseTask(e));
