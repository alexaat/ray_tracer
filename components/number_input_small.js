export default function createNumberInputSmall(title, value, changeListener, options){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: row; justify-content: space-between;  width: 100%;  padding: 2px;  box-sizing: border-box;"
    
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
    input.style = 'width: 36px; margin-left: 8px;';  

    if(options){      
        if(options.min) {
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