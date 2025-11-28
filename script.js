import init, {generate_pixel} from "./pkg/ray_tracer.js";

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

async function run(){

    await init();

    function get_px(x,y){
        let point = generate_pixel(x,y);
        const r = point.color.r.toString(16);
        const g = point.color.g.toString(16);
        const b = point.color.b.toString(16);
        
        const color = `#${r}0${g}0${b}`;

        console.log(color);
        ctx.fillStyle = color;

        ctx.fillRect(y, x, 50, 50)


    }

    get_px(0,0);
    get_px(0,50);
    get_px(0,100);


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







