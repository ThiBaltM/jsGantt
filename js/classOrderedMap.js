class MapCell{
    constructor(key, value){
        this.key = key;
        this.value = value;
    }
}
class OrderedMap{
    constructor(){
        this.cells = new Liste();
    }
    
    size(){
        return this.cells.longueur;
    }

    get(key, node=false){
        for(let a=0; a< this.cells.longueur;a++){
            let cell = this.cells.GetItem(a)
            if(cell.key == key){
                if(node){
                    return cell
                }
                return cell.value;
            }
        }
        return undefined;
    }

    set(key, value, place=null){
        if(place != null){
            if(place > this.cells.length || place < 0){
                console.error("try to add out of range");
            }else{
            let tmp = []
            for(let i=place; i<this.size(); i++ ){
                tmp.push(this.cells.GetItem(i))
            }
            tmp.forEach(element => {
                this.cells.Suppr(element)
            });
            this.cells.Push(new MapCell(key, value))
            tmp.forEach(element => {
                this.cells.Push(element)
            });
            }
        }else{
            this.cells.Push(new MapCell(key, value));
        }
    }

    delete(key){
        this.cells.Suppr(
            this.get(key, true)
        );
    }

    values(){
        let res = [];
        this.cells.ToArray().forEach(cell =>{
            res.push(cell.value);
        })
        return res;
    }

    keys(){
        let res = [];
        this.cells.forEach(cell =>{
            res.push(cell.key);
        })
        return res;
    }
}