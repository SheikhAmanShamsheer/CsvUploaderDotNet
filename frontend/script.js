import Grid from "./Grid.js";
import border from "./border.js";
import leftBorder from "./leftBorder.js"
import GridFromLines from "./GridFromLines.js"


const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight-5;

// const leftCanvas = document.getElementById("left");
// leftCanvas.width = 100;
// leftCanvas.height = 5000;
// const leftC = leftCanvas.getContext("2d");

// const topCanvas = document.getElementById("top");
// topCanvas.width = 2700;
// topCanvas.height = 25;
// const topC = topCanvas.getContext("2d");

// var grid = new Grid(0,0,c,canvas)
// var top = new border(0,25,topC,topCanvas,c)
// var left = new leftBorder(25,0,leftC,leftCanvas)



async function fetchData(){
    const apiUrl = `http://localhost:5239/api/user`;
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
    return data
}

let data = [];
try{
    data = await fetchData();
}catch{
    
}


let gridLines = new GridFromLines(canvas,context,data)
gridLines.drawCanvas();


canvas.addEventListener("pointerdown",(event)=>{
    gridLines.handleMouseDown(event);
})
canvas.addEventListener("pointermove",(event)=>{
    gridLines.handleMouseMove(event);
})
canvas.addEventListener("pointerup",()=>{
    gridLines.handleMouseUp();
})
canvas.addEventListener("dblclick",(event)=>{
    gridLines.handleDoubleClick(event);
})
canvas.addEventListener("wheel",(event)=>{
    // var st = window.scrollY || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    // if (st > lastScrollTop) {
        //     f = 1;
        // } else if (st < lastScrollTop) {
            //     f = -1
            // } // else was horizontal scroll
            // let lastScrollTop = st <= 0 ? 0 : st;
    let f = 1;
    if(event.deltaY < 0){
        f = -1
    }
    gridLines.handelScroll(event,f)
})
window.addEventListener("resize",(event)=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight;
    gridLines.setCanvas(canvas);
    gridLines.setData()
    gridLines.drawGrid()
    gridLines.drawCanvas()
})






















// grid.drawGrid(data)
// top.drawTopBorder()
// left.drawLeftBorder()

// topCanvas.addEventListener("mousemove", (event) => {
//     top.hoverMouse(event);
// });

// leftCanvas.addEventListener("mousemove", (event) => {
//     // let arr = left.handleMouseDown(event)
//     // grid.drawGridArray(arr)
//     left.hoverMouseTop(event)
// });
// let increaseFatcor = 0
// let r = undefined
// let arr = []
// topCanvas.addEventListener("mousedown", (event) => {
//     let array = top.handleMouseDown(event)
//     if(array[1] == "increasing"){
//         r = array[0];
//         // arr = grid.findSelectedRow(r);
//     }else{
//         r = array[0];
//         // arr = grid.findSelectedRow(r)
//         top.unsetTopBorder()
//         left.unsetLeftBorder(arr[0],arr[arr.length-1])
//         // grid.drawGridArray(arr)
//     }
//     // try{
//     //     console.log(arr.x);
//     //     r = arr;
//     //     console.log("r set: ",r)
//     //     grid.drawGridArray(arr)
//     // }catch(e){
//     // }
//     // console.log(array)
//     // if(Array.isArray(array[0])){
//     //     // arr = array[0];
//     //     r = array[1];
//     //     arr = grid.findSelectedRow(r);
//     //     console.log(arr)
//     // }else{
//     //     arr = array
//     //     top.unsetTopBorder()
//     //     left.unsetLeftBorder(arr[0],arr[arr.length-1])
//     //     grid.drawGridArray(arr)
//     // }
// });
// topCanvas.addEventListener("mouseup", (event) => {
//     top.handleMouseUp()
// });
// topCanvas.addEventListener("mousemove", (event) => {
//     const rect = topCanvas.getBoundingClientRect();
//     const x = event.clientX-rect.x;
//     const y = event.clientY-rect.y;
//     let rec = top.findCellTopBorderRange(x,y);
//     if(rec != null){
//         increaseFatcor = x-rec.x;
//         topCanvas.style.cursor = 'col-resize'
//     }else{
//         topCanvas.style.cursor = 'pointer'
//     }
//     if(top.isIncreasing){
//         if(r != undefined){
//             console.log("increasing by: ",(x-(r.x+r.width)));
//             let factor = x-(r.x+r.width)
//             // if(r.width <= -50){
//             //     factor = 0
//             // }
//             r.width += factor
//             topCanvas.width += factor
//             canvas.width += factor
//             top.drawTopBorderFactor(factor,r)
//             // grid.drawGridArrayIncrease(arr,factor,r,data)
//             leftC.clearRect(0,0,leftCanvas.width,leftCanvas.height)
//             left.drawLeftBorder()
//         }
            
//     }
    
// });

// leftCanvas.addEventListener("mousedown", (event) => {
//     let arr = left.handleMouseDown(event)
//     left.unsetLeftBorder()
//     top.unsetTopBorder()
//     // grid.drawGridArray(arr)
// });
// canvas.addEventListener("mousedown",(event) => {
//     // grid.handleMouseDown(event)
// })
// canvas.addEventListener("mousemove",(event) => {
//     // let se = grid.handleMouseMove(event)
//     // top.drawSelectedBorder(se)
//     // left.drawSelectedLeftBorder(se)
//     // top.drawTopBorder()
//     // topC.clearRect(0,0,topCanvas.width,topCanvas.height)

// })
// canvas.addEventListener("mouseup",(event) => {
//     // let se = grid.handleMouseUp(event)
//     // top.drawSelectedBorder(se)
//     // left.drawSelectedLeftBorder(se)
// })
// canvas.addEventListener("dblclick",(event) => {
//     // grid.handleDoubleClick(event)
// });
// window.addEventListener("keydown",(event)=>{
//     // console.log("called")
//     let se = grid.drawGridCell(event)
//     top.drawSelectedBorder(se)
//     left.drawSelectedLeftBorder(se)
// })