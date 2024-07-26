import rect from "./rect.js";

class GridFromLines{
    constructor(canvas,context){
        this.context = context;
        this.canvas = canvas
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 30;
        this.grid = []
        this.top = []
        this.left = []
        this.selectedCells = []
        this.start = new rect(-1,-1,this.width,this.height,"",this.context);
        this.end = new rect(-1,-1,this.width,this.height,"",this.context);
        this.isSelecting = 0; 
        this.isIncreasing = 0;
        this.widthArray = []
        this.heightArray = []
        this.numberOfCells = (this.canvas.width/this.width)*(this.canvas.height/this.height);
        this.gridData = new Array(this.numberOfCells).fill(0);
        this.s = new rect(-1,-1,this.width,this.height,"",this.context);
        this.detector = 0;
        this.factor = 0;
        this.found = new rect(-1,-1,this.width,this.height,"",this.context);
        this.initailX = 0;
    }
    drawGrid(){
        let letters = 0;
        let left = 0;
        let k = 0;
        this.grid = []
        this.top = []
        this.left = []

        for(let i=0;i<this.canvas.height;i+=this.height){
            let j = 0;
            while(j <= this.canvas.width){
                let text = ""
                if(i == 0){
                    if(this.top.length != 0){
                        text = String.fromCharCode('A'.charCodeAt(0) + letters++);
                    }
                    this.top.push(new rect(j,i,this.widthArray[j],this.heightArray[i],text,this.context))
                }else if(j == 0){
                    this.left.push(new rect(j,i,this.widthArray[j],this.heightArray[i],++left,this.context))
                }
                else{
                    this.grid.push(new rect(j,i,this.widthArray[j],this.heightArray[i],String(this.gridData[k++]),this.context))
                }
                j += this.width;
            }
        }
    }
    drawCanvas(factor=0){
        // console.log("draw")
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawLines(factor);
        this.drawGrid();
        this.drawTop();
        this.drawLeft();
        this.drawData();
    }
    drawLines(factor=0){
        let x = 0;
        let y = 0;
        while(x <= this.canvas.width){
            this.context.strokeStyle = "rgb(196,199,197)";
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(x,this.canvas.height);
            this.context.stroke();
            if(this.widthArray[x] == undefined){
                this.widthArray[x] = this.width;
            }else{
                this.widthArray[x] += factor;
            }
            x += this.widthArray[x];
        }
        x = 0;
        while(y <= this.canvas.height){
            this.context.strokeStyle = "rgb(196,199,197)";
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(this.canvas.width,y);
            this.context.stroke();
            this.heightArray[y] = this.height;
            y += this.heightArray[y];
        }
    }
    drawData(){
        for(let i=0;i<this.grid.length;i++){
            let wt = this.textWrap(this.grid[i].text);
            this.grid[i].draw(wt);
        }
    }
    drawTop(){
        for(let i=0;i<this.top.length;i++){
            this.top[i].draw();
        }
    }
    drawLeft(){
        for(let i=0;i<this.left.length;i++){
            this.left[i].draw();
        }
    }
    find(x,y,arr){
        for(let i=0;i< arr.length;i++){
            let r = arr[i];
            if((x >= r.x && x <= (r.x+r.width)) && (y >= r.y && (y <= r.y+r.height))){
                return [r,i]
            }
        }
    }
    findCell(x,y){
        if(x >= 100 && y > 30){
            return this.find(x,y,this.grid);
        }else if(x > 100 && y < 30){
            return this.find(x,y,this.top);
        }else{
            return this.find(x,y,this.left);
        }
    }
    selectEntireColumn(cell){
        let selectedColumn = [];
        let y = this.height;
        while(y <= this.canvas.height){
            for(let i=0;i<this.grid.length;i++){
                if(cell.x == this.grid[i].x && y == this.grid[i].y){
                    selectedColumn.push(this.grid[i]);
                }
            }
            y += this.height;
        }
        return selectedColumn;
    }
    selectEntireRow(cell){
        let selectedRow = [];
        let x = this.width;
        while(x <= this.canvas.width){
            for(let i=0;i<this.grid.length;i++){
                if(x == this.grid[i].x && cell.y == this.grid[i].y){
                    selectedRow.push(this.grid[i]);
                }
            }
            x += this.width;
        }
        return selectedRow;
    }
    
