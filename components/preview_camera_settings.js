import createNumberInput  from "./number_input.js";
import createTitle from "./title.js";
import createVectorInput from "./vector_input.js";
import createColorPicker from "./color_picker.js";

export default function createPreviewCameraSettings(previewCamera, changeListener){

    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; padding: 4px; gap: 4px; border: 2px, solid, black; border-radius: 4px; width: 100%; box-sizing: border-box;"
    container.appendChild(createTitle("Camera Settings"));
    container.appendChild(createNumberInput("width", previewCamera.image_width, (val) => {
        previewCamera = {...previewCamera, image_width: Number(val)} ;
        changeListener(previewCamera);
    }, {"border": true}));
    container.appendChild(createNumberInput("aspect ratio", previewCamera.aspect_ratio, (val) => {
        previewCamera = {...previewCamera, aspect_ratio: Number(val)};
        changeListener(previewCamera);
    }, {"border": true}));
    container.appendChild(createNumberInput("pixel samples", previewCamera.pixel_samples, (val) => {
        previewCamera = {...previewCamera, pixel_samples: Number(val)};
        changeListener(previewCamera);
    }, {"border": true}));
    container.appendChild(createNumberInput("field of view", previewCamera.vfov, (val) => {
        previewCamera = {...previewCamera, vfov: Number(val)};
        changeListener(previewCamera);
    }, {"border": true})); 

    const div = document.createElement('div');
    div.style = "display: flex; flex-direction: row; justify-content: space-between; gap: 8px";
    div.appendChild(createVectorInput("camera position", previewCamera.lookfrom, (val) => {
        previewCamera = {...previewCamera, lookfrom: val};
        changeListener(previewCamera);
    }));
    div.appendChild(createVectorInput("camera direction", previewCamera.lookat, (val) => {
        previewCamera = {...previewCamera, lookat: val};
        changeListener(previewCamera);
    }));
    div.appendChild(createVectorInput("camera up", previewCamera.vup, (val) => {
        previewCamera = {...previewCamera, vup: val};
        changeListener(previewCamera);
    }));
    container.appendChild(div); 

    container.appendChild(createNumberInput("variation angle of rays through each pixel", previewCamera.defocus_angle, (val) => {
        previewCamera = {...previewCamera, defocus_angle: Number(val)};
        changeListener(previewCamera);
    }, {"border": true}));
    container.appendChild(createNumberInput("focus distance", previewCamera.focus_dist, (val) => {
        previewCamera = {...previewCamera, focus_dist: Number(val)};
        changeListener(previewCamera);
    }, {"border": true}));
    container.appendChild(createNumberInput("max depth", previewCamera.max_depth, (val) => {
        previewCamera = {...previewCamera, max_depth: Number(val)};
        changeListener(previewCamera);
    }, {"border": true}));
    container.appendChild(createColorPicker("background", previewCamera.background, (val) => {
        previewCamera = {...previewCamera, background: val};
        changeListener(previewCamera);
    }, {"border": true}));

    return container;
}
