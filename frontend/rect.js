
class rect {
    constructor(x, y, width, height, text,context,func) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.context = context
        this.draw = (t = this.text) => {
            // let random = Math.random()*(255-10)+10;
            // this.context.fillStyle = `rgb(${random},${random},${random})`
            // this.context.strokeStyle = "rgb(196,199,197)"
            // this.context.beginPath();
            // this.context.fillRect(this.x, this.y, this.width, this.height);
            // this.context.stroke();
            this.context.font = "16px Arial";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            this.context.fillText(t, this.x + this.width / 2, this.y + this.height / 2);
        };
        
    }
}

export default rect;

 // drawGridCell(cell) {
    //     this.context.fillStyle = "rgba(0,120,215,0.3)";
    //     this.context.fillRect(cell.x, cell.y, cell.width, cell.height);
    // }

    // clearGridCell(cell) {
    //     this.context.clearRect(cell.x, cell.y, cell.width, cell.height);
    //     this.context.strokeStyle = "black";
    //     this.context.strokeRect(cell.x, cell.y, cell.width, cell.height);
    //     this.context.fillStyle = "black";
    //     this.context.font = "16px Arial";
    //     this.context.textAlign = "center";
    //     this.context.textBaseline = "middle";
    //     this.context.fillText(cell.text, cell.x + cell.width / 2, cell.y + cell.height / 2);
    // }