import init,
    {       
        get_shapes_titles,
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
import createCylinderProperties from "./components/cylinder_properties.js";
import createBlockProperties from "./components/block_properties.js";

//elements  
const rightPanel = document.querySelector('#right-panel');

const shapeOptionsContainer = document.querySelector("#shape-options-container");
const selectedShapesContainer = document.querySelector("#selected-shapes-container");

const previewCanvas = document.querySelector("#preview-canvas");
const previewContext = previewCanvas.getContext('2d');

const commandsInput = document.querySelector('#commands-input');

commandsInput.addEventListener("input", (e) => {
    const command = e.target.value.trim();
    start_preview_request(command);
    
});

previewCanvas.addEventListener("click", () => {
    const imageData = previewCanvas.toDataURL('image/png');
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = imageData;
    downloadLink.click();
});

const default_materials = [
    {"type": "lambertian", "color": [15, 15, 235], "fuzz": 1.0, selected: true},
    {"type": "metal","color": [255, 255, 255],"fuzz": 0.1, selected: false},
    {"type": "dielectric", "color": [255, 255, 255], "refraction_index": 1.6, selected: false}
];

let shapes = [];

let previewCamera = {
    image_width: 150,    
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
let show = false;
const showListener = (val) => {
    show = val;
    shapeOptionsContainer.innerHTML = "";
    init_shapes_selector();
}

function init_shapes_selector(){

    const shapes_titles = get_shapes_titles();

    const shapeOptions = createOptions("add shape", shapes_titles, show, showListener, title => { 
        //const title = e.target.value;
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
        //e.target.selectedIndex = 0;
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
                    rightPanel.appendChild(createSphereProperties(selected, (params) => propertiesUpdateListener(selected, params))); 
                    break;
                case "plane":
                    rightPanel.appendChild(createPlaneProperties(selected, (params) => propertiesUpdateListener(selected, params)));
                    break;
                case "quad":
                    rightPanel.appendChild(createQuadProperties(selected, (params) => propertiesUpdateListener(selected, params)));
                    break;
                case "block":
                    rightPanel.appendChild(createBlockProperties(selected, (params) => propertiesUpdateListener(selected, params)));
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
    previewCanvas.after(createPreviewCameraSettings(previewCamera, (val) => {
        previewCamera = val; 
        init_preview_screen();
        start_preview_request();          
    }));
}
//
////////end center panel///////////

//request preview 
let timers = [];
function start_preview_request(command){

    for (let timer of timers){
        clearTimeout(timer);
    }  
    
    
    const inputWASM = command ? command : formatToWASM(previewCamera, shapes);
    


    const w = previewCamera.image_width;
    const h = Math.trunc(w/previewCamera.aspect_ratio);
    previewContext.clearRect(0, 0, w, h);   

    //const inputWASM = formatToWASM(previewCamera, shapes);
  
   
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