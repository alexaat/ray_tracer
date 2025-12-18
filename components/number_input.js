export default function createNumberInput(title, value, changeListener, options){
    const container = document.createElement('div');
    container.style = `
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        padding: 2px;
        gap: 4px;  
        box-sizing: border-box;   
        `;        
    
    const titleElement = document.createElement('div');
    if (title){
        titleElement.innerHTML = title;
    }
    container.appendChild(titleElement);

    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.value = 0.0;
    if (value){
        input.value = value;
    }
    if (changeListener) {
        input.addEventListener("change", (e) => changeListener(e.target.value));
    }
    input.style = "width: 56px";

    if(options){
        if (options.border){
            container.style.setProperty(   
                "border", "1px solid black"
            );
            container.style.setProperty(                 
                "border-radius", "4px"                
            );
            // container.style.setProperty(  
            //     "box-sizing", "border-box"
            // );
        }

        if(options.min || options.min == 0) {            
            input.setAttribute('min', options.min);
        }
        if(options.max) {
            input.setAttribute('max', options.max);
        }
        if(options.step) {
            input.setAttribute('step', options.step);
        }  
    }

    container.appendChild(input);

    return container;
}