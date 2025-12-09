import createVectorInput from "./vector_input.js";
import createMaterialProperties from "./material_properties.js";

export default function createQuadProperties(quad, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; min-width: 100px; padding: 2px; box-sizing: border-box; border: 2px, solid, black; border-radius: 4px; gap: 4px;"

    //title
    const titleElement = document.createElement('div');
    titleElement.style = "width: 100%; text-align: center; margin-bottom: 4px";
    titleElement.innerHTML = quad.title;
    container.appendChild(titleElement);
    
    container.appendChild(createVectorInput("q", quad.properties.q, (val) => changeListener({properties: {q: val}})));
    container.appendChild(createVectorInput("u", quad.properties.u, (val) => changeListener({properties: {u: val}})));
    container.appendChild(createVectorInput("v", quad.properties.v, (val) => changeListener({properties: {v: val}})));
    container.appendChild(createMaterialProperties(quad.materials, (val) => changeListener({materials: val})));

    return container;
}