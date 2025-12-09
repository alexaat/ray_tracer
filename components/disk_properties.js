import createVectorInput from "./vector_input.js";
import createMaterialProperties from "./material_properties.js";
import createPropertiesNumberInput from "./properties_number_input.js";

export default function createDiskProperties(disk, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; min-width: 100px; padding: 2px; box-sizing: border-box; border: 2px, solid, black; border-radius: 4px; gap: 4px;"

    //title
    const titleElement = document.createElement('div');
    titleElement.style = "width: 100%; text-align: center; margin-bottom: 4px";
    titleElement.innerHTML = disk.title;
    container.appendChild(titleElement);
    
    container.appendChild(createVectorInput("center", disk.properties.center, (val) => changeListener({properties: {center: val}})));
    container.appendChild(createVectorInput("normal", disk.properties.normal, (val) => changeListener({properties: {normal: val}})));
  
    const div = document.createElement('div');
    div.style = "box-sizing: border-box; border: 2px, solid, black; border-radius: 4px; padding: 2px;";    
    div.appendChild(createPropertiesNumberInput("radius", disk.properties.radius, (val) => changeListener({properties: {radius: Number(val)}})));
    container.appendChild(div);

    container.appendChild(createMaterialProperties(disk.materials, (val) => changeListener({materials: val})));

    return container;
}