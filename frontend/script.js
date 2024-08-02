import Grid from "./Grid.js";
import border from "./border.js";
import leftBorder from "./leftBorder.js"
import GridFromLines from "./GridFromLines.js"


const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight-5;


const findEmail = document.getElementById("emailInput");
const submitEmail = document.getElementById("findRecord");

const UploadFile = document.getElementById("UploadFile");
const deleteButton = document.getElementById("deleteBtn");




async function fetchByEmail(email){
    let data = undefined;
    const apiUrl = `http://localhost:5239/api/user/email/${email}`;
    try{
        const response = await fetch(apiUrl);
        const apiData = await response.json();
        data = Object.values(apiData);
    }
    catch(error)
    {
        console.log(error);
    }
    return data
}

async function fetchCount(){
    const apiUrl = `http://localhost:5239/api/user/count`;
    let data = undefined;
    try{
        const response = await fetch(apiUrl);
        const apiData = await response.json();
        data = apiData
    }
    catch(error)
    {
        console.log(error);
    }
    return data
}



async function uploadCsv(event) {
    event.preventDefault();
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];
    if (!file) {
        alert("Please select a file");
        console.error("No file selected");
        return;
    }
    console.log(file);
    const formData = new FormData();
    formData.append("files", file);

    try {
        const response = await fetch(
            "http://localhost:5239/api/user/upload-file",
            {
                method: "POST",
                body: formData,
            }
        );
        const data = await response.json();
        console.log("no of lines: ",data);
        if(data.length > 0) fileInput.value = ""
        let count = await fetchCount();
        let totalLineUploaded = count-initialCount;
        while(totalLineUploaded < data){
            count = await fetchCount();
            totalLineUploaded = count-initialCount;
            console.log(`Lines to be uploaded: ${data} and lines Uploaded: ${totalLineUploaded}`)
            if(totalLineUploaded == 85633){
                let data = await fetchData();
                gridLines.setData(data)
                gridLines.drawGrid()
                gridLines.drawCanvas()
                break;
            }   
        }
    } catch (error) {
        console.error("Error:", error);
        alert(data);
    }
}

async function fetchData(){
    const apiUrl = `http://localhost:5239/api/user`;
    let data = []
    try{
        const response = await fetch(apiUrl);
        const apiData = await response.json();

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

async function DeleteById(id){
    const apiUrl = `http://localhost:5239/api/user/email/${id}`;
    try{
        const response = await fetch(apiUrl);
        const apiData = await response.json();
        // data = Object.values(apiData);
        alert(apiData);
    }
    catch(error)
    {
        console.log(error);
    }
    return data
}



let initialCount = await fetchCount();



let data = [];
let userData = undefined;

submitEmail.addEventListener("click",async ()=>{
    userData = await fetchByEmail(findEmail.value);
    console.log(userData);
    data.push(userData)
    gridLines.setData([userData])
    gridLines.drawGrid()
    gridLines.drawCanvas()
    findEmail.value = ""
})
try{
    data = await fetchData();
}catch{
    
}




let gridLines = new GridFromLines(canvas,context,data)
gridLines.drawCanvas();


deleteButton.addEventListener("click",()=>{
    if(gridLines.selectedCellForDelete){
        console.log(gridLines.selectedCellForDelete)
        // DeleteById(gridLines.selectedCellForDelete.id)
    }
})

UploadFile.addEventListener('click',uploadCsv)

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