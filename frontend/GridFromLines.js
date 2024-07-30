import rect from "./rect.js";

class GridFromLines{
    constructor(canvas,context,data){
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
        this.numberOfCells = (this.canvas.width/this.width)*(this.canvas.height/this.height)+500;
        this.data = data;
        this.singleDataLength = data[0].length;
        this.gridData = []
        if(this.data == []){
            this.gridData = new Array(this.numberOfCells).fill(" "); // .map((numberOfCells, i) => numberOfCells + i);
        }else{
            this.data  = this.data.flat(1);
            let k = 0;
            this.gridData = new Array(this.numberOfCells).fill(" ")
            for(let i=0;i<this.data.length;i++){
                let og = this.data[i];
                if(i % this.singleDataLength == 0 && i != 0) k += 14;
                this.gridData[k] = og;
                k++;
            }
            // console.log("gridData: ",this.gridData)
        }
        this.widthArray = new Array(this.numberOfCells).fill(100)
        this.heightArray = new Array(this.numberOfCells).fill(30)
        this.s = new rect(-1,-1,this.width,this.height,"",this.context);
        this.detector = 0;
        this.factor = 0;
        this.found = new rect(-1,-1,this.width,this.height,"",this.context);
        this.initailX = 0;
        this.drawGrid()
    }
    updateGrid(){
        if(this.factor != 0){
            for(let i=0;i<this.top.length;i++){
                if(this.top[i].x == this.initailX){
                    this.top[i].width += this.factor;
                }
                if(this.top[i].x > this.initailX){
                    this.top[i].x += this.factor;
                }
            }
            for(let i=0;i<this.grid.length;i++){
                if(this.grid[i].x == this.initailX){
                    this.grid[i].width += this.factor;
                }
                if(this.grid[i].x > this.initailX){
                    this.grid[i].x += this.factor;
                }
            }
        }
    }
    drawGrid(){
        let letters = 0;
        let left = 0;
        let k = 0;
        for(let i=0;i<this.canvas.height;i+=this.height){
            let j = 0;
            while(j <= this.canvas.width){
                let text = ""
                if(i == 0){
                    if(this.top.length != 0){
                        text = String.fromCharCode('A'.charCodeAt(0) + letters++);
                    }
                    let x = j ,y=i;
                    this.top.push(new rect(x,y,this.widthArray[j],this.heightArray[i],text,this.context))
                }else if(j == 0){
                    this.left.push(new rect(j,i,this.widthArray[j],this.heightArray[i],++left,this.context))
                }
                else{
                    let x = j ,y=i;
                    this.grid.push(new rect(x,y,this.widthArray[j],this.heightArray[i],this.gridData[k++],this.context))
                }
                j += this.width;
            }
        }
    }
    drawCanvas(increasing = 0){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawLines(increasing);
        this.drawTop();
        this.drawLeft();
        this.drawData();
        // requestAnimationFrame(this.drawCanvas)
    }
    drawLines(increasing = 0){
        let x = 0;
        let y = 0;
        while(x <= this.canvas.width){
            this.context.strokeStyle = "rgb(196,199,197)";
            this.context.beginPath();
            this.context.moveTo(x+0.5, y);
            this.context.lineTo(x+0.5,this.canvas.height);
            this.context.stroke();
            if(this.factor != "a" && x == this.initailX && increasing){
                this.widthArray[x] += this.factor;
            }
            x += this.widthArray[x];
        }
        x = 0;
        while(y < this.canvas.height){
            this.context.strokeStyle = "rgb(196,199,197)";
            this.context.beginPath();
            this.context.moveTo(x, y+0.5);
            this.context.lineTo(this.canvas.width,y+0.5);
            this.context.stroke();
            y += this.heightArray[y];
        }
    }
    drawData(){
        if(this.gridData[0] == " "){
            for(let i=0;i<this.gridData.length;i++){
                let wt = this.textWrap(this.gridData[i]);
                this.grid[i].draw(wt);
            }
        }else{
            for(let i=0;i<this.gridData.length;i++){
                let wt = this.textWrap(this.gridData[i]);
                try{
                    this.grid[i].draw(wt);
                }catch(e){

                }
            }
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
        // while(y <= this.canvas.height){
            for(let i=0;i<this.grid.length;i++){
                if(cell.x == this.grid[i].x ){  // && y == this.grid[i].y
                    selectedColumn.push(this.grid[i]);
                }
            }
        //     y += this.height;
        // }
        return selectedColumn;
    }
    selectEntireRow(cell){
        let selectedRow = [];
        let x = this.widthArray[cell.x];
        // while(x <= this.canvas.width){
        for(let i=0;i<this.grid.length;i++){
            if(cell.y == this.grid[i].y){
                selectedRow.push(this.grid[i]);
            }
        }
        //     x += this.widthArray[this.grid[x].x];
        // }
        console.log("selectedRow: ",selectedRow)
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
                numberOfColumns = ((bottomRight.x-topLeft.x)/this.width)+1;  // change this.width with total width
                numberOfRows = ((bottomRight.y-topLeft.y)/this.height)+1;
                topRight = new rect(topLeft.x+(numberOfColumns*this.width),topLeft.y,0,0,"",this.context);  // change this.width with total width
                bottomLeft = new rect(topLeft.x,topLeft.y+(numberOfRows*this.height),0,0,"",this.context);
                this.drawGridLines(topLeft.x, topLeft.y,topRight.x,topRight.y);
                this.drawGridLines(topLeft.x,topLeft.y,bottomLeft.x,bottomLeft.y);
                this.drawGridLines(bottomLeft.x,bottomLeft.y,bottomRight.x+this.widthArray[bottomRight.x],bottomRight.y+this.height);
                this.drawGridLines(topRight.x,topRight.y,bottomRight.x+this.widthArray[bottomRight.x],bottomRight.y+this.height)
            }else if(this.start.x > this.end.x && this.start.y > this.end.y){
                bottomRight = this.start;
                topLeft = this.end;
                numberOfColumns = ((bottomRight.x-topLeft.x)/this.width)+1;  // change this.width with total width
                numberOfRows = ((bottomRight.y-topLeft.y)/this.height)+1;
                topRight = new rect(topLeft.x+(numberOfColumns*this.width),topLeft.y,0,0,"",this.context);  // change this.width with total width
                bottomLeft = new rect(topLeft.x,topLeft.y+(numberOfRows*this.height),0,0,"",this.context);
                this.drawGridLines(topLeft.x, topLeft.y,topRight.x,topRight.y);
                this.drawGridLines(topLeft.x,topLeft.y,bottomLeft.x,bottomLeft.y);
                this.drawGridLines(bottomLeft.x,bottomLeft.y,bottomRight.x+this.widthArray[bottomRight.x],bottomRight.y+this.height);
                this.drawGridLines(topRight.x,topRight.y,bottomRight.x+this.widthArray[bottomRight.x],bottomRight.y+this.height)
            }else if(this.start.x > this.end.x && this.start.y < this.end.y){
                topRight = this.start;
                bottomLeft = this.end;
                numberOfColumns = ((topRight.x-bottomLeft.x)/this.width)+1;  // change this.width with total width
                numberOfRows = ((topRight.y-bottomLeft.y)/this.height)+1;
                bottomRight = new rect(bottomLeft.x+(numberOfColumns*this.width),bottomLeft.y,0,0,"",this.context);  // change this.width with total width
                topLeft = new rect(bottomLeft.x,bottomLeft.y+(numberOfRows*this.height),0,0,"",this.context);
                this.drawGridLines(topRight.x+this.widthArray[topRight.x],topRight.y,topLeft.x, topLeft.y-this.height);
                this.drawGridLines(topLeft.x,topLeft.y-this.height,bottomLeft.x,bottomLeft.y+this.height);
                this.drawGridLines(bottomLeft.x,bottomLeft.y+this.height,bottomRight.x,bottomRight.y+this.height);
                this.drawGridLines(topRight.x+this.widthArray[topRight.x],topRight.y,bottomRight.x,bottomRight.y+this.height)
            }else{
                bottomLeft = this.start;
                topRight = this.end;
                numberOfColumns = ((topRight.x-bottomLeft.x)/this.width)+1;  // change this.width with total width
                numberOfRows = ((topRight.y-bottomLeft.y)/this.height)+1;
                bottomRight = new rect(bottomLeft.x+(numberOfColumns*this.width),bottomLeft.y,0,0,"",this.context); // change this.width with total width
                topLeft = new rect(bottomLeft.x,bottomLeft.y+(numberOfRows*this.height),0,0,"",this.context);
                this.drawGridLines(topRight.x+this.widthArray[topRight.x],topRight.y,topLeft.x, topLeft.y-this.height);
                this.drawGridLines(topLeft.x,topLeft.y-this.height,bottomLeft.x,bottomLeft.y+this.height);
                this.drawGridLines(bottomLeft.x,bottomLeft.y+this.height,bottomRight.x,bottomRight.y+this.height);
                this.drawGridLines(topRight.x+this.widthArray[topRight.x],topRight.y,bottomRight.x,bottomRight.y+this.height)
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
        // this.drawCanvas()
        const x = event.offsetX;
        const y = event.offsetY;
        let a = this.findCell(x,y);
        let found = a[0];
        if(x >= found.x+this.widthArray[found.x]-20 && x <= found.x+this.widthArray[found.x]-5 && y < 30){
            this.isIncreasing = 1;
            this.initailX = found.x;
        }else{
            this.canvas.style.cursor = "pointer";
            let i = a[1];
            if(found.x >= 100 && found.y >= 30){
                this.isSelecting = 1;
                // this.start.x = found.x;
                // this.start.y = found.y;
                this.start = found;
                this.drawSelectedGrid();
            }else {
                this.drawCellBorder(found)
            }
        }
        
    }

    handleMouseMove(event){
        const x = event.offsetX;
        const y = event.offsetY;
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
        let a = this.find(x,y,this.top);
        if(a != null){
            this.found = a[0];
            let i = a[1];
            if(this.initailX == 0){
                this.s.x = this.found.x;
                this.s.y = this.found.y
                console.log("top selected: ",this.top[i]);
                this.initailX = this.found.x;
                this.detector = 1;
            }
            if((x >= this.found.x+this.widthArray[this.found.x]-20 && x <= this.found.x+this.widthArray[this.found.x]-5  && y < 30) || this.isIncreasing){
                this.canvas.style.cursor = "col-resize";
                if(this.isIncreasing == 1){
                    let factor = x-(this.s.x);
                    this.s.x += factor;
                    this.drawCanvas()
                    this.drawVirtualLine(this.s.x,this.s.y,this.s.x,this.canvas.width);
                }
            }else{
                this.canvas.style.cursor = "pointer";
            }
        }
        
    }
    handleMouseUp(){
        if(this.isIncreasing == 1){
            this.isIncreasing = 0;
            this.factor = this.s.x-(this.initailX+this.widthArray[this.initailX])
            console.log("difference: ",this.s.x-(this.initailX+this.widthArray[this.initailX]));
            this.updateGrid()
            this.drawCanvas(1)
            this.initailX = 0;
        }
        this.detector = 0;
        this.isSelecting = 0;
        
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
    
    measureTextWidth(text, font) {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        context.font = font;
        return context.measureText(text).width;
    }
    

    textWrap(text){
        if(text.length >= 10){
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