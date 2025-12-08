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

// export default function createPreviewCameraSettings(width, aspectRatio, pixelSamples, vfov, lookfrom, lookat, vup, defocusAngle, focusDist, maxDepth, background){
//     const container = document.createElement('div');
//     container.style = "display: flex; flex-direction: column; padding: 4px; gap: 4px; border: 2px, solid, black; border-radius: 4px; width: 100%; box-sizing: border-box;"
//     container.appendChild(createTitle("Preview Camera Settings"));
//     container.appendChild(createNumberInput(width.title, width.value, width.changeListener));
//     container.appendChild(createNumberInput(aspectRatio.title, aspectRatio.value, aspectRatio.changeListener));
//     container.appendChild(createNumberInput(pixelSamples.title, pixelSamples.value, pixelSamples.changeListener));
//     container.appendChild(createNumberInput(vfov.title, vfov.value, vfov.changeListener));
//     container.appendChild(createVectorInput(lookfrom.title, lookfrom.x, lookfrom.y, lookfrom.z));
//     container.appendChild(createVectorInput(lookat.title, lookat.x, lookat.y, lookat.z));
//     container.appendChild(createVectorInput(vup.title, vup.x, vup.y, vup.z));
//     container.appendChild(createNumberInput(defocusAngle.title, defocusAngle.value, defocusAngle.changeListener));
//     container.appendChild(createNumberInput(focusDist.title, focusDist.value, focusDist.changeListener));
//     container.appendChild(createNumberInput(maxDepth.title, maxDepth.value, maxDepth.changeListener));
//     container.appendChild(createColorPicker(background.color, background.changeListener));
//     return container;   
// }

export default function createPreviewCameraSettings(previewCamera, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; padding: 4px; gap: 4px; border: 2px, solid, black; border-radius: 4px; width: 100%; box-sizing: border-box;"
    container.appendChild(createTitle("Preview Camera Settings"));    
    container.appendChild(createNumberInput("width", previewCamera.image_width, (val) => changeListener({image_width: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("aspect ratio", previewCamera.aspect_ratio, (val) => changeListener({aspect_ratio: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("pixel samples", previewCamera.pixel_samples, (val) => changeListener({pixel_samples: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("field of view", previewCamera.vfov, (val) => changeListener({vfov: Number(val)}), {"border": true}));
    container.appendChild(createVectorInput("camera position", previewCamera.lookfrom, (val) => changeListener({lookfrom: val})));
    container.appendChild(createVectorInput("camera direction", previewCamera.lookat, (val) => changeListener({lookat: val})));
    container.appendChild(createVectorInput("camera up direction", previewCamera.vup, (val) => changeListener({vup: val})));
    container.appendChild(createNumberInput("variation angle of rays through each pixel", previewCamera.defocus_angle, (val) => changeListener({defocus_angle: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("focus distance", previewCamera.focus_dist, (val) => changeListener({focus_dist: Number(val)}), {"border": true}));
    container.appendChild(createNumberInput("max depth", previewCamera.max_depth, (val) => changeListener({max_depth: Number(val)}), {"border": true}));
    container.appendChild(createColorPicker("background", previewCamera.background, (val) => changeListener({background: val}), {"border": true}));
    return container;   
}
