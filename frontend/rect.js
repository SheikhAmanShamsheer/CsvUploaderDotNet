
class rect {
    constructor(x, y, width, height, text,context,func) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.context = context
        this.draw = (t = "") => {
            // console.log(color);
            this.context.fillStyle = "black"
            this.context.beginPath();
            this.context.rect(this.x, this.y, this.width, this.height);
            this.context.stroke();
            this.context.font = "16px Arial";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        };
        
    }
}

export default rect;