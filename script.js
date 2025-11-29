import init, {generate_pixel, get_image_dimensions, get_shapes_titles} from "./pkg/ray_tracer.js";

//elements
const renderedCanvas = document.querySelector("#renderedCanvas");
const ctx = renderedCanvas.getContext('2d');
const imageWidth = document.querySelector("#imageWidth"); 
const imageHeight = document.querySelector("#imageHeight");
const generateImageButton = document.querySelector("#generateImage");
const shapesOption = document.querySelector("#shapesOption");

//state
let outputImageWidth = 10;
let outputImageHeight = 10;



async function run(){

    await init();

    //init image size fields
    init_output_image_dimention_settinds();

    //init generateImage button
    init_generate_image_button();

    //init shapes selector
    init_shapes_selector();
}

run();

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

function init_shapes_selector(){
    const shapes_titles = get_shapes_titles();


    for (let title of shapes_titles){
        console.log(title);
        let opt = document.createElement('option');
        opt.value = title;
        opt.innerHTML = title;
        shapesOption.appendChild(opt);
    }

    console.log(shapes_titles);
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







