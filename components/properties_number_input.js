export default function createPropertiesNumberInput(title, value, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: row; justify-content: space-between; width: 100%; padding: 2px; box-sizing: border-box;"
    
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
        input.addEventListener("change", changeListener);
    }
    input.style = "width: 36px; margin-left: 4px";

    container.appendChild(input);

    return container;
}