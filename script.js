import init,
    {
        generate_pixel,
        get_shapes_titles,
        get_preview_camera,
        set_preview_camera,
        add_shpere,
        update_sphere,
        get_scene,
        delete_sphere,
        get_material_titles

    } from "./pkg/ray_tracer.js";
import {

    emptyPropertyComponent,
    spherePropertyComponent,
    createPreviewCameraSetting


} from "./components.js";

import createPreviewCameraSettings from "./components/preview_camera_settings.js";
import createShapeTile from "./components/shape_tile.js";
import createOptions from "./components/options.js";
import createSphereProperties from "./components/sphere_properties.js";

//elements
const leftPanel = document.querySelector('#left-panel');
const centerPanel = document.querySelector('#center-panel');
const rightPanel = document.querySelector('#right-panel');

const renderedCanvas = document.querySelector("#rendered-canvas");
const ctx = renderedCanvas.getContext('2d');

const shapesOption = document.querySelector("#shapes-option");
const shapeOptionsContainer = document.querySelector("#shape-options-container");
const selectedShapesContainer = document.querySelector("#selected-shapes-container");

const previewCanvas = document.querySelector("#preview-canvas");
const previewContext = previewCanvas.getContext('2d');
const previewCameraSettings = document.querySelector("#preview-camera-settings");
//const previewCameraInputWidth = document.querySelector("#preview-camera-input-width");
//const previewCameraInputHeight = document.querySelector("#preview-camera-input-height");
//const imageWidth = document.querySelector("#imageWidth"); 
//const imageHeight = document.querySelector("#imageHeight");
//const generateImageButton = document.querySelector("#generateImage");



