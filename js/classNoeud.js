class Noeud{
    constructor(valeur=null, suivant=null){
        this.valeur = valeur;
        this.suivant = suivant;
    }
}

class NoeudDouble{
    constructor(valeur=null, suivant=null, precedent = null){
        this.valeur = valeur;
        this.suivant = suivant;
        this.precedent = precedent;
    }
}