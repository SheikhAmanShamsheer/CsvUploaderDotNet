import Grid from "./Grid.js";
import border from "./border.js";
import leftBorder from "./leftBorder.js"

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = 2600;
canvas.height = 5000;

const leftCanvas = document.getElementById("left");
leftCanvas.width = 100;
leftCanvas.height = 5000;
const leftC = leftCanvas.getContext("2d");

const topCanvas = document.getElementById("top");
topCanvas.width = 2700;
topCanvas.height = 25;
const topC = topCanvas.getContext("2d");

var grid = new Grid(0,0,c,canvas)
var top = new border(0,25,topC,topCanvas,c,grid)
// var left = new leftBorder(25,0,leftC)

grid.drawGrid()
top.drawTopBorder()
// left.drawLeftBorder()


canvas.addEventListener("mousedown",(event) => {
    grid.handleMouseDown(event)
})
canvas.addEventListener("mousemove",(event) => {
    grid.handleMouseMove(event)
})
canvas.addEventListener("mouseup",(event) => {
    grid.handleMouseUp(event)
})
// canvas.addEventListener("mousemove",(event) => {
//     grid.handleMouse(event)
// })
// canvas.addEventListener("mousedown", (event) => {
//     c.clearRect(0,0,canvas.width,canvas.height)
//     grid.drawGrid()

// });
// canvas.addEventListener("mouseup", (event) => grid.dragEnd(event));

topCanvas.addEventListener("mousedown", (event) => {
    let arr = top.handleMouseDown(event)
    grid.drawGridArray(arr)

});
canvas.addEventListener("dblclick",(event) => grid.handleDoubleClick(event));