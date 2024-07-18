import rect from "./rect.js";
import Grid from "./Grid.js";

class border{
    constructor(x,y,context,canvas,gridContext,gridInstance){
        this.context = context;
        this.canvas = canvas;
        this.gridContext = gridContext
        this.rectArray = [];
        this.selectedColumn = ""
        this.selectedCell = ""
        this.gridInstance = gridInstance
        for(var i=0;i<=27;i++){
            var text = ""
            if(i > 0) text = String.fromCharCode('A'.charCodeAt(0) + i-1);
            this.rectArray.push(new rect(x,0,100,25,text,this.context));
            this.rectArray[this.rectArray.length-1].draw()
            x = x+100;
        }
    }
    drawTopBorder(){
        for(var i=0;i<this.rectArray.length;i++){
            this.rectArray[i].draw()
        }
    }
    colorCell(r){
        this.r = r;
        this.context.fillStyle = "rgba(0,120,215,0.3)"
        this.context.fillRect(this.r.x,this.r.y,this.r.width,this.r.height);
    }
    handleMouseDown(event){
        let arr = []
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        for(let i=0;i< this.rectArray.length;i++){
            let r = this.rectArray[i];
            if((x > r.x && x < (r.x+r.width)) && (y > r.y && (y < r.y+r.height))){
                for(let i=0;i<100;i++){
                    r.y += 50;
                    this.colorCell(r)
                    arr.push(r)
                }
                break
            }
        }
        return arr
    }
    // handleMouseDown(event){
    //     const rect = this.canvas.getBoundingClientRect();
    //     const x = event.clientX - rect.left;
    //     const y = event.clientY - rect.top;
    //     // console.log(rect);
    //     for(let i=0;i< this.rectArray.length;i++){
    //         let r = this.rectArray[i];
    //         if((x > r.x && x < (r.x+r.width)) && (y > r.y && (y < r.y+r.height))){
    //             console.log(r.x+" "+r.y+" "+r.width+" "+r.height)
    //             if(r.text.match(/[A-Z]/i)){
    //                 console.log("columnBorder")
    //                 this.selectColumn(r)
    //                 this.selectedColumn = r;
    //             }else{
    //                 console.log("grid")
    //                 this.selectedCell = r;
    //             }
    //             break
    //         }
    //     }
    // }
    // select(r){ 
    //     this.r = r;
    //     this.gridContext.fillStyle = "rgba(0,120,215,0.3)"
    //     this.gridContext.fillRect(this.r.x-100,this.r.y,this.r.width,50);
    // }
    // deSelect(selectCell,cellOrNot=0){
    //     this.cell = selectCell;
    //     if(cellOrNot) this.cell.x+=100 
    //     this.gridContext.clearRect(this.cell.x-100,this.cell.y,this.cell.width,50);
    //     this.gridContext.rect(this.cell.x,this.cell.y,this.cell.width,50);
    //     this.context.stroke();
    //     this.gridContext.fillStyle = "black"
    // }
    // selectColumn(r){
    //     if(this.selectedColumn == ""  && this.gridInstance.selectedCell == ""){
    //         this.r = r;
    //         for(let i=0;i<100;i++){
    //             this.select(this.r)
    //             this.r.y += 50;
    //         }
    //         this.selectedColumn = this.r
    //     }else if(this.gridInstance.selectedCell){
    //         this.deSelect(this.gridInstance.selectedCell,1);
    //         this.gridInstance.selectedCell = ""
    //         this.selectColumn(r)
    //     }else{
    //         this.selectedColumn.y = 0
    //         for(let i=0;i<100;i++){
    //             this.deSelect(this.selectedColumn)
    //             this.selectedColumn.y += 50;
    //         }
    //         this.selectedColumn = ""
    //         this.selectColumn(r)
    //     }
        
    // }

}
export default border;