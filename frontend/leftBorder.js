import rect from "./rect.js";
import Util from "./utils.js";
class leftBorder{
    constructor(x,y,context,canvas,gridInstance){
        this.gridInstance = gridInstance
        this.context = context
        this.canvas = canvas
        this.rectArray = [];
        this.utils = new Util()
        this.start = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.end = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        for(let i=0;i<1000;i++){
            this.rectArray.push(new rect(0,y,100,50,i,this.context));
            y = y+50;
            this.rectArray[this.rectArray.length-1].draw()
        }
    }
    colorCell(r){
        this.r = r;
        // this.context.fillStyle = "rgba(0,120,215,0.3)"
        this.context.fillStyle = "rgba(0,120,0,0.3)"
        this.context.fillRect(this.r.x,this.r.y,this.r.width,this.r.height);
    }
    
    drawLeftBorder(){
        
        for(let i=0;i<this.rectArray.length;i++){
            if((this.rectArray[i].y >= this.start.y && this.rectArray[i].y <= this.end.y)||(this.rectArray[i].y <= this.start.y && this.rectArray[i].y >= this.end.y)){
                this.colorCell(this.rectArray[i])
            }
            this.rectArray[i].draw()
        }
    }
    unsetLeftBorder(){
        this.start = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.end = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.context.clearRect(0,100,this.canvas.width,this.canvas.height)
        this.drawLeftBorder()
    }
    // setLeftBorder(s,e){
    //     this.start = s
    //     this.end = e
    //     this.context.clearRect(0,100,this.canvas.width,this.canvas.height)
    //     this.drawLeftBorder()
    // }
    findCell(x,y){
        for(let i=0;i< this.gridInstance.rectArray.length;i++){
            let r = this.gridInstance.rectArray[i];
            if((x >= r.x && x <= (r.x+r.width)) && (y >= r.y && (y <= r.y+r.height))){
                return r
            }
        }
    }
    drawSelectedLeftBorder(se){
        if(se.length > 0){
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.start.x = se[0].x;
            this.start.y = se[0].y;
            this.end.x = se[1].x;
            this.end.y = se[1].y;
            this.drawLeftBorder()
        }
        
    }
    drawGridCell(cell){
        const span = document.createElement("span");
        span.textContent = cell.text;
        span.style.position = "absolute";
        span.style.width = `${100}px`;
        span.style.height = `${50}px`;
        span.style.backgroundColor = "#fff";
        span.style.border = "1px solid #ddd";
        span.style.padding = "2px";
        span.style.paddingLeft = `${45}px`
        span.style.paddingTop = `${15}px`
        span.style.boxSizing = "border-box";
        span.style.zIndex = 1000;
        span.style.border = "2px solid blue"
        span.style.left = `${cell.x}px`;
        span.style.top = `${cell.y+25}px`;
        
        document.body.appendChild(span);

        span.addEventListener("mouseleave", () => {
            document.body.removeChild(span);
        });
        span.addEventListener("click",(event)=>{
            let arr = this.handleMouseDown(event)
            this.gridInstance.drawGridArray(arr)
        })
    }
    handleMouseDown(event){
        let arr = []
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        for(let i=0;i< this.rectArray.length;i++){
            let r = this.rectArray[i];
            if((x > r.x && x < (r.x+r.width)) && (y > r.y && (y < r.y+r.height))){
                let startX = r.x
                let startY = r.y+50
                this.gridInstance.setStartAndEnd(r.x,r.y)
                for(let i=0;i<27;i++){
                    let f = this.findCell(startX,startY);
                    arr.push(f)
                    startX += 100
                }
                break
            }
        }
        return arr
    }
    hoverMouseTop(event){
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
export default leftBorder;