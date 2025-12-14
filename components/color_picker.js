import {vectorToColor, colorToVector} from "../util.js"; 

export default function createColorPicker(title, vector, changeListener, options){

    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: row; justify-content: flex-start; gap: 8px; width: 100%; align-items: center;  box-sizing: border-box; padding: 2px"
    if (options){
        if(options.border){
            container.style.setProperty(   
                "border", "1px, solid, black"
            );
            container.style.setProperty(                 
                "border-radius", "4px"                
            );
            container.style.setProperty(  
                "box-sizing", "border-box"
            );
        }
    }

    const label = document.createElement('label');
    label.setAttribute("for", "background_color");
    label.innerHTML = title;
    label.style = "margin-right: 8px;"
    container.appendChild(label);
    
    const input = document.createElement('input');
    input.setAttribute('type', 'color');
    input.setAttribute('value', vectorToColor(vector));
    input.setAttribute('id', 'background_color');
    input.addEventListener("change", (e) => changeListener(colorToVector(e.target.value)));
    container.appendChild(input);  

    return container;
}



