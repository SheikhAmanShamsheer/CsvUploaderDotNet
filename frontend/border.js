import rect from "./rect.js";

class border{
    constructor(x,y,context,canvas,gridContext,gridInstance){
        this.context = context;
        this.canvas = canvas;
        this.gridContext = gridContext
        this.rectArray = [];
        this.gridInstance = gridInstance
        for(var i=0;i<27;i++){
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
    
    findCell(x,y){
        for(let i=0;i< this.gridInstance.rectArray.length;i++){
            let r = this.gridInstance.rectArray[i];
            if((x >= r.x && x <= (r.x+r.width)) && (y >= r.y && (y <= r.y+r.height))){
                return r
            }
        }
    }
    findCellTopBorder(x,y){
        for(let i=0;i< this.rectArray.length;i++){
            let r = this.rectArray[i];
            if((x >= r.x && x <= (r.x+r.width)) && (y >= r.y && (y <= r.y+r.height))){
                return r
            }
        }
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
                let startY = 50
                // this.gridInstance.start.x = r.x;
                // this.gridInstance.start.y = 0
                // this.gridInstance.end.x = r.x;
                // this.gridInstance.end.y = 0
                this.gridInstance.setStartAndEnd(r.x-100,0)
                for(let i=0;i<100;i++){
                    let f = this.findCell(startX,startY);
                    arr.push(f)
                    startY += 50
                }
                break
            }
        }
        return arr
    }

    drawGridCell(cell){
        const span = document.createElement("span");
        span.textContent = cell.text;
        span.style.position = "absolute";
        span.style.width = `${100}px`;
        span.style.height = `${25}px`;
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