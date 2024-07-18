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
        this.start = ""
        this.end = ""
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
        console.log("Drawing gird array")
        for(var i=0;i<arr.length;i++){
            console.log(arr[i])
            arr[i].draw()
        }

    }   

    findCell(x,y){
        for(let i=0;i< this.rectArray.length;i++){
            let r = this.rectArray[i];
            if((x > r.x && x < (r.x+r.width)) && (y > r.y && (y < r.y+r.height))){
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
        this.start = found
        this.colorCell(found)
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawGrid()
    }
    handleMouseMove(event){
        if(this.isSelecting == 1){
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.end = this.findCell(x,y)
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
            this.end = this.findCell(x,y)
            this.isSelecting = 0;
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.drawGrid()
            this.start = undefined
            this.end = undefined
        }
    }
    // selectCell(r){
    //     if(this.selectedCell == ""){
    //         this.r = r;
    //         this.selectedCell = r;
    //         this.context.fillStyle = "rgba(0,120,215,0.3)"
    //         this.context.fillRect(this.r.x,this.r.y,this.r.width,this.r.height);
    //     }else{
    //         this.r = r;
    //         this.context.clearRect(this.selectedCell.x,this.selectedCell.y,this.selectedCell.width,this.selectedCell.height);
    //         this.context.rect(this.selectedCell.x,this.selectedCell.y,this.selectedCell.width,this.selectedCell.height);
    //         this.context.fillStyle = "black"
    //         this.context.stroke();
    //         this.context.font = "16px Arial";
    //         this.context.textAlign = "center";
    //         this.context.textBaseline = "middle";
    //         this.context.fillText(this.selectedCell.text, this.selectedCell.x + this.selectedCell.width / 2, this.selectedCell.y + this.selectedCell.height / 2)
    //         this.context.fillStyle = "rgba(0,120,215,0.3)"
    //         this.context.fillRect(this.r.x,this.r.y,this.r.width,this.r.height);
    //         this.selectedCell = this.r;
    //     }
    // }
    colorCell(r){
        this.r = r;
        this.context.fillStyle = "rgba(0,120,215,0.3)"
        this.context.fillRect(this.r.x,this.r.y,this.r.width,this.r.height);
    }
    handleDoubleClick(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.createInputField(this.findCell(x,y));
    }
    // dragStart(event){
    //     const rect = this.canvas.getBoundingClientRect();
    //     const x = event.clientX - rect.left;
    //     const y = event.clientY - rect.top;
    //     this.start = this.findCell(x,y)
    // }
    // dragEnd(event){
    //     const rect = this.canvas.getBoundingClientRect();
    //     const x = event.clientX - rect.left;
    //     const y = event.clientY - rect.top;
    //     this.end = this.findCell(x,y)
    //     console.log("Start: "+this.start.x+" "+this.start.y+" "+this.start.text)
    //     console.log("end: "+this.end.x+" "+this.end.y+" "+this.end.text)
    //     this.drawGrid()
    // }
    
    createInputField(cell) {
        const rect = this.canvas.getBoundingClientRect();
        const input = document.createElement("input");
        input.type = "text";
        input.value = cell.text;
        input.style.position = "absolute";
        input.style.left = `${cell.x+rect.left }px`;
        input.style.top = `${cell.y+rect.top}px`;
        input.style.width = `${cell.width }px`;
        input.style.height = `${cell.height }px`; 
        input.style.fontSize = "12px"; 
        input.style.border = "1px solid #rgb(221,221,221)";
        input.style.boxSizing = "border-box";
        
        input.addEventListener("focus", () => {
            input.style.borderColor = "red";
        });
        
        input.addEventListener("blur", () => {
            cell.text = input.value;
            document.body.removeChild(input);
        });
    
        document.body.appendChild(input);
        input.focus();
        input.select();
    }

    
}
export default Grid;