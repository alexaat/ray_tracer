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

    //options
    const list = materials.map(material => material.type);
    const options = createMaterialOptions(list, selectedMaterial.type, (val) => {
        selectedMaterial = materials.find(material => material.type == val);        
        let el = document.querySelector('.properties-container');
        if (el) {
            el.innerHTML = "";
        }

        container.appendChild(createProperties(selectedMaterial, changeListener));  
    });
    container.appendChild(options);
    
    let el = document.querySelector('.properties-container');
    if (el) {
        el.innerHTML = "";
    } 
    container.appendChild(createProperties(selectedMaterial, changeListener));    
    
    return container;
}

function createProperties(selectedMaterial, changeListener){
   
    let container = document.createElement('div');
    container.classList.add("properties-container"); 
 
    switch (selectedMaterial.type){
        case "lambertian": 
            return container.appendChild(createProperiesForLambertian(selectedMaterial, changeListener)); 
        case "metal": 
            return container.appendChild(createProperiesForMetal(selectedMaterial, changeListener)); 
        case "dielectric": 
            return container.appendChild(createProperiesForDielectric(selectedMaterial, changeListener)); 
    }
    
    return container;
}

function createProperiesForLambertian(selectedMaterial, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; width: 100%; gap: 8px;"
    container.appendChild(createNumberInput("fuzz", selectedMaterial.fuzz, (val) => changeListener({type: selectedMaterial.type, "fuzz": val})));
    container.appendChild(createColorPicker("color", selectedMaterial.color, (val) => changeListener({type: selectedMaterial.type, "color": val})));
    return container;
    
}
function createProperiesForMetal(selectedMaterial){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; width: 100%; gap: 8px;"
    container.appendChild(createNumberInput("fuzz", selectedMaterial.fuzz, (val) => changeListener({type: selectedMaterial.type, "fuzz": val})));
    container.appendChild(createColorPicker("color", selectedMaterial.color, (val) => changeListener({type: selectedMaterial.type, "color": val})));
    return container;

}
function createProperiesForDielectric(selectedMaterial){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; width: 100%; gap: 8px;"
    container.appendChild(createNumberInput("refraction_index", selectedMaterial.fuzz, (val) => changeListener({type: selectedMaterial.type, "refraction_index": val})));
    container.appendChild(createColorPicker("color", selectedMaterial.color, (val) => changeListener({type: selectedMaterial.type, "color": val})));
    return container;
}

