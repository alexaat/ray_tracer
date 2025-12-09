import init,
    {       
        get_shapes_titles,       
        get_scene,
        render_pixel

    } from "./pkg/ray_tracer.js";


import {formatToWASM, uuid, shuffle} from './util.js';

import createPreviewCameraSettings from "./components/preview_camera_settings.js";
import createShapeTile from "./components/shape_tile.js";
import createOptions from "./components/options.js";
import createSphereProperties from "./components/sphere_properties.js";
import createPropertiesPlaceholder from "./components/properties_placeholder.js";
import createPlaneProperties from "./components/plane_properties.js";
import createQuadProperties from "./components/quad_properties.js";
import createDiskProperties from "./components/disk_properties.js";
import createTubeProperties from "./components/tube_properties.js";
import createCylinderProperties from "./components/cylinder_properties.js"

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
    console.log("Scene:");
    console.log(get_scene());
    console.log("WASM Input");
    console.log(formatToWASM(previewCamera, shapes));
});


const default_materials = [
    {"type": "lambertian", "color": [15, 15, 235], "fuzz": 1.0, selected: true},
    {"type": "metal","color": [255, 255, 255],"fuzz": 0.1, selected: false},
    {"type": "dielectric", "color": [255, 255, 255], "refraction_index": 1.6, selected: false}
];

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
    aspect_ratio: 1.3,
    pixel_samples: 20,
    vfov: 22,
    defocus_angle: 0.4,
    focus_dist: 19,
    max_depth: 20,
    lookfrom: [5, 5, 25],
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
        let materials = [];
        switch(title){
            case "sphere": 
                properties = {"center": [0, 1, 0], "radius": 1,};
                materials = default_materials;            
                break;
            case "plane":
                properties = {"center": [0, -1.0, 0], "normal": [0, 1, 0]};
                materials = default_materials;
                break;
            case "block":
                properties = {"a": [-2, -   2, -2],"b": [2, 2, 2], "rotate": [0, 10, 0]};
                materials = default_materials;
                break;
            case "quad":
                properties = {"q": [0, 0, 0],"u": [3, 0, 0], "v": [0, 3, 0]};
                materials = default_materials;
                break;
            case "disk":
                properties = {"center": [0, 0, 0],"normal": [0, 1, 0], "radius": 1};
                materials = default_materials;
                break;
            case "tube":
                properties = {"top": [0, 0, 0],"bottom": [0, 2, 0], "radius": 1};
                materials = default_materials;
                break;
            case "cylinder":
                properties = {"top": [0, 0, 0],"bottom": [0, 2, 0], "radius": 1};
                materials = default_materials;
                break;         
        }

        shape = {...shape, properties, materials};

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
            ////////
            /*
            switch (selected.title){
                case "sphere":
                    rightPanel.appendChild(createSphereProperties(selected, (params) => {
                        const index = shapes.indexOf(selected);
                        const properties = params.properties;
                        const materials = params.materials;
                        if(properties){
                            shapes[index].properties = {...shapes[index].properties, ...properties};                            
                        }
                        if(materials){
                            shapes[index].materials = materials;     
                        }
                        if (properties || materials) {                           
                            start_preview_request();  
                        }
                    })); 
                    break;
                case "plane":
                    rightPanel.appendChild(createPlaneProperties(selected, (params) => {                       
                        const index = shapes.indexOf(selected);
                        const properties = params.properties;
                        const materials = params.materials;
                        if(properties){
                            shapes[index].properties = {...shapes[index].properties, ...properties};                            
                        }
                        if(materials){
                            shapes[index].materials = materials;     
                        }
                        if (properties || materials) {                           
                            start_preview_request();  
                        }

                    }));
                    break;
                case "quad":
                    rightPanel.appendChild(createQuadProperties(selected, (params) => {                        
                        const index = shapes.indexOf(selected);
                        const properties = params.properties;
                        const materials = params.materials;
                        if(properties){
                            shapes[index].properties = {...shapes[index].properties, ...properties};                            
                        }
                        if(materials){
                            shapes[index].materials = materials;     
                        }
                        if (properties || materials) {                           
                            start_preview_request();  
                        }
                    }));
                    break;
                case "disk":
                    rightPanel.appendChild(createDiskProperties(selected, (params) => {                        
                        const index = shapes.indexOf(selected);
                        const properties = params.properties;
                        const materials = params.materials;
                        if(properties){
                            shapes[index].properties = {...shapes[index].properties, ...properties};                            
                        }
                        if(materials){
                            shapes[index].materials = materials;     
                        }
                        if (properties || materials) {                           
                            start_preview_request();  
                        }
                    }));
                    break;
                case "tube":
                    rightPanel.appendChild(createTubeProperties(selected, (params) => {                        
                        const index = shapes.indexOf(selected);
                        const properties = params.properties;
                        const materials = params.materials;
                        if(properties){
                            shapes[index].properties = {...shapes[index].properties, ...properties};                            
                        }
                        if(materials){
                            shapes[index].materials = materials;     
                        }
                        if (properties || materials) {                           
                            start_preview_request();  
                        }
                    }));
                    break;

                case "cylinder":
                    rightPanel.appendChild(createCylinderProperties(selected, (params) => {                        
                        const index = shapes.indexOf(selected);
                        const properties = params.properties;
                        const materials = params.materials;
                        if(properties){
                            shapes[index].properties = {...shapes[index].properties, ...properties};                            
                        }
                        if(materials){
                            shapes[index].materials = materials;     
                        }
                        if (properties || materials) {                           
                            start_preview_request();  
                        }
                    }));
                    break;
            }
            */
            //////////

             switch (selected.title){
                case "sphere":
                    rightPanel.appendChild(createSphereProperties(selected, (params) => propertiesUpdateListener(selected, params))); 
                    break;
                case "plane":
                    rightPanel.appendChild(createPlaneProperties(selected, (params) => propertiesUpdateListener(selected, params)));
                    break;
                case "quad":
                    rightPanel.appendChild(createQuadProperties(selected, (params) => propertiesUpdateListener(selected, params)));
                    break;
                case "disk":
                    rightPanel.appendChild(createDiskProperties(selected, (params) => propertiesUpdateListener(selected, params)));
                    break;
                case "tube":
                    rightPanel.appendChild(createTubeProperties(selected, (params) => propertiesUpdateListener(selected, params)));
                    break;
                case "cylinder":
                    rightPanel.appendChild(createCylinderProperties(selected, (params) => propertiesUpdateListener(selected, params)));
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
        previewCamera = val; 
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
let timers = [];
async function start_preview_request(){

    for (let timer of timers){
        clearTimeout(timer);
    }
    const w = previewCamera.image_width;
    const h = Math.trunc(w/previewCamera.aspect_ratio);
    previewContext.clearRect(0, 0, w, h);   

    const inputWASM = formatToWASM(previewCamera, shapes);
  
    let sortedArr = [];
    for (let y = 0; y < h; y++){
        for (let x = 0; x < w; x++){
            sortedArr.push([x,y]);
        }
    }   

    let shuffledArr = shuffle(sortedArr);

    for (let p of shuffledArr){      
        timers.push(setTimeout(() => {
            const x = p[0];
            const y = p[1];
            const color = render_pixel(inputWASM, x, y);
            previewContext.fillStyle = color;
            previewContext.fillRect(x, y, 1, 1);  
        }, 0.0));
    }

    
    /*
    const randomXs = random_array(0, w);
    const randomYs = random_array(0, h);
    for (let y = 0; y < randomYs.length; y++){
        for (let x = 0; x < randomXs.length; x++){
            let _y = randomYs[y];
            let _x = randomXs[x];
            //console.log("x: "+ _x + ", y: "+ _y);
            timers.push(setTimeout(() => {
                const color = render_pixel(inputWASM, _x, _y);                            
                previewContext.fillStyle = color;
                previewContext.fillRect(_x, _y, 1, 1);  
            }, 0.0));   

        }
    }
        */
    
    
    /*
    const worker = new Worker('worker.js'); 
    worker.postMessage(1000000000); // send data to worker
    worker.onmessage = function (event) {
    console.log("Result from worker:", event.data);
    };
    */




    // previewContext.clearRect(0, 0, w, h);   
    // for (let y = 0; y < h; y++){
    //     for (let x = 0; x < w; x++){
    //         setTimeout(() => {
    //             const color = render_pixel(inputWASM, x, y);            
    //             previewContext.fillStyle = color;
    //             previewContext.fillRect(x, y, 1, 1);  
    //         }, 0.0);           
          
    //     }
    // }

    // const h = previewCameraWidth/previewCameraAspectRation;
    // previewContext.clearRect(0, 0, previewCameraWidth, h) ;    
    // for (let i = 0; i < previewCameraWidth*h; i++){
    //     let x = getRandomInt(previewCameraWidth);
    //     let y = getRandomInt(h);
    //     let color = get_pixel_color(x,y);
    //     previewContext.fillStyle = color;
    //     previewContext.fillRect(x, y, 1, 1);
    // } 
}

function propertiesUpdateListener(selected, params){
    const index = shapes.indexOf(selected);
    const properties = params.properties;
    const materials = params.materials;
    if(properties){
        shapes[index].properties = {...shapes[index].properties, ...properties};                            
    }
    if(materials){
        shapes[index].materials = materials;     
    }
    if (properties || materials) {                           
        start_preview_request();  
    }                
}

//test;
// leftPanel.appendChild(createMaterialProperties([
//                     {"type": "lambertian", "color": [235, 0, 0], "fuzz": 1.0, selected: true},
//                     {"type": "metal","color": [255, 255, 255],"fuzz": 0.1, selected: false},
//                     {"type": "dielectric", "color": [255, 255, 255], "refraction_index": 1.6, selected: false}
//                 ], (val) => console.log(val)));


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






