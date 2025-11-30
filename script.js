import init, {generate_pixel, get_image_dimensions, get_shapes_titles} from "./pkg/ray_tracer.js";

//elements
const renderedCanvas = document.querySelector("#renderedCanvas");
const ctx = renderedCanvas.getContext('2d');
const imageWidth = document.querySelector("#imageWidth"); 
const imageHeight = document.querySelector("#imageHeight");
const generateImageButton = document.querySelector("#generateImage");
const shapesOption = document.querySelector("#shapesOption");
const selectedShapesContainer = document.querySelector("#selected-shapes-container");
const shapeProperty = document.querySelector("#shape-property");


//state
let outputImageWidth = 10;
let outputImageHeight = 10;
let shapes = [];



async function run(){

    await init();

    //init shapes selector
    init_shapes_selector();

    //init image size fields
    init_output_image_dimention_settinds();

    //init generateImage button
    init_generate_image_button();


}

run();

/////////////left panel///////////

function init_shapes_selector(){
    //set initial title
    let opt = document.createElement('option');
    opt.value = "add shape";
    opt.innerHTML = "add shape";
    shapesOption.appendChild(opt);
    //add shapes titles
    const shapes_titles = get_shapes_titles();
    for (let title of shapes_titles){       
        let opt = document.createElement('option');
        opt.value = title;
        opt.innerHTML = title;
        shapesOption.appendChild(opt);
    }

    update_selected_shapes();

    //add select listener
    shapesOption.addEventListener("change", (e) => {
        let title = e.target.value;
        let item = {selected: true, title, properties: {x: 0.0, y: 0.0, z: 0.0}};
        shapes.map((item) => {
            item.selected = false;
            return item;
        });  
        shapes.unshift(item);
        update_selected_shapes();
        e.target.selectedIndex = 0;
    });
}

function update_selected_shapes(){
    selectedShapesContainer.innerHTML = "";
    shapes.map(shape => {
        let div = document.createElement('div');
        div.classList.add("shape-element")
        div.innerHTML = shape.title;
        if (shape.selected){
           div.classList.add("selected");  
        }
        //change selected item
        div.addEventListener("click", (e) => {
            let child = e.target;
            let parent = child.parentNode;
            let index = Array.prototype.indexOf.call(parent.children, child);
            shapes.map((item) => {
                item.selected = false;
                return item;
            });  
            shapes[index].selected = true;            
            update_selected_shapes();
        });
        selectedShapesContainer.appendChild(div);
    });

    //update right panel
    shapeProperty.innerHTML = "";
    if (shapes.length == 0) {
        let emptyDiv = document.createElement('div');
        emptyDiv.innerHTML = "-empty-";
        shapeProperty.appendChild(emptyDiv);
    }
    let selected = shapes.filter(item => item.selected)[0];
    if (selected){
        //title
        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = selected.title;
        shapeProperty.appendChild(titleDiv);
        //x
        let xDiv = document.createElement('div');
        xDiv.innerHTML = `x: ${selected.properties.x}`;
        shapeProperty.appendChild(xDiv);
        //y
        let yDiv = document.createElement('div');
        yDiv.innerHTML = `y: ${selected.properties.y}`;
        shapeProperty.appendChild(yDiv);
        //z
        let zDiv = document.createElement('div');
        zDiv.innerHTML = `z: ${selected.properties.z}`;
        shapeProperty.appendChild(zDiv);
    }
}

/////////////end left panel/////////

function init_output_image_dimention_settinds(){
    let {width, height} = get_output_image_size();
    outputImageWidth = width;
    outputImageHeight = height;
    imageWidth.value = outputImageWidth;
    imageHeight.value = outputImageHeight;
    renderedCanvas.width = outputImageWidth;
    renderedCanvas.height = outputImageHeight; 
    imageWidth.addEventListener("change", (e) => {
        outputImageWidth = e.target.value;
        renderedCanvas.width = outputImageWidth;
    });
    imageHeight.addEventListener("change", (e) => {
        outputImageHeight = e.target.value;
        renderedCanvas.height = outputImageHeight; 
    });
}

function init_generate_image_button(){
 
    generateImageButton.addEventListener("click", () => {
        for (let y = 0; y <outputImageHeight;  y++){
            for (let x = 0; x<outputImageWidth; x++){
                get_px(x,y);
            }       
        }
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/png');
        // Link to download image
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = imageData;
    });

}

function get_px(x,y){
    let point = generate_pixel(x,y);
    let r = point.color.r.toString(16);
    r = r.length == 1 ? "0" + r : r;
    let g = point.color.g.toString(16);
    g = g.length == 1 ? "0" + g : g;
    let b = point.color.b.toString(16);
    b = b.length == 1 ? "0" + b : b;
    
    const color = `#${r}${g}${b}`;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1)
}

function get_output_image_size(){
    let dimen = get_image_dimensions();
    let width = dimen.width;
    let height = dimen.height;
    return {width, height}
}

/*
const canvas = document.getElementById('renderedCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000'; // Set color to red
ctx.fillRect(0, 0, 50, 50); // Draw rectangle
ctx.fillStyle = '#00FF00'; // Set color to red
ctx.fillRect(0, 50, 50, 50); // Draw rectangle
ctx.fillStyle = '#0000FF'; // Set color to red
ctx.fillRect(0, 100, 50, 50); // Draw rectangle
// Convert canvas to data URL
const imageData = canvas.toDataURL('image/png');
// Link to download image
const downloadLink = document.getElementById('downloadLink');
downloadLink.href = imageData;
*/







