import init,
    {
        generate_pixel,
        get_shapes_titles,
        get_preview_camera,
        set_preview_camera,
        add_shpere,
        update_sphere,
        get_scene

    } from "./pkg/ray_tracer.js";
import {

    emptyPropertyComponent,
    spherePropertyComponent,
    createPreviewCameraSetting


} from "./components.js";




/* 
        "pixel_samples" : 200,
        "vfov" : 22,
        "lookfrom" : [5, 6, 25],
        "lookat" : [0, 0, 0],
        "vup": [0, 1, 0],
        "defocus_angle": 0.4,
        "focus_dist": 19,
        "aspect_ratio": 1.333333,
        "image_width": 200,
        "max_depth": 50,
        "background": [173, 216, 230]
*/



//elements
const centerPanel = document.querySelector('#center-panel');

const renderedCanvas = document.querySelector("#rendered-canvas");
const ctx = renderedCanvas.getContext('2d');

const shapesOption = document.querySelector("#shapes-option");
const selectedShapesContainer = document.querySelector("#selected-shapes-container");

const previewCanvas = document.querySelector("#preview-canvas");
const previewContext = previewCanvas.getContext('2d');
const previewCameraSettings = document.querySelector("#preview-camera-settings");
//const previewCameraInputWidth = document.querySelector("#preview-camera-input-width");
//const previewCameraInputHeight = document.querySelector("#preview-camera-input-height");
//const imageWidth = document.querySelector("#imageWidth"); 
//const imageHeight = document.querySelector("#imageHeight");
//const generateImageButton = document.querySelector("#generateImage");



const shapeProperty = document.querySelector("#shape-property");


const showSceneButton = document.querySelector("#show-scene-button");
showSceneButton.addEventListener("click", () => {
    console.log(get_scene());
});

//state
let previewScreenWidth = 150.0;
let previewScreenAspectRation = 1.3333;
//let previewScreenHeight = 120;
//let outputImageWidth = 10;
//let outputImageHeight = 10;
let shapes = [];




async function run(){

    await init();

    //init shapes selector
    init_shapes_selector();

    //init prevew screen
    init_preview_screen();

    //init preview camera settinds
    init_preview_camera_settings();



    //init image size fields
    //init_output_image_dimention_settinds();

    //init generateImage button
    //init_generate_image_button();


}

run();

/////////////left panel///////////
//
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
        const title = e.target.value;
        const id = uuid();       
        const item = {selected: true, id, title, properties: {x: 0.0, y: 0.0, z: 0.0, radius: 1.0}};
        shapes.map((item) => {
            item.selected = false;
            return item;
        });  
        shapes.unshift(item);
        if (item.title == "sphere"){           
            console.log(add_shpere(id, item.properties.x, item.properties.y, item.properties.z, item.properties.radius));
        }
        update_selected_shapes();
        e.target.selectedIndex = 0;
        start_preview_request();
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
        shapeProperty.appendChild(emptyPropertyComponent());
    }
    let selected = shapes.filter(item => item.selected)[0];    
    if (selected){
        let index = shapes.indexOf(selected);
        shapeProperty.appendChild(
            spherePropertyComponent(
                selected.title,
                selected.properties.x,
                selected.properties.y,
                selected.properties.z,
                selected.properties.radius,
                (e) => {
                    const val = e.target.value;
                    switch (e.target.id) {
                        case "property-input-x":
                            shapes[index].properties.x = val;
                        break;
                        
                        case "property-input-y":
                            shapes[index].properties.y = val;
                        break;
                        
                        case "property-input-z":
                            shapes[index].properties.z = val;
                        break;
                        
                        case "property-input-radius":
                            shapes[index].properties.radius = val;
                        break;
                    } 
                    const id = shapes[index].id;
                    const x = shapes[index].properties.x;
                    const y = shapes[index].properties.y;
                    const z = shapes[index].properties.z;
                    const radius = shapes[index].properties.radius;
                    console.log("update: " + update_sphere(id, x, y, z, radius));
                    start_preview_request();

                }
            
            ));
    }
}
//
/////////////end left panel/////////


////////////center panel////////////
//
function init_preview_screen(){
    //let previewCamera = get_preview_camera();
    //previewScreenWidth = previewCamera.image_width;
    //previewScreenHeight = previewCamera.image_height;
    previewCanvas.width = previewScreenWidth;
    previewCanvas.height = previewScreenWidth/previewScreenAspectRation;
}

function init_preview_camera_settings(){
    centerPanel.appendChild(createPreviewCameraSetting(
        previewScreenWidth,
        previewScreenAspectRation,

    ));



    // previewCameraInputWidth.value = previewScreenWidth;
    // previewCameraInputWidth.addEventListener("change", e => {
    //     previewScreenWidth = e.target.value;
    //     previewCanvas.width = previewScreenWidth;
    //     previewCanvas.height = previewScreenHeight;
    //     update_preview_camera_at_WASM();        
    //     start_preview_request();        
    // });
    // previewCameraInputHeight.value = previewScreenHeight;
    // previewCameraInputHeight.addEventListener("change", e => {
    //     previewScreenHeight = e.target.value;
    //     previewCanvas.width = previewScreenWidth;
    //     previewCanvas.height = previewScreenHeight;
    //     update_preview_camera_at_WASM();   
    //     start_preview_request();
    // });
}


//
////////end center panel///////////

///////////right panel/////////////
//



//
//////end right panel//////////////

//request preview 
function start_preview_request(){
    if (shapes.length == 0) {
        return;
    }
    previewContext.clearRect(0, 0, previewScreenWidth, previewScreenHeight);    
    for (let i = 0; i < previewScreenWidth*previewScreenHeight; i++){
        let x = getRandomInt(previewScreenWidth);
        let y = getRandomInt(previewScreenHeight);
        let color = get_pixel_color(x,y);
        previewContext.fillStyle = color;
        previewContext.fillRect(x, y, 1, 1);
    } 
}



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

function get_pixel_color(x,y){
    let color = generate_pixel(x,y);
    let r = color.r.toString(16);
    r = r.length == 1 ? "0" + r : r;
    let g = color.g.toString(16);
    g = g.length == 1 ? "0" + g : g;
    let b = color.b.toString(16);
    b = b.length == 1 ? "0" + b : b;    
    return `#${r}${g}${b}`;
}

function update_preview_camera_at_WASM(){
    console.log(set_preview_camera(previewScreenWidth, previewScreenHeight))
}


//util
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function uuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
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







