class Liste{
    constructor(){
        this.longueur =0;
        this.entete = new Noeud();
    }
    
    Push(val){
        if(this.longueur == 0){
            this.entete.valeur = val;
        }
        else{
            var tmp = this.entete;
            while(tmp.suivant != null){
                tmp = tmp.suivant;
            }
            tmp.suivant = new Noeud(val);
        }
        this.longueur++;
        return this.longueur;
    }

    PushNode(node){
        if(this.longueur == 0){
        this.entete = node;
    }
    else{
        var tmp = this.entete;
        while(tmp.suivant != null){
            tmp = tmp.suivant;
        }
        tmp.suivant = node;
    }
    this.longueur++;
    return this.longueur;
    }

    ToArray(){
        if(this.longueur == 0){
            return [];
        }
        let tmp = this.entete;
        let res =[tmp.valeur];
        let index = 0
        while(tmp.suivant != null){
            tmp = tmp.suivant;
            index ++;
            res[index] = tmp.valeur;
        }
        return res;
    }
    Reverse(){
        if(this.longueur == 0){
            return [];
        }
        let tmp = this.entete;
        let res =[tmp.valeur];
        let index = 0
        while(tmp.suivant != null){
            tmp = tmp.suivant;
            index ++;
            res[index] = tmp.valeur;
        }
        return res.reverse();
    }

    GetItem(i){
        if(i>=this.longueur){
            throw   "Index out of range";
        }else{
            let tmp = this.entete;
            for(let k=0; k<i; k++){
                tmp = tmp.suivant;
            }
            return tmp.valeur;
        }
    }

    GetNode(i){
        if(i>=this.longueur){
            throw   "Index out of range";
        }else{
            let tmp = this.entete;
            for(let k=0; k<i; k++){
                tmp = tmp.suivant;
            }
            return tmp;
        }
    }

    Suppr(val){
        //cas particuliers
        if(this.entete.valeur == val){ 
            this.entete = this.entete.suivant;
            if(this.entete == null){
                this.entete = new Noeud();
            }
            this.longueur --;
            return
        }
        if( this.longueur >0 && this.entete.suivant.valeur == val){
            this.entete.suivant = this.entete.suivant.suivant;
            this.longueur --;
            return
        }
        if(this.longueur>1 && this.entete.suivant.suivant.valeur == val){
            this.entete.suivant.suivant = this.entete.suivant.suivant.suivant;
            this.longueur --;
            return
        }
        //si la valeur n'est pas dans les 3 premiers champs
        let tmp1,tmp2;
        tmp1 = this.entete;
        tmp2 = tmp1.suivant;
        while(tmp2.suivant != null){
            tmp1 = tmp1.suivant
            tmp2 = tmp2.suivant;
            if(tmp2.valeur == val){
                //suppression de la valeur
                tmp1.suivant = tmp2.suivant;
                this.longueur --;
                return;
            }
        }
        console.error("not found")
        //la valeur n'a pas été trouvée
        return;
    }
}