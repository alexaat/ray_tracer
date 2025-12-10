import createVectorInput from "./vector_input.js";
import createMaterialProperties from "./material_properties.js";
import createPropertiesNumberInput from "./properties_number_input.js";

export default function createCylinderProperties(cylinder, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; min-width: 100px; padding: 2px; box-sizing: border-box; border: 2px, solid, black; border-radius: 4px; gap: 4px;"

    //title
    const titleElement = document.createElement('div');
    titleElement.style = "width: 100%; text-align: center; margin-bottom: 4px";
    titleElement.innerHTML = cylinder.title;
    container.appendChild(titleElement);
    
    container.appendChild(createVectorInput("top", cylinder.properties.top, (val) => changeListener({properties: {top: val}})));
    container.appendChild(createVectorInput("bottom", cylinder.properties.bottom, (val) => changeListener({properties: {bottom: val}})));
  
    const div = document.createElement('div');
    div.style = "box-sizing: border-box; border: 2px, solid, black; border-radius: 4px; padding: 2px;";    
    div.appendChild(createPropertiesNumberInput("radius", cylinder.properties.radius, (val) => changeListener({properties: {radius: Number(val)}}), {min: 0, max: 100000, step: 0.5}));
    container.appendChild(div);

    container.appendChild(createMaterialProperties(cylinder.materials, (val) => changeListener({materials: val})));

    return container;
}