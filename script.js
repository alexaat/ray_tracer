import init,
    {
        generate_pixel,
        get_shapes_titles,
        set_preview_camera,
        get_scene,
        get_material_titles

    } from "./pkg/ray_tracer.js";


import {formatToWASM, uuid} from './util.js';

import createPreviewCameraSettings from "./components/preview_camera_settings.js";
import createShapeTile from "./components/shape_tile.js";
import createOptions from "./components/options.js";
import createSphereProperties from "./components/sphere_properties.js";
import createPropertiesPlaceholder from "./components/properties_placeholder.js";

//elements
const leftPanel = document.querySelector('#left-panel');
const centerPanel = document.querySelector('#center-panel');
const rightPanel = document.querySelector('#right-panel');

const renderedCanvas = document.querySelector("#rendered-canvas");
const ctx = renderedCanvas.getContext('2d');


const shapeOptionsContainer = document.querySelector("#shape-options-container");
const selectedShapesContainer = document.querySelector("#selected-shapes-container");

const previewCanvas = document.querySelector("#preview-canvas");
const previewContext = previewCanvas.getContext('2d');



const showSceneButton = document.querySelector("#show-scene-button");
showSceneButton.addEventListener("click", () => {
    console.log(get_scene());
     console.log(formatToWASM(previewCamera, shapes));
});


//state
//preview camera
let previewCameraWidth = 150.0;
const maxPreviewCameraWidth = 450;
let previewCameraAspectRation = 1.3333;
const maxPreviewCameraAspectRation = 50;
let previewCameraPixelSamples = 200;
const maxPreviewCameraPixelSamples = 5000;
let previewCameraVfov = 22;
const maxPreviewCameraVfov = 180;
let previewCameraDefocusAngle = 0.4;
const maxPreviewCameraDefocusAngle = 100;
let previewCamearFocusDist = 19;
const maxPreviewCamearFocusDist = 1000000;
let previewCameraMaxDepth = 50;
const maxPreviewCameraMaxDepth = 5000;
let previewCameraLookFrom = {x: 5, y: 6, z: 25};
const maxVectorComponentValue = 1000000;
let previewCameraLookAt = {x: 0, y: 0, z: 0};
let previewCameraVup = {x: 0, y: 1, z: 0};
let previewCameraBackground = {r: 190, g: 190, b: 190}

const maxRadius = 1000000;

let shapes = [];

let previewCamera = {
    image_width: 150.0,    
    aspect_ratio: 1.3333,
    pixel_samples: 200,
    vfov: 22,
    defocus_angle: 0.4,
    focus_dist: 19,
    max_depth: 50,
    lookfrom: [5, 6, 25],
    lookat: [0, 0, 0],
    vup: [0, 1, 0],
    background: [190, 190, 190]
}

async function run(){

    await init();

    //update_preview_camera_at_WASM();

    //init shapes selector
    init_shapes_selector();

    //init prevew screen
    init_preview_screen();

    //init preview camera settinds
    init_preview_camera_settings();


    start_preview_request();


}

run();

/////////////left panel///////////
//
function init_shapes_selector(){

    const shapes_titles = get_shapes_titles();   
    const shapeOptions = createOptions("add shape", shapes_titles, e => {
        const title = e.target.value;
        const id = uuid();  
        let shape = {selected: true, id, title};
        let properties = {};
        let material = {};
        switch(title){
            case "sphere": 
                properties = {"center": [0, 1, 0], "radius": 1,};
                material = {"type": "lambertian", "color": [249, 0, 0], "fuzz": 0.9};
                break;
            case "plane":
                properties = {"center": [0, 0, 0], "normal": [0, 1, 0]};
                material = {"type": "lambertian", "color": [152, 152, 152],"fuzz": 0.5};
                break;
            case "block":
                properties = {"a": [-4, 0, -2],"b": [0, 4, 2], "rotate": [0, 10, 0]};
                material = {"type": "metal","color": [255, 255, 255],"fuzz": 0.1};
                break;
            case "cylinder": 
                properties = {"top": [4, 3, 0], "bottom": [4, 0, 0], "radius": 2};
                material = {"type": "dielectric", "color": [255, 255, 255], "refraction_index": 1.6}; 
                break;           
        }
        //body is used to send its content to WASM
        shape = {...shape, properties, material};

        //clear shape is selected flag
        shapes.map((item) => {
            item.selected = false;
            return item;
        });
        
        shapes.unshift(shape);
        update_selected_shapes();
        e.target.selectedIndex = 0;
        start_preview_request();        
    });
    update_selected_shapes();
    shapeOptionsContainer.appendChild(shapeOptions);  

}

