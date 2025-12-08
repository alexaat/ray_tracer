import createMaterialOptions from "./material_options.js";
import createPropertiesNumberInput from "./properties_number_input.js";

export default function createSphereProperties(sphere, materials, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; min-width: 100px; padding: 2px; box-sizing: border-box; border: 2px, solid, black; border-radius: 4px; gap: 4px;"
    
    const titleElement = document.createElement('div');
    titleElement.style = "width: 100%; text-align: center; margin-bottom: 4px";
    titleElement.innerHTML = sphere.title;
    container.appendChild(titleElement);


    container.appendChild(createPropertiesNumberInput("x", sphere.properties.center[0], (val) => changeListener({properties: {center: [Number(val), sphere.properties.center[1], sphere.properties.center[2]]}})));
    container.appendChild(createPropertiesNumberInput("y", sphere.properties.center[1], (val) => changeListener({properties: {center: [sphere.properties.center[0], Number(val), sphere.properties.center[2]]}})));
    container.appendChild(createPropertiesNumberInput("z", sphere.properties.center[2], (val) => changeListener({properties: {center: [sphere.properties.center[0], sphere.properties.center[1], Number(val)]}})));
    container.appendChild(createPropertiesNumberInput("r", sphere.properties.radius, (val) => changeListener({properties: {radius: Number(val)}})));

    return container;
}