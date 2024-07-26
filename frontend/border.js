import rect from "./rect.js";
import Util from "./utils.js"

class border{
    constructor(x,y,context,canvas,gridContext,gridInstance){
        this.context = context;
        this.canvas = canvas;
        this.gridContext = gridContext
        this.rectArray = [];
        this.gridInstance = gridInstance
        this.isIncreasing = false;
        this.utils = new Util()
        this.start = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.end = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        for(var i=0;i<27;i++){
            var text = ""
            if(i > 0) text = String.fromCharCode('A'.charCodeAt(0) + i-1);
            this.rectArray.push(new rect(x,0,this.utils.cellWidth,this.utils.topCellheight,text,this.context));
            this.rectArray[this.rectArray.length-1].draw()
            x = x+this.utils.cellWidth;
        }
    }
    drawTopBorder(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        for(var i=0;i<this.rectArray.length;i++){
            if((this.rectArray[i].x >= this.start.x && this.rectArray[i].x <= this.end.x) || (this.rectArray[i].x <= this.start.x && this.rectArray[i].x >= this.end.x)){
                this.colorCell(this.rectArray[i])
            }
            this.rectArray[i].draw()
        }
    }
    drawTopBorderFactor(factor,r){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        for(var i=0;i<this.rectArray.length;i++){
            if((this.rectArray[i].x > this.start.x && this.rectArray[i].x < this.end.x) || (this.rectArray[i].x < this.start.x && this.rectArray[i].x > this.end.x)){
                this.colorCell(this.rectArray[i])
            }
            if(r.text != this.rectArray[i].text && this.rectArray[i].x >= r.x){
                this.rectArray[i].x += factor
            }
            // else{
            //     this.rectArray[i].width += factor
            // }
            this.rectArray[i].draw()
        }
    }
    drawSelectedBorder(se){
        if(se.length > 0){
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.start.x = se[0].x+100;
            this.start.y = se[0].y;
            this.end.x = se[1].x+100;
            this.end.y = se[1].y;
            this.drawTopBorder()
        }
    }
    unsetTopBorder(){
        this.start = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.end = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawTopBorder()
    }
    setTopBorder(start,end){
        this.start = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.end = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawTopBorder()
    }
    findCell(x,y){
        for(let i=0;i< this.gridInstance.rectArray.length;i++){
            let r = this.gridInstance.rectArray[i];
            if((x >= r.x && x <= (r.x+r.width)) && (y >= r.y && (y <= r.y+r.height))){
                return r
            }
        }
    }
    colorCell(r){
        this.r = r;
        this.context.fillStyle = "rgba(0,120,0,0.3)"
        this.context.fillRect(this.r.x,this.r.y,this.r.width,this.r.height);
    }
    colorTopCell(r){
        this.r = r;
        // this.context.fillStyle = "rgba(0,120,215,0.3)"
        this.context.fillStyle = "black"
        this.context.fillRect(this.r.x,this.r.y,this.r.width,this.r.height);
        this.drawTopBorder()
    }
    
    findCellTopBorderRange(x,y){
        for(let i=0;i< this.rectArray.length;i++){
            let r = this.rectArray[i];
            if((x >= (r.x+r.width-10) && x <= (r.x+r.width-2)) && (y >= r.y && (y <= r.y+r.height))){
                return r
            }
        }
        return null
    }
    handleMouseUp(){
        this.isIncreasing = false
    }
    increaseCellWidth(){

    }
    handleMouseDown(event){
        let arr = []
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let selectedR = undefined;
        let dx = x;
        let dy = y;
        for(let i=0;i< this.rectArray.length;i++){
            let r = this.rectArray[i];
            if((x >= (r.x+r.width-10) && x <= (r.x+r.width-2)) && (y >= r.y && (y <= r.y+r.height))){
                this.isIncreasing = true
                selectedR = r;
                return [selectedR,"increasing"]
            }
            if((x >= r.x && x <= (r.x+r.width)) && (y >= r.y && (y <= r.y+r.height))){
                // let startX = r.x
                // let startY = 50
                // this.gridInstance.setStartAndEnd(r.x-this.utils.cellWidth,0)
                // for(let i=0;i<100;i++){
                //     let f = this.findCell(startX,startY);
                //     arr.push(f)
                //     startY += f.height;
                // }
                return [r,"selecting"]
                // break
            }
        }
        // if(selectedR == undefined){
        //     return arr
        // }else{
        //     return [arr,selectedR]
        // }
    }

    


    drawGridCell(cell){
        const span = document.createElement("span");
        span.textContent = cell.text;
        span.style.position = "absolute";
        span.style.width = `${this.utils.cellWidth}px`;
        span.style.height = `${this.utils.topCellheight}px`;
        span.style.backgroundColor = "#fff";
        span.style.border = "1px solid #ddd";
        span.style.padding = "2px";
        span.style.paddingLeft = `${45}px`
        span.style.boxSizing = "border-box";
        span.style.zIndex = 1000;
        span.style.border = "2px solid blue"
        span.style.left = `${cell.x}px`;
        span.style.top = `${cell.y}px`;
        
        document.body.appendChild(span);

        span.addEventListener("mouseleave", () => {
            document.body.removeChild(span);
        });
        span.addEventListener("click",(event)=>{
            let arr = this.handleMouseDown(event)
            this.gridInstance.drawGridArray(arr)
        })
    }

    hoverMouse(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        for(let i=0;i< this.rectArray.length;i++){
            let r = this.rectArray[i];
            if((x > r.x && x < (r.x+r.width)) && (y > r.y && (y < r.y+r.height))){
                this.drawGridCell(r)
            }
        }
    }


}
export default border;