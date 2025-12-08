export default function createNumberInput(title, value, changeListener, options){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: row; justify-content: space-between; width: 100%; padding: 2px; gap: 4px"
    
    if(options){
        if (options.border){
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

    const titleElement = document.createElement('div');
    if (title){
        titleElement.innerHTML = title;
    }
    container.appendChild(titleElement);

    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    if (value){
        input.value = value;
    }
    if (changeListener) {
        input.addEventListener("change", (e) => changeListener(e.target.value));
    }
    input.style = "width: 60px";

    container.appendChild(input);

    return container;
}