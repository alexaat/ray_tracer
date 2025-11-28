import init, {generate_pixel} from "./pkg/ray_tracer.js";

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

        console.log(color);
        ctx.fillStyle = color;

        ctx.fillRect(y, x, 1, 1)


    }

    for (let y = 0; y < 500;  y++){
        for (let x = 0; x<500; x++){
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







