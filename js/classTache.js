function s4(){
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function guid() {
    return s4() + s4() + '-' + s4()+ s4() + '-' + s4() + s4();
}


class Tache {
    constructor (diagramme, name, desc, duree, predecesseurs = [], color = null, successeurs = []) {
        this.diagramme = diagramme;
        this.id = guid();
        this.name = name;
        this.desc = desc;
        this.duree = parseFloat(duree);
        this.origin = 0
        this.dta = undefined
        this.predecesseurs = predecesseurs;
        this.successeurs = successeurs;

        //collision rectangle
        this.rectX;
        this.rectY;
        this.rectWidth;
        this.rectHeight;

        if(color == null){
            let colors = [
                "#fad390",
                "#f8c291",
                "#6a89cc",
                "#82ccdd",
                "#b8e994", 
                "#f6b93b",
                "#4a69bd",
                "#60a3bc",
                "#78e08f",
                "#fa983a",
                "#1e3799",
                "#3c6382",
                "#38ada9",
                "#e58e26",
                "#0c2461",
                "#0a3d62",
                "#079992"
            ];
            let random = Math.floor(Math.random() * colors.length);
            this.color = colors[random];
        }else{
            this.color = color;
        }
    }

    calculOrigin(){
        let tmp = this.origin;
        this.origin = 0;
        if(this.predecesseurs.length !=0){
            for(let c=0; c<this.predecesseurs.length; c++){
                let o = this.diagramme.actualTabTasks.get(this.predecesseurs[c]);
                if(o==undefined){
                    this.origin = tmp;
                    return this.origin
                }
                let tmpOrigin = o.calculOrigin() + o.duree
                if(tmpOrigin > this.origin){
                    this.origin = tmpOrigin
                }
            }
        }
        return this.origin
    }

    calculDTO(){
        this.calculOrigin();
        return this.origin;
    }

    calculDTA(dta, reset=false){
        console.log('test', this.dta, dta, dta < this.dta || this.dta ==null || reset)
        if(dta < this.dta || this.dta ==null || reset){
            this.dta = dta

            this.predecesseurs.forEach(e=>{
                let task = this.diagramme.actualTabTasks.get(e)
                if(task==undefined){
                    return
                }
                console.log(this, "appelle", e, this.dta-this.duree)
                task.calculDTA(this.dta - this.duree)
            })
        }
    }

    calculMargeLibre(){
        if(this.successeurs.length ==0){
            return this.diagramme.maxDTA-this.duree-this.origin
        }else{
            let min = undefined
            this.successeurs.forEach(e=>{
                let task = this.diagramme.actualTabTasks.get(e)
                if(min==undefined || min > task.origin){
                    min = task.origin
                }
            })
            console.log(min, this.duree, this.origin)
            return min - this.duree - this.origin
        }
    }
    calculMargeTotale(){
        if(this.successeurs.length==0){
            return this.dta-this.duree-this.origin
        }
        let min = 0
        this.successeurs.forEach(e=>{
            let task = this.diagramme.actualTabTasks.get(e)
            let tmp = task.calculMargeTotale()
            if(min == undefined || tmp < min ){
                min = tmp
            }
        })
        return min+this.dta-this.duree-this.origin
    }

    calculPos(index){
        this.rectX = this.origin*this.diagramme.unitDay + this.diagramme.leftMargin;
        this.rectY =  index*(this.diagramme.unitHeight+this.diagramme.margin);
        this.rectWidth = this.duree*this.diagramme.unitDay;
        this.rectHeight = this.diagramme.unitHeight;
    }

    dispTask(ctx){
        if(this.diagramme.showCritic && this.origin+this.duree == this.dta){
            ctx.fillStyle = "#eb1717";
            ctx.fillRect(this.rectX-2, this.rectY-2, this.rectWidth+4, this.rectHeight+4);
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.rectX, this.rectY, this.rectWidth, this.rectHeight);
        this.predecesseurs.forEach(element => {
            let preced = this.diagramme.tabTasks.get(element)
            if(preced == undefined){
                return
            }
            ctx.strokeStyle = preced.color
            ctx.lineWidth = 3
            
            ctx.beginPath()
            ctx.moveTo(this.rectX, this.rectY+this.rectHeight/2)
            ctx.lineTo(preced.rectX+preced.rectWidth/1.5, preced.rectY+preced.rectHeight/2)
            ctx.stroke()
            
        });
        
        if(this.rectHeight > 20){
            ctx.fillStyle = '#ffffff'
            ctx.fillText(this.name, this.rectX+5, this.rectY+15, this.rectWidth-10)
        }
    }

}