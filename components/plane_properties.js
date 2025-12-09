import createVectorInput from "./vector_input.js";
import createMaterialProperties from "./material_properties.js";

export default function createPlaneProperties(plane, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; min-width: 100px; padding: 2px; box-sizing: border-box; border: 2px, solid, black; border-radius: 4px; gap: 4px;"

    //title
    const titleElement = document.createElement('div');
    titleElement.style = "width: 100%; text-align: center; margin-bottom: 4px";
    titleElement.innerHTML = plane.title;
    container.appendChild(titleElement);

    
    container.appendChild(createVectorInput("center", plane.properties.center, (val) => changeListener({properties: {center: val}})));
    container.appendChild(createVectorInput("normal", plane.properties.normal, (val) => changeListener({properties: {normal: val}})));
    container.appendChild(createMaterialProperties(plane.materials, (val) => changeListener({materials: val})));

    return container;
}