const showSceneButton = document.querySelector("#show-scene-button");
showSceneButton.addEventListener("click", () => {
    console.log(get_scene());
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




async function run(){

    await init();

    update_preview_camera_at_WASM();

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

    const shapes_titles = get_shapes_titles();   
   
    const shapeOptions = createOptions("add shape", shapes_titles, (e) => {
        const title = e.target.value;
        const id = uuid();       
        const item = {selected: true, id, title, properties: {x: 0.0, y: 0.0, z: 0.0, radius: 1.0}};
        shapes.map((item) => {
            item.selected = false;
            return item;
        });  
        shapes.unshift(item);
        if (item.title == "sphere"){           
            add_shpere(id, item.properties.x, item.properties.y, item.properties.z, item.properties.radius);
        }
        update_selected_shapes();
        e.target.selectedIndex = 0;
        start_preview_request();
    });
    
    update_selected_shapes();

    //add select listener
    // shapeOptions.addEventListener("change", (e) => {
    //     const title = e.target.value;
    //     const id = uuid();       
    //     const item = {selected: true, id, title, properties: {x: 0.0, y: 0.0, z: 0.0, radius: 1.0}};
    //     shapes.map((item) => {
    //         item.selected = false;
    //         return item;
    //     });  
    //     shapes.unshift(item);
    //     if (item.title == "sphere"){           
    //         add_shpere(id, item.properties.x, item.properties.y, item.properties.z, item.properties.radius);
    //     }
    //     update_selected_shapes();
    //     e.target.selectedIndex = 0;
    //     start_preview_request();
    // });

    shapeOptionsContainer.appendChild(shapeOptions);
}

function update_selected_shapes(){
    selectedShapesContainer.innerHTML = "";    
    
    shapes.map(shape => {
        let shapeTile = createShapeTile(shape.id, shape.title, shape.selected, (id) => {
            const shapeToDelete = shapes.find(shape => shape.id == id);
            shapes = shapes.filter(shape => shape.id != id);
            if (shapes.length > 0 && shapeToDelete.selected) {
                shapes[0].selected = true;
            }
            delete_sphere(shapeToDelete.id);
            update_selected_shapes();
            start_preview_request();
        });

        //change selected item
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
        let selected = shapes.filter(item => item.selected)[0];    
        if(selected){
            if (selected.title == "sphere"){
                rightPanel.appendChild(createSphereProperties(selected, (properties) => {
                    //validate
                    const x = properties.x;
                    const y = properties.y;
                    const z = properties.z;
                    const radius = properties.radius;
                    if  (coordinateIsValid(x) && coordinateIsValid(y) &&  coordinateIsValid(z) &&  radiusIsValid(radius)){
                        const index = shapes.indexOf(selected);
                        shapes[index].properties.x = x;
                        shapes[index].properties.y = y;
                        shapes[index].properties.z = z;
                        shapes[index].properties.radius = radius;
                        update_sphere(selected.id, selected.properties.x, selected.properties.y, selected.properties.z, selected.properties.radius);
                        start_preview_request();
                        update_selected_shapes();
                    }

                }, get_material_titles()));   
            }           
        }
    }
}
//
/////////////end left panel/////////


////////////center panel////////////
//
function init_preview_screen(){
    previewCanvas.width = previewCameraWidth;
    previewCanvas.height = previewCameraWidth/previewCameraAspectRation;
}

function init_preview_camera_settings(){
    const width = {
        title: "width",
        value: previewCameraWidth,
        changeListener: (e) => {
            const w = e.target.value;
            if (w > 0 && w < maxPreviewCameraWidth){
                previewCameraWidth = w;
                init_preview_screen();
                update_preview_camera_at_WASM();
                start_preview_request();
            }

        }
    };

    const aspectRatio = {
        title: "aspect ratio",
        value: previewCameraAspectRation,
        changeListener: (e) => {
            const a = e.target.value;
            if (a > 0.0 && a < maxPreviewCameraAspectRation){
                previewCameraAspectRation = a;
                init_preview_screen();
                update_preview_camera_at_WASM();
                start_preview_request(); 
            }           
        }
    };

    const pixelSamples = {
        title: "pixel samples",
        value: previewCameraPixelSamples,
        changeListener: (e) => {
            const ps = e.target.value;
            if (ps > 0 && ps < maxPreviewCameraPixelSamples){
                previewCameraPixelSamples = ps;
                update_preview_camera_at_WASM();
                start_preview_request(); 
            }           
        }
    };

    const vfov = {
        title: "field of view",
        value: previewCameraVfov,
        changeListener: (e) => {
            const fv = e.target.value;
            if (fv > 0 && fv < maxPreviewCameraVfov){
                previewCameraVfov = fv;
                update_preview_camera_at_WASM();
                start_preview_request(); 
            }
        }
    };

    const lookfrom = {
        title: "camera position",
        x: {
            title: "x",
            value: previewCameraLookFrom.x,
            changeListener: (e) => {
                let x = e.target.value;
                if (Math.abs(x) < maxVectorComponentValue){
                    previewCameraLookFrom.x = x;
                    update_preview_camera_at_WASM();
                    start_preview_request(); 
                }
            }
        },
        y: {
            title: "y",
            value: previewCameraLookFrom.y,
             changeListener: (e) => {
                let y = e.target.value;
                if (Math.abs(y) < maxVectorComponentValue){
                    previewCameraLookFrom.y = y;
                    update_preview_camera_at_WASM();
                    start_preview_request(); 
                }
            }
        },
        z: {
            title: "z",
            value: previewCameraLookFrom.z,
            changeListener: (e) => {
                let z = e.target.value;
                if (Math.abs(z) < maxVectorComponentValue){
                    previewCameraLookFrom.z = z;
                    update_preview_camera_at_WASM(); 
                    start_preview_request();
                }
            }
        }
    };

    const lookat = {
        title: "camera direction",
        x: {
            title: "x",
            value: previewCameraLookAt.x,
            changeListener: (e) => {
                let x = e.target.value;
                if (Math.abs(x) < maxVectorComponentValue){
                    previewCameraLookAt.x = x;
                    update_preview_camera_at_WASM();
                    start_preview_request(); 
                }
            }
        },
        y: {
            title: "y",
            value: previewCameraLookAt.y,
            changeListener: (e) => {
                let y = e.target.value;
                if (Math.abs(y) < maxVectorComponentValue){
                    previewCameraLookAt.y = y;
                    update_preview_camera_at_WASM(); 
                    start_preview_request();
                }
            }
        },
        z: {
            title: "z",
            value: previewCameraLookAt.z,
            changeListener: (e) => {
                let z = e.target.value;
                if (Math.abs(z) < maxVectorComponentValue){
                    previewCameraLookAt.z = z;
                    update_preview_camera_at_WASM(); 
                    start_preview_request();
                }
            }
        }
    };

    const vup = {
        title: "camera up direction",
        x: {
            title: "x",
            value: previewCameraVup.x,
            changeListener: (e) => {
                let x = e.target.value;
                if (Math.abs(x) < maxVectorComponentValue){
                    previewCameraVup.x = x;
                    update_preview_camera_at_WASM(); 
                    start_preview_request();
                }
            }
        },
        y: {
            title: "y",
            value: previewCameraVup.y,
            changeListener: (e) => {
                let y = e.target.value;
                if (Math.abs(y) < maxVectorComponentValue){
                    previewCameraVup.y = y;
                    update_preview_camera_at_WASM(); 
                    start_preview_request();
                }
            }
        },
        z: {
            title: "z",
            value: previewCameraVup.z,
            changeListener: (e) => {
                let z = e.target.value;
                if (Math.abs(z) < maxVectorComponentValue){
                    previewCameraVup.z = z;
                    update_preview_camera_at_WASM();
                    start_preview_request(); 
                }
            }
        }
    };

    const defocusAngle = {
        title: "variation angle of rays through each pixel",
        value: previewCameraDefocusAngle,
        changeListener: (e) => {
            const pa = e.target.value;
            if (pa > 0 && pa < maxPreviewCameraDefocusAngle){
                previewCameraDefocusAngle = pa;
                update_preview_camera_at_WASM(); 
                start_preview_request();
            }
        }
    };

    const focusDist = {
        title: "focus distance",
        value: previewCamearFocusDist,
        changeListener: (e) => {
            const fd = e.target.value;
            if (fd > 0 && fd < maxPreviewCamearFocusDist){
                previewCamearFocusDist = fd;
                update_preview_camera_at_WASM(); 
                start_preview_request();
            }
        }
    };

    const maxDepth = {
        title: "max depth",
        value: previewCameraMaxDepth,
        changeListener: (e) => {
            const md = e.target.value;
            if (md > 0 && md < maxPreviewCameraMaxDepth){
                previewCameraMaxDepth = md;
                update_preview_camera_at_WASM(); 
                start_preview_request();
            }
        }
    };

    const background = {
        color: `#${previewCameraBackground.r.toString(16)}${previewCameraBackground.g.toString(16)}${previewCameraBackground.b.toString(16)}`,      
        changeListener: (e) => {
            const colorHex = e.target.value.slice(1);
            const rgb = colorHex.match(/.{1,2}/g);
            const r = clamp(parseInt(rgb[0], 16), 0, 255);
            const g = clamp(parseInt(rgb[1], 16), 0, 255);
            const b = clamp(parseInt(rgb[2], 16), 0, 255);
            previewCameraBackground = {r,g,b}; 
            update_preview_camera_at_WASM();    
            start_preview_request();  
        }
    };

    const cameraPreviewSettings = createPreviewCameraSettings(width, aspectRatio, pixelSamples, vfov, lookfrom, lookat, vup, defocusAngle, focusDist, maxDepth, background);
    centerPanel.appendChild(cameraPreviewSettings);

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

function uuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

function extractVector(val) {
    return {x: val.x, y: val.y, z: val.z}
}

function coordinateIsValid(coord){
    return Math.abs(coord) < maxVectorComponentValue;
}
function radiusIsValid(radius){
    return radius > 0 && radius < maxRadius;
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






