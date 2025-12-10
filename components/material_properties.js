import createMaterialOptions from "./material_options.js";
import createNumberInput from "./number_input.js";
import createColorPicker from "./color_picker.js";

export default function createMaterialProperties(materials, changeListener){
    let selectedMaterial = materials.find(material => material.selected);
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; min-width: 100px; padding: 2px; box-sizing: border-box; border: 2px, solid, black; border-radius: 4px; gap: 4px;";
    
    //title
    const titleElement = document.createElement('div');
    titleElement.innerHTML = "material";
    container.appendChild(titleElement);

    const updateListener = val => {
       
        materials = materials.map(material => {
            if (material.type == val.type){
                return {...material, ...val};
            } else {
                return material;
            }
        });
        changeListener(materials);
    }


    //options
    const list = materials.map(material => material.type);
    const options = createMaterialOptions(list, selectedMaterial.type, (val) => {
        selectedMaterial = materials.find(material => material.type == val);        
        let el = document.querySelector('#properties-container');
        if (el) {
            el.remove();
        }
        container.appendChild(createProperties(selectedMaterial, updateListener));
        
        //update state: set selected
        materials = materials.map((material) => {
            if (material.type == val) {
                return {...material, selected: true};
            } else {
                 return {...material, selected: false};
            }
        });      
        changeListener(materials); 

    });
    container.appendChild(options);
    
    let el = document.querySelector('#properties-container');
    if (el) {
        el.remove();
    } 
    container.appendChild(createProperties(selectedMaterial, updateListener));    
    
    return container;
}

function createProperties(selectedMaterial, changeListener){
   
    let container = document.createElement('div');

    container.setAttribute('id', 'properties-container');
 
    switch (selectedMaterial.type){
        case "lambertian": 
            container.appendChild(createProperiesForLambertian(selectedMaterial, val => changeListener(val))); 
            break;
        case "metal": 
            container.appendChild(createProperiesForMetal(selectedMaterial, val => changeListener(val))); 
            break;
        case "dielectric": 
            container.appendChild(createProperiesForDielectric(selectedMaterial, val => changeListener(val))); 
            break;
    }
    
    return container;
   
}

function createProperiesForLambertian(selectedMaterial, updateListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; width: 100%; gap: 8px;"
    container.appendChild(createNumberInput("fuzz", selectedMaterial.fuzz, (val) => updateListener({type: selectedMaterial.type, "fuzz": Number(val)})));
    container.appendChild(createColorPicker("color", selectedMaterial.color, (val) => updateListener({type: selectedMaterial.type, "color": val})));
    return container;
    
}
function createProperiesForMetal(selectedMaterial, updateListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; width: 100%; gap: 8px;"
    container.appendChild(createNumberInput("fuzz", selectedMaterial.fuzz, (val) => updateListener({type: selectedMaterial.type, "fuzz": Number(val)})));
    container.appendChild(createColorPicker("color", selectedMaterial.color, (val) => updateListener({type: selectedMaterial.type, "color": val})));
    return container;

}
function createProperiesForDielectric(selectedMaterial, updateListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; width: 100%; gap: 8px;"
    container.appendChild(createNumberInput("r/i", selectedMaterial.refraction_index, (val) => updateListener({type: selectedMaterial.type, "refraction_index": Number(val)})));
    container.appendChild(createColorPicker("color", selectedMaterial.color, (val) => updateListener({type: selectedMaterial.type, "color": val})));
    return container;
}