function update_selected_shapes(){

    selectedShapesContainer.innerHTML = "";   

    shapes.map(shape => {
        //create shape tile for left panel
        let shapeTile = createShapeTile(shape.id, shape.title, shape.selected, (id) => {
            //tile delete click listener
            const shapeToDelete = shapes.find(shape => shape.id == id);
            shapes = shapes.filter(shape => shape.id != id);
            //select top tile if selected tile is deleted
            if (shapes.length > 0 && shapeToDelete.selected) {
                shapes[0].selected = true;
            }
            update_selected_shapes();
            start_preview_request();      
        });


        //change selected item on click
        shapeTile.addEventListener("click", (e) => {

        if (e.target.classList.contains("shape-delete-button")){
            return;
        }

        let child = e.currentTarget;
        let parent = child.parentNode;

        shapes.map((item) => {
            item.selected = false;
            return item;
        });  
        
        let index = Array.prototype.indexOf.call(parent.children, child);
        shapes[index].selected = true;

        update_selected_shapes();

        });

        selectedShapesContainer.appendChild(shapeTile);

    });

    //update right panel
    rightPanel.innerHTML = "";
    if (shapes.length > 0) {
        let selected = shapes.find(item => item.selected);
        if (selected){
            switch (selected.title){
                case "sphere":
                    rightPanel.appendChild(createSphereProperties(selected, get_material_titles(), (params) => {
                        const index = shapes.indexOf(selected);
                        const properties = params.properties;
                        const material = params.material;
                        if(properties){
                            shapes[index].properties = {...shapes[index].properties, ...properties};                            
                        }
                        if(material){
                            shapes[index].material = {...shapes[index].material, ...material};     
                        }
                        if (properties || material) {
                            start_preview_request();  
                        }
                    })); 
                    break;
                case "plane":
                    break;
                case "block":
                    break;
                case "cylinder":
                    break;
            }
        }

    } else {
        rightPanel.appendChild(createPropertiesPlaceholder());
    }
}
//
/////////////end left panel/////////


////////////center panel////////////
//
function init_preview_screen(){
    previewCanvas.width = previewCamera.image_width;
    previewCanvas.height = previewCamera.image_width/previewCamera.aspect_ratio;
}

function init_preview_camera_settings(){

    centerPanel.appendChild(createPreviewCameraSettings(previewCamera, (val) => {
        previewCamera = {...previewCamera, ...val}; 
        init_preview_screen();
        start_preview_request();          
    }));    

}

//
////////end center panel///////////

///////////right panel/////////////
//




//
//////end right panel//////////////

//request preview 
function start_preview_request(){
    const inputWASM = formatToWASM(previewCamera, shapes);
    console.log("inputWASM: " + inputWASM);

    const h = previewCameraWidth/previewCameraAspectRation;
    previewContext.clearRect(0, 0, previewCameraWidth, h) ;    
    for (let i = 0; i < previewCameraWidth*h; i++){
        let x = getRandomInt(previewCameraWidth);
        let y = getRandomInt(h);
        let color = get_pixel_color(x,y);
        previewContext.fillStyle = color;
        previewContext.fillRect(x, y, 1, 1);
    } 
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
   set_preview_camera(
        previewCameraPixelSamples,
        previewCameraVfov,
        extractVector(previewCameraLookFrom),
        extractVector(previewCameraLookAt),
        extractVector(previewCameraVup),
        previewCameraDefocusAngle,
        previewCamearFocusDist,
        previewCameraAspectRation,
        previewCameraWidth,
        previewCameraMaxDepth,
        previewCameraBackground
    );        
}


//util
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}



function extractVector(val) {
    return {x: val.x, y: val.y, z: val.z}
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






