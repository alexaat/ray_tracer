import init,
    {       
        get_shapes_titles,
        render_pixel,
        validate_query

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
const leftPanel = document.querySelector('#left-panel');

let shapeOptionsContainer;
let selectedShapesContainer;

const previewCanvas = document.querySelector("#preview-canvas");
const previewContext = previewCanvas.getContext('2d');

const queryBorder = document.querySelector('#query-border');
const queryInput = document.querySelector('#query-input');

const buttonGreen = document.querySelector('.button-green');
const buttonRed = document.querySelector('.button-red');

//download image
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

    init_query_panel();

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

    leftPanel.innerHTML = "";

    shapeOptionsContainer = document.createElement('div');
    shapeOptionsContainer.setAttribute('id', 'shape-options-container');
    shapeOptionsContainer.style = "width: 100%; padding-left: 4px; padding-right: 4px; box-sizing: border-box;";
    leftPanel.appendChild(shapeOptionsContainer);

    selectedShapesContainer = document.createElement('div');
    selectedShapesContainer.setAttribute('id', 'selected-shapes-container');
    selectedShapesContainer.style = "width: 100%; padding-left: 4px; padding-right: 4px; box-sizing: border-box;";
    leftPanel.appendChild(selectedShapesContainer);

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

function init_query_panel(){
   
    queryInput.addEventListener("input", (e) => {   
        const query = e.target.value.trim();
        if(query == ''){
            queryBorder.style.borderColor = 'rgba(32, 32, 32, 1)';
        } else {
            if(validate_query(query)){
                queryBorder.style.borderColor = 'rgba(32, 32, 32, 1)';
                start_preview_request(query);    
            } else {
                queryBorder.style.borderColor = 'rgba(255, 0, 0, 1)';       
            }
        }
        
    });

    //copy
    buttonGreen.addEventListener("click", () => {
        queryInput.select();
        document.execCommand("copy");
        //queryInput.setSelectionRange(0, 99999); 
        //navigator.clipboard.writeText(queryInput.value);
        alert("Copied the text: " + queryInput.value);
    });

    //paste
    // buttonAmber.addEventListener("click", ()  =>  {   
    //     navigator.clipboard        
    //     .readText()
    //     .then((clipText) => (queryInput.value = clipText));
    // });

    //delete
    buttonRed.addEventListener("click", () => {
        queryInput.value = "";
    });

}
//
////////end center panel///////////

//request preview 
let timers = [];
function start_preview_request(query){

    for (let timer of timers){
        clearTimeout(timer);
    }   
    
    if(query){
        updateSceneFromQuery(query);
    }

    const inputWASM = query ? query : formatToWASM(previewCamera, shapes);

    queryInput.value = inputWASM;
    
    const w = previewCamera.image_width;
    const h = Math.trunc(w/previewCamera.aspect_ratio);
    previewContext.clearRect(0, 0, w, h);   

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
        }, 0.01));
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

function updateSceneFromQuery(scene){
    const parsed = JSON.parse(scene);  
    //1. update camera 
    previewCamera = parsed.camera;
    const el = document.querySelector('#camera-settings');
    if (el){
        el.remove();
    }

    //2. update shapes
    shapes = [];
    //parse shapes
    for (let shape of parsed.shapes) {
        let s = {};
        for (const [key, value] of Object.entries(shape)) {
            const id = uuid(); 
            s = {...s, title: key, id, properties: value};
            const materialTitle = value.material;
            delete s.properties.material;
            let material = parsed.materials[materialTitle];
            material = {...material, selected: true}; 
            const materials = [material];
            //add remaining materials
            let remaining = default_materials.filter(m => m.type != material.type);
            remaining = remaining.map(m => {
                return {...m, selected: false};
            });
            materials.push(...remaining);

            s = {...s, materials};

        }        
       shapes.push(s);
    }

    for (let i = 0; i < shapes.length; i++){
        if (i == 0) {
            shapes[i] = {...shapes[i],  selected: true};
        } else {
            shapes[i] = {...shapes[i],  selected: false};
        }
    }
    leftPanel.innerHTML = "";
    init_shapes_selector();
    init_preview_camera_settings();
    init_preview_screen();
}