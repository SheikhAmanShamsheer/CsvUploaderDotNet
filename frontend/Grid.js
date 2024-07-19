import rect from "./rect.js";

class Grid{
    constructor(x,y,context,canvas){
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.context = context;
        this.rectArray = [];
        this.nheight = Math.ceil(5000/50);
        this.nwidth = Math.ceil(2700/100);
        this.total = this.nheight*this.nwidth;
        this.startX = this.x;
        this.selectedCell = ""
        this.start = new rect(-1.-1,100,50,"",this.context)
        this.end = new rect(-1.-1,100,50,"",this.context)
        this.isSelecting = 0;
        for(let i=0;i<this.total;i++){
            if(this.x > canvas.width){
                this.x = this.startX;
                this.y = this.y+50;
            }
            this.rectArray.push(new rect(this.x,this.y,100,50,i+1,this.context));
            this.x = this.x+100;
        }
    }
    setStartAndEnd(x,y){
        this.start.x = x;
        this.end.x = x;
        this.start.y = y;
        this.end.y = y;
    }
    drawGrid(){
        for(var i=0;i<this.rectArray.length;i++){
            if(this.start != undefined && this.end != undefined){
                if((this.rectArray[i].x >= this.start.x && this.rectArray[i].x <= (this.end.x)) && (this.rectArray[i].y >= this.start.y && (this.rectArray[i].y < this.end.y+50))||
                (this.rectArray[i].y >= this.end.y && this.rectArray[i].y <= this.start.y  && this.rectArray[i].x >= this.start.x && this.rectArray[i].x <= this.end.x)||
                (this.rectArray[i].x <= this.start.x && this.rectArray[i].x >= this.end.x && this.rectArray[i].y >= this.start.y && this.rectArray[i].y <= this.end.y)||
                (this.rectArray[i].x <= this.start.x && this.rectArray[i].x >= this.end.x && this.rectArray[i].y <= this.start.y && this.rectArray[i].y >= this.end.y)){
                    this.colorCell(this.rectArray[i])
                }
                this.rectArray[i].draw()
            }else{
                this.rectArray[i].draw()
            }
        }

    }
    drawGridArray(arr){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        // this.start = new rect(-1.-1,100,50,"",this.context)
        // this.end = new rect(-1.-1,100,50,"",this.context)
        this.drawGrid()
        let sum = 0
        for(var i=0;i<arr.length;i++){
            this.colorCell(arr[i])
            arr[i].draw()
            sum += parseInt(arr[i].text)
        }
    }  
    drawGridCell(event){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        console.log("end: ",this.end.x,this.end.y)
        let f = this.findCell(this.end.x,this.end.y)
        console.log("f: ",f)
        let nextX = 0;
        let nextY = 0;
        if(event.key == "ArrowUp" && f.y != 0 ){
            nextX = f.x;
            nextY = f.y-50;
        }else if(event.key == "ArrowDown" && f.y != 4950){
            nextX = f.x;
            nextY = f.y+50;
        }else if(event.key == "ArrowLeft" && f.x != 0){
            nextX = f.x-100;
            nextY = f.y;
        }else if(event.key == "ArrowRight" && f.x != 2500){
            nextX = f.x+100;
            nextY = f.y;
        }else{
            nextX = f.x;
            nextY = f.y
        }
        
        let next = this.findCell(nextX,nextY)
        console.log("next ",next)
        // console.log(next)
        this.start.x = next.x;
        this.start.y = next.y;
        this.end.x = next.x;
        this.end.y = next.y;
        this.drawGrid()

    }
    
    findCell(x,y){
        for(let i=0;i< this.rectArray.length;i++){
            let r = this.rectArray[i];
            if((x >= r.x && x < (r.x+r.width)) && (y >= r.y && (y < r.y+r.height))){
                return r
            }
        }
    }
    
    handleMouseDown(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.isSelecting = 1;
        let found = this.findCell(x,y)
        console.log(found)
        this.start.x = found.x
        this.start.y = found.y
        // this.colorCell(found)
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawGrid()
    }
    handleMouseMove(event){
        if(this.isSelecting == 1){
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            let found = this.findCell(x,y)
            this.end.x = found.x
            this.end.y = found.y
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.drawGrid()
        }
    }
    handleMouseUp(event){
        if(this.isSelecting){
            console.log("moved Up")
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            // console.log(x,y);
            let found = this.findCell(x,y)
            this.end.x = found.x
            this.end.y = found.y
            this.isSelecting = 0;
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.drawGrid()
            // this.start = undefined
            // this.end = undefined
        }
    }
    
    colorCell(r){
        this.r = r;
        this.context.fillStyle = "rgba(0,120,215,0.3)"
        this.context.fillRect(this.r.x,this.r.y,this.r.width,this.r.height);
    }
    handleDoubleClick(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let f = this.findCell(x,y);
        console.log("db",f);
        this.createInputField(f);
    }
    
    createInputField(cell) {
        const rect = this.canvas.getBoundingClientRect();
        const input = document.createElement("input");
        input.type = "text";
        input.value = cell.text;
        input.style.position = "absolute";
        input.style.left = `${cell.x+100 }px`;
        input.style.top = `${cell.y+25}px`;
        input.style.width = `${cell.width }px`;
        input.style.height = `${cell.height }px`; 
        input.style.fontSize = "12px"; 
        input.style.border = "1px solid #rgb(221,221,221)";
        input.style.boxSizing = "border-box";
        document.body.appendChild(input);
        input.focus();
        input.select();
        input.addEventListener("focus", () => {
            input.style.borderColor = "red";
        });
        
        input.addEventListener("blur", () => {
            cell.text = input.value;
            document.body.removeChild(input);
        });
    
        
    }

    
}
export default Grid;