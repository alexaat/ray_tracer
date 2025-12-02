export function emptyPropertyComponent(){
    const div = document.createElement('div');
    return div;
}

export function spherePropertyComponent(title, x, y, z, radius, changeListener){
    //container
    const container = document.createElement('div');
    container.appendChild(titleElement(title));    
    
    //x component
    container.appendChild(numberComponent("x", x, changeListener));

    //y component
    container.appendChild(numberComponent("y", y, changeListener));

    //z component
    container.appendChild(numberComponent("z", z, changeListener));

    //radius component
    container.appendChild(numberComponent("radius", radius, changeListener));

    return container;
}

function titleElement(title) {
    const container = document.createElement('div');
    container.setAttribute("id","property-title");
    container.innerHTML = title;
    return container;
}

function numberComponent(t, n, changeListener){
    const container = document.createElement('div');
    container.classList.add('property-field');
    
    const title = document.createElement('div');
    title.innerHTML = t;
    container.appendChild(title);

    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('id', `property-input-${t}`);
    input.classList.add("property-input");
    input.value = n;
    input.addEventListener("change", changeListener);
    container.appendChild(input);

    return container;
}

