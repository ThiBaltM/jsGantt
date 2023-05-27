class Diagramme {
    constructor (canvas, largeur, hauteur) {
        this.canvas = canvas;
        this.screenWidth = largeur;
        this.screenHeight = hauteur;
        this.unitDay = 100;
        this.unitHeight = 50;
        this.margin = (this.screenHeight - this.bottomMargin)/ 70
        this.tabTasks = new OrderedMap();
        this.actualTabTasks = new OrderedMap()
        this.maxDTA=0;
        this.draggedTask = null;
        this.dragging=false;
        this.tmpLine = null;
        this.leftMargin = 20;
        this.bottomMargin = 40;
        this.maxDta = 0;
        this.showCritic = false;
    }

    addTask(){
        let tabPreced = []
        let inputTaskName = document.getElementById("inputNameTask");
        let inputTaskDuree = document.getElementById("inputDuree");
        let selectTaskPreced = document.getElementById("selectPreced");
        let option;
        for (let i=0; i<selectTaskPreced.length; i++){
            option = selectTaskPreced.options[i];
            if(option.selected){
                tabPreced.push(option.value);
            }
        }
        let task = new Tache(this, inputNameTask.value, inputDescTask.value, inputDuree.value, tabPreced);
        for (let i=0; i<tabPreced.length; i++){
            console.debug(this.tabTasks.get(tabPreced[i]))
            this.tabTasks.get(tabPreced[i]).successeurs.push(task.id);
        }
        this.tabTasks.set(task.id, task);
        this.actualTabTasks.set(task.id, task);
        selectTaskPreced.options[selectTaskPreced.length] = new Option(task.name, task.id);

        this.checkPos()
        
    }

    checkPos(){
        this.calculDTs()
        //calcul units
        if(this.tabTasks.size() < 13){
            this.unitHeight = (this.screenHeight - this.bottomMargin)/ 14;
        }else{
            let unit= (this.screenHeight - this.bottomMargin)/ this.tabTasks.size();
            this.unitHeight = unit - unit/6
        }
        this.margin = this.unitHeight/5;
        if(this.maxDTA <9){
            this.unitDay = (this.screenWidth-2*this.leftMargin)/10
        }else{
            this.unitDay = (this.screenWidth-2*this.leftMargin)/this.maxDTA
        }
        
        
        this.updateDisplay();
        
        document.getElementById('projectBar').max = this.maxDTA
    }

    supprCurrent(){
        if(!this.dragging && this.draggedTask != null){
            this.draggedTask.predecesseurs.forEach(e=>{
                let t = this.actualTabTasks.get(e)
                let tmp = []
                t.successeurs.forEach(e1=>{
                    if(e1 != this.draggedTask.id){
                        tmp.push(e1)
                    }
                })
                t.successeurs = tmp
            })
            this.draggedTask.successeurs.forEach(e=>{
                let t = this.actualTabTasks.get(e)
                let tmp1 = []
                t.predecesseurs.forEach(e1=>{
                    if(e1 != this.draggedTask.id){
                        tmp1.push(e1)
                    }
                })
                t.predecesseurs = tmp1
                console.log(tmp1, t.predecesseurs)
            })
            this.actualTabTasks.delete(this.draggedTask.id)
            this.tabTasks = this.actualTabTasks
            this.checkPos()

            let oldOption = document.querySelector('option[value="'+this.draggedTask.id+'"]');
            oldOption.parentNode.removeChild(oldOption);

            this.draggedTask = null
        }
    }
    
    calculDTs(){

        let lastTasks = []

        //calcul DTOs
        let maxDTA = 0;
        Array.from(this.tabTasks.values()).forEach(e =>{
            if(e.successeurs.length == 0){
                e.calculOrigin();
                console.log(e)
                lastTasks.push(e)
                if(e.origin+e.duree > maxDTA){
                    maxDTA = e.origin+e.duree
                    
                }
            }
        })
        this.maxDTA=0
        console.log("initialisation")
        console.log(lastTasks)
        this.resetDta()
        lastTasks.forEach(e1 =>{
            e1.calculDTA(maxDTA, true)
            if(this.maxDTA < e1.dta){
                this.maxDTA =  e1.dta
            }
        })

        


    }


    resetDta(){
        this.actualTabTasks.values().forEach(e=>{
            e.dta = undefined;
        })
    }

    updateDisplay(){
        
        ctx.fillStyle = '#dfe7e6';
        ctx.fillRect(0,0, this.screenWidth, this.screenHeight);
        

        //draw unit line
        ctx.strokeStyle = '#2b2c2c'
        ctx.fillStyle='#2b2c2c'
        ctx.lineWidth = 3
        
        ctx.beginPath()
        ctx.moveTo(this.leftMargin, this.screenHeight-this.bottomMargin/1.5)
        ctx.lineTo(this.screenWidth-this.leftMargin, this.screenHeight-this.bottomMargin/1.5)
        let cUnit=0;
        while(cUnit*this.unitDay<=this.screenWidth-this.leftMargin*2){
            ctx.moveTo(this.leftMargin+cUnit*this.unitDay, this.screenHeight-this.bottomMargin/1.5 -3);
            ctx.lineTo(this.leftMargin+cUnit*this.unitDay, this.screenHeight-this.bottomMargin/1.5 +3);
            ctx.fillText(cUnit.toString(), this.leftMargin+cUnit*this.unitDay-3, this.screenHeight-this.bottomMargin/1.5+15)
            cUnit ++;
        }
        ctx.stroke()

        //get starting point
        let c=0;
        Array.from(this.tabTasks.values()).forEach(e =>{
            e.calculPos(c);
            c++;
        })
        //draw tasks
        ctx = this.canvas.getContext('2d');
        Array.from(this.tabTasks.values()).forEach(e =>{
            e.dispTask(ctx, c);
        })
        //draw dragged task
        if(this.dragging){
            ctx.fillStyle=this.draggedTask.color;
            ctx.fillRect(0,this.tmpLine*(this.margin+this.unitHeight)-(this.margin/2)-2, 100, 4)
        }

        //draw advance rect

        let advance = document.getElementById('projectBar').value
        ctx.fillStyle = "gray"
        ctx.globalAlpha = 0.5
        ctx.fillRect(this.leftMargin, 0, advance*this.unitDay,this.screenHeight-this.bottomMargin)
        ctx.stroke()
        ctx.globalAlpha = 1

    }

    tryDragTask(e){

        let x=e.clientX- canvas.getBoundingClientRect().left;
        let y=e.clientY- canvas.getBoundingClientRect().top;

        this.tabTasks.values().forEach(task => {
            //test collision
            if(
                task.rectX<x && x<task.rectX+task.rectWidth 
                && task.rectY<y && y<task.rectY+task.rectHeight
            ){
                this.draggedTask = task;
                this.actualTabTasks = this.tabTasks;
                this.dragging=true;
                this.tabTasks.delete(task.id);
                this.tmpLine = Math.floor(y/(this.unitHeight+this.margin));

                //update task fields
                document.getElementById('inputDTO').value = task.origin
                document.getElementById('inputDTA').value = task.dta
                document.getElementById('inputML').value = task.calculMargeLibre()
                document.getElementById('inputMT').value = task.calculMargeTotale()
                document.getElementById('inputName').value = task.name;
                document.getElementById('inputDesc').value = task.desc;
                document.getElementById('inputDuration').value = task.duree
            }
        })
        this.updateDisplay();
    }

    dragTask(e){
        if(this.dragging){
            let y=e.clientY- canvas.getBoundingClientRect().top;
            this.tmpLine = Math.floor(y/(this.unitHeight+this.margin));
            if(this.tmpLine > this.tabTasks.size()){
                this.tmpLine = this.tabTasks.size()
            }
            this.updateDisplay();
        }
    }

    releaseTask(e){
        if(this.dragging){
            this.dragging =false;
            this.tabTasks.set(this.draggedTask.id, this.draggedTask, this.tmpLine)
            this.actualTabTasks = this.tabTasks;
            this.tmpLine = null;
            this.updateDisplay();
        }
    }

}