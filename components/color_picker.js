// export default function createColorPicker(value, changeListener){
//     const container = document.createElement('div');
//     container.style = "display: flex; flex-direction: row; justify-content: flex-start;  width: 100%;  padding: 2px; align-items: center; border: 2px, solid, black; border-radius: 4px; box-sizing: border-box;"
//     const input = document.createElement('input');
//     input.setAttribute('type', 'color');
//     input.setAttribute('value', value);
//     input.setAttribute('id', 'background_color');
//     input.addEventListener("change", changeListener);
//     container.appendChild(input);

//     const label = document.createElement('label');
//     label.setAttribute("for", "background_color");
//     label.innerHTML = "background color";
//     label.style = "margin-left: 8px;"
//     container.appendChild(label);

//     return container;
// }

import {vectorToColor, colorToVector} from "../util.js"; 

export default function createColorPicker(title, vector, changeListener, options){


    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: row; justify-content: flex-start;  width: 100%;  padding: 2px; align-items: center;"
    if (options){
        if(options.border){
            container.style.setProperty(   
                "border", "2px, solid, black"
            );
            container.style.setProperty(                 
                "border-radius", "4px"                
            );
            container.style.setProperty(  
                "box-sizing", "border-box"
            );
        }
    }
    
    const input = document.createElement('input');
    input.setAttribute('type', 'color');
    input.setAttribute('value', vectorToColor(vector));
    input.setAttribute('id', 'background_color');
    input.addEventListener("change", (e) => changeListener(colorToVector(e.target.value)));
    container.appendChild(input);

    const label = document.createElement('label');
    label.setAttribute("for", "background_color");
    label.innerHTML = title;
    label.style = "margin-left: 8px;"
    container.appendChild(label);

    return container;
}



