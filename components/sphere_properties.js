import createPropertiesNumberInput from "./properties_number_input.js";

export default function createSphereProperties(sphere, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; min-width: 100px; padding: 2px; box-sizing: border-box; border: 2px, solid, black; border-radius: 4px"
    
    const titleElement = document.createElement('div');
    titleElement.style = "width: 100%; text-align: center; margin-bottom: 4px";
    titleElement.innerHTML = sphere.title;
    container.appendChild(titleElement);

    container.appendChild(createPropertiesNumberInput("x", sphere.properties.x, (value) => {
        const properties = {
            x: value,
            y: sphere.properties.y,
            z: sphere.properties.z,
            radius: sphere.properties.radius
        }
        changeListener(properties);
    }));
    container.appendChild(createPropertiesNumberInput("y", sphere.properties.y, (value) => {
        const properties = {
            x: sphere.properties.x,
            y: value,
            z: sphere.properties.z,
            radius: sphere.properties.radius
        }
        changeListener(properties);
    }));
    container.appendChild(createPropertiesNumberInput("z", sphere.properties.z, (value) => {
        const properties = {
            x: sphere.properties.x,
            y: sphere.properties.y,
            z: value,
            radius: sphere.properties.radius
        }
        changeListener(properties);
    }));
    container.appendChild(createPropertiesNumberInput("r", sphere.properties.radius, (value) => {
        const properties = {
            x: sphere.properties.x,
            y: sphere.properties.y,
            z: sphere.properties.z,
            radius: value
        }
        changeListener(properties);
    }));

    return container;
}