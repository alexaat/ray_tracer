import createVectorInput from "./vector_input.js";
import createMaterialProperties from "./material_properties.js";

export default function createBlockProperties(block, changeListener){
    const container = document.createElement('div');
    container.style = `
        display: flex;
        flex-direction: column;
        min-width: 100px;
        gap: 4px;`
    container.classList.add('card-static');

    //title
    const titleElement = document.createElement('div');
    titleElement.style = "width: 100%; text-align: center; margin-bottom: 4px";
    titleElement.innerHTML = block.title;
    container.appendChild(titleElement);    
    container.appendChild(createVectorInput("a", block.properties.a, (val) => changeListener({properties: {a: val}})));
    container.appendChild(createVectorInput("b", block.properties.b, (val) => changeListener({properties: {b: val}})));
    container.appendChild(createVectorInput("rotate", block.properties.rotate, (val) => changeListener({properties: {rotate: val}})));
    container.appendChild(createMaterialProperties(block.materials, (val) => changeListener({materials: val})));
    return container;
}