import createPropertiesNumberInput from "./properties_number_input.js";
import createMaterialProperties from "./material_properties.js";
import createVectorInput from "./vector_input.js";

export default function createSphereProperties(sphere, changeListener){
    const container = document.createElement('div');
    container.style = `
        display: flex;
        flex-direction: column;
        min-width: 100px;
        gap: 4px;
        `;
    container.classList.add('card-static');

    const titleElement = document.createElement('div');
    titleElement.style = "width: 100%; text-align: center; margin-bottom: 4px";
    titleElement.innerHTML = sphere.title;
    container.appendChild(titleElement);
    
    container.appendChild(createVectorInput("center", sphere.properties.center, (val) => changeListener({properties: {center: val}})));
   
    const div = document.createElement('div');
    div.style = "box-sizing: border-box; border: 1px solid black; border-radius: 4px; padding: 2px;";    
    div.appendChild(createPropertiesNumberInput("radius", sphere.properties.radius, (val) => changeListener({properties: {radius: Number(val)}}), {min: 0, max: 100000, step: 0.5}));
    container.appendChild(div);

    container.appendChild(createMaterialProperties(sphere.materials, (val) => changeListener({materials: val})));

    return container;
}