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

/*

    "pixel_samples" : 200,
    "vfov" : 22,
    "lookfrom" : [5, 6, 25],
    "lookat" : [0, 0, 0],
    "vup": [0, 1, 0],
    "defocus_angle": 0.4,
    "focus_dist": 19,
    "aspect_ratio": 1.333333,
    "image_width": 200,
    "max_depth": 50,
    "background": [173, 216, 230

*/


export function createPreviewCameraSetting(
    previewScreenWidth,
    previewScreenAspectRation,
   
){
    const container = document.createElement('div');
    container.setAttribute('id', 'preview-camera-settings');
    //title
    const title = document.createElement('div');
    title.classList.add('preview-camera-settings-title');
    title.innerHTML = "Preview Camera Settings";
    container.appendChild(title);

    //image width
    const width = document.createElement('input');
    width.setAttribute('type', 'number');
    width.value = previewScreenWidth;
    width.setAttribute('id', "preview-camera-input-width");
    //width.addEventListener("change", previewCameraChangeListener);  
    container.appendChild(width);
   
    //image aspect ratio
    const aspect = document.createElement('input');
    aspect.setAttribute('type', 'number');
    aspect.value = previewScreenAspectRation;
    aspect.setAttribute('id', "preview-camera-input-aspect-ratio");
    //aspect.addEventListener("change", previewCameraChangeListener);  
    container.appendChild(aspect);

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

