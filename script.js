import init, {generate_pixel, get_image_dimentions} from "./pkg/ray_tracer.js";

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

async function run(){

    await init();

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

    let {width, height} = get_output_image_size();
    document.querySelector("#imageWidth").value = width; 
    document.querySelector("#imageHeight").value = height;
    const myCanvas = document.querySelector("#myCanvas");
    myCanvas.width = width;
    myCanvas.height = height; 

    console.log(`width: ${width}, height: ${height}`);

    for (let y = 0; y <height;  y++){
        for (let x = 0; x<width; x++){
            get_px(x,y);
        }       
    }

    // Convert canvas to data URL
    const imageData = canvas.toDataURL('image/png');
    // Link to download image
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = imageData;

}

run();


function get_output_image_size(){
    let dimen = get_image_dimentions();
    let width = dimen.width;
    let height = dimen.height;
    return {width, height}
}

/*
const canvas = document.getElementById('myCanvas');
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