    drawCell(cell){
        this.context.strokeStyle ="rgb(0,0,255)"
        this.context.beginPath();
        this.context.rect(cell.x, cell.y, cell.width, cell.height);
        this.context.stroke();
    }
    drawGridCells(cell){
        this.context.fillStyle = "rgba(14,101,235,0.1)";
        this.context.beginPath();
        this.context.fillRect(cell.x, cell.y, cell.width, cell.height);
        this.context.fillStyle = "black" // for converting the text color back to black 
    }
    drawSelectedCells(cells){
        for(let i=0;i<cells.length;i++){
            // *** for blue border ***
            // this.context.strokeStyle ="rgb(0,0,255)"
            // this.context.beginPath();
            // this.context.rect(cells[i].x, cells[i].y, cells[i].width, cells[i].height);
            // this.context.stroke();
            // *** for blue border end ***

            this.context.fillStyle = "rgba(14,101,235,0.1)";
            this.context.beginPath();
            this.context.fillRect(cells[i].x, cells[i].y, cells[i].width, cells[i].height);
            this.context.fillStyle = "black" // for converting the text color back to black 

            // *** for filling text ****
            // this.context.fillStyle = "white";
            // this.context.font = "16px Arial";
            // this.context.textAlign = "center";
            // this.context.textBaseline = "middle";
            // this.context.fillText(cells[i].text, cell.x + cell.width / 2, cell.y + cell.height / 2);
            // this.context.fillStyle = "black";
            // *** for filling text end ****
            this.context.stroke();
        }
    }
    drawSelectedGrid(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawCanvas()
        if(this.end.x == -1) this.end = this.start;
        if(this.start == this.end ){
            this.drawCell(this.start);
        }else{
            let first = 0;
            let g = []
            for(let i=0;i<this.grid.length;i++){
                if((this.grid[i].x >= this.start.x && this.grid[i].x <= (this.end.x)) && (this.grid[i].y >= this.start.y && (this.grid[i].y < this.end.y+this.height))||
                (this.grid[i].y >= this.end.y && this.grid[i].y <= this.start.y  && this.grid[i].x >= this.start.x && this.grid[i].x <= this.end.x)||
                (this.grid[i].x <= this.start.x && this.grid[i].x >= this.end.x && this.grid[i].y >= this.start.y && this.grid[i].y <= this.end.y)||
                (this.grid[i].x <= this.start.x && this.grid[i].x >= this.end.x && this.grid[i].y <= this.start.y && this.grid[i].y >= this.end.y)){
                    if(first == 0){
                        this.drawCell(this.start);
                        first++;
                    }
                    g.push(this.grid[i]);
                    this.drawGridCells(this.grid[i])
                }
            }
            
            
            let topLeft = new rect(-1,-1,this.width,this.height,"",this.context);
            let topRight = new rect(-1,-1,this.width,this.height,"",this.context);
            let bottomLeft = new rect(-1,-1,this.width,this.height,"",this.context);
            let bottomRight = new rect(-1,-1,this.width,this.height,"",this.context)
            
            let numberOfColumns = 0;
            let numberOfRows = 0;
            if(this.start.x == this.end.x && this.start.y < this.end.y){
                this.drawGridLines(this.start.x,this.start.y,this.start.x+100,this.start.y);
                this.drawGridLines(this.start.x+100,this.start.y,this.end.x+100,this.end.y+30);
                this.drawGridLines(this.end.x,this.end.y+30,this.end.x+100,this.end.y+30)
                this.drawGridLines(this.end.x,this.end.y+30,this.start.x,this.start.y)
                
            }else if(this.start.x < this.end.x && this.start.y < this.end.y){
                topLeft = this.start;
                bottomRight = this.end;
                numberOfColumns = ((bottomRight.x-topLeft.x)/this.width)+1;
                numberOfRows = ((bottomRight.y-topLeft.y)/this.height)+1;
                topRight = new rect(topLeft.x+(numberOfColumns*this.width),topLeft.y,0,0,"",this.context);
                bottomLeft = new rect(topLeft.x,topLeft.y+(numberOfRows*this.height),0,0,"",this.context);
                this.drawGridLines(topLeft.x, topLeft.y,topRight.x,topRight.y);
                this.drawGridLines(topLeft.x,topLeft.y,bottomLeft.x,bottomLeft.y);
                this.drawGridLines(bottomLeft.x,bottomLeft.y,bottomRight.x+this.width,bottomRight.y+this.height);
                this.drawGridLines(topRight.x,topRight.y,bottomRight.x+this.width,bottomRight.y+this.height)
            }else if(this.start.x > this.end.x && this.start.y > this.end.y){
                bottomRight = this.start;
                topLeft = this.end;
                numberOfColumns = ((bottomRight.x-topLeft.x)/this.width)+1;
                numberOfRows = ((bottomRight.y-topLeft.y)/this.height)+1;
                topRight = new rect(topLeft.x+(numberOfColumns*this.width),topLeft.y,0,0,"",this.context);
                bottomLeft = new rect(topLeft.x,topLeft.y+(numberOfRows*this.height),0,0,"",this.context);
                this.drawGridLines(topLeft.x, topLeft.y,topRight.x,topRight.y);
                this.drawGridLines(topLeft.x,topLeft.y,bottomLeft.x,bottomLeft.y);
                this.drawGridLines(bottomLeft.x,bottomLeft.y,bottomRight.x+this.width,bottomRight.y+this.height);
                this.drawGridLines(topRight.x,topRight.y,bottomRight.x+this.width,bottomRight.y+this.height)
            }else if(this.start.x > this.end.x && this.start.y < this.end.y){
                topRight = this.start;
                bottomLeft = this.end;
                numberOfColumns = ((topRight.x-bottomLeft.x)/this.width)+1;
                numberOfRows = ((topRight.y-bottomLeft.y)/this.height)+1;
                bottomRight = new rect(bottomLeft.x+(numberOfColumns*this.width),bottomLeft.y,0,0,"",this.context);
                topLeft = new rect(bottomLeft.x,bottomLeft.y+(numberOfRows*this.height),0,0,"",this.context);
                this.drawGridLines(topRight.x+this.width,topRight.y,topLeft.x, topLeft.y-this.height);
                this.drawGridLines(topLeft.x,topLeft.y-this.height,bottomLeft.x,bottomLeft.y+this.height);
                this.drawGridLines(bottomLeft.x,bottomLeft.y+this.height,bottomRight.x,bottomRight.y+this.height);
                this.drawGridLines(topRight.x+this.width,topRight.y,bottomRight.x,bottomRight.y+this.height)
            }else{
                bottomLeft = this.start;
                topRight = this.end;
                numberOfColumns = ((topRight.x-bottomLeft.x)/this.width)+1;
                numberOfRows = ((topRight.y-bottomLeft.y)/this.height)+1;
                bottomRight = new rect(bottomLeft.x+(numberOfColumns*this.width),bottomLeft.y,0,0,"",this.context);
                topLeft = new rect(bottomLeft.x,bottomLeft.y+(numberOfRows*this.height),0,0,"",this.context);
                this.drawGridLines(topRight.x+this.width,topRight.y,topLeft.x, topLeft.y-this.height);
                this.drawGridLines(topLeft.x,topLeft.y-this.height,bottomLeft.x,bottomLeft.y+this.height);
                this.drawGridLines(bottomLeft.x,bottomLeft.y+this.height,bottomRight.x,bottomRight.y+this.height);
                this.drawGridLines(topRight.x+this.width,topRight.y,bottomRight.x,bottomRight.y+this.height)
            }
        }
        
    }
    drawGridLines(startX,startY,endX,endY){
        this.context.strokeStyle = "blue";
        this.context.beginPath();
        this.context.moveTo(startX,startY);
        this.context.lineTo(endX,endY);
        this.context.stroke();
    }
    drawVirtualLine(startX,startY,endX,endY){
        this.context.strokeStyle = "grey";
        this.context.beginPath();
        this.context.moveTo(startX,startY);
        this.context.lineTo(endX,endY);
        this.context.stroke();
    }
    drawCellBorder(cell){
        this.drawCanvas()
        this.context.fillStyle = "blue"
        this.context.strokeStyle = "rgb(255,255,255)"
        this.context.beginPath();
        this.context.fillRect(cell.x, cell.y, cell.width, cell.height);
        this.context.fillStyle = "white";
        this.context.font = "16px Arial";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText(cell.text, cell.x + cell.width / 2, cell.y + cell.height / 2);
        this.context.fillStyle = "black";
        this.context.stroke();
        let se = null;
        if(cell.x >= 100 && cell.y < 30){
            se = this.selectEntireColumn(cell);
        }else{
            se = this.selectEntireRow(cell);
        }
        this.start.x = se[0].x;
        this.start.y = se[0].y;
        this.drawSelectedCells(se);
    }
    handleMouseDown(event){
        this.drawCanvas()
        const x = event.offsetX;
        const y = event.offsetY;
        let a = this.findCell(x,y);
        let found = a[0];
        if(x >= found.x+this.width-20 && x <= found.x+this.width-2){
            this.isIncreasing = 1;
        }else{
            this.canvas.style.cursor = "pointer";
        }
        let i = a[1];
        if(found.x >= 100 && found.y >= 30){
            this.isSelecting = 1;
            this.start.x = found.x;
            this.start.y = found.y;
            this.drawSelectedGrid();
        }else {
            this.drawCellBorder(found)
        }
    }

