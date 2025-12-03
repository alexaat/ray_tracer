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
    "background": [173, 216, 230
*/

export default function createPreviewCameraSettings(width, aspectRatio, pixelSamples, vfov, lookfrom, lookat, vup, defocusAngle, focusDist, maxDepth, background){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; padding: 4px; gap: 4px; border: 2px, solid, black; border-radius: 4px; width: 100%; box-sizing: border-box;"
    container.appendChild(createTitle("Preview Camera Settings"));
    container.appendChild(createNumberInput(width.title, width.value, width.changeListener));
    container.appendChild(createNumberInput(aspectRatio.title, aspectRatio.value, aspectRatio.changeListener));
    container.appendChild(createNumberInput(pixelSamples.title, pixelSamples.value, pixelSamples.changeListener));
    container.appendChild(createNumberInput(vfov.title, vfov.value, vfov.changeListener));
    container.appendChild(createVectorInput(lookfrom.title, lookfrom.x, lookfrom.y, lookfrom.z));
    container.appendChild(createVectorInput(lookat.title, lookat.x, lookat.y, lookat.z));
    container.appendChild(createVectorInput(vup.title, vup.x, vup.y, vup.z));
    container.appendChild(createNumberInput(defocusAngle.title, defocusAngle.value, defocusAngle.changeListener));
    container.appendChild(createNumberInput(focusDist.title, focusDist.value, focusDist.changeListener));
    container.appendChild(createNumberInput(maxDepth.title, maxDepth.value, maxDepth.changeListener));
    container.appendChild(createColorPicker(background.color, background.changeListener));
    

    return container;   
}