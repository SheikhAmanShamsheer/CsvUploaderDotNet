import rect from "./rect.js";
import Util from "./utils.js"
class Grid{
    constructor(x,y,context,canvas){
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.context = context;
        this.utils = new Util()
        this.rectArray = [];
        this.nheight = Math.ceil(5000/this.utils.cellHeight);
        this.nwidth = Math.ceil(2700/this.utils.cellWidth);
        this.total = this.nheight*this.nwidth;
        this.startX = this.x;
        this.selectedCell = ""
        this.start = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.end = new rect(-1,-1,this.utils.cellWidth,this.utils.cellHeight,"",this.context)
        this.isSelecting = 0;
        this.data = []
        // for(let i=0;i<this.total;i++){
        //     if(this.x > canvas.width){
        //         this.x = this.startX;
        //         this.y = this.y+this.utils.cellHeight;
        //     }
        //     this.rectArray.push(new rect(this.x,this.y,this.utils.cellWidth,this.utils.cellHeight,i+1,this.context));
        //     this.x = this.x+this.utils.cellWidth;
        // }
        // console.log(this.rectArray)
    }
    setStartAndEnd(x,y){
        this.start.x = x;
        this.end.x = x;
        this.start.y = y;
        this.end.y = y;
    }
    
    createRectFromData(data){
        if(data != null){
            let x = 0;
            let y = 0;
            let width = 100;
            let height = 50;
            for(let i=0;i<data.length;i++){
                x = 0;
                for(let j=0;j<data[i].length;j++){
                    this.rectArray.push(new rect(x,y,width,height,data[i][j],this.context))
                    x += 100;
                }
                while(x < this.canvas.width){
                    this.rectArray.push(new rect(x,y,width,height,"",this.context))
                    x += 100;
                }
                y+=50
            }
            console.log(this.rectArray)
        }
        
    }
    createRectDefault(){
        for(let i=0;i<this.total;i++){
            if(this.x > canvas.width){
                this.x = this.startX;
                this.y = this.y+this.utils.cellHeight;
            }
            this.rectArray.push(new rect(this.x,this.y,this.utils.cellWidth,this.utils.cellHeight,"",this.context));
            this.x = this.x+this.utils.cellWidth;
        }
    }
    drawGrid(data){
        if(data != null){
            this.createRectFromData(data)
        }else{
            this.createRectDefault()
        }
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        for(var i=0;i<this.rectArray.length;i++){
            // if(this.start.x != -1 || this.end.x != -1){
                // if(this.end.x == -1){
                //     this.end.x = this.start.x;
                //     this.end.y = this.start.y;
                // }
                if((this.rectArray[i].x >= this.start.x && this.rectArray[i].x <= (this.end.x)) && (this.rectArray[i].y >= this.start.y && (this.rectArray[i].y < this.end.y+this.utils.cellHeight))||
                (this.rectArray[i].y >= this.end.y && this.rectArray[i].y <= this.start.y  && this.rectArray[i].x >= this.start.x && this.rectArray[i].x <= this.end.x)||
                (this.rectArray[i].x <= this.start.x && this.rectArray[i].x >= this.end.x && this.rectArray[i].y >= this.start.y && this.rectArray[i].y <= this.end.y)||
                (this.rectArray[i].x <= this.start.x && this.rectArray[i].x >= this.end.x && this.rectArray[i].y <= this.start.y && this.rectArray[i].y >= this.end.y)){
                    this.colorCell(this.rectArray[i])
                    // sum += parseInt(this.rectArray[i].text)
                }
                this.rectArray[i].draw()
            // }else{
            //     this.rectArray[i].draw()
            // }
        }
    }
    drawGridArray(arr){
        console.log("arr: ",arr)
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        let sum = 0
        for(var i=0;i<arr.length;i++){
            this.colorCell(arr[i])
            if(arr[i] != null) {
                arr[i].draw()
                sum += parseInt(arr[i].text)
            }
                
        }
        this.drawGrid()
    }  
    drawGridArrayIncrease(arr,factor,r,data){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        for(let i=0;i<this.rectArray.length;i++){
            if(arr.includes(this.rectArray[i])){
                this.rectArray[i].width += factor;
            }else if(this.rectArray[i].x+this.rectArray[i].width >= (r.x)) {
                this.rectArray[i].x += factor;
            }

        }
        this.drawGrid()
    }
    drawGridCell(event){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        let f = this.findCell(this.end.x,this.end.y)
        let nextX = 0;
        let nextY = 0;
        if(event.key == "ArrowUp" && f.y != 0 ){
            nextX = f.x;
            nextY = f.y - this.utils.cellHeight;
        }else if(event.key == "ArrowDown" && f.y != this.canvas.height){
            nextX = f.x;
            nextY = f.y + this.utils.cellHeight;
        }else if(event.key == "ArrowLeft" && f.x != 0){
            nextX = f.x - f.width
            nextY = f.y;
        }else if(event.key == "ArrowRight" && f.x != this.canvas.width){
            nextX = f.x + f.width
            nextY = f.y;
        }else{
            nextX = f.x;
            nextY = f.y
        }
        
        let next = this.findCell(nextX,nextY)
        this.start.x = next.x;
        this.start.y = next.y;
        this.end.x = next.x;
        this.end.y = next.y;
        this.drawGrid()
        return [this.start,this.end]
    }

    findSelectedRow(selectedR){
        let arr = []
        console.log("selected: ",selectedR)
        for(let i=0;i<this.rectArray.length;i++){
            if(this.rectArray[i].x == selectedR.x-100){
                arr.push(this.rectArray[i]);
            }
        }
        return arr
    }

    findCell(x,y){
        for(let i=0;i< this.rectArray.length;i++){
            let r = this.rectArray[i];
            if((x >= r.x && x <= (r.x+r.width)) && (y >= r.y && (y <= r.y+r.height))){
                return r
            }
        }
    }
    
    handleMouseDown(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.offsetX;
        const y = event.offsetY;
        this.isSelecting = 1;
        let found = this.findCell(x,y)
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
            return [this.start,this.end]
        }else{
            return []
        }
    }
    handleMouseUp(event){
        if(this.isSelecting){
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            let found = this.findCell(x,y)
            this.end.x = found.x
            this.end.y = found.y
            this.isSelecting = 0;
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.drawGrid()
            return [this.start,this.end]
            // this.start = undefined
            // this.end = undefined
        }else{
            return []
        }
    }
    
    colorCell(r){
        this.r = r;
        this.context.fillStyle = "rgba(0,120,0,0.3)"
        this.context.fillRect(this.r.x,this.r.y,this.r.width,this.r.height);
    }
    
    handleDoubleClick(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let f = this.findCell(x,y);
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
            
            if(input.value.length > 15){
                input.value = input.value.substring(0,this.utils.cellWidth/12)
                input.value += "..."
            }
            cell.text = input.value;
            document.body.removeChild(input);
        });
    
        
    }

    
}
export default Grid;