import rect from "./rect.js";
import User from "./User.js";

class GridFromLines{
    constructor(canvas,context,data){
        this.context = context;
        this.canvas = canvas
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 20;
        this.grid = []
        this.top = []
        this.left = []
        this.selectedCells = []
        this.start = new rect(-1,-1,this.width,this.height,"",this.context);
        this.end = new rect(-1,-1,this.width,this.height,"",this.context);
        this.isSelecting = 0; 
        this.isIncreasing = 0;
        this.numberOfCells = Math.floor((this.canvas.width/this.width)*(this.canvas.height/this.height));
        this.numberOfColumns =  Math.floor((this.canvas.width/this.width));
        this.numberOfRows = Math.floor((this.canvas.height/this.height));
        this.scrollY = 0;
        this.st = 0;
        this.apiCallCount = 0;
        this.apiCallCheck = 76;
        this.lastRow = 0;
        this.gridData = []
        this.startRow = 0;
        this.data = data;
        this.checkPoint = 70;
        this.nextStartPoint = 101;
        this.selectedCellForDelete = undefined;
        this.singleDataLength = 0;
        if(this.data.length > 0){
            this.singleDataLength = this.data[0].length;
        }

        this.widthArray = new Map();
        this.heightArray = new Map();



        this.s = new rect(-1,-1,this.width,this.height,"",this.context);
        this.detector = 0;
        this.factor = 0;
        this.found = new rect(-1,-1,this.width,this.height,"",this.context);
        this.initailX = -1;
        this.initailY = -1;
        this.drawGrid()
        // this.setData()
    }
    getRowForDelete(){
        return this.selectedCellForDelete;
    }
    setCanvas(c){
        this.canvas = c;
        this.numberOfCells = Math.floor((this.canvas.width/this.width)*(this.canvas.height/this.height));
        this.numberOfColumns =  Math.floor((this.canvas.width/this.width));
    }
    setData(data = this.data){
        if(data != this.data){
            this.data  = data;
        }
        if(this.data.length == 0){
            this.gridData = new Array(this.numberOfCells).fill(" "); // .map((numberOfCells, i) => numberOfCells + i);
        }else{
            // this.data  = this.data.flat(1);
            this.gridData = new Array(this.numberOfCells).fill(" ")
            this.singleDataLength = this.data[0].length;
            let k = 0;
            let x = 0, y = 0;
            for(let i=this.st;i<this.data.length;i++){
                x = 0;
                for(let j=0;j<this.numberOfColumns;j++){
                    if(j < this.singleDataLength){
                        this.gridData[k] = this.data[i][j];
                        k++;
                    }else{
                        this.gridData[k] = ""
                        k++;
                    }
                }
            }
            // console.log("gridData: ",this.gridData)
        }
    }
    async fetchData(){
        // this.st += 40;
        console.log("data fetching")
        const apiUrl = `http://localhost:5239/api/user/${this.nextStartPoint}`;
        this.nextStartPoint += 70;
        console.log("next start point: ",this.nextStartPoint)
        let data = []
        try{
            const response = await fetch(apiUrl);
            const apiData = await response.json();
            // let apidata = data;
            // apidata = data.map(data => Object.values(data));
            // console.log("data",Object.values(apiData[0]));
            
            for(let i=0;i<apiData.length;i++){
                data.push(Object.values(apiData[i]))
            }
        }
        catch(error)
        {
            console.log(error);
        }
        this.data.push(...data);
    }
    updateGrid(){
        if(this.factor != 0){
            if(this.initailX != -1){
                let flag = 0;
                console.log("inside X")
                for(let i=0;i<this.top.length;i++){
                    if(this.top[i].x == this.initailX && this.widthArray[this.top[i].x]+this.factor > Math.floor(this.widthArray[this.top[i].x]*0.30)){
                        this.top[i].width += this.factor;
                        flag = 1;
                    }
                    if(this.top[i].x > this.initailX && flag){
                        let iX = this.top[i].x; 
                        this.top[i].x += this.factor;
                        this.widthArray[this.top[i].x] = this.widthArray[iX];
                    }
                }
                flag = 0;
                for(let i=0;i<this.grid.length;i++){
                    if(this.grid[i].x == this.initailX && this.widthArray[this.grid[i].x]+this.factor > Math.floor(this.widthArray[this.grid[i].x]*0.30)){
                        this.grid[i].width += this.factor;
                        flag = 1;
                    }
                    if(this.grid[i].x > this.initailX && flag){
                        let iX = this.grid[i].x;
                        this.grid[i].x += this.factor;
                        this.widthArray[this.grid[i].x] = this.widthArray[iX];
                        // console.log("getting: ",this.widthArray.get(iX),iX)  Later .....................
                    }
                }
            }
            if(this.initailY != -1){
                let flag = 0;
                console.log("inside Y")
                for(let i=0;i<this.left.length;i++){
                    if(this.left[i].y == this.initailY && this.heightArray[this.left[i].y]+this.factor > Math.floor(this.heightArray[this.left[i].y]*0.30)){
                        this.left[i].height += this.factor;
                        flag = 1;
                    }
                    if(this.left[i].y > this.initailY && flag){
                        let iY = this.left[i].y; 
                        this.left[i].y += this.factor;
                        this.heightArray[this.left[i].y] = this.heightArray[iY];
                    }
                }
                flag = 0;
                for(let i=0;i<this.grid.length;i++){
                    if(this.grid[i].y == this.initailY && this.heightArray[this.grid[i].y]+this.factor > Math.floor(this.heightArray[this.grid[i].y]*0.30)){
                        this.grid[i].height += this.factor;
                        flag = 1;
                    }
                    if(this.grid[i].y > this.initailY && flag){
                        let iY = this.grid[i].y;
                        this.grid[i].y += this.factor;
                        this.heightArray[this.grid[i].y] = this.heightArray[iY];
                    }
                }
            }
            
        }
    }
    drawGrid(){
        // this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.setData()
        let letters = 0;
        let left = this.st;
        let k = 0;
        this.left = [];
        this.top = [];
        this.grid = [];
        for(let i=0;i<this.canvas.height;i+=this.height){
            let j = 0;
            while(j <= this.canvas.width){
                let text = ""
                if(i == 0){
                    if(this.top.length != 0){
                        text = String.fromCharCode('A'.charCodeAt(0) + letters++);
                    }
                    let x = j ,y=i;
                    if(this.checkPoint == 70){
                        this.widthArray[x] = this.width;
                        this.heightArray[y] = this.height;
                    }
                    
                    this.top.push(new rect(x,y,0,0,text,this.context))
                }else if(j == 0){
                    if(this.checkPoint == 70){
                        this.widthArray[j] = this.width;
                        this.heightArray[i] = this.height;
                    }

                    this.left.push(new rect(j,i,0,0,++left,this.context))
                }
                else{
                    let x = j ,y=i;
                    if(this.checkPoint == 70){
                        this.widthArray[x] = this.width;
                        this.heightArray[y] = this.height;
                    }
                    this.grid.push(new rect(x,y,0,0,this.gridData[k++],this.context))
                }
                j += this.width;
            }
        }

    }
    drawTopSelected(){
        if(this.end.x == -1) this.end = this.start;
        for(let i=0;i<this.top.length;i++){
            if((this.top[i].x >= this.start.x && this.top[i].x <= this.end.x) || (this.top[i].x <= this.start.x && this.top[i].x >= this.end.x)){
                this.drawGridCells(this.top[i])
            }
        }
    }
    drawLeftSelected(){
        for(let i=0;i<this.left.length;i++){
            if((this.left[i].y >= this.start.y && this.left[i].y <= this.end.y)||(this.left[i].y <= this.start.y && this.left[i].y >= this.end.y)){
                this.drawGridCells(this.left[i])
            }
        }
    }

    drawCanvas(increasing = 0,scrolling=0){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawLines(increasing);
        this.drawTop();
        this.drawLeft(scrolling);
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
            if(this.factor != "a" && x == this.initailX && increasing && this.widthArray[x]+this.factor > this.widthArray[x]*0.30){
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
            // console.log("diff: ",(this.heightArray[y]+this.factor > 0))
            if(y == this.initailY && increasing && (this.heightArray[y]+this.factor >  Math.floor(this.heightArray[y]*0.30))){
                this.heightArray[y] += this.factor;
            }
            y += this.heightArray[y];
        }
    }
    drawData(){
        if(this.gridData[0] == " "){
            for(let i=0;i<this.gridData.length;i++){
                let wt = this.textWrap(this.gridData[i]);
                if(this.gridData[i].length > 1){
                    this.grid[i].draw(wt,this.widthArray[this.grid[i].x],this.heightArray[this.grid[i].y]);
                }
            }
        }else{
            for(let i=0;i<this.gridData.length;i++){
                let wt = this.textWrap(this.gridData[i]);
                try{
                    this.grid[i].draw(wt,this.widthArray[this.grid[i].x],this.heightArray[this.grid[i].y]);
                }catch(e){

                }
            }
        }
    }
    drawTop(){
        for(let i=0;i<this.top.length;i++){
            this.top[i].draw(this.top[i].text,this.widthArray[this.top[i].x],this.heightArray[this.top[i].y]);
        }
    }
    drawLeft(scrolling=0){
        let k = this.st;
        for(let i=0;i<this.left.length;i++){
            // if(scrolling != 0 && parseInt(this.left[i].text) >= 1){
            //     this.left[i].text = String(parseInt(this.left[i].text) + 3*scrolling);    
            // }
            this.left[i].draw(++k,this.widthArray[this.left[i].x],this.heightArray[this.left[i].y]);
        }
    }
    
    find(x,y,arr){
        for(let i=0;i< arr.length;i++){
            let r = arr[i];
            if((x >= r.x && x <= (r.x+this.widthArray[r.x])) && (y >= r.y && (y <= r.y+this.heightArray[r.y]))){
                return [r,i]
            }
        }
    }

    findCell(x,y){
        if(x >= this.width && y > this.height){
            return this.find(x,y,this.grid);
        }else if(x > this.width && y < this.height){
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
        this.selectedCellForDelete = selectedRow[0];
        return selectedRow;
    }
    
    drawCell(cell){
        // this.context.strokeStyle ="rgb(0,0,255)"
        this.context.strokeStyle ="rgb(19,126,67)"
        this.context.beginPath();
        this.context.rect(cell.x, cell.y, this.widthArray[cell.x], this.heightArray[cell.y]);
        this.context.stroke();
    }

    drawGridCells(cell){
        this.context.fillStyle = "rgba(19,126,67,0.2)";
        this.context.beginPath();
        this.context.fillRect(cell.x, cell.y, this.widthArray[cell.x], this.heightArray[cell.y]);
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

            // this.context.fillStyle = "rgba(14,101,235,0.1)";
            // this.context.fillStyle = "rgba(14,101,235,0.1)";
            this.context.fillStyle = "rgba(19,126,67,0.2)";
            this.context.beginPath();
            this.context.fillRect(cells[i].x, cells[i].y, this.widthArray[cells[i].x], this.heightArray[cells[i].y]);
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
            // let first = 0;
            let g = []
            for(let i=0;i<this.grid.length;i++){
                if((this.grid[i].x >= this.start.x && this.grid[i].x <= (this.end.x)) && (this.grid[i].y >= this.start.y && (this.grid[i].y < this.end.y+this.height))||
                (this.grid[i].y >= this.end.y && this.grid[i].y <= this.start.y  && this.grid[i].x >= this.start.x && this.grid[i].x <= this.end.x)||
                (this.grid[i].x <= this.start.x && this.grid[i].x >= this.end.x && this.grid[i].y >= this.start.y && this.grid[i].y <= this.end.y)||
                (this.grid[i].x <= this.start.x && this.grid[i].x >= this.end.x && this.grid[i].y <= this.start.y && this.grid[i].y >= this.end.y)){
                    if(this.grid[i] == this.start){
                        this.drawCell(this.start);
                        // first++;
                    }else{
                        this.drawGridCells(this.grid[i])
                    }
                    g.push(this.grid[i]);
                }
            }
            console.log(g);
            
            
            let topLeft = new rect(-1,-1,this.width,this.height,"",this.context);
            let topRight = new rect(-1,-1,this.width,this.height,"",this.context);
            let bottomLeft = new rect(-1,-1,this.width,this.height,"",this.context);
            let bottomRight = new rect(-1,-1,this.width,this.height,"",this.context)
            
            let numberOfColumns = 0;
            let numberOfRows = 0;
            if(this.start.x == this.end.x && this.start.y < this.end.y){
                this.drawGridLines(this.start.x,this.start.y,this.start.x+this.width,this.start.y);
                this.drawGridLines(this.start.x+this.width,this.start.y,this.end.x+this.width,this.end.y+this.height);
                this.drawGridLines(this.end.x,this.end.y+this.height,this.end.x+this.width,this.end.y+this.height)
                this.drawGridLines(this.end.x,this.end.y+this.height,this.start.x,this.start.y)
                
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
        this.context.strokeStyle = "rgb(19,126,67)";
        this.context.beginPath();
        this.context.moveTo(startX,startY);
        this.context.lineTo(endX,endY);
        this.context.stroke();
    }
    drawVirtualLine(startX,startY,endX,endY){
        console.log("drawing line")
        this.context.strokeStyle = "grey";
        this.context.beginPath();
        this.context.moveTo(startX+0.5,startY+0.5);
        this.context.lineTo(endX+0.5,endY+0.5);
        this.context.stroke();
    }
    drawCellBorder(cell){
        this.drawCanvas()
        this.context.fillStyle = "rgb(19,126,67)"
        // this.context.strokeStyle = "rgb(255,255,255)"
        this.context.strokeStyle = "rgb(19,126,67)"
        this.context.beginPath();
        this.context.fillRect(cell.x, cell.y, this.widthArray[cell.x], this.heightArray[cell.y]);
        this.context.fillStyle = "white";
        this.context.font = "12px Arial";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText(cell.text, cell.x + this.widthArray[cell.x] / 2, cell.y + this.heightArray[cell.y] / 2);
        this.context.fillStyle = "black";
        this.context.stroke();
        let se = null;
        if(cell.x >= this.width && cell.y < this.height){
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
        if((x >= found.x+this.widthArray[found.x]-10 && x <= found.x+this.widthArray[found.x]-2 && y < this.height)){
            this.isIncreasing = 1;
            this.initailX = found.x;
            console.log("top")
        }else if(y >= this.found.y+this.heightArray[this.found.y]-10 && y <= this.found.y+this.heightArray[this.found.y]-2){
            this.initailY = found.y;
            this.isIncreasing = 1;
            console.log("left")
        }else{
            this.canvas.style.cursor = "pointer";
            let i = a[1];
            if(found.x >= this.width && found.y >= this.height){
                this.isSelecting = 1;
                // this.start.x = found.x;
                // this.start.y = found.y;
                this.start = found;
                this.drawSelectedGrid();
                this.drawTopSelected();
                this.drawLeftSelected();
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
            if(found.x >= this.width && found.y >= this.height){
                this.end = found;
            }
            this.drawSelectedGrid();
            this.drawTopSelected();
            this.drawLeftSelected();
        }
        let a = this.find(x,y,this.top);
        let b = this.find(x,y,this.left);
        if(a != null){
            this.found = a[0];
            let i = a[1];
            if(this.initailX == -1){
                this.s.x = this.found.x;
                this.s.y = this.found.y
                // console.log("top selected: ",this.top[i]);
                // this.initailX = this.found.x;
                this.detector = 1;
            }
            if((x >= this.found.x+this.widthArray[this.found.x]-10 && x <= this.found.x+this.widthArray[this.found.x]-2  && y < this.height) || this.isIncreasing){
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
        if(b != null){
            this.found = b[0];
            let i = b[1];
            if(this.initailY == -1){
                this.s.x = this.found.x;
                this.s.y = this.found.y
                // console.log("left selected: ",this.left[i]);
                // this.initailX = this.found.x;
                this.detector = 1;
            }
            if((y >= this.found.y+this.heightArray[this.found.y]-5 && y <= this.found.y+this.heightArray[this.found.y]-2) || this.isIncreasing){
                this.canvas.style.cursor = "row-resize";
                if(this.isIncreasing == 1){
                    let factor = y-(this.s.y);
                    this.s.y += factor;
                    this.drawCanvas()
                    this.drawVirtualLine(this.s.x,this.s.y,this.canvas.width,this.s.y);
                }
            }else{
                this.canvas.style.cursor = "pointer";
            }
        }
        
    }
    handleMouseUp(){
        if(this.isIncreasing == 1){
            this.isIncreasing = 0;
            if(this.initailX != -1){
                this.factor = this.s.x-(this.initailX+this.widthArray[this.initailX])
                console.log("difference: ",this.s.x-(this.initailX+this.widthArray[this.initailX]));
                this.updateGrid()
                this.drawCanvas(1)
                this.initailX = -1;
            }
            if(this.initailY != -1){
                this.factor = this.s.y-(this.initailY+this.heightArray[this.initailY])
                console.log("difference: ",this.s.y-(this.initailY+this.heightArray[this.initailY]));
                this.updateGrid()
                this.drawCanvas(1)
                this.initailY = -1;
            }
            
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
        if(x > this.width && y > this.height){
            let a = this.findCell(x,y);
            let found = a[0];
            let i = a[1];
            this.createInputField(found,i);
        }
    }
    
    measureTextWidth(text, font) {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        context.font = font;
        return context.measureText(text).width;
    }
    
    async handelScroll(event){
        if(this.scrollY <= 0 && event.deltaY < 0){
            this.scrollY = 0;
        }else{
            this.scrollY += event.deltaY;
        }
        this.st = Math.floor(this.scrollY/100);
        console.log(this.scrollY,event.deltaY,this.st,this.st+24);
        if(this.st+24  >= this.checkPoint){
            this.checkPoint += 40;
            console.log("fetch called");
            this.fetchData();
        }
        this.setData();
        this.drawGrid();
        this.drawCanvas();
    }

    textWrap(text){
        if(text != undefined){
            if(text.length >= 10){
                let showValue = text.substring(0,5);
                showValue += "..."
                return showValue;
            }
            return text;
        }
        return "";
    }


    

    async UpdateCellData(cell){
        console.log("Update Called")
        const apiUrl = `http://localhost:5239/api/user/update`;
        try{
            const response = await fetch(apiUrl,
                {
                    method: "PUT",
                    body: JSON.stringify(cell),
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            const apiData = await response.json();
            alert(apiData)
        }
        catch(error)
        {
            console.log(error);
        }
    }

    createInputField(cell,i) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = this.gridData[i];
        input.style.position = "absolute";
        input.style.left = `${this.grid[i].x}px`;
        input.style.top = `${this.grid[i].y+160}px`;
        input.style.width = `${this.widthArray[this.grid[i].x] }px`;
        input.style.height = `${this.heightArray[this.grid[i].y] }px`; 
        input.style.fontSize = "12px"; 
        // input.style.border = "1px solid rgb(221,221,221)";
        input.style.border = "1px solid #137E43";
        input.style.boxSizing = "border-box";
        document.body.appendChild(input);
        input.focus();
        input.select();
        console.log("cell in inputL: ",cell)
        input.addEventListener("blur", () => {
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
            if(this.gridData[i] != input.value){
                cell.text = input.value;
                console.log("changes cell: ",cell.text )
                let selectedRow = this.selectEntireRow(cell);
                for(let i=0;i<selectedRow.length;i++){
                    if(selectedRow[i].x == cell.x && selectedRow[i].y == cell.y){
                        selectedRow[i].text = cell.text;
                        break;
                    }
                }
                console.log("len: ",selectedRow.length);
                let user = new User(
                    selectedRow[0].text,
                    selectedRow[1].text,
                    selectedRow[2].text,
                    selectedRow[3].text,
                    selectedRow[4].text,
                    selectedRow[5].text,
                    selectedRow[6].text,
                    selectedRow[7].text,
                    selectedRow[8].text,
                    selectedRow[9].text,
                    selectedRow[10].text,
                    selectedRow[11].text,
                    selectedRow[12].text,
                )
                console.log(user);
                // console.log(selectedRow);/
                // selectedFRow[0] = 
                this.UpdateCellData(user)
            }
            this.gridData[i] = input.value;
            document.body.removeChild(input);
            this.drawCanvas()
        });
    
        
    }

}

export default GridFromLines;