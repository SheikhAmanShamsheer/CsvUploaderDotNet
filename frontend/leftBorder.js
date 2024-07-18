import rect from "./rect.js";

class border{
    constructor(x,y,context){
        this.context = context
        this.rectArray = [];
        for(let i=0;i<1000;i++){
            this.rectArray.push(new rect(0,y,100,50,i,this.context));
            y = y+50;
            this.rectArray[this.rectArray.length-1].draw()
        }
    }
    drawLeftBorder(){
        for(let i=0;i<this.rectArray.length;i++){
            this.rectArray[i].draw()
        }
    }
}
export default border;