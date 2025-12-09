import createNumberInput  from "./number_input.js";
import createTitle from "./title.js";
import createVectorInput from "./vector_input.js";
import createColorPicker from "./color_picker.js";

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
    "background": [173, 216, 230]
*/

export default function createPreviewCameraSettings(previewCamera, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; padding: 4px; gap: 4px; border: 2px, solid, black; border-radius: 4px; width: 100%; box-sizing: border-box;"
    container.appendChild(createTitle("Preview Camera Settings"));    
    container.appendChild(createNumberInput("width", previewCamera.image_width, (val) => changeListener({image_width: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("aspect ratio", previewCamera.aspect_ratio, (val) => changeListener({aspect_ratio: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("pixel samples", previewCamera.pixel_samples, (val) => changeListener({pixel_samples: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("field of view", previewCamera.vfov, (val) => changeListener({vfov: Number(val)}), {"border": true}));
    
    const div = document.createElement('div');
    div.style = "display: flex; flex-direction: row; justify-content: space-between; gap: 8px";
    div.appendChild(createVectorInput("camera position", previewCamera.lookfrom, (val) => changeListener({lookfrom: val})));
    div.appendChild(createVectorInput("camera direction", previewCamera.lookat, (val) => changeListener({lookat: val})));
    div.appendChild(createVectorInput("camera up", previewCamera.vup, (val) => changeListener({vup: val})));
    container.appendChild(div); 

    container.appendChild(createNumberInput("variation angle of rays through each pixel", previewCamera.defocus_angle, (val) => changeListener({defocus_angle: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("focus distance", previewCamera.focus_dist, (val) => changeListener({focus_dist: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("max depth", previewCamera.max_depth, (val) => changeListener({max_depth: Number(val)}), {"border": true}));
    container.appendChild(createColorPicker("background", previewCamera.background, (val) => changeListener({background: val}), {"border": true}));
    return container;   
}