    handleMouseMove(event){
        const rect = this.canvas.getBoundingClientRect();
        // console.log(event.offsetX,event.offsetY)
        const x = event.offsetX;
        const y = event.offsetY;
        let a = this.find(x,y,this.top);
        if(a != null){
            this.found = a[0];
            let i = a[1];
            if((x >= this.found.x+this.width-20 && x <= this.found.x+this.width-2)|| this.isIncreasing == 1){
                this.canvas.style.cursor = "col-resize";
                if(this.isIncreasing == 1){
                    if(this.detector == 0){
                        this.s.x = this.found.x;
                        this.s.y = this.found.y
                        this.initailX = this.found.x;
                        this.detector = 1;
                    }
                    let factor = x-(this.s.x);
                    if(factor < 0){
                        factor = -factor;
                    }
                    // console.log(`${x}-${this.s.x+this.s.width} = ${factor}`);
                    this.s.x += factor;
                    console.log(this.s.x);
                    this.drawCanvas()
                    this.drawVirtualLine(this.s.x,this.s.y,this.s.x,this.canvas.width);
                }
            }else{
                this.canvas.style.cursor = "pointer";
            }
        }else{
            this.canvas.style.cursor = "pointer";
        }
        if(this.isSelecting){
            this.drawCanvas()
            const x = event.offsetX;
            const y = event.offsetY;
            let a = this.findCell(x,y);
            let found = a[0];
            let i = a[1];
            if(found.x >= 100 && found.y >= 30){
                this.end = found;
            }
            this.drawSelectedGrid();
        }
    }
    handleMouseUp(){
        this.isSelecting = 0;
        this.isIncreasing = 0;
        this.detector = 0;
        console.log("starting top cell: ",this.widthArray[this.initailX]);
        console.log("difference: ",this.s.x-this.initailX);
        this.drawCanvas(this.s.x-this.initailX)
        this.start = new rect(-1,-1,this.width,this.height,"",this.context)
        this.end = new rect(-1,-1,this.width,this.height,"",this.context)
    }

    handleDoubleClick(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let a = this.findCell(x,y);
        let found = a[0];
        let i = a[1];
        this.createInputField(found,i);
    }
    

    textWrap(text){
        if(text.length >= 13){
            let showValue = text.substring(0,5);
            showValue += "..."
            return showValue;
        }
        return text;
    }

    createInputField(cell,index) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = cell.text;
        input.style.position = "absolute";
        input.style.left = `${cell.x }px`;
        input.style.top = `${cell.y}px`;
        input.style.width = `${cell.width }px`;
        input.style.height = `${cell.height }px`; 
        input.style.fontSize = "12px"; 
        input.style.border = "1px solid #rgb(221,221,221)";
        input.style.boxSizing = "border-box";
        document.body.appendChild(input);
        input.focus();
        input.select();
        
        input.addEventListener("blur", () => {
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.gridData[index] = input.value;
            document.body.removeChild(input);
            this.drawCanvas()
        });
    
        
    }

}

export default GridFromLines